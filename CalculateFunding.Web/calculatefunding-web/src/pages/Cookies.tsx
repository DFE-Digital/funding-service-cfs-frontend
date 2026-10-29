import { Main } from "components/Main";
import React, { useState } from "react";
import { Section } from "types/Sections";
import { useHistory } from "react-router-dom";
import { BackLink } from "../components/BackLink";

interface CookiesProps {
    cookieConsent: boolean | null;
    setCookieConsent: React.Dispatch<React.SetStateAction<boolean | null>>;
  }

export const Cookies: React.FC<CookiesProps> = ({ setCookieConsent, cookieConsent }) => {
    const [localConsent, setLocalConsent] = useState<boolean | null>(cookieConsent);
    const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);

    const history = useHistory();

    const backToPreviousPage = (event : any) => {
      event.preventDefault();
      history.goBack();
    };

    const handleSaveSettings = () => {
        setCookieConsent(localConsent);
        localStorage.setItem("cookie-consent", localConsent === true ? "accepted" : "rejected");
        setShowSuccessMessage(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });  
      };


    const SuccessMassage = () => {
        return (          
          <div className="govuk-notification-banner govuk-notification-banner--success govuk-!-width-two-thirds govuk-!-margin-top-6" role="alert"
            aria-labelledby="govuk-notification-banner-title"
            data-module="govuk-notification-banner">
            <div className="govuk-notification-banner__header">
              <h2 className="govuk-notification-banner__title" id="govuk-notification-banner-title">
                Success
              </h2>
            </div>  
            <div className="govuk-notification-banner__content">
              <h2 className="govuk-heading-m">
                You&apos;ve set your cookie preferences. {" "}
                <a href="#" onClick={backToPreviousPage} style={{ color: "green", textDecoration: "underline" }} className="data-link success">
                    Go back to the page you were looking at.
                </a>
              </h2>             
            </div>
          </div>)
      }

