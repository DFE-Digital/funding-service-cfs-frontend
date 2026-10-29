import React from "react";

export interface InformationTextProps {
  header: string;
  text: string;
  hidden?: boolean;
}

export function InformationPanel(props: InformationTextProps) {

  if (props.hidden || props.text.length === 0) {
    return null;
  } else {
    return (
      <div
        className="govuk-notification-banner govuk-!-margin-top-1"
        role="region"
        aria-labelledby="govuk-notification-banner-title"
        data-module="govuk-notification-banner"
      >
        <div className="govuk-notification-banner__header">
          <h2 className="govuk-notification-banner__title" id="govuk-notification-banner-title">
            {props.header}
          </h2>
        </div>
        <div className="govuk-notification-banner__content">
          <span className="govuk-warning-text__assistive">Warning</span>
          <span
            className="govuk-notification-banner__heading govuk-!-width-full"
            data-testid="permission-alert-message"
          >
            {props.text}
          </span>
        </div>
      </div>
    ) 
  }
}
