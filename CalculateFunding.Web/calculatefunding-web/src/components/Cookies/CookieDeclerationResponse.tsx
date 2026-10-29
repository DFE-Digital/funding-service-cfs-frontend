import React, { useEffect, useState } from "react";

interface CookieDeclerationResponseProps {
  cookieConsent: boolean | null;
  setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
}

const CookieDeclerationResponse: React.FC<CookieDeclerationResponseProps> = ({ cookieConsent, setIsHidden }) => {
    const [responseMessage, setResponseMessage] = useState<string>("");

    useEffect(() => {
        if (cookieConsent === true) {
          setResponseMessage("accepted");
        } else if (cookieConsent === false) {
          setResponseMessage("rejected");
        } else {
          setResponseMessage(""); // Case where cookieConsent is null
        }
      }, [cookieConsent]);

      const handleHideMessage = () => {
        setIsHidden(true)
        localStorage.setItem("cookieMessageHidden", "true"); 
      };
    
      
  return (
        <div className="govuk-width-container">
            <div className="govuk-grid-row govuk-phase-banner govuk-!-padding-top-4">
                <div className="govuk-grid-column-full left-align">
                    <p className="govuk-body">
                        You&apos;ve {responseMessage} analytics cookies. You can{" "}
                        <a className="govuk-link" href="/app/Cookies">
                             change your cookie settings
                        </a> 
                        {" "}at any time.
                    </p>

                    <div className="govuk-button-group">
                        <button
                            className="govuk-button govuk-!-margin-right-3"
                            onClick={handleHideMessage}
                            data-module="govuk-button"
                        >
                            Hide cookie message
                        </button>
                    </div>
                </div>
            </div>
        </div>
  );
};

export default CookieDeclerationResponse;

