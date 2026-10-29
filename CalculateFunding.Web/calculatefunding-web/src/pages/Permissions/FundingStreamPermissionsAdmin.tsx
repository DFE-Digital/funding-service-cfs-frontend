import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { LoadingFieldStatus } from "../../components/LoadingFieldStatus";
import { Main } from "../../components/Main";
import { MultipleErrorSummary } from "../../components/MultipleErrorSummary";
import { WarningText } from "../../components/WarningText";
import { useErrors } from "../../hooks/useErrors";
import { IStoreState } from "../../reducers/rootReducer";
import * as userService from "../../services/userService";
import { FundingStreamPermissions } from "../../types/FundingStreamPermissions";
import { ReportOnUsersWithFundingStreamPermissionsModel } from "../../types/ReportOnUsersWithFundingStreamPermissionsModel";
import { Section } from "../../types/Sections";
import { FundingStream } from "../../types/viewFundingTypes";
import { BackLink } from "components/BackLink";
import { AutoComplete } from "components/AutoComplete";

export function FundingStreamPermissionsAdmin() {
  const permissions: FundingStreamPermissions[] = useSelector(
    (state: IStoreState) => state.userState.fundingStreamPermissions
  );
  const fundingStreams: FundingStream[] = useMemo(
    () =>
      permissions &&
      permissions
        .filter((fs) => fs.canAdministerFundingStream)
        .map(
          (fs) =>
            ({
              id: fs.fundingStreamId,
              name: fs.fundingStreamName,
            } as FundingStream)
        ),
    [permissions]
  );
  const { errors, addError, clearErrorMessages } = useErrors();
  const [selectedFundingStream, setSelectedFundingStream] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [report, setReport] = useState<ReportOnUsersWithFundingStreamPermissionsModel>();

  async function onSelect(name: string) {
    clearErrorMessages();
    setReport(undefined);
    setLoading(false);
    if (!permissions) return;

    const match = permissions
    .sort((a, b) => (a.fundingStreamName ?? a.fundingStreamId).localeCompare(b.fundingStreamName ?? b.fundingStreamId))
    .find((fs) => fs.fundingStreamName === name);
    setSelectedFundingStream(match?.fundingStreamId ?? "");
  }

  const fundingStreamError = errors.find(e => e.fieldName === "fundingStream");
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    clearErrorMessages();

    if (!selectedFundingStream || selectedFundingStream.length === 0) {
      addError({ error: "Select a funding stream to continue", fieldName: "fundingStream" });
    } else {
      try {
        setLoading(true);
        const response = await userService.getReportOnUsersByFundingStream(selectedFundingStream);
        setReport(response.data);
              
        // Automatically download the CSV
        if (response.data?.url) {
          const link = document.createElement("a");   
          link.href = response.data.url;             
          link.download = `report-${selectedFundingStream}.csv`; 
          document.body.appendChild(link);          
          link.click();                               // Trigger download
          document.body.removeChild(link);          
        }
      } catch (e: any) {
        addError({ error: e, description: "Unexpected server error" });
      }
      setLoading(false);
    }
  }

  return (
    <Main location={Section.Home}>
      <div className="govuk-grid-row govuk-!-margin-bottom-3">
        <div className="govuk-grid-column-full">
          <BackLink />
        </div>
      </div>
      <MultipleErrorSummary errors={errors} />
        {!loading && report?.url && (
          <div className="govuk-notification-banner govuk-notification-banner--success" role="alert"
            aria-labelledby="govuk-notification-banner-title"
            data-module="govuk-notification-banner">
            <div className="govuk-notification-banner__header">
              <h2 className="govuk-notification-banner__title" id="govuk-notification-banner-title">
                Success
              </h2>
            </div>  
            <div className="govuk-notification-banner__content">
              <h2 className="govuk-heading-m">
                Download successful: {selectedFundingStream}
              </h2>             
            </div>
          </div>
        )}

      {permissions && fundingStreams && fundingStreams.length === 0 && (
        <WarningText text="You don't have any admin permissions" className="govuk-!-margin-top-4" />
      )}

      <section className="govuk-grid-row govuk-!-margin-top-2">
        <div className="govuk-grid-column-two-thirds">
          <form
            id="download-form"
            className="form"
            onSubmit={onSubmit}
            noValidate={true}
            data-validate="permissions"
          >
            <div className={`govuk-form-group ${errors.filter((e) => e.fieldName === "fundingStream").length > 0
                ? "govuk-form-group--error"
                : ""
              }`}>
              <h1 className="govuk-heading-l govuk-!-margin-bottom-3 govuk-!-margin-top-3">
                Download all user permissions for a funding stream
              </h1>
              <span className="govuk-!-margin-bottom-2 govuk-hint">
                Start typing to select a funding stream you administer and download its user permissions as a CSV file
              </span>
                {fundingStreamError && (
                  <p className="govuk-error-message">
                    <span className="govuk-visually-hidden">Error:</span>
                      Select a funding stream to continue
                  </p>
                )}
              {fundingStreams ? (
                <AutoComplete
                  componentId="fundingStream"
                  suggestions={fundingStreams.map(fs => fs.name)}
                  callback={onSelect}
                  error={fundingStreamError}
                />) : (
                <LoadingFieldStatus title="Loading..." />
              )}
            </div>
            <button
              type="submit"
              className="govuk-button govuk-!-margin-right-1"
            >
              Download CSV file
            </button>
            {loading && (
              <LoadingFieldStatus
                title={"Generating report of users with permissions against this funding stream"}
              />
            )}
          </form>
        </div>
      </section>
    </Main>
  );
}
