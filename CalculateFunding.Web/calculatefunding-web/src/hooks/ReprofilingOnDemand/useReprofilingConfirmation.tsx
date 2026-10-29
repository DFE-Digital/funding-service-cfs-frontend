import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initialiseFundingSearchSelection } from "../../actions/FundingSearchSelectionActions";
import { useErrorContext } from "../../context/ErrorContext";
import { getLatestJob } from "../../helpers/jobDetailsHelper";
import { IStoreState } from "../../reducers/rootReducer";
import { getSpecificationCalculationResultsMetadata } from "../../services/providerService";
import * as publishService from "../../services/publishService";
import { FundingSearchSelectionState } from "../../states/FundingSearchSelectionState";
import { FundingConfiguration } from "../../types/FundingConfiguration";
import { JobDetails } from "../../types/jobDetails";
import { JobNotification, MonitorFallback, MonitorMode } from "../../types/Jobs/JobSubscriptionModels";
import { JobType } from "../../types/jobType";
import { Permission } from "../../types/Permission";
import {
  FundingActionType,
  PublishedProviderReprofilingSummary,
} from "../../types/PublishedProvider/PublishedProviderFundingCount";
import { SpecificationSummary } from "../../types/SpecificationSummary";
import { useJobSubscription } from "../Jobs/useJobSubscription";
import { useSpecificationPermissions } from "../Permissions/useSpecificationPermissions";
import { useFundingConfiguration } from "../useFundingConfiguration";
import { useSpecificationSummary } from "../useSpecificationSummary";
import { useHistory } from "react-router";

export interface UseReprofilingConfirmationResult {
  specification: SpecificationSummary | undefined;
  isLoadingSpecification: boolean;
  fundingConfiguration: FundingConfiguration | undefined;
  isLoadingFundingConfiguration: boolean;
  fundingSummary: PublishedProviderReprofilingSummary | undefined;
  clearFundingSearchSelection: () => void;
  latestJob: JobDetails | undefined;
  isWaitingForJob: boolean;
  isPermissionsFetched: boolean;
  hasPermissionToRefresh: boolean;
  hasPermissionToRelease: boolean;
  hasPermissionToReleaseForStatement: boolean;
  hasPermissionToReleaseForContractorPayments: boolean;
  selectedProviderIds: string[];
  notifications: JobNotification[];
  specificationLastUpdatedDate: Date | undefined;
}
export const useReprofilingConfirmation = ({
  specificationId,
  fundingStreamId,
  fundingPeriodId,
  actionType,
}: {
  fundingStreamId: string;
  fundingPeriodId: string;
  specificationId: string;
  actionType: Exclude<FundingActionType, FundingActionType.Refresh>;
}): UseReprofilingConfirmationResult => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { addErrorToContext, clearErrorsFromContext } = useErrorContext();
  const { selectedProviderIds } = useSelector<IStoreState, FundingSearchSelectionState>(
    (state) => state.fundingSearchSelection
  );
  const [fundingSummary, setFundingSummary] = useState<PublishedProviderReprofilingSummary>();
  const [specificationLastUpdatedDate, setSpecificationLastUpdatedDate] = useState<Date>();
  
  if(fundingSummary?.totalEligibleProviders === 0){    
    history.push(`/FundingManagement/ReprofileBatch/${fundingStreamId}/${fundingPeriodId}/${specificationId}`, {update: false})
  }

  const { specification, isLoadingSpecification } = useSpecificationSummary(specificationId, (err) =>
    addErrorToContext({ error: err, description: "Error while loading specification" })
  );

  const { hasPermission, isPermissionsFetched } = useSpecificationPermissions(specificationId, [
    Permission.CanRefreshFunding
  ]);

  const { fundingConfiguration, isLoadingFundingConfiguration } = useFundingConfiguration(
    fundingStreamId,
    fundingPeriodId,
    (err) => addErrorToContext({ error: err, description: "Error while loading funding configuration" })
  );

  const {
    addSub,
    removeAllSubs,
    results: notifications,
  } = useJobSubscription({
    onError: (err) =>
      addErrorToContext({ error: err, description: "An error occurred while monitoring the running jobs" }),
  });

  const hasPermissionToRefresh = useMemo(
    () => hasPermission && hasPermission(Permission.CanRefreshFunding),
    [isPermissionsFetched]
  );

  useEffect(() => {
    getSpecificationCalculationResultsMetadata(specificationId)
      .then((result) => {
        setSpecificationLastUpdatedDate(result.data.lastUpdated);
      })
      .catch((err) => {
        addErrorToContext({
          error: err,
          description: `Error while getting specification calculation results metadata for specification Id: ${specificationId}`,
        });
      });

    addSub({
      monitorMode: MonitorMode.SignalR,
      monitorFallback: MonitorFallback.Polling,
      filterBy: {
        specificationId: specificationId,
        jobTypes: [
          JobType.RefreshFundingJob,
          JobType.ApproveAllProviderFundingJob,
          JobType.ApproveBatchProviderFundingJob,
          JobType.PublishBatchProviderFundingJob,
          JobType.PublishAllProviderFundingJob,
          JobType.ReleaseProvidersToChannelsJob,
        ],
      },
      onError: (e) => addErrorToContext({ error: e, description: "Error while checking for background job" }),
    });

    return () => {
      removeAllSubs();
      clearErrorsFromContext();
    };
  }, []);

  useEffect(() => {
    if (!fundingConfiguration || fundingSummary) return;

    async function loadBatchFundingSummary() {
      const response = await publishService.reproflingProvidersFundingService(
        specificationId,
        selectedProviderIds
      );
      setFundingSummary(response?.data);
    }
    loadBatchFundingSummary();
  }, [fundingConfiguration]);

  const clearFundingSearchSelection = useCallback(() => {
    dispatch(initialiseFundingSearchSelection(fundingStreamId, fundingPeriodId, specificationId, actionType));
  }, [specificationId, fundingPeriodId, fundingStreamId]);

  return {
    specification,
    isLoadingSpecification,
    fundingConfiguration,
    isLoadingFundingConfiguration,
    fundingSummary,
    clearFundingSearchSelection,
    latestJob: getLatestJob(notifications.flatMap((n) => n.latestJob)),
    isWaitingForJob: notifications.some((n) => !!n.latestJob?.isActive),
    isPermissionsFetched,
    hasPermissionToRefresh: hasPermissionToRefresh,
    selectedProviderIds,
    notifications,
    specificationLastUpdatedDate,
  } as UseReprofilingConfirmationResult;
};
