import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { IStoreState } from "../reducers/rootReducer";
import { Section } from "../types/Sections";
import CrownLogo from "../styles/govuk-frontend/govuk/assets/images/department-for-education_white.png";
import { FundingStreamPermissions } from "../types/FundingStreamPermissions";

const SafeLink = Link as any;

export const TopHeader = React.memo(function (props: { location: Section }) {

  const permissions: FundingStreamPermissions[] = useSelector(
      (state: IStoreState) => state.userState.fundingStreamPermissions
    );
  const canAdminister = permissions && permissions.some((fs) => fs.canAdministerFundingStream);

  const windowLocation = window.location.href;
  let environment = "";

  if (windowLocation.includes("https://dv.")) {
    environment = "(dev)";
  }
  if (windowLocation.includes("localhost")) {
    environment = "(local)";
  }
  if (windowLocation.includes("https://te.")) {
    environment = "(test)";
  }
  if (windowLocation.includes("https://sb.")) {
    environment = "(sandbox)";
  }
  if (windowLocation.includes("https://pp.")) {
    environment = "(pre-Production)";
  }

  return (
  <>
    <header className="govuk-header govuk-header--full-width-border" data-module="govuk-header">
      <div className="govuk-header__container govuk-width-container">
        <div className="govuk-header__logo">
          <SafeLink to="/" className="govuk-header__link govuk-header__link--homepage">
              <img src={CrownLogo} alt="Department for Education" className="govuk-header__logotype"></img>
          </SafeLink>
        </div>
      </div>
    </header>
    <div className="govuk-service-navigation"
      data-module="govuk-service-navigation">
      <div className="govuk-width-container">
        <div className="govuk-service-navigation__container">
          <nav aria-label="Menu" className="govuk-service-navigation__wrapper">
            <ul className="govuk-service-navigation__list" id="navigation">
              <li className="govuk-service-navigation__item govuk-service-navigation__service-name">
                {"Calculate Funding Service " + environment}
              </li>
              <li className={
                  "govuk-service-navigation__item" +
                  (props.location === Section.Templates ? " govuk-service-navigation__item--active" : "")
                }>
                <SafeLink className="govuk-service-navigation__link" to="/Templates/List">
                  Templates
                </SafeLink>
              </li>
              <li className={"govuk-service-navigation__item" +
                  (props.location === Section.Specifications ? " govuk-service-navigation__item--active" : "")}>
                <SafeLink className="govuk-service-navigation__link" to="/SpecificationsList">
                  Specifications
                </SafeLink>
              </li>
               <li className={
                  "govuk-service-navigation__item" +
                  (props.location === Section.Datasets ? " govuk-service-navigation__item--active" : "")
                }>
                <SafeLink className="govuk-service-navigation__link" to="/Datasets/ManageData" aria-current="true">
                  Data
                </SafeLink>
              </li>
              <li className={
                  "govuk-service-navigation__item" +
                  (props.location === Section.Results ? " govuk-service-navigation__item--active" : "")
                }>
                <SafeLink className="govuk-service-navigation__link" to="/results">
                  Results
                </SafeLink>
              </li>
              <li className={
                  "govuk-service-navigation__item" +
                  (props.location === Section.FundingManagement ? " govuk-service-navigation__item--active" : "")
                }>
                <SafeLink className="govuk-service-navigation__link" to="/FundingManagement">
                  Funding
                </SafeLink>
              </li>
              <li className={
                  "govuk-service-navigation__item" +
                  (props.location === Section.Permissions ? " govuk-service-navigation__item--active" : "")
                }>
                  {canAdminister ? 
                    (
                      <SafeLink className="govuk-service-navigation__link" to="/Permissions/AdminHome">
                        Permissions
                      </SafeLink>
                    )
                  : (
                      <SafeLink className="govuk-service-navigation__link" to="/Permissions/ViewMyPermissions">
                        Permissions
                      </SafeLink>
                    )
                  }
              </li>
              
            </ul>
          </nav>
        </div>
      </div>
    </div>
    </>
  );
});