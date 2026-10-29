import React, { useMemo, useState } from "react";
import { RouteComponentProps, useHistory } from "react-router";
import { Breadcrumb, Breadcrumbs } from "../../../components/Breadcrumbs";
import { FundingSelectionBreadcrumb } from "../../../components/Funding/FundingSelectionBreadcrumb";
import JobNotificationSection from "../../../components/Jobs/JobNotificationSection";
import { LoadingStatusNotifier } from "../../../components/LoadingStatusNotifier";
import { Main } from "../../../components/Main";
import { MultipleErrorSummary } from "../../../components/MultipleErrorSummary";
import { PermissionStatus } from "../../../components/PermissionStatus";
import { Title } from "../../../components/Title";
import { useErrorContext } from "../../../context/ErrorContext";
import { useAddJobObserver } from "../../../hooks/Jobs/useAddJobObserver";
import * as publishService from "../../../services/publishService";
import { Permission } from "../../../types/Permission";
import { FundingActionType } from "../../../types/PublishedProvider/PublishedProviderFundingCount";
import { Section } from "../../../types/Sections";
import { FundingReprofilingSummary } from "components/Funding/Confirmation/FundingReprofilingSummary";
import { useReprofilingConfirmation } from "hooks/ReprofilingOnDemand/useReprofilingConfirmation";
import { InformationPanel } from "components/InformationPanel";

export interface FundingManagementReprofilingConfirmFundingRouteProps {
  fundingStreamId: string;
  fundingPeriodId: string;
  specificationId: string;
}

