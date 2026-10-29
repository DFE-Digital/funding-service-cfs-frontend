import { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { RouteComponentProps, useHistory } from "react-router";
import { Link , useLocation} from "react-router-dom";
import * as actions from "../../../actions/FundingSearchSelectionActions";
import { Breadcrumb, Breadcrumbs } from "../../../components/Breadcrumbs";
import { FundingSelectionBreadcrumb } from "../../../components/Funding/FundingSelectionBreadcrumb";
import { LoadingStatusNotifier } from "../../../components/LoadingStatusNotifier";
import { Main } from "../../../components/Main";
import { MultipleErrorSummary } from "../../../components/MultipleErrorSummary";
import { useJobSubscription } from "../../../hooks/Jobs/useJobSubscription";
import { useErrors } from "../../../hooks/useErrors";
import { useSpecificationSummary } from "../../../hooks/useSpecificationSummary";
import { publishedProviderService } from "../../../services/publishedProviderService";
import { HistoryPage } from "../../../types/HistoryPage";
import { JobCreatedResponse } from "../../../types/JobCreatedResponse";
import { MonitorFallback, MonitorMode } from "../../../types/Jobs/JobSubscriptionModels";
import { JobType } from "../../../types/jobType";
import { BatchUploadResponse } from "../../../types/PublishedProvider/BatchUploadResponse";
import { BatchValidationRequest } from "../../../types/PublishedProvider/BatchValidationRequest";
import { FundingActionType } from "../../../types/PublishedProvider/PublishedProviderFundingCount";
import { Section } from "../../../types/Sections";
import { useProfileVariationPointers } from "hooks/Variation/useProfileVariationPointers";
import { InformationPanel } from "components/InformationPanel";
const SafeLink = Link as any;
export interface ReprofileBatchRouteProps {
  fundingStreamId: string;
  fundingPeriodId: string;
  specificationId: string;
}

export function ReprofileProvidersForFundingApproval({ match }: RouteComponentProps<ReprofileBatchRouteProps>) {
  const fundingStreamId = match.params.fundingStreamId;
  const fundingPeriodId = match.params.fundingPeriodId;
  const specificationId = match.params.specificationId;
  const [hasProfileVariationPointer, setHasProfileVariationPointer] = useState<boolean>(true);
  const [fileName, setFileName] = useState<string>("");
  const [theFile, setTheFile] = useState<File>();
  const [jobId, setJobId] = useState<string | undefined>();
  const [batchId, setBatchId] = useState<string | undefined>();
  const [isUpdating, setIsUpdating] = useState<boolean>();
  const [isWaitingForJob, setIsWaitingForJob] = useState<boolean>();
  const [actionType, setActionType] = useState<FundingActionType | undefined>();
  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();
  const { errors, addError, clearErrorMessages } = useErrors();
  const currentPage: HistoryPage = {
    title: "Reprofile a batch of providers",
    path: history.location.pathname,
  };

  const [isValid, setIsApproved] = useState<any>(location.state);
  const errorCss = isValid ? "govuk-form-group govuk-form-group--error" : "govuk-form-group";
  const { addSub, results: jobNotifications } = useJobSubscription({
    isEnabled: true,
    onError: (err) => addError({ error: err, description: "Error checking for background jobs running" }),
  });  

  useEffect(() => {
    addJobTypeSubscription([
      JobType.BatchPublishedProviderValidationJob,
      JobType.RefreshFundingJob,
      JobType.ApproveBatchProviderFundingJob,
    ]);
  }, [match]);
  window.scrollTo(0, 0)

  function addJobTypeSubscription(jobTypes: JobType[]) {
    addSub({
      filterBy: {
        specificationId: specificationId,
        jobTypes: jobTypes,
      },
      monitorMode: MonitorMode.SignalR,
      monitorFallback: MonitorFallback.Polling,
      onError: (err) =>
        addError({ error: err, description: "An error occurred while monitoring a background job" }),
    });
  }

  const { profileVariationPointers, isLoadingVariationManagement } = useProfileVariationPointers({
    specificationId,
    enabled: !!specificationId?.length,
    onSuccess: () => clearErrorMessages(),
    onError: (err) =>
      addError({
        error: err.message,
        description: "Error while loading available funding lines",
      }),
  });

  useEffect(() => {
    if(profileVariationPointers){
      if(profileVariationPointers.filter(item=>item.profileVariationPointer !== null).length > 0){
        setHasProfileVariationPointer(true);
      } else {
        setHasProfileVariationPointer(false)
      }
    }
  }, [hasProfileVariationPointer, profileVariationPointers])
  
  const { mutate: uploadBatchFile, isLoading: isUploadingBatchFile } = useMutation<
    BatchUploadResponse,
    AxiosError,
    File
  >(
    async (theFile) => {
      return (await publishedProviderService.uploadBatchOfPublishedProviders(theFile)).data;
    },
    {
      onError: (err) =>
        addError({ error: err, description: "Error while trying to queue job to validate your batch file" }),
      onSuccess: (data) => {
        setBatchId(data.batchId);
        createValidationJob({
          batchId: data.batchId,
          specificationId: specificationId,
          fundingStreamId: fundingStreamId,
          fundingPeriodId: fundingPeriodId,
        });
      },
    }
  );

  const { data: publishedProviderIds, isLoading: isExtractingProviderIds } = useQuery<string[], AxiosError>(
    `batch-${batchId}-publishedProviderIds`,
    async () => (await publishedProviderService.getPublishedProvidersByBatch(batchId as string)).data,
    {
      enabled:
        batchId !== undefined &&
        jobId !== undefined &&
        jobNotifications.some((j) => j.latestJob?.jobId === jobId && j.latestJob?.isSuccessful),
      cacheTime: 0,
      staleTime: 0,
    }
  );

  const { mutate: createValidationJob, isLoading: isCreatingValidationJob } = useMutation<
    JobCreatedResponse,
    AxiosError,
    BatchValidationRequest
  >(
    async (request) => {
      return (await publishedProviderService.validatePublishedProvidersByBatch(request)).data;
    },
    {
      onError: (err) =>
        addError({ error: err, description: "Error while trying to create job to validate your batch file" }),
      onSuccess: (data) => {
        setJobId(data.jobId);
        setIsWaitingForJob(true);
      },
    }
  );

  const getFileToUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsApproved(false);
    if (e.target.files !== null) {
      const file: File = e.target.files[0];
      setFileName(file.name);
      setTheFile(file); 
      window.history.replaceState({}, '');     
    }
  };

  const uploadForApprove = async () => {
    setIsUpdating(true);
    clearErrorMessages();
    setActionType(FundingActionType.Reprofile);
    await uploadBatchFile(theFile as File);
  };

  const latestJob = jobNotifications.find((j) => j.latestJob && j.latestJob.jobId === jobId)?.latestJob;

  useEffect(() => {
    if (!latestJob) return;

    if (isWaitingForJob) {
      setIsWaitingForJob(false);
    }
    if (latestJob.isFailed) {
      addError({ error: latestJob.outcome ? latestJob.outcome : "", description: "Validation failed" });
      setIsUpdating(false);
      setFileName("");
    } else if (latestJob.isSuccessful && publishedProviderIds) {
      dispatch(actions.initialiseFundingSearchSelection(fundingStreamId, fundingPeriodId, specificationId, actionType));
      dispatch(actions.addProvidersToFundingSelection(publishedProviderIds));
      history.push(
        `/FundingManagement/ReprofilingOnDemand/Confirm/${fundingStreamId}/${fundingPeriodId}/${specificationId}/${actionType}`,
        { previousPage: currentPage }
      );
    }
  }, [jobNotifications, publishedProviderIds]);

  const { specification } = useSpecificationSummary(specificationId, () =>
    addError({ error: "Error while loading specification" })
  );
  
  const isBlocked =
    isUpdating ||
    isWaitingForJob ||
    isUploadingBatchFile ||
    isCreatingValidationJob ||
    isExtractingProviderIds ||
    (latestJob && latestJob.jobId === jobId && latestJob.isActive);
  const hasActiveJob = latestJob && latestJob.isActive;
  const hasUsersValidationJobActive = latestJob && latestJob.isActive && latestJob.jobId === jobId;
  const isValidatingOrUploading =
    isUpdating ||
    isUploadingBatchFile ||
    isCreatingValidationJob ||
    isWaitingForJob ||
    hasUsersValidationJobActive;
  return (
    <Main location={Section.FundingManagement}>
      <Breadcrumbs>
        <Breadcrumb name="Home" url="/" />
        <Breadcrumb name="Funding management" url="/FundingManagement" />
        <FundingSelectionBreadcrumb actionType={FundingActionType.Approve} />
        <Breadcrumb
          name={specification?.name ?? ""}
          url={`/FundingManagement/Approve/Results/${fundingStreamId}/${fundingPeriodId}/${specificationId}`}
        />
      </Breadcrumbs>
      <MultipleErrorSummary errors={errors} />
      { !hasProfileVariationPointer && 
        <ProblemStatus massage ={"The variation pointers have not been set for any of the funding lines in this specification. Please set the variation pointers."} />
      }
      {isValid &&      
        <ProblemStatus massage={"None of the providers in this batch are eligible for reprofiling. This is either because the providers have not been released only for statements, the details of the providers are not in an open state or the open date is not within the same year as the allocation funding year."} />
      }
      <fieldset className="govuk-fieldset">
        <legend className="govuk-fieldset__legend govuk-fieldset__legend--xl">
          <h1 className="govuk-fieldset__heading govuk-!-margin-bottom-5">{currentPage.title}</h1>
        </legend>
        {specification && (
          <dl className="govuk-summary-list govuk-summary-list--no-border">
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">
                <p className="govuk-body">If you choose to reprofile the allocations of providers in a batch, their profiles will be generated based on the open dates for new openers and converters.</p>
                <h2 className="govuk-heading-s govuk-!-margin-bottom-1">
                  {specification.name}
                </h2>
              </dt>
            </div>
          </dl>
        )}
        {!isBlocked && (
        <div className="govuk-!-margin-bottom-3">
          <p className="govuk-body">Reprofile provider allocations by uploading the data on the first sheet of a .xlsx file. When you upload, remember the following:</p>
          <ul className="govuk-list govuk-list--bullet">
            <li>The file should have only one UKPRN column</li>
          </ul>
        </div>)}
        <br/>
      </fieldset>
      {isBlocked && (
        <LoadingStatusNotifier
          notifications={[
            {
              isActive: isValidatingOrUploading,
              title: "Eligibility check",
              subTitle:"Please wait, this could take several minutes",
              description:"Please do not refresh this page, you will be redirected automatically"
            },
            {
              isActive: hasActiveJob,
              title: "Background job is running",
              subTitle:
                latestJob && latestJob.isActive
                  ? `Job ${latestJob.statusDescription}: ${latestJob.jobDescription}`
                  : "",
            },
            {
              isActive: isExtractingProviderIds,
              title: "Extracting providers from file",
            },
            {
              isActive: isUploadingBatchFile,
              title: "Reprofiling your file...",
            },
            {
              isActive: isCreatingValidationJob,
              title: "Creating job to validate file...",
            },
            {
              isActive: isWaitingForJob,
              title: "Creating job to validate file...",
            },
          ]}
        />
      )}
      {!isBlocked && (
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-two-thirds">
            <div className={errorCss}>              
              <label className="govuk-label" htmlFor="file-upload">
                <strong>Upload a .xlsx file</strong>
              </label>
              <br/>
              {isValid && 
                <>
                  <span className="govuk-caption-m">Please check for the below errors.</span>   
                  <br/>               
                  <span className="govuk-error-message">None of the providers in this batch are eligible for reprofiling</span>                  
                </>
              }
              <input
                className="govuk-file-upload"
                id="file-upload"
                name="file-upload"
                type="file"
                disabled={isBlocked || !hasProfileVariationPointer}
                style={{background: "initial"}}
                onChange={getFileToUpload}
              />
            </div>
            <button
              className="govuk-button govuk-!-margin-right-1"
              type="button"
              onClick={uploadForApprove}
              disabled={fileName.length === 0 || isBlocked || !hasProfileVariationPointer}
              data-module="govuk-button"
            >
              Reprofile
            </button>
            <SafeLink
              className="govuk-button govuk-button--secondary"
              data-module="govuk-button"
              to={`/FundingManagement/Approve/Results/${fundingStreamId}/${fundingPeriodId}/${specificationId}`}
            >
              Cancel
            </SafeLink>
          </div>
        </div>
      )}
    </Main>
  );
}

const ProblemStatus = (props : {massage : string}) =>{
  return(
    <div className="govuk-error-summary" aria-labelledby="error-summary-title" role="alert"  data-testid="error-summary">
      <h2 className="govuk-error-summary__title" id="error-summary-title">There is a problem</h2>
      <div className="govuk-error-summary__body">
        <ul className="govuk-list govuk-error-summary__list">
          <li>  
            <a href="" className="govuk-link govuk-link-red">{props.massage}</a>
          </li>
        </ul>
      </div>
    </div>
  )}