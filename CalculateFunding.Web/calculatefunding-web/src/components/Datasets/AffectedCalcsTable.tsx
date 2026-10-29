import React from "react";
import { Link } from "react-router-dom";
import { AffectedCalculationResponse } from "types/Datasets/AffectedCalculationResponse";
const SafeLink = Link as any;


export const AffectedCalcsTable = ({
    affectedCalculations
}: {
    affectedCalculations: AffectedCalculationResponse[];
}) => {
  return (
          <div className="govuk-form-group govuk-form-group--error govuk-!-padding-top-4" id="calculation">
            <fieldset className="govuk-fieldset" aria-describedby="nationality-hint nationality-error">
              <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">
                <h3 className="govuk-fieldset__heading">
                Calculations impacted by changes in the latest version of the data schema
                </h3>
              </legend>
              <div id="nationality-hint" className="govuk-hint">
              You can view the calculations impacted by changes in the latest version of the data schema.
              </div>
              <p id="nationality-error" className="govuk-error-message">
                <span className="govuk-visually-hidden">Error:</span> Revisit the calculation template, fix the errors and update the data set again.
              </p>
              <table className="govuk-table govuk-table--small-text-until-tablet" id="nationality">
                <thead className="govuk-table__head">
                  <tr className="govuk-table__row">
                    <th scope="col" className="govuk-table__header">Calculation name</th>
                    <th scope="col" className="govuk-table__header">Source code field name</th>
                    <th scope="col" className="govuk-table__header">Calculation type</th>
                  </tr>
                </thead>
                <tbody className="govuk-table__body">
                {affectedCalculations.map((affectedCalculation : AffectedCalculationResponse ) => (
                    <tr className="govuk-table__row">                
                      <td className="govuk-table__cell"><SafeLink className=" govuk-link govuk-link--no-visited-state govuk-table__header" target="_blank"  to={`/Specifications/EditCalculation/${affectedCalculation.id}`}>{affectedCalculation.name}</SafeLink></td>                               
                      <td className="govuk-table__cell">{affectedCalculation.removedDataFields.map((str, i) => (
                            <span key={i}>
                                {str}
                                {i !== affectedCalculation.removedDataFields.length - 1 && ", "} {/* Add comma if it's not the last item */}
                                        <br /> {/* Add line break after each string */}
                            </span>
                        ))}</td>                               
                      <td className="govuk-table__cell">{affectedCalculation.calculationType}</td>                               
                    </tr>   
                  ))} 
                </tbody>
              </table>
            </fieldset>
          </div>
  );
};