export function ConfirmReprofilingOnDemand({
  match,
}: RouteComponentProps<FundingManagementReprofilingConfirmFundingRouteProps>) {
  const { fundingStreamId, fundingPeriodId, specificationId } = match.params;
  const actionType = FundingActionType.Reprofile;
  const history = useHistory();
  const { state: errors, clearErrorsFromContext, addErrorToContext } = useErrorContext();
  const {
    specification,
    isLoadingSpecification,
    fundingConfiguration,
    isLoadingFundingConfiguration,
    fundingSummary,
    clearFundingSearchSelection,
    latestJob,
    isWaitingForJob,
    isPermissionsFetched,
    hasPermissionToRefresh,
    selectedProviderIds,
    notifications,
    specificationLastUpdatedDate,
  } = useReprofilingConfirmation({
    specificationId: specificationId,
    fundingStreamId: fundingStreamId,
    fundingPeriodId: fundingPeriodId,
    actionType: actionType,
  });
  const { addJobObserver } = useAddJobObserver();
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const isLoading = useMemo(
    () =>
      isConfirming ||
      specification === undefined ||
      fundingConfiguration === undefined ||
      !isPermissionsFetched,
    [specification, fundingConfiguration, isConfirming, isPermissionsFetched]
  );
  
  const handleConfirm = async () => {
    clearErrorsFromContext();
    if (!fundingConfiguration) {
      console.error("missing funding config");
      return;
    }
    setIsConfirming(true);
    let jobId: string;
    try {
      if(fundingSummary != undefined && fundingSummary.totalEligibleProviders >0)
      {
        const eligibleProviderIds: string[] = fundingSummary.ProviderSummaryResult.filter(item=>item.isEligible).map(item => item.UKPRN);
        jobId = (await publishService.reprofileOnDemandService(specificationId, eligibleProviderIds))
          .data.jobId;
          clearFundingSearchSelection();
          addJobObserver({ jobId: jobId, specificationId: specificationId });
          history.push(
            `/FundingManagement/Approve/Results/${fundingStreamId}/${fundingPeriodId}/${specificationId}`
          );
      }
    } catch (e: any) {
      addErrorToContext({
        error: e,
        description: "Error while trying to approve specification",
      });
      setIsConfirming(false);
    }
  };
  const someEligible : any = (fundingSummary?.totalProviders! - fundingSummary?.totalEligibleProviders!) >= 1 ? true : false;
  return (
    <Main location={Section.FundingManagement}>
      <Breadcrumbs>
        <Breadcrumb name="Home" url="/" />
        <Breadcrumb name={"Funding management"} url={"/FundingManagement"} />
        <FundingSelectionBreadcrumb actionType={FundingActionType.Reprofile} />
        <Breadcrumb
          url={`/FundingManagement/Approve/Results/${fundingStreamId}/${fundingPeriodId}/${specificationId}`}
          name={specification?.fundingStreams[0].name ?? ""}
        />
        <Breadcrumb name={"Reprofile a batch of providers"} />
      </Breadcrumbs>
      <PermissionStatus
        requiredPermissions={hasPermissionToRefresh ? [] : [Permission.CanRefreshFunding]}
        hidden={!isPermissionsFetched}
      />
      <MultipleErrorSummary errors={errors} />
      {notifications.length > 0 && (
        <JobNotificationSection
          jobNotifications={notifications}
          notificationSettings={[
            {
              jobTypes: [], // any we have subscribed to
              showActive: true,
              showFailed: true,
              showSuccessful: false,
            },
          ]}
        />
      )}
      <br/>
      {someEligible &&
        <InformationPanel
        header="Important"
        hidden = {false}
        text="Some of the providers in this batch are not eligible for reprofiling. 
        This is either because the providers have not been released only for statements,the details 
        of the providers are not in an open state or the open date is not within the same year as the 
        allocation funding year."/>
      }
      <LoadingStatusNotifier
        notifications={[
          {
            isActive: isLoadingSpecification,
            title: "Loading specification",
          },
          {
            isActive: isLoadingFundingConfiguration,
            title: "Loading funding configuration",
          },
          {
            isActive: !isPermissionsFetched,
            title: "Loading permissions",
          },
          {
            isActive: isLoading,
            title: "Updating",
          },
        ]}
      />
      <Title
        title="Confirm reprofile"
        titleCaption="Check all the information carefully before confirming the reprofile."
      />
      <br/>      
      {!!fundingConfiguration && !!specification && (
        <section>
          <FundingReprofilingSummary
            specification={specification}
            fundingSummary={fundingSummary}
            isWaitingForJob={isWaitingForJob}
          />
        </section>
      )}
      <div className="govuk-!-margin-bottom-4">
        <button 
          className="govuk-link govuk-link--no-visited-state " 
          onClick={() =>{ 
            clearFundingSearchSelection();
            history.goBack()
            }}>
            Discard changes and upload another file
        </button>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full">
          <div
            className={`govuk-form-group ${
              errors.filter((e) => e.fieldName === "acknowledge").length ? "govuk-form-group--error" : ""
            }`}>
            <fieldset className="govuk-fieldset" aria-describedby="acknowledgementCheckbox">
              <legend className="govuk-fieldset__legend">
                <div className="govuk-warning-text">
                  <span className="govuk-warning-text__icon" aria-hidden="true">
                    !
                  </span>
                  <strong className="govuk-warning-text__text">
                    <span className="govuk-warning-text__assistive">Warning</span>
                    Reprofiling an allocation for a provider will set the profile to start from the profile period that contains the provider open date using the appropriate reprofiling strategy for the circumstances of the provider
                  </strong>
                </div>
              </legend>
            </fieldset>
          </div>
          <ButtonControlsSection
          isDisabled={
              isLoading ||
              isWaitingForJob ||
              !fundingSummary ||
              !hasPermissionToRefresh ||
              fundingSummary.totalEligibleProviders == 0
            }
            onConfirm={handleConfirm}
            onCancel={() => {
              clearFundingSearchSelection();
              history.push(`/FundingManagement/Approve/Results/${fundingStreamId}/${fundingPeriodId}/${specificationId}`)
            }}
          />
        </div>
      </div>
    </Main>
  );
}

const ButtonControlsSection = ({
  isDisabled,
  onConfirm,
  onCancel,
}: {
  isDisabled: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) => (
  <section aria-label="action controls">
    <button
      data-prevent-double-click="true"
      className="govuk-button govuk-!-margin-right-1"
      data-module="govuk-button"
      disabled={isDisabled}
      onClick={onConfirm}
    >
      Confirm
    </button>
    <a className="govuk-button govuk-button--secondary" data-module="govuk-button" onClick={onCancel}>
      Cancel
    </a>
  </section>);