return (
    <Main location={Section.Home} >
      <BackLink />

      {showSuccessMessage && <SuccessMassage/>}
      <div className="govuk-grid-row govuk-!-width-two-thirds govuk-!-margin-top-6">
        <div className="govuk-grid-column-full govuk-!-margin-bottom-4">
            <h1 className="govuk-heading-l govuk-!-margin-bottom-6">Cookies</h1>
            <p className="govuk-body">Cookies are small files saved on your phone, tablet or computer when you visit a website. At DfE, we use cookies to ensure our website and digital services operate seamlessly. They help to gather valuable insights into how you engage with our services.</p>
        </div>

        <div className="govuk-grid-column-full govuk-!-margin-bottom-4">
            <h2 className="govuk-heading-l">Essential cookies</h2>
            <p className="govuk-body">Keeping you secure and connected</p>
            <p className="govuk-body"> Essential cookies are vital to maintaining the security of your information and ensuring DfE runs efficiently.</p>    
            <table
                className="govuk-table"
                id="essential-cookies"
              >
                <thead className="govuk-table__head">
                  <tr className="govuk-table__row">
                    <th scope="col" className="govuk-table__header govuk-!-width-one-quarter">
                      Name
                    </th>
                    <th scope="col" className="govuk-table__header govuk-!-width-one-half">
                      Purpose
                    </th>
                    <th scope="col" className="govuk-table__header govuk-!-width-one-quarter">
                      Expiry
                    </th>
                  </tr>
                </thead>
                <tbody className="govuk-table__body" id="mainContentResults">
                    <tr className="govuk-table__row">
                      <td className="govuk-table__cell">AppServiceAuthSession</td>
                      <td className="govuk-table__cell">Authenticates user and maintain their session</td>
                      <td className="govuk-table__cell">Session</td>
                    </tr>
                    <tr className="govuk-table__row">
                      <td className="govuk-table__cell">AppServiceAuthSession1</td>
                      <td className="govuk-table__cell">Authenticates user and maintain their session</td>
                      <td className="govuk-table__cell">Session</td>
                    </tr>
                    <tr className="govuk-table__row">
                      <td className="govuk-table__cell">ai_authUser</td>
                      <td className="govuk-table__cell">Collects usage statistics, telemetry data and tracks authenticated users</td>
                      <td className="govuk-table__cell">Session</td>
                    </tr>
                    <tr className="govuk-table__row">
                      <td className="govuk-table__cell">ai_session</td>
                      <td className="govuk-table__cell">Maintains user states across pages</td>
                      <td className="govuk-table__cell">30 minutes</td>
                    </tr>
                    <tr className="govuk-table__row">
                      <td className="govuk-table__cell">cfs-skills-confirmation</td>
                      <td className="govuk-table__cell">Track user skill confirmation and hide confirmation page</td>
                      <td className="govuk-table__cell">24 hours</td>
                    </tr>
                    <tr className="govuk-table__row">
                      <td className="govuk-table__cell">SpsAuthenticatedUser</td>
                      <td className="govuk-table__cell">Track single page authentication</td>
                      <td className="govuk-table__cell">6 days and 22 hours</td>
                    </tr>
                    <tr className="govuk-table__row">
                      <td className="govuk-table__cell">VstsSession</td>
                      <td className="govuk-table__cell">Visual Studio session cookie</td>
                      <td className="govuk-table__cell">364 days and 22 hours</td>
                    </tr>
                    <tr className="govuk-table__row">
                      <td className="govuk-table__cell">ai_user</td>
                      <td className="govuk-table__cell">Collects usage statistics, telemetry data and identifies returning users</td>
                      <td className="govuk-table__cell">1 year</td>
                    </tr>
                </tbody>
              </table> 
        </div>

        <div className="govuk-grid-column-full govuk-!-margin-bottom-4">
           <h2 className="govuk-heading-l govuk-!-margin-bottom-5">Analytics cookies (optional)</h2>
           <p className="govuk-body">Enhancing your experience through insightful data</p>
           <p className="govuk-body">With your consent, we employ analytics cookies like Google Analytics to collect data on how you interact with DfE services. This information is invaluable as it allows us to:</p>
           <ul className="govuk-list govuk-list--bullet govuk-list--spaced">
                <li><strong>Understand user behaviour:</strong> Gain insights into which features are most popular and how you navigate our services</li>
                <li><strong>Improve our digital services:</strong> Identify areas to enhance to better meet your needs and preferences</li>
                <li><strong>Optimise performance:</strong> Ensure that our digital services are efficient and responsive across all devices</li>
            </ul>
            <p className="govuk-body">By using analytics tools, we are committed to continually refining and improving your experience with DfE.</p>
        </div>

        <div className="govuk-grid-column-full govuk-!-margin-bottom-4"> 
            <h2 className="govuk-heading-l govuk-!-margin-bottom-2 govuk-!-margin-bottom-4">Microsoft Clarity (optional)</h2>
            <p className="govuk-body ">Visualising user interactions for superior usability</p>
            <p className="govuk-body ">In addition to Google Analytics, we use Microsoft Clarity to gain a deeper understanding of your interactions with DfE digital services. Microsoft Clarity provides us with anonymised information with:</p>
            <ul className="govuk-list govuk-list--bullet govuk-list--spaced">
                <li><strong>Heatmaps:</strong> Visual representations of where users click, scroll and spend the most time</li>
                <li><strong>Session recordings:</strong> Real-time anonymised recordings of user sessions to observe firsthand how colleagues engage with DfE services</li>
                <li><strong>Performance metrics:</strong> Data on page load times and other performance indicators to ensure optimal performance</li>
            </ul>
            <p className="govuk-body ">The insights gained help us to make informed decisions, improve usability and accessibility of DfE digital. By understanding user behaviour, we can create a more intuitive and satisfying experience for all colleagues.</p>
            <table
                className="govuk-table"
                id="microsoft-clarity"
              >
                <thead className="govuk-table__head">
                  <tr className="govuk-table__row">
                    <th scope="col" className="govuk-table__header govuk-!-width-one-quarter">
                      Name
                    </th>
                    <th scope="col" className="govuk-table__header govuk-!-width-one-half">
                      Purpose
                    </th>
                    <th scope="col" className="govuk-table__header govuk-!-width-one-quarter">
                      Expiry
                    </th>
                  </tr>
                </thead>
                <tbody className="govuk-table__body" id="mainContentResults">
                    <tr className="govuk-table__row">
                      <td className="govuk-table__cell">CLID</td>
                      <td className="govuk-table__cell">Used by Microsoft Clarity to help us understand CFS usage</td>
                      <td className="govuk-table__cell">1 year</td>
                    </tr>
                    <tr className="govuk-table__row">
                      <td className="govuk-table__cell">MUID</td>
                      <td className="govuk-table__cell">Used by Microsoft Clarity to help us understand CFS usage</td>
                      <td className="govuk-table__cell">1 year</td>
                    </tr>
                </tbody>
              </table> 
        </div>

        <div className="govuk-grid-column-full govuk-!-margin-bottom-4">
            <h2 className="govuk-heading-l govuk-!-margin-bottom-2 govuk-!-margin-bottom-4">Your privacy matters</h2>
            <p className="govuk-body govuk-!-margin-bottom-6">At DfE, we prioritise your privacy and are committed to transparent practices.</p>
            <p className="govuk-body govuk-!-margin-bottom-6">Optional cookies are designed to enhance your interaction with DfE services, ensuring that the best possible experience can be provided to colleagues.</p>
            <p className="govuk-body govuk-!-margin-bottom-6">If you choose to enable optional cookies, data collected is anonymised and handled with the stringent security and care to GOV.UK standards and best practices.</p>
        </div>

        <div className="govuk-grid-column-full">
          <div className="govuk-radios govuk-radios--inline">
              <label className="govuk-label govuk-!-margin-bottom-2" htmlFor="file-upload-1">
                  <strong>Do you want to accept analytics cookies?</strong>
              </label>
              <div className="govuk-radios__item">
              <input
                  className="govuk-radios__input"
                  id="yesUpload"
                  name="cookieConsent"
                  aria-label="Approve analytics cookies"        
                  onChange={() => setLocalConsent(true)}
                  checked={localConsent === true}        
                  type="radio"
              />
              <label className="govuk-label govuk-radios__label" htmlFor="yesUpload">
                  Yes
              </label>
              </div>
              <div className="govuk-radios__item govuk-!-margin-bottom-7">
              <input
                  className="govuk-radios__input"
                  id="noUpload"
                  name="cookieConsent"
                  aria-label="Reject analytics cookies"
                  onChange={() => setLocalConsent(false)}
                  checked={localConsent === false}
                  type="radio"
              />
              <label className="govuk-label govuk-radios__label" htmlFor="noUpload">
                  No
              </label>
              </div>
          </div>
            <button
                data-prevent-double-click="true"
                className="govuk-button govuk-!-margin-right-1"
                data-module="govuk-button"
                onClick={handleSaveSettings}
                >
                Save cookie settings
            </button>
          </div>
        </div>
    </Main>
  );
};
