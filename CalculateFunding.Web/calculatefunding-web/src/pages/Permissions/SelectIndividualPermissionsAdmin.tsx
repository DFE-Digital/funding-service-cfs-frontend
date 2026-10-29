import { AxiosError } from "axios";
import { equals } from "ramda";
import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";

import { AutoComplete } from "../../components/AutoComplete";
import { BackLink } from "../../components/BackLink";
import { LoadingFieldStatus } from "../../components/LoadingFieldStatus";
import { Main } from "../../components/Main";
import { MultipleErrorSummary } from "../../components/MultipleErrorSummary";
import { WarningText } from "../../components/WarningText";
import { milliseconds } from "../../helpers/TimeInMs";
import { useConfirmLeavePage } from "../../hooks/useConfirmLeavePage";
import { useErrors } from "../../hooks/useErrors";
import { IStoreState } from "../../reducers/rootReducer";
import * as userService from "../../services/userService";
import { FundingStreamPermissions } from "../../types/FundingStreamPermissions";
import { Permission } from "../../types/Permission";
import { Section } from "../../types/Sections";
import { UserSearchResult, UserSearchResultItem } from "../../types/Users/UserSearchResult";
import { FundingStream } from "../../types/viewFundingTypes";
import { useHistory } from "react-router";

export function SelectIndividualPermissionsAdmin(): JSX.Element {
  const myPermissions: FundingStreamPermissions[] = useSelector(
    (state: IStoreState) => state.userState.fundingStreamPermissions
  );
  const fundingStreamsForAdmin: FundingStream[] = useMemo(
    () =>
      myPermissions &&
      myPermissions
        .filter((fs) => fs.canAdministerFundingStream)
        .map(
          (fs) =>
            ({
              id: fs.fundingStreamId,
              name: fs.fundingStreamName,
            } as FundingStream)
        ),
    [myPermissions]
  );

  const { errors, addError, clearErrorMessages } = useErrors();
  const { data: usersSearchResult } = useQuery<UserSearchResult, AxiosError>(
    "users",
    async () => (await userService.findUsers("")).data,
    {
      refetchOnWindowFocus: false,
      enabled: fundingStreamsForAdmin?.length > 0,
      cacheTime: milliseconds.ThreeMinutes,
      staleTime: milliseconds.ThreeMinutes,
      onError: (err: any) =>
        addError({
          error: err,
          description: "Could not load user search",
          suggestion: "Please try again later",
        }),
    }
  );
  const [isLoadingUserPermissions, setIsLoadingUserPermissions] = useState<boolean>(false);
  const [notification, setNotification] = useState<any | undefined>();
  const [user, setUser] = useState<UserSearchResultItem>();
  const [selectedFundingStream, setSelectedFundingStream] = useState<FundingStream>();
  const [selectedUserFundingStreamPermissions, setSelectedUserFundingStreamPermissions] =
    useState<FundingStreamPermissions>();
  const [originalPermissions, setOriginalPermissions] = useState<Permission[]>();
  const [editedPermissions, setEditedPermissions] = useState<Permission[]>();
  const [currentUserName, setCurrentUserName] = useState<string>("");
  const history = useHistory();
  useConfirmLeavePage(!equals(originalPermissions, editedPermissions));
  const permissions: FundingStreamPermissions[] = useSelector(
    (state: IStoreState) => state.userState.fundingStreamPermissions
  );

  const currentUserId = permissions.map(p => p.userId).find(id => id && id.trim() !== "");

    const users: string[] = useMemo(
      () =>
        !usersSearchResult?.users
          ? []
          : usersSearchResult.users
            .filter((u: { id: string }) => u.id != currentUserId)
              .sort((a: { name: string }, b: { name: string }) =>
                a.name.localeCompare(b.name)
              )
            .map((u: { name: string }) => u.name),
    [usersSearchResult, currentUserId]
    );

  const onUserSelected = (name: string) => {
    clearErrorMessages();
    setNotification(undefined);
    setUser(undefined);
    setEditedPermissions(undefined);
    setOriginalPermissions(undefined);
    if (!usersSearchResult?.users) return;

    const match = usersSearchResult.users.find((x: { name: string; }) => x.name === name);
    setUser(match);
  };

 const onFundingStreamSelect = (name: string) => {
    clearErrorMessages();
    setNotification(undefined);
    setSelectedFundingStream(undefined);
    setEditedPermissions(undefined);
    setOriginalPermissions(undefined);
    if (!fundingStreamsForAdmin) return;

    const match = fundingStreamsForAdmin.sort((a, b) => a.name.localeCompare(b.name)).find((fs) => fs.name === name);
    setSelectedFundingStream(match);
};

  const userError = errors.find(e => e.fieldName === "user-select");
  const fundingStreamError = errors.find(e => e.fieldName === "fundingStream");

  const onSubmitCriteria = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearErrorMessages();
    setNotification(undefined);

  let hasError = false;

    if (!user) {
      addError({ error: "Select a user to continue", fieldName: "user-select" });
      hasError = true;
    }

    if (!selectedFundingStream) {
      addError({ error: "Select a funding stream to continue", fieldName: "fundingStream" });
      hasError = true;
    }

    if (hasError) {
      setEditedPermissions(undefined);
      setOriginalPermissions(undefined);
      return;
    }
    try {
      setIsLoadingUserPermissions(true);
      if(user && selectedFundingStream){
      const response = await userService.getOtherUsersPermissionsForFundingStream(
        user.id,
        selectedFundingStream.id
      );
      history.push("/Permissions/View/Individual", {
        user,
        fundingStream: selectedFundingStream,
        permissions: response.data
      })}
    } catch (e: any) {
      addError({ error: e, description: "Error while fetching user's permissions" });
      setEditedPermissions(undefined);
      setOriginalPermissions(undefined);
    } finally {
      setIsLoadingUserPermissions(false);
    }
  };
  
  return (
    <Main location={Section.Home}>
      <BackLink />
      <MultipleErrorSummary errors={errors} />

      <h1 className="govuk-heading-l govuk-!-margin-bottom-3 govuk-!-margin-top-7">
        View and change a user’s permissions
      </h1>

      {notification && <>{notification}</>}

      {fundingStreamsForAdmin?.length === 0 && (
        <WarningText text="You don't have any admin permissions" className="govuk-!-margin-top-4" />
      )}
      {!selectedUserFundingStreamPermissions && fundingStreamsForAdmin.length > 0 && (
        <section id="select-user-and-funding-stream" className="govuk-grid-row govuk-!-margin-top-2">
          <div className="govuk-grid-column-full">
            <form id="criteria-form" onSubmit={onSubmitCriteria}>
              <fieldset className="govuk-fieldset">
                <div className={`govuk-form-group ${
                  errors.filter((e) => e.fieldName === "user-select").length > 0
                    ? "govuk-form-group--error"
                    : ""
                }`}>
                  <label className="govuk-label govuk-!-margin-top-2" id="user-permissions" htmlFor="user-select">
                    <h2 className="govuk-heading-m">Select a user</h2>
                  </label>
                  <p className="govuk-hint govuk-!-margin-bottom-3">
                    Start typing to select from a list of current CFS users.
                  </p>
                  {userError && (
                    <p  className="govuk-error-message">
                      <span className="govuk-visually-hidden">Error:</span>
                      Select a user to continue
                    </p>
                  )}
                  <div className="autocomplete-wrapper">
                    {users ? (
                      <AutoComplete componentId="user-select" suggestions={users} callback={onUserSelected} error={userError} />
                    ) : (
                      <LoadingFieldStatus title="Loading..." />
                    )}
                  </div>
                </div>
                <div className={`govuk-form-group ${
                  errors.filter((e) => e.fieldName === "fundingStream").length > 0
                    ? "govuk-form-group--error"
                    : ""
                }`}>
                  <label className="govuk-label" htmlFor="fundingStream">
                    <h2 className="govuk-heading-m">Select a funding stream</h2>
                  </label>
                  <div className="govuk-hint govuk-!-margin-bottom-3">
                    Start typing to select a funding stream you administer.
                  </div>
                  {fundingStreamError && (
                    <p className="govuk-error-message">
                      <span className="govuk-visually-hidden">Error:</span>
                      Select a funding stream to continue
                    </p>
                  )}
                  {fundingStreamsForAdmin ? (
                    <AutoComplete
                      componentId="fundingStream"
                      suggestions={fundingStreamsForAdmin.map(fs => fs.name)}
                      callback={onFundingStreamSelect} error={fundingStreamError}
                    />) : (
                    <LoadingFieldStatus title="Loading..." />
                  )}
                </div>
                <button type="submit" className="govuk-button govuk-!-margin-right-1">
                  Go to permissions
                </button>
              </fieldset>
            </form>
          </div>
        </section>
      )}
    </Main>
  );
}