import "../styles/ConfirmationModal.scss";

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";

export function ConfirmationModal(
  message: any,
  callback: any,
  confirmButtonText = "Leave this page",
  cancelButtonText = "Stay on this page"
) {
  const container = document.createElement("div");
  container.setAttribute("modal-confirmation-placeholder", "");
  container.setAttribute("class", "confirm-modal");
  container.setAttribute("data-testid", "modal-confirmation-placeholder");
  document.body.appendChild(container);

  const handleCancel = () => {
    unmountComponentAtNode(container);
  };
  const handleContinue = async () => {
    unmountComponentAtNode(container);
    const isAsync = callback.constructor.name === "AsyncFunction";
    isAsync ? await callback(true) : callback(true);
  };

  return render(
    <div className="modal" data-module="govuk-modal-dialogue">
      <div className="modal-content">
        <div className="govuk-modal-dialogue__header modal-header">
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
          <button
            type="button"
            onClick={handleCancel}
            className="govuk-button govuk-modal-dialogue__close"
            data-module="govuk-button"
            aria-label="Close modal dialogue"
          >
            ×
          </button>
        </div>
        <div className="modal-body">
          <div className="govuk-modal-dialogue__content govuk-!-width-full govuk-body-m">{message}</div>
          <button
            id="confirm"
            className="govuk-button govuk-button--warning govuk-!-margin-left-2 govuk-!-margin-right-1"
            data-module="govuk-button"
            onClick={handleContinue}
            data-testid="confirm-modal-continue-button"
          >
            {confirmButtonText}
          </button>
          <button id="cancel" className="govuk-button" data-module="govuk-button" onClick={handleCancel}>
            {cancelButtonText}
          </button>
        </div>
      </div>
    </div>,
    container
  );
}
