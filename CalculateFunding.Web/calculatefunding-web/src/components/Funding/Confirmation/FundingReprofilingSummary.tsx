import React from "react";
import { useErrorContext } from "../../../context/ErrorContext";
import {
  FundingActionType,
  PublishedProviderReprofilingSummary,
} from "../../../types/PublishedProvider/PublishedProviderFundingCount";
import { SpecificationSummary } from "../../../types/SpecificationSummary";
import { LoadingFieldStatus } from "../../LoadingFieldStatus";
import { CsvDownloadPublishedProviders } from "../CsvDownloadPublishedProviders";

export interface FundingReprofilingSummaryProps {
  specification: SpecificationSummary;
  fundingSummary: PublishedProviderReprofilingSummary | undefined;
  isWaitingForJob: boolean;
}

export function FundingReprofilingSummary(props: FundingReprofilingSummaryProps) {
  const actionType = FundingActionType.Reprofile;
  const { addErrorToContext } = useErrorContext();

  if (!props.fundingSummary) {
    return (
      <div className="govuk-grid-row govuk-!-margin-bottom-5">
        <LoadingFieldStatus title={"Loading reprofiling summary"} />
      </div>
    );
  } else {
    return (
      <>
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-three-quarters">
            <table className="govuk-table" aria-label="funding-summary-table">
              <thead className="govuk-table__head">
              </thead>
              <tbody className="govuk-table__body">
                <tr className="govuk-table__row">
                  <th scope="row" className="govuk-table__header">
                    Specification selected
                  </th>
                  <td className="govuk-table__cell">{props.specification.name}</td>
                  <td className="govuk-table__cell govuk-table__cell--numeric">&nbsp;</td>
                </tr>
                <tr className="govuk-table__row">
                  <th scope="row" className="govuk-table__header">
                    Funding period
                  </th>
                  <td className="govuk-table__cell">{props.specification.fundingPeriod.name}</td>
                  <td className="govuk-table__cell govuk-table__cell--numeric">&nbsp;</td>
                </tr>
                <tr className="govuk-table__row">
                  <th scope="row" className="govuk-table__header">
                    Number of eligible providers
                  </th>
                  <td className="govuk-table__cell"> {props.fundingSummary.totalEligibleProviders}</td>
                  <td className="govuk-table__cell govuk-table__cell--numeric">&nbsp;</td>
                </tr>
                {(props.fundingSummary.totalProviders - props.fundingSummary.totalEligibleProviders >= 1 ) &&
                  <tr className="govuk-table__row">
                    <th scope="row" className="govuk-table__header">
                      Number of providers not eligible for reprofiling
                    </th>
                    <td className="govuk-table__cell"> {props.fundingSummary.totalProviders - props.fundingSummary.totalEligibleProviders}</td>
                    <td className="govuk-table__cell govuk-table__cell--numeric">&nbsp;</td>
                  </tr>
                }
                <tr className="govuk-table__row">
                    <th scope="row" className="govuk-table__header">
                        Eligibility status
                    </th>
                    <td className="govuk-table__cell">
                      <CsvDownloadPublishedProviders
                        actionType={FundingActionType.Reprofile}
                        specificationId={props.specification.id}
                        link = {props.fundingSummary?.Url}
                        addError={addErrorToContext}
                      />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  }
}
