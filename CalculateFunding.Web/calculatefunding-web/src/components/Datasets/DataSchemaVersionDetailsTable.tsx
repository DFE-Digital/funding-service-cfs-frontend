import { DateTimeFormatter } from "components/DateTimeFormatter";
import React from "react";

export const DataSchemaVersionDetailsTable = ({
  newDataSchema
}: {
  newDataSchema: any;
}) => {
  return (
<table className="govuk-table govuk-!-margin-bottom-8" >
            <thead className="govuk-table__body">             
              <tr className="govuk-table__row">                    
                <th scope="col" className="govuk-table__header govuk-!-width-one-quarter"><strong>New data schema version</strong></th>                  
                <td scope="col" className="govuk-table__cell govuk-!-width-one-half">
                  V{newDataSchema.version}
                </td>
              </tr>
            </thead>
            <tbody>
              <tr className="govuk-table__row">
                <th className="govuk-table__cell"><strong>Last updated</strong></th>   
                <td className="govuk-table__cell"><DateTimeFormatter date={newDataSchema.lastUpdatedDt}/></td>                                  
              </tr>   
              <tr className="govuk-table__row">
                <th className="govuk-table__cell"><strong>Updated by</strong></th>    
                <td className="govuk-table__cell">{newDataSchema.lastUpdatedBy}</td>                                             
              </tr>   
              <tr className="govuk-table__row">
                <th className="govuk-table__cell"><strong>Change notes</strong></th>  
                <td className="govuk-table__cell">{newDataSchema.comment}</td>                                               
              </tr>   
            </tbody>
          </table>  
  );
};
