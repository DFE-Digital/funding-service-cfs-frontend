import "../../styles/PreviewProfileModal.scss";

import React, { useEffect, useState } from "react";

import { ErrorProps } from "../../hooks/useErrors";
import { previewProfile } from "../../services/profilingService";
import { ProfileTotal } from "../../types/FundingLineProfile";
import { DateTimeFormatter } from "../DateTimeFormatter";
import { FormattedNumber, NumberType } from "../FormattedNumber";
import { LoadingStatus } from "../LoadingStatus";

export interface PreviewProfileModalProps {
  specificationId: string;
  providerId: string;
  fundingStreamId: string;
  fundingPeriodId: string;
  fundingLineId: string;
  previewProfilePatternKey: string | null;
  showModal: boolean;
  toggleModal: React.Dispatch<React.SetStateAction<boolean>>;
  addError: (error: ErrorProps) => void;
  setPreviewProfilePatternKey: React.Dispatch<React.SetStateAction<string | null | undefined>>;
}

export function PreviewProfileModal({
  specificationId,
  providerId,
  fundingLineId,
  fundingPeriodId,
  fundingStreamId,
  previewProfilePatternKey,
  showModal,
  toggleModal,
  addError,
  setPreviewProfilePatternKey,
}: PreviewProfileModalProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [profileTotals, setProfileTotals] = useState<ProfileTotal[]>([]);

  useEffect(() => {
    async function getPreviewProfile() {
      try {
        const data: ProfileTotal[] = (
          await previewProfile(
            specificationId,
            fundingStreamId,
            fundingPeriodId,
            providerId,
            fundingLineId,
            previewProfilePatternKey
          )
        ).data;
        setProfileTotals(data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        addError({
          error: "Could not retrieve preview data. Please try again.",
          fieldName: "preview-profile",
        });
        toggleModal(false);
        setPreviewProfilePatternKey(undefined);
      }
    }

    getPreviewProfile();
  }, [previewProfilePatternKey]);

  const handleClose = () => {
    toggleModal(false);
  };

  const modalDisplayStyle = {
    display: showModal ? "block" : "none",
  };

  return (
    <div id="preview-profile-modal" className="modal" style={modalDisplayStyle} role="dialog">
      <div className="modal-content">
        <div className="modal-header">
          <svg
            focusable="false"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 296 60"
            height="30"
            width="148"
            fill="currentcolor" 
            className="govuk-header__logotype-crown" 
            aria-label="GOV.UK"
          ><g>
                <circle cx="20" cy="17.6" r="3.7"/>
                <circle cx="10.2" cy="23.5" r="3.7"/>
                <circle cx="3.7" cy="33.2" r="3.7"/>
                <circle cx="31.7" cy="30.6" r="3.7"/>
                <circle cx="43.3" cy="17.6" r="3.7"/>
                <circle cx="53.2" cy="23.5" r="3.7"/>
                <circle cx="59.7" cy="33.2" r="3.7"/>
                <circle cx="31.7" cy="30.6" r="3.7"/>
                <path d="M33.1,9.8c.2-.1.3-.3.5-.5l4.6,2.4v-6.8l-4.6,1.5c-.1-.2-.3-.3-.5-.5l1.9-5.9h-6.7l1.9,5.9c-.2.1-.3.3-.5.5l-4.6-1.5v6.8l4.6-2.4c.1.2.3.3.5.5l-2.6,8c-.9,2.8,1.2,5.7,4.1,5.7h0c3,0,5.1-2.9,4.1-5.7l-2.6-8ZM37,37.9s-3.4,3.8-4.1,6.1c2.2,0,4.2-.5,6.4-2.8l-.7,8.5c-2-2.8-4.4-4.1-5.7-3.8.1,3.1.5,6.7,5.8,7.2,3.7.3,6.7-1.5,7-3.8.4-2.6-2-4.3-3.7-1.6-1.4-4.5,2.4-6.1,4.9-3.2-1.9-4.5-1.8-7.7,2.4-10.9,3,4,2.6,7.3-1.2,11.1,2.4-1.3,6.2,0,4,4.6-1.2-2.8-3.7-2.2-4.2.2-.3,1.7.7,3.7,3,4.2,1.9.3,4.7-.9,7-5.9-1.3,0-2.4.7-3.9,1.7l2.4-8c.6,2.3,1.4,3.7,2.2,4.5.6-1.6.5-2.8,0-5.3l5,1.8c-2.6,3.6-5.2,8.7-7.3,17.5-7.4-1.1-15.7-1.7-24.5-1.7h0c-8.8,0-17.1.6-24.5,1.7-2.1-8.9-4.7-13.9-7.3-17.5l5-1.8c-.5,2.5-.6,3.7,0,5.3.8-.8,1.6-2.3,2.2-4.5l2.4,8c-1.5-1-2.6-1.7-3.9-1.7,2.3,5,5.2,6.2,7,5.9,2.3-.4,3.3-2.4,3-4.2-.5-2.4-3-3.1-4.2-.2-2.2-4.6,1.6-6,4-4.6-3.7-3.7-4.2-7.1-1.2-11.1,4.2,3.2,4.3,6.4,2.4,10.9,2.5-2.8,6.3-1.3,4.9,3.2-1.8-2.7-4.1-1-3.7,1.6.3,2.3,3.3,4.1,7,3.8,5.4-.5,5.7-4.2,5.8-7.2-1.3-.2-3.7,1-5.7,3.8l-.7-8.5c2.2,2.3,4.2,2.7,6.4,2.8-.7-2.3-4.1-6.1-4.1-6.1h10.6,0Z"/>
              </g>
          </svg>
          <button className="govuk-button" onClick={handleClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          {isLoading ? (
            <LoadingStatus title="Loading preview..." />
          ) : (
            <>
              <h2 className="govuk-heading-m">Pattern name</h2>
              <table className="govuk-table govuk-!-margin-top-5">
                <caption className="govuk-table__caption">Profiling installments</caption>
                <thead className="govuk-table__head">
                  <tr className="govuk-table__row">
                    <th scope="col" className="govuk-table__header">
                      Instalment
                    </th>
                    <th scope="col" className="govuk-table__header">
                      Payment status
                    </th>
                    <th scope="col" className="govuk-table__header">
                      Instalment number
                    </th>
                    <th scope="col" className="govuk-table__header">
                      Per cent
                    </th>
                    <th scope="col" className="govuk-table__header govuk-table__header--numeric">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody className="govuk-table__body">
                  {profileTotals
                    .sort((a, b) => a.installmentNumber - b.installmentNumber)
                    .map((pt) => (
                      <tr key={`installment-${pt.installmentNumber}`} className="govuk-table__row">
                        <th scope="row" className="govuk-table__header">
                          <DateTimeFormatter date={pt.actualDate as Date} />
                        </th>
                        <td className="govuk-table__cell">
                          {pt.isPaid ? <strong className="govuk-tag">Paid</strong> : null}
                        </td>
                        <td className="govuk-table__cell">{pt.installmentNumber}</td>
                        <td className="govuk-table__cell">
                          <FormattedNumber
                            value={pt.profileRemainingPercentage}
                            type={NumberType.FormattedPercentage}
                          />
                        </td>
                        <td className="govuk-table__cell govuk-table__cell--numeric">
                          <FormattedNumber value={pt.value} type={NumberType.FormattedMoney} />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </>
          )}
          <button className="govuk-button" data-module="govuk-button" onClick={handleClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
