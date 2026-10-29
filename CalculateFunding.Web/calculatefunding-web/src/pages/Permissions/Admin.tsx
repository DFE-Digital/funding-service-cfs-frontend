import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";

import { Main } from "../../components/Main";
import { MultipleErrorSummary } from "../../components/MultipleErrorSummary";
import { WarningText } from "../../components/WarningText";
import { useErrors } from "../../hooks/useErrors";
import { IStoreState } from "../../reducers/rootReducer";
import { FundingStreamPermissions } from "../../types/FundingStreamPermissions";
import { Section } from "../../types/Sections";
import { Title } from "components/Title";
import { BackLink } from "components/BackLink";

enum AdminSelection {
  None = "None",
  ByIndividual = "ByIndividual",
  ByFundingStream = "ByFundingStream",
}

export function Admin() {
  const permissions: FundingStreamPermissions[] = useSelector(
    (state: IStoreState) => state.userState.fundingStreamPermissions
  );
  document.title = "Administer permissions";
  const [adminSelection, setAdminSelection] = useState<AdminSelection>(AdminSelection.None);
  const fundingStreams = useMemo(
    () =>
      permissions &&
      permissions
        .filter((fs) => fs.canAdministerFundingStream)
        .map((fs) => ({
          id: fs.fundingStreamId,
          name: fs.fundingStreamName,
        })),
    [permissions]
  );
  const { errors, addError, clearErrorMessages } = useErrors();
  const managePermissionsError = errors.find(e => e.fieldName === "managePermissions");
  const history = useHistory();

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    clearErrorMessages();
    setAdminSelection(
      e.target.value === "by-individual-user" ? AdminSelection.ByIndividual : AdminSelection.ByFundingStream
    );
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    clearErrorMessages();

    switch (adminSelection) {
      case AdminSelection.ByIndividual:
        history.push("/Permissions/Individual");
        break;
      case AdminSelection.ByFundingStream:
        history.push("/Permissions/FundingStream");
        break;
      default:
        addError({ error: "Select an option to continue", fieldName: "managePermissions" });
        break;
    }
  }

  return (
    <Main location={Section.Home}>
      <div className="govuk-grid-row govuk-!-margin-bottom-7">
        <div className="govuk-grid-column-full">
          <BackLink />
        </div>
      </div>
      <MultipleErrorSummary errors={errors} />

      {permissions && fundingStreams && fundingStreams.length === 0 && (
        <WarningText text="You don't have any admin permissions" className="govuk-!-margin-top-4" />
      )}
      <section className="govuk-!-margin-top-9 govuk-!-margin-bottom-9">
        <form
          id="view-permissions-type"
          onSubmit={handleSubmit}
          noValidate={true}
          data-validate="permissions"
        >
          <fieldset className="govuk-fieldset" aria-describedby="view-permissions-heading">
              <div 
                className={`govuk-form-group ${errors.filter((e) => e.fieldName === "managePermissions").length > 0 
                ? "govuk-form-group--error": ""}`}
              >
              <h1 className="govuk-heading-xl govuk-!-margin-bottom-3 govuk-!-margin-top-3">Manage user permissions</h1>
              {managePermissionsError && (
                  <p id="view-permissions-type" className="govuk-error-message">
                    <span className="govuk-visually-hidden">Error:</span>
                    Select an option to continue
                  </p>
              )}
              <div className="govuk-hint">
                View and change a user’s permissions or download all user permissions for a funding stream you administer.
              </div>
              <div className="govuk-radios">
                <div className="govuk-radios__item">
                  <input
                    className="govuk-radios__input"
                    id="individual-user"
                    name="view-user-permissions-for"
                    onChange={onChange}
                    type="radio"
                    value="by-individual-user"
                    aria-describedby="individual-user-hint"
                  />
                  <label className="govuk-label govuk-radios__label" htmlFor="individual-user">
                    View and change a user’s permissions
                  </label>
                </div>
                <div className="govuk-radios__item">
                  <input
                    className="govuk-radios__input"
                    id="funding-stream"
                    name="view-user-permissions-for"
                    onChange={onChange}
                    type="radio"
                    value="by-funding-stream"
                    aria-describedby="funding-stream-hint"
                  />
                  <label className="govuk-label govuk-radios__label" htmlFor="funding-stream">
                    Download all user permissions for a funding stream as a CSV file
                  </label>
                </div>
              </div>
            </div>

            <button type="submit" className="govuk-button" data-module="govuk-button">
              Continue
            </button>
          </fieldset>
        </form>
      </section>
    </Main>
  );
}
