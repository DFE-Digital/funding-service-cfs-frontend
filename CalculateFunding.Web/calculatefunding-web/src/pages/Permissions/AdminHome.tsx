import React from "react";
import { Main } from "../../components/Main";
import { Title } from "../../components/Title";
import { Section } from "../../types/Sections";
import { TextLink } from "../../components/TextLink";
import { BackLink } from "components/BackLink";

export function AdminHome(): JSX.Element {
  const pageTitle = (document.title = "Permissions");

  return (
    <Main location={Section.Permissions}>
      <div className="govuk-grid-row govuk-!-margin-bottom-7">
        <div className="govuk-grid-column-full">
          <BackLink />
        </div>
      </div>
      <span className="govuk-caption-xl">Admin</span>
      <Title
        title={pageTitle}
        description="View your permissions or manage user permissions for a funding stream you administer."
        includeBackLink={false}
      />
       <div className="homepage-section-container govuk-grid-row govuk-!-margin-top-3 govuk-!-margin-bottom-8">
        <div className="govuk-grid-column-full">
          <section className="homepage-section-container">
            <div className="govuk-grid-row">
              <div className="govuk-grid-column-one-third">
                <div className="govuk-heading-m ">
                  <TextLink to="/Permissions/ViewMyPermissions">View your permissions</TextLink>
                </div>
                <p className="govuk-body">View your own approval, editing and release permissions for any funding stream.</p>
              </div>
              <div className="govuk-grid-column-one-third">
                <div className="govuk-heading-m">
                  <TextLink to="/Permissions/Admin">Manage user permissions</TextLink>
                </div>
                <p className="govuk-body">
                  View or change a user's permissions or download all user permissions for a funding stream you administer.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Main>
  );
}