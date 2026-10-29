import { toNumber } from "lodash";
import React, { useState } from "react";
import { useHistory } from "react-router";
import { useParams } from "react-router-dom";

import { BackLink } from "../../components/BackLink";
import { LoadingStatus } from "../../components/LoadingStatus";
import { Main } from "../../components/Main";
import { MultipleErrorSummary } from "../../components/MultipleErrorSummary";
import { PermissionStatus } from "../../components/PermissionStatus";
import { FundingStreamAndPeriodSelection } from "../../components/TemplateBuilder/FundingStreamAndPeriodSelection";
import { Title } from "../../components/Title";
import { useTemplatePermissions } from "../../hooks/TemplateBuilder/useTemplatePermissions";
import { useEffectOnce } from "../../hooks/useEffectOnce";
import {
  cloneNewTemplateFromExisting,
  getAllFundingStreamsWithAvailablePeriods,
  getTemplateVersion,
} from "../../services/templateBuilderDatasourceService";
import { ErrorMessage } from "../../types/ErrorMessage";
import { Section } from "../../types/Sections";
import { TemplatePermissions, TemplateResponse } from "../../types/TemplateBuilderDefinitions";
import { FundingPeriod, FundingStream } from "../../types/viewFundingTypes";
import { AutoComplete } from "components/AutoComplete";

export interface TemplateVersionRoute {
  templateId: string;
  version: string;
}

