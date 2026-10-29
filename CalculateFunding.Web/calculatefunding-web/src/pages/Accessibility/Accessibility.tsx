import { Breadcrumbs, Breadcrumb } from "components/Breadcrumbs";
import { Main } from "components/Main";
import React from "react";
import { Section } from "types/Sections";

export const Accessibility = () => {

return (
    <Main location={Section.Home} >
      <Breadcrumbs>
        <Breadcrumb name="Home" url="/" />
      </Breadcrumbs>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full govuk-!-margin-bottom-4">
            <h1 className="govuk-heading-xl govuk-!-margin-bottom-4">Accessibility statement</h1>
            <p className="govuk-body govuk-!-margin-bottom-4">The Department for Education is committed to making its services accessible, in accordance with the Public Sector Bodies (Websites and Mobile Applications) (No. 2) Accessibility Regulations 2018.</p>
                <p className="govuk-body govuk-!-margin-bottom-4">   This accessibility statement applies to the Calculate Funding Service or CFS website under the aegis of the Education Skills Funding Agency or ESFA of the Department for Education. </p>
                <p className="govuk-body govuk-!-margin-bottom-4">  We are in the process of conducting a full accessibility audit and will be updating our statement soon. However, making the service fully compliant may not be feasible due to the small number of users currently using the website.</p>
                <p className="govuk-body govuk-!-margin-bottom-6"> At the moment we are striving to ensure that the CFS website is at a minimum accessible capacity for users with disabilities most commonly found in the workforce.</p>
            <p></p>
        </div>
        <div className="govuk-grid-column-full govuk-!-margin-bottom-4">
            <h2 className="govuk-heading-l govuk-!-margin-bottom-4">Compliance status</h2>
            <p className="govuk-body govuk-!-margin-bottom-6">This website is deemed to be partially compliant with the Web Content
                 Accessibility guidelines version 2.1 AA standard, due to potential non-compliances and exemptions
                  which may be listed below once a full accessibility audit is conducted. 
                  
            </p>
                 <p className="govuk-body govuk-!-margin-bottom-4"> We are striving to ensure that the users of the CFS website are able to: </p>
                <ul className="govuk-list govuk-list--bullet govuk-list--spaced govuk-!-margin-bottom-4">
                     <li> change colours, contrast levels and fonts</li>
                     <li>zoom in up to 300% without the text spilling off the screen</li>
                     <li>navigate most of the service website using just a keyboard</li>
                     <li>navigate most of the service website using speech recognition software</li>
                     <li>listen to most of the service website using a screen reader (including the most recent versions of JAWS, NVDA and VoiceOver)</li>
                </ul>
           <p className="govuk-body govuk-!-padding-bottom-4 ">We've also made the service text on the website as simple as possible to understand.
           <br/>
           <br/>
           <a className="govuk-body govuk-!-margin-bottom-6 govuk-link govuk-link--no-visited-state"
            href="https://mcmw.abilitynet.org.uk/" target="”_blank”">AbilityNet (opens in a new tab) </a> 
             has advice on making your device easier to use if you have a disability.
            </p>
        </div>
        <div className="govuk-grid-column-full govuk-!-margin-bottom-4"> 

            <h2 className="govuk-heading-l govuk-!-margin-bottom-2 govuk-!-margin-bottom-4">Non-accessible content</h2>
            <p className="govuk-body govuk-!-margin-bottom-6">This section will be updated once we conduct a full accessibility audit.
            </p>
        </div>
        <div className="govuk-grid-column-full govuk-!-margin-bottom-4">

           <h2 className="govuk-heading-l govuk-!-margin-bottom-2 govuk-!-margin-bottom-4">What we're doing to improve accessibility</h2>
            <p className="govuk-body govuk-!-margin-bottom-6">We will enhance our service in accordance with the findings of our accessibility audit that is to be conducted soon.
            </p>
        </div>
        <div className="govuk-grid-column-full govuk-!-margin-bottom-4">

          <h2 className="govuk-heading-l govuk-!-margin-bottom-2 govuk-!-margin-bottom-4">Feedback and contact information</h2>
            <p className="govuk-body govuk-!-margin-bottom-6">If you need information on this service in a different format like an accessible PDF, large print, easy read, audio recording or braille, email <a className="govuk-link govuk-link--no-visited-state" href="mailto:fundingservice.requests@education.gov.uk">fundingservice.requests@education.gov.uk</a>. 
            </p>
        </div>
        <div className="govuk-grid-column-full govuk-!-margin-bottom-4">
  
          <h2 className="govuk-heading-l govuk-!-margin-bottom-2 govuk-!-margin-bottom-4">Reporting accessibility problems with this service</h2>
           <p className="govuk-body govuk-!-margin-bottom-6">We're always looking to improve the accessibility of this website. If you find any problems not listed on this page or think we're not meeting accessibility requirements, email <a className="govuk-link govuk-link--no-visited-state" href="mailto:fundingservice.requests@education.gov.uk">fundingservice.requests@education.gov.uk</a>.
           </p>
        </div>
        <div className="govuk-grid-column-full govuk-!-margin-bottom-4">

      <h2 className="govuk-heading-l govuk-!-margin-bottom-2 govuk-!-margin-bottom-4">Enforcement procedure</h2>
          <p className="govuk-body govuk-!-margin-bottom-6">The Equality and Human Rights Commission (EHRC) is responsible for enforcing the Public Sector Bodies 
                (Websites and Mobile Applications) (No. 2) Accessibility Regulations 2018 (the 'accessibility regulations').
                If you're not happy with how we respond to your complaint,
                <a className="govuk-link govuk-link--no-visited-state" href="https://www.equalityadvisoryservice.com/" target="”_blank”"> contact the Equality Advisory and Support Service (opens in a new tab)</a>.</p>
        </div> 
        <div className="govuk-grid-column-full govuk-!-margin-bottom-4">
          <h2 className="govuk-heading-l govuk-!-margin-bottom-2 govuk-!-margin-bottom-4">Preparation of this accessibility statement</h2>
          <p className="govuk-body govuk-!-margin-bottom-6">This statement was prepared on 20 October 2023. </p>
        </div>
        </div>
    </Main>
  );
};
