import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { BackLink } from "../../components/BackLink";
import { LoadingStatus } from "../../components/LoadingStatus";
import { Main } from "../../components/Main";
import { MultipleErrorSummary } from "../../components/MultipleErrorSummary";
import { PermissionStatus } from "../../components/PermissionStatus";
import { AutoComplete } from "components/AutoComplete";
import { useTemplatePermissions } from "../../hooks/TemplateBuilder/useTemplatePermissions";
import { useEffectOnce } from "../../hooks/useEffectOnce";
import {
  createNewDraftTemplate,
  getAllFundingStreamsWithAvailablePeriods,
} from "../../services/templateBuilderDatasourceService";
import { ErrorMessage } from "../../types/ErrorMessage";
import { Section } from "../../types/Sections";
import {
  FundingStreamWithPeriodsResponse,
  TemplatePermissions,
} from "../../types/TemplateBuilderDefinitions";
import { FundingPeriod, FundingStream } from "../../types/viewFundingTypes";
import { bool } from "prop-types";
const SafeLink = Link as any;

export const CreateTemplate = () => {
  const [permittedFundingStreamsWithPeriods, setPermittedFundingStreamsWithPeriods] = useState<
    FundingStreamWithPeriodsResponse[]
  >([]);
  const [fundingStreams, setFundingStreams] = useState<FundingStream[]>([]);
  const [fundingPeriods, setFundingPeriods] = useState<FundingPeriod[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedFundingStreamId, setSelectedFundingStreamId] = useState<string>();
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
  const fundingStreamError = errors.find(e => e.fieldName === "fundingStreamId");
  const fundingPeriodError = errors.find(e => e.fieldName === "fundingPeriodId");


  const fetchData = async () => {
    const result = await getAllFundingStreamsWithAvailablePeriods();
    return result.data;
  };

  useEffectOnce(() => {
    setIsLoading(true);
    try {
      const loadData = async () => {
        const fundingStreamWithPeriodsResponse = await fetchData();
        setIsLoading(false);
        const permitted = fundingStreamWithPeriodsResponse.filter(
          (available) =>
            fundingStreamPermissions &&
            fundingStreamPermissions.some(
              (f) =>
                f.permission === TemplatePermissions.Create &&
                f.fundingStreamId === available.fundingStream.id
            )
        );
        setPermittedFundingStreamsWithPeriods(permitted);
        if (permitted.length > 0) {
          const permittedFundingStreams = permitted.map((item) => item.fundingStream);
          setFundingStreams(permittedFundingStreams);
          setEnableSaveButton(true);
        } else {
          addErrorMessage("There are no funding streams to display");
        }
      };
      loadData();
    } catch (err: any) {
      addErrorMessage(`Template options could not be loaded: ${err.message}.`);
      setIsLoading(false);
    }
  });

  function populateFundingPeriods(fundingPeriods: FundingPeriod[]) {
    setFundingPeriods([]);
    if (!fundingPeriods || fundingPeriods.length === 0) {
      addErrorMessage(
        "No funding periods available for this funding stream. You will not be able to select a funding period if a template for this funding stream and period already exists. Please select a different funding stream.",
        "fundingStreamId"
      );
      setEnableSaveButton(false);
      return;
    }
    setFundingPeriods(fundingPeriods);
    setEnableSaveButton(true);
  }

  useEffect(() => {
    clearErrorMessages();
    const streamWithPeriods = permittedFundingStreamsWithPeriods.find(
      (item) => item.fundingStream.id === selectedFundingStreamId
    );
    if (streamWithPeriods) {
      populateFundingPeriods(streamWithPeriods.fundingPeriods);
    }
  }, [selectedFundingStreamId]);

  function addErrorMessage(errorMessage: string, fieldName?: string) {
    const errorCount: number = errors.length;
    const error: ErrorMessage = { id: errorCount + 1, fieldName: fieldName, message: errorMessage };
    setErrors((errors) => [...errors, error]);
  }

  function clearErrorMessages() {
    setErrors([]);
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const description = e.target.value;
    setDescription(description);
  };

  const handleFundingStreamChange = (fundingStreamName: string) => {
    clearErrorMessages();
    const fundingStream = fundingStreams.sort((a, b) => (a.name ?? a.id).localeCompare(b.name ?? b.id))
    .find((fs) => fs.name === fundingStreamName);
    setSelectedFundingStreamId(fundingStream?.id);
    setSelectedFundingPeriodId(undefined);
    setEnableSaveButton(true);
  };

  const handleFundingPeriodChange = (fundingPeriodName: string) => {
    clearErrorMessages();
    const fundingPeriod = fundingPeriods.sort((a, b) => (a.name ?? a.id).localeCompare(b.name ?? b.id))
    .find((fs) => fs.name === fundingPeriodName);
    setSelectedFundingPeriodId(fundingPeriod?.id);
    setEnableSaveButton(true);
  };

  const handleSaveClick = async () => {
    if (!enableSaveButton) {
      return;
    }
    setEnableSaveButton(false);
    try {
      let hasError = false;
      if (!selectedFundingStreamId) {
        addErrorMessage("Select a funding stream to continue", "fundingStreamId");
        setSelectedFundingStreamId(undefined);
        hasError = true;
      }
      if (!selectedFundingPeriodId) {
        addErrorMessage("Select a funding period to continue", "fundingPeriodId");
        setSelectedFundingPeriodId(undefined);
        hasError = true;
      }
      if (hasError) return;
      
      const fundingStreamId = selectedFundingStreamId as string;
      const fundingPeriodId = selectedFundingPeriodId as string;

      setSaveMessage("Saving template...");

      const result = await createNewDraftTemplate(
        fundingStreamId,
        fundingPeriodId,
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
       <BackLink to={"/Templates/List"} />  
      <div className="govuk-grid-row">
         <div className="govuk-grid-column-two-thirds">
          <PermissionStatus requiredPermissions={missingPermissions} hidden={isLoading} />
          <MultipleErrorSummary errors={errors} />
      <LoadingStatus
        title={"Loading options..."}
        description={"Please wait whilst the options are loading"}
        hidden={!isLoading}
      />
      {canCreateTemplate && (
        <form id="createTemplate">
          {!isLoading && (
            <>
            <h1 className="govuk-heading-l govuk-!-margin-top-4">
              Create a template
            </h1>
            <div className={`govuk-form-group ${errors.filter((e) => e.fieldName === "fundingStreamId").length > 0
                ? "govuk-form-group--error"
                : ""
              }`}>
 <h2 className="govuk-label-wrapper">
              <label className="govuk-label govuk-label--m" htmlFor="description">
                Select a funding stream
              </label>
              </h2>
              <div id="desc-char-hint" className="govuk-hint">
                    Start typing to select a funding stream from the list
              </div>
               {fundingStreamError && (
                  <p id="fundingStream-error" className="govuk-error-message">
                    <span className="govuk-visually-hidden">Error:</span>
                    Select a funding stream to continue
                  </p>
                )}
          {fundingStreams.length > 0 && !isLoading && (
            <AutoComplete
                                componentId="fundingStreamId"
                                suggestions={fundingStreams
                                  .sort((a, b) => (a.name ?? a.id)
                                    .localeCompare(b.name ?? b.id))
                                  .map((fs) => fs.name)
                                  .filter((name): name is string => !!name)} // <- filter undefined
                                callback={handleFundingStreamChange} error={fundingStreamError}
                              />
          )}
            </div>
            <div className={`govuk-form-group ${errors.filter((e) => e.fieldName === "fundingPeriodId").length > 0
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
                    Select a funding period to continue
                  </p>
                )}
          {fundingStreams.length > 0 && (!selectedFundingStreamId || fundingPeriods.length > 0 ) && !isLoading && (
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
                <div className="govuk-grid-column-full govuk-form-group">
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
                <div className="govuk-grid-column-full">
                  {(
                    <button
                      className="govuk-button"
                      data-testid="save"
                      onClick={handleSaveClick}
                      disabled={!enableSaveButton}
                    >
                      Save
                    </button>
                  )}
                  &nbsp;
                  {saveMessage.length > 0 ? <span className="govuk-error-message">{saveMessage}</span> : null}
                </div>
              </div>
            </>
          )}
        </form>
      )}
        </div>
      </div>
    </Main>
  );
};
