import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Main } from "../../components/Main";
import { MultipleErrorSummary } from "../../components/MultipleErrorSummary";
import { WarningText } from "../../components/WarningText";
import { useErrors } from "../../hooks/useErrors";
import { IStoreState } from "../../reducers/rootReducer";
import { FundingStreamPermissions } from "../../types/FundingStreamPermissions";
import { Section } from "../../types/Sections";
import { useHistory } from "react-router-dom";
import { AutoComplete } from "components/AutoComplete";
import { LoadingFieldStatus } from "components/LoadingFieldStatus";
import { BackLink } from "components/BackLink";

export function MyPermissions(): JSX.Element {
  const permissions: FundingStreamPermissions[] = useSelector(
    (state: IStoreState) => state.userState.fundingStreamPermissions
  );
  const { errors, addError } = useErrors();
  const [selectedFundingStreamId, setSelectedFundingStreamId] = useState<string | undefined>();
  const history = useHistory();

  const fundingStreamError = errors.find(e => e.fieldName === "fundingStream");
  const onFundingStreamChange = (name: string) => {
    if (!permissions) return;
    const match = permissions
      .sort((a, b) => (a.fundingStreamName ?? a.fundingStreamId).localeCompare(b.fundingStreamName ?? b.fundingStreamId))
      .find((fs) => fs.fundingStreamName === name);
      
    setSelectedFundingStreamId(match?.fundingStreamId ?? "");
  };

  function goToPermissionsPage() {
    if (!selectedFundingStreamId) {
      addError({ error: "Select a funding stream to continue", fieldName: "fundingStream" });
      setSelectedFundingStreamId(undefined);
      return;
    }
  history.push(`/permissions/MyPermissions/${selectedFundingStreamId}/admin`);
}
  return (
    <Main location={Section.Permissions}>
      <BackLink />
      <MultipleErrorSummary errors={errors} />
      

      {permissions && permissions.length === 0 && (
        <WarningText
          text="You have read only access for all funding streams"
          className="govuk-!-margin-top-4"
        />
      )}
      {permissions && permissions.length > 0 && (
        <section className="govuk-grid-row govuk-!-margin-top-2">
          <div className="govuk-grid-column-two-thirds">
            <div className={`govuk-form-group ${errors.filter((e) => e.fieldName === "fundingStream").length > 0
                ? "govuk-form-group--error"
                : ""
              }`}>
              <h1 className="govuk-heading-l govuk-!-margin-bottom-3 govuk-!-margin-top-3">
                View your permissions
              </h1>
              <span className=" govuk-!-margin-bottom-2 govuk-hint">
                Start typing to select a funding stream and view your approval, editing and release permissions.
              </span>
                {fundingStreamError && (
                  <p id="fundingStream-error" className="govuk-error-message">
                    <span className="govuk-visually-hidden">Error:</span>
                    Select a funding stream to continue
                  </p>
                )}
                {permissions ? (
                  <AutoComplete
                    componentId="fundingStream"
                    suggestions={permissions
                      .sort((a, b) => (a.fundingStreamName ?? a.fundingStreamId)
                        .localeCompare(b.fundingStreamName ?? b.fundingStreamId))
                      .map((fs) => fs.fundingStreamName)
                      .filter((name): name is string => !!name)} // <- filter undefined
                    callback={onFundingStreamChange} error={fundingStreamError}
                  />) : (
                  <LoadingFieldStatus title="Loading..." />
                )}
            </div>
            
             <button
                type="button"
                className="govuk-button govuk-!-margin-right-1"
                onClick={goToPermissionsPage}
              >
                Continue
              </button>

          </div>
        </section>
      )}
    </Main>
  );
}


