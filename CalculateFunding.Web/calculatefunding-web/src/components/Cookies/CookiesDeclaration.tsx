import React from "react";

interface CookiesDeclarationProps {
  cookieConsent: boolean | null;
  setCookieConsent: React.Dispatch<React.SetStateAction<boolean | null>>;
}

const CookiesDeclaration: React.FC<CookiesDeclarationProps> = ({ setCookieConsent }) => {
  const handleAccept = () => {
    setCookieConsent(true);
    localStorage.setItem("cookie-consent", "accepted");
  };

  const handleReject = () => {
    setCookieConsent(false);
    localStorage.setItem("cookie-consent", "rejected");
  };

  return (
    <div className="govuk-width-container">
      <div className="govuk-grid-row govuk-phase-banner govuk-!-padding-top-4">
        <div className="govuk-grid-column-full left-align">
          <h1 className="govuk-heading-m">Cookies on Calculate Funding Service</h1>
          <p className="govuk-body">We use some essential cookies to make this service work.</p>
          <p className="govuk-body">
            We&apos;d also like to use analytics cookies so we can understand how you use the service and make improvements.
          </p>

          <div className="govuk-button-group">
            <button
              className="govuk-button govuk-!-margin-right-3"
              onClick={handleAccept}
              data-module="govuk-button"
            >
              Accept analytics cookies
            </button>
            <button
              className="govuk-button govuk-!-margin-right-3"
              onClick={handleReject}
              data-module="govuk-button"
            >
              Reject analytics cookies
            </button>
            <a className="govuk-link" href="/app/Cookies">
              View cookies
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiesDeclaration;
