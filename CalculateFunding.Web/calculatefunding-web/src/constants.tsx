const WARNINGMESSAGECONSTANTS = {
     CalculationsAffectedWarningMessage : 
    `If the fields in the latest version of the data schema differ from those in the current, 
    selected version, you can still update the schema. But you will have to fix the calculations 
    that have been affected by the fields removed earlier.`,

     noFieldsRemovedWarningMessage :
    `There are no fields removed between the current and the latest version of the data schema.`,

    removedCalculationsMessage: 
    `The fields that have been removed between the current 
    and latest versions of the data schema have now been refreshed and no errors have been detected. 
    You can continue updating the data schema.`,

    CalculationsAffectedErrorMessage: 
    `Some of the fields are not present in the latest version of the data schema. 
    Check the calculation script and update the data set again before the data schema is upgraded.`,
    
    RemovedFieldsHintText: 
    `You can view the fields in the latest version of the data schema that differ from those 
    in the current, selected version.`,


    }
    
    Object.freeze(WARNINGMESSAGECONSTANTS)

const AdultType = {
     ADF :"ADF", ASF:"ASF", ALL:"ALL"
}
Object.freeze(AdultType)

export  {
     WARNINGMESSAGECONSTANTS,
     AdultType}
