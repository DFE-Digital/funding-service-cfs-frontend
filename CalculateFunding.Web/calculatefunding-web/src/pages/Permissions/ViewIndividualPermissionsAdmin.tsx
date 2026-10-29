import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";
import { equals } from "ramda";

import { BackLink } from "../../components/BackLink";
import { Main } from "../../components/Main";
import { MultipleErrorSummary } from "../../components/MultipleErrorSummary";
import { convertToSlug } from "../../helpers/stringHelper";
import { applyPermission, getEnabledPermissions } from "../../hooks/Permissions/useFundingStreamPermissions";
import { useConfirmLeavePage } from "../../hooks/useConfirmLeavePage";
import { useErrors } from "../../hooks/useErrors";
import * as userService from "../../services/userService";
import { buildPermissions } from "../../tests/fakes/testFactories";
import { FundingStreamPermissions } from "../../types/FundingStreamPermissions";
import { Permission, PermissionsCategories } from "../../types/Permission";
import { Section } from "../../types/Sections";
import { UserSearchResultItem } from "../../types/Users/UserSearchResult";
import { FundingStream } from "../../types/viewFundingTypes";
import { useSelector } from "react-redux";
import { IStoreState } from "reducers/rootReducer";
import { User } from "types/User";

export function ViewIndividualPermissionsAdmin(): JSX.Element {
  const { errors, addError, clearErrorMessages } = useErrors();
  const location = useLocation();

  const { user, fundingStream, permissions } = location.state as {
    user: UserSearchResultItem;
    fundingStream: FundingStream;
    permissions: FundingStreamPermissions;
  };

  const currentUserpermissions: FundingStreamPermissions[] = useSelector(
    (state: IStoreState) => state.userState.fundingStreamPermissions
  );
  
  const enabledPermissions = getEnabledPermissions(permissions);

  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<any>();
  const [adminUsers, setAdminUsers] = useState<User[]>([]);

  const [selectedUserFundingStreamPermissions, setSelectedUserFundingStreamPermissions] =
    useState<FundingStreamPermissions>(permissions);

  const [editedPermissions, setEditedPermissions] =
    useState<Permission[]>(enabledPermissions);

  const [originalPermissions, setOriginalPermissions] =
    useState<Permission[]>(enabledPermissions);

  const permissionsToShow: Permission[] =
    Object.values(Permission).map(x => x.toString()) as Permission[];

  const parentPermissions: string[] = [
    Permission.CanReleaseFunding.toString()
  ];

  const childPermissions: string[] = [
    Permission.CanReleaseFundingForStatement.toString(),
    Permission.CanReleaseFundingForPaymentOrContract.toString()
  ];

  const parentChildPermissions = [
    {
      parent: Permission.CanReleaseFunding.toString(),
      child: [
        Permission.CanReleaseFundingForStatement.toString(),
        Permission.CanReleaseFundingForPaymentOrContract.toString()
      ]
    }
  ];

  const currentUserId = currentUserpermissions
    .find(p => p.userId && p.userId.trim() !== "")?.userId;

 // get admin's user emails
  useEffect(() => {
    if (!fundingStream?.id) return;
    userService.getAdminUsersForFundingStream(fundingStream.id)
      .then((result) =>
       setAdminUsers(result.data ?? [])
      );
  }, [fundingStream]);

  // Find when admin id matches with current user's id
  const isAdmin = adminUsers.some(admin => admin.userId === currentUserId)

  useConfirmLeavePage(!equals(originalPermissions, editedPermissions));

  const selectedApplyPermission = (
    userFundingStreamPermissions: FundingStreamPermissions,
    permission: Permission,
    checked: boolean
  ) => {
    const updated = applyPermission(userFundingStreamPermissions, permission, checked);
    setSelectedUserFundingStreamPermissions(updated);
  };

  const handleParentPermission = (
    permission: Permission,
    editedPermissions: Permission[],
    userFundingStreamPermissions: FundingStreamPermissions,
    enabledBefore: boolean
  ) => {
    const childPermissions =
      parentChildPermissions.find(p => p.parent == permission.toString())?.child;

    if (!childPermissions) return;

    const newPermissions: Permission[] = [...editedPermissions];

    childPermissions.forEach(per => {
      const childPermission = permissionsToShow.find(p => p.toString() == per);
      if (childPermission) {
        newPermissions.push(childPermission);
        selectedApplyPermission(userFundingStreamPermissions, childPermission, !enabledBefore);
      }
    });

    if (enabledBefore) {
      setEditedPermissions(
        editedPermissions.filter(p => !childPermissions.includes(p.toString()))
      );
    } else {
      setEditedPermissions([...new Set([...editedPermissions, ...newPermissions])]);
    }
  };

  const handleChildPermission = (
    permission: Permission,
    editedPermissions: Permission[],
    userFundingStreamPermissions: FundingStreamPermissions,
    enabledBefore: boolean
  ) => {
    const parentPermission =
      parentChildPermissions.find(p => p.child.includes(permission.toString()))?.parent;

    const childPerms =
      parentChildPermissions.find(p => p.parent == parentPermission)?.child;

    if (!parentPermission || !childPerms) return;

    const parentPerm = permissionsToShow.find(p => p.toString() == parentPermission);
    if (!parentPerm) return;

    if (enabledBefore) {
      const stillEnabled = childPerms.some(per => {
        const cp = permissionsToShow.find(p => p.toString() == per);
        return cp && cp !== permission && editedPermissions.includes(cp);
      });

      if (!stillEnabled) {
        setEditedPermissions(
          editedPermissions.filter(p => p !== permission && p !== parentPerm)
        );
        selectedApplyPermission(userFundingStreamPermissions, parentPerm, false);
      } else {
        setEditedPermissions(editedPermissions.filter(p => p !== permission));
      }
    } else {
      setEditedPermissions([...editedPermissions, permission, parentPerm]);
      selectedApplyPermission(userFundingStreamPermissions, parentPerm, true);
    }

    selectedApplyPermission(userFundingStreamPermissions, permission, !enabledBefore);
  };

  const onChangePermission = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearErrorMessages();
    setNotification(undefined);

    const permissionName = e.target.value;
    const permission = permissionsToShow.find(p => p.toString() == permissionName);
    if (!permission) return;

    const enabledBefore = editedPermissions.includes(permission);

    if (parentPermissions.includes(permissionName)) {
      handleParentPermission(
        permission,
        editedPermissions,
        selectedUserFundingStreamPermissions,
        enabledBefore
      );
    } else if (childPermissions.includes(permissionName)) {
      handleChildPermission(
        permission,
        editedPermissions,
        selectedUserFundingStreamPermissions,
        enabledBefore
      );
    } else {
      if (enabledBefore) {
        setEditedPermissions(editedPermissions.filter(p => p !== permission));
      } else {
        setEditedPermissions([...editedPermissions, permission]);
      }

      selectedApplyPermission(
        selectedUserFundingStreamPermissions,
        permission,
        !enabledBefore
      );
    }
  };

  const onSaveUserPermissions = async () => {
    if (isSaving) return;

    setIsSaving(true);

    try {
      const response =
        await userService.updateOtherUsersPermissionsForFundingStream(
          selectedUserFundingStreamPermissions
        );

      const perms = response.data;
      const enabled = getEnabledPermissions(perms);

      setSelectedUserFundingStreamPermissions(perms);
      setEditedPermissions(enabled);
      setOriginalPermissions(enabled);

      setNotification(
        <div
          className="govuk-notification-banner govuk-notification-banner--success"
          role="alert"
          aria-labelledby="govuk-notification-banner-title"
        >
          <div className="govuk-notification-banner__header">
            <h2 className="govuk-notification-banner__title" id="govuk-notification-banner-title">
              Success
            </h2>
          </div>
          <div className="govuk-notification-banner__content">
            <h2 className="govuk-heading-m">
              You have saved {user.name}’s permissions for the {fundingStream.name} funding stream
            </h2>
          </div>
        </div>
      );
    } catch (e: any) {
      addError({ error: e, description: "Error saving changes, try again" });
    } finally {
      setIsSaving(false);
    }

    window.scrollTo(0, 0);
  };

  const onRemoveUserPermissions = async () => {
    if (isSaving) return;

    try {
      setNotification(undefined);
      setOriginalPermissions([]);
      setEditedPermissions([]);

      setSelectedUserFundingStreamPermissions(
        buildPermissions({
          fundingStreamId: fundingStream.id,
          fundingStreamName: fundingStream.name,
          setAllPermsEnabled: false,
          userId: user.id
        })
      );
    } catch (e: any) {
      addError({ error: e, description: "Error removing user's permissions" });
    }
  };

  const UserPermissionDisplay = (props: {
    permission: Permission;
    enabledPermissions: Permission[] | undefined;
  }) => {
    const permissionTitle = props.permission.toString();
    const slug = convertToSlug(permissionTitle);
    const words = permissionTitle.split(" ");

    let boldCount = 1;
    if (props.permission === Permission.CanUploadDataSourceFiles || props.permission === Permission.CanAdministerFundingStream) boldCount = 3;

    const boldWords = words.slice(0, boldCount).join(" ");
    const restWords = words.slice(boldCount).join(" ");

    return (
      <div className="govuk-checkboxes govuk-checkboxes--medium govuk-!-margin-bottom-3">
        <div className="govuk-checkboxes__item">
          <input
            className="govuk-checkboxes__input"
            id={slug}
            name={slug}
            type="checkbox"
            defaultChecked={props.enabledPermissions?.includes(props.permission)}
            onChange={onChangePermission}
            value={permissionTitle}
          />
          <label className="govuk-label govuk-checkboxes__label" htmlFor={slug}>
            <strong>{boldWords}</strong> {restWords}
          </label>
        </div>
      </div>
    );
  };

  return (
    <Main location={Section.Home}>
      <BackLink />
      <MultipleErrorSummary errors={errors} />
      {notification}

      <section>
        <div className="govuk-grid-row govuk-!-margin-top-5">
          <div className="govuk-grid-column-full">
            <fieldset className="govuk-fieldset">
              <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                <h1 className="govuk-heading-l govuk-!-margin-bottom-3 govuk-!-margin-top-3">
                  {user.name} — {fundingStream.name} funding stream
                </h1>
              </legend>

              {Object.keys(PermissionsCategories).map((categoryName, idx) => {

                return (
                  <div key={idx} className="govuk-form-group">
                    <fieldset className="govuk-fieldset govuk-!-margin-bottom-6">
                      <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">
                        {categoryName}
                      </legend>

                      {PermissionsCategories[categoryName].map(p => (
                        <UserPermissionDisplay
                          key={p.toString()}
                          permission={p}
                          enabledPermissions={editedPermissions}
                        />
                      ))}
                    </fieldset>
                  </div>
                );
              })}
              <div className="govuk-grid-columns-two-thirds">
                <button
                  onClick={onSaveUserPermissions}
                  className="govuk-button govuk-!-margin-right-3"
                >
                  Save permissions
                </button>

                <button
                  onClick={onRemoveUserPermissions}
                  className="govuk-button govuk-button--secondary"
                >
                  Clear
                </button>
              </div>
            </fieldset>
          </div>
        </div>
      </section>
    </Main>
  );
}