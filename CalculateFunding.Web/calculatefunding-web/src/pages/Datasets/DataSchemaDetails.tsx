import React from "react";
import { RouteComponentProps, useLocation } from "react-router";
import { LoadingStatus } from "../../components/LoadingStatus";
import { Main } from "../../components/Main";
import { useErrors } from "../../hooks/useErrors";
import { useSpecificationSummary } from "../../hooks/useSpecificationSummary";
import { Section } from "../../types/Sections";
import { useSpecificationDatasets } from "hooks/DataSets/useSpecificationDatasets";
import { DateTimeFormatter } from "components/DateTimeFormatter";
import { BackLink } from "components/BackLink";

export interface DataSchemaDetailsRouteProps {
  specificationId: string;
}

export function DataSchemaDetails({
  match,
}: RouteComponentProps<DataSchemaDetailsRouteProps>): JSX.Element {
  const specificationId = match.params.specificationId;

  const {addError} = useErrors();
  const { specification} = useSpecificationSummary(specificationId, (err) =>
    addError({
      error: err,
      description: "Error while loading specification",
    })
  );

  const location = useLocation()
  const state : any = location.state;

  const {isLoadingDatasets, } = useSpecificationDatasets({
    specificationId,
    options: {
      onError: (err) =>
        addError({
          error: err,
          description: "Could not load data sets",
          suggestion: "Please try again later",
        }),
    },
  });
  
  document.title = "View data schema details - Calculate funding";

  
    
  return (
    <Main location={Section.Specifications}>
      {!isLoadingDatasets &&
        <BackLink className="govuk-!-margin-bottom-8" to={`/ViewSpecification/${specificationId}?showDatasets=true`}/>}
      <LoadingStatus
        title={"Loading data schema details"}
        hidden={!isLoadingDatasets}
        description={"Please wait whilst data schema details are loading"}
      />
     { !isLoadingDatasets && specification && 
      <div className="govuk-grid-row">
          <div className="govuk-grid-column-full" >
            <h1 className="govuk-heading-xl govuk-!-margin-bottom-1">{specification.name}</h1>
            <span className="govuk-caption-l govuk-!-margin-bottom-8">
              {specification.fundingStreams[0].name} for {specification.fundingPeriod.name}
            </span>
            <div className="govuk-!-margin-top-4 govuk-!-margin-bottom-7">
              <h3 className="govuk-heading-l">Data schema details</h3>
            </div>
              <div className="govuk-form-group govuk-!-margin-bottom-8">
                <label className="govuk-label" htmlFor="funding-stream">
                  <strong>Name of the data schema</strong>
                </label>
                <p className="govuk-body" id="funding-period">
                  {state.ds.definition.name}
                </p>
            </div>

            <div className="govuk-form-grou govuk-!-margin-bottom-8">
              <label className="govuk-label" htmlFor="funding-period">
                <strong>Description</strong>
              </label>
              <p className="govuk-body" id="funding-period">
                {state.ds.definition.description}
              </p>
            </div>
          </div>
        </div>
      }
        <table className="govuk-table govuk-!-margin-bottom-8" hidden={isLoadingDatasets}>
            <thead className="govuk-table__head">
              <tr className="govuk-table__row">
                <th scope="col" className="govuk-table__header govuk-!-width-one-quarter">
                  Data schema version
                </th>            
                <th scope="col" className="govuk-table__header govuk-!-width-one-quarter">
                  Last updated
                </th>
                <th scope="col" className="govuk-table__header govuk-!-width-one-quarter">
                  Updated by
                </th>
                <th scope="col" className="govuk-table__header govuk-!-width-one-quarter">
                  Change notes
                </th>
              </tr>
            </thead>
            <tbody className="govuk-table__body">             
                  <tr className="govuk-table__row" key={state.ds.id}>
                    <td className="govuk-table__cell"><strong>V{state.ds.definition.version}</strong></td>                  
                    <td className="govuk-table__cell"><DateTimeFormatter date={state.ds.definition.lastUpdatedDt}/></td>   
                    <td className="govuk-table__cell">{state.ds.definition.lastUpdatedBy}</td>                  
                    <td className="govuk-table__cell">
                      {state.ds.definition.comment}
                    </td>                    
                  </tr>            
            </tbody>
          </table>
          <div className="govuk-"></div>
    </Main>
  );
}
