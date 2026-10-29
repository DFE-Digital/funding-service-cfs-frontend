import React from "react";
import {WARNINGMESSAGECONSTANTS} from "../../constants";


export const RemovedFieldsTable = ({
    removedFields
}: {
    removedFields: any;
}) => {
  return (
    <div className="govuk-form-group govuk-!-margin-bottom-7"> 
    <label className="govuk-heading-m govuk-!-margin-bottom-1" >
      <strong>Fields removed between the current and latest version of the data schema</strong>
    </label>       
    <span className="govuk-hint">
    {WARNINGMESSAGECONSTANTS.RemovedFieldsHintText}
    </span>        
    <table className="govuk-table govuk-!-margin-bottom-8" >
      <thead className="govuk-table__head">
        <tr className="govuk-table__row">
          <th scope="col" className="govuk-table__header govuk-!-width-one-quarter">
            Field name
          </th>            
          <th scope="col" className="govuk-table__header govuk-!-width-one-half">
            Field type
          </th>
        </tr>
      </thead>
      <tbody className="govuk-table__body">  
      {removedFields.map((removedField : any) => (
        <tr className="govuk-table__row">
          <td className="govuk-table__cell"><strong>{removedField.name}</strong></td>                  
          <td className="govuk-table__cell">{removedField.type}</td>                               
        </tr>   
      ))}                  
      </tbody>
    </table>
  </div>
  );
};