export const CloneTemplate = () => {
  const { templateId, version } = useParams<TemplateVersionRoute>();
  const [fundingStream, setFundingStream] = useState<FundingStream>();
  const [fundingPeriods, setFundingPeriods] = useState<FundingPeriod[]>([]);
  const [templateToClone, setTemplateToClone] = useState<TemplateResponse>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedFundingPeriodId, setSelectedFundingPeriodId] = useState<string>();
  const [description, setDescription] = useState<string>("");
  const [errors, setErrors] = useState<ErrorMessage[]>([]);
  const [saveMessage, setSaveMessage] = useState<string>("");
  const [enableSaveButton, setEnableSaveButton] = useState<boolean>(false);
  const { canCreateTemplate, missingPermissions, fundingStreamPermissions } = useTemplatePermissions([
    TemplatePermissions.Create,
  ]);
  const history = useHistory();
  const maxCharacters = 200;
  const remainingCharacters = maxCharacters - description.length;
  const fundingPeriodError = errors.find(e => e.fieldName === "fundingPeriod");

  const fetchAvailableFundingConfigurations = async () => {
    const result = await getAllFundingStreamsWithAvailablePeriods();
    return result.data;
  };

  useEffectOnce(() => {
    setIsLoading(true);

    const fetchTemplateToClone = async (templateId: string, version: number) => {
      try {
        setIsLoading(true);
        const templateResult = await getTemplateVersion(templateId, version);
        if (templateResult.status !== 200) {
          addErrorMessage("Could not fetch template from which to clone. " + templateResult.statusText);
        }
        const templateResponse = templateResult.data as TemplateResponse;
        setTemplateToClone(templateResponse);
        setFundingStream({ id: templateResponse.fundingStreamId, name: templateResponse.fundingStreamName });
        await loadAvailable(templateResponse.fundingStreamId);
      } catch (err: any) {
        addErrorMessage(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    const loadAvailable = async (fundingStreamId: string) => {
      if (!fundingStreamId) {
        return;
      }
      const fundingStreamWithPeriodsResponse = await fetchAvailableFundingConfigurations();
      setIsLoading(false);

      // extract funding stream matching the template we're cloning from
      const streamWithPeriods = fundingStreamWithPeriodsResponse.find(
        (x) => x.fundingStream.id === fundingStreamId
      );
      if (!streamWithPeriods) {
        addErrorMessage("No available funding streams with periods", "fundingStreamId");
        return;
      }
      // user has sufficient permissions?
      if (
        fundingStreamPermissions &&
        !fundingStreamPermissions.some(
          (f) => f.permission === TemplatePermissions.Create && f.fundingStreamId === fundingStreamId
        )
      ) {
        addErrorMessage(
          "Insufficient permissions to clone a template with this funding stream",
          "fundingStreamId"
        );
        return;
      }
      populateFundingPeriods(streamWithPeriods.fundingPeriods);
    };

    try {
      fetchTemplateToClone(templateId, toNumber(version));
    } catch (err: any) {
      addErrorMessage(`Template options could not be loaded: ${err.message}.`);
      setIsLoading(false);
    }
  });

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const description = e.target.value;
    setDescription(description);
  };

  function addErrorMessage(errorMessage: string, fieldName?: string) {
    const errorCount: number = errors.length;
    const error: ErrorMessage = { id: errorCount + 1, fieldName: fieldName, message: errorMessage };
    setErrors((errors) => [...errors, error]);
  }

  function clearErrorMessages() {
    setErrors([]);
  }

  function populateFundingPeriods(fundingPeriods: FundingPeriod[]) {
    setFundingPeriods([]);
    if (!fundingPeriods || fundingPeriods.length === 0) {
      addErrorMessage(
        "No funding periods available for this funding stream. You will not be able to select a funding period if a template for this funding stream and period already exists. Please select a different funding stream.",
        "fundingPeriodId"
      );
      setEnableSaveButton(false);
      return;
    }
    setFundingPeriods(fundingPeriods);
    setEnableSaveButton(true);
  }

  const handleFundingPeriodChange = (fundingPeriodName: string) => {
    clearErrorMessages();

    const fundingPeriod = fundingPeriods.sort((a, b) => (a.name ?? a.id).localeCompare(b.name ?? b.id))
    .find((fs) => fs.name === fundingPeriodName);
    
    setSelectedFundingPeriodId(fundingPeriod?.id);
    setEnableSaveButton(true);
  };

  const handleSaveClick = async () => {
    if (!templateToClone || !enableSaveButton || !fundingStream) {
      return;
    }
    setEnableSaveButton(false);
    try {
      if (!selectedFundingPeriodId) {
        addErrorMessage("Select a funding period to continue", "fundingPeriod");
        setSelectedFundingPeriodId(undefined);
        return;
      }

      setSaveMessage("Saving template...");

      const result = await cloneNewTemplateFromExisting(
        templateToClone.templateId,
        templateToClone.version,
        templateToClone.fundingStreamId,
        selectedFundingPeriodId,
        description
      );
      if (result.status === 201) {
        history.push(`/Templates/${result.data}/Edit`);
      } else {
        addErrorMessage(
          "Template creation failed: " + result.status + " " + result.statusText + " " + result.data
        );
      }
    } catch (err: any) {
      addErrorMessage(
        `Template could not be saved: ${err.message}. Try refreshing the page and saving again.`
      );
      setSaveMessage(`Template could not be saved: ${err.message}.`);
      setEnableSaveButton(true);
    }
  };

  return (
    <Main location={Section.Templates}>
      <BackLink to={`/Templates/${templateId}/Edit?version=${version}`} />
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
      <PermissionStatus requiredPermissions={missingPermissions} hidden={isLoading} />
      <MultipleErrorSummary errors={canCreateTemplate ? errors : []} />
      <LoadingStatus
        title={"Loading options..."}
        description={"Please wait whilst the options are loading"}
        hidden={!isLoading}
      />
      {canCreateTemplate && (
        <form id="cloneTemplate">
      <h1 className="govuk-heading-l govuk-!-margin-top-4">
        <span className="govuk-caption-l">Templates</span>
        Clone a template
      </h1>
      <h2 className="govuk-heading-m govuk-!-margin-top-6 govuk-!-margin-bottom-6">
        Template name: {templateToClone?.name}
      </h2>
      <p className="govuk-body govuk-!-margin-top-6 govuk-!-margin-bottom-6">
        <span className="govuk-tag govuk-tag--grey">
          v{templateToClone?.majorVersion}.{templateToClone?.minorVersion} {templateToClone?.status}
        </span>
      </p>
      <div className={`govuk-form-group ${errors.filter((e) => e.fieldName === "fundingPeriod").length > 0
                ? "govuk-form-group--error"
                : ""
              }`}>
 <h2 className="govuk-label-wrapper">
              <label className="govuk-label govuk-label--m" htmlFor="description">
                Select a funding period
              </label>
              </h2>
              <div id="desc-char-hint" className="govuk-hint">
                    Start typing to select a funding period from the list
              </div>
               {fundingPeriodError && (
                  <p id="fundingStream-error" className="govuk-error-message">
                    <span className="govuk-visually-hidden">Error:</span>
                    Select a funding stream to continue
                  </p>
                )}
          {fundingPeriods.length > 0 && !isLoading && (
            <AutoComplete
                                componentId="fundingPeriodId"
                                suggestions={fundingPeriods
                                  .sort((a, b) => (a.name ?? a.id)
                                    .localeCompare(b.name ?? b.id))
                                  .map((fs) => fs.name)
                                  .filter((name): name is string => !!name)} // <- filter undefined
                                callback={handleFundingPeriodChange} error={fundingPeriodError}
                              />
          )}
              </div>
         

          <div className="govuk-grid-row">
            <div className="govuk-grid-column-full">
              <h2 className="govuk-label-wrapper">
              <label className="govuk-label govuk-label--m" htmlFor="description">
                Add a template description
              </label>
              </h2>
              <div id="desc-char-hint" className="govuk-hint">
                    Include information related to this template that might help you or other users later
              </div>
              <textarea
                className="govuk-textarea govuk-js-character-count govuk-!-margin-bottom-1"
                id="description"
                rows={8}
                aria-describedby="description-hint"
                maxLength={200}
                onChange={handleDescriptionChange}
              />
              <div id="desc-char-info" className="govuk-hint govuk-character-count__message">
                    You have {remainingCharacters} characters remaining
              </div>
            </div>
          </div>
          <div className="govuk-grid-row">
            <div className="govuk-grid-column-full govuk-body-m">
              {(
                <button
                  className="govuk-button govuk-!-margin-top-5 govuk-!-margin-right-2"
                  data-testid="save"
                  onClick={handleSaveClick}
                  disabled={!enableSaveButton}
                >
                  Clone
                </button>
              )}
              {saveMessage.length > 0 ? <span className="govuk-error-message">{saveMessage}</span> : null}
            </div>
          </div>
        </form>
      )}
        </div>
      </div>

    </Main>
  );
};
