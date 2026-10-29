import React, { useEffect, useMemo, useState } from "react";

import { convertToSlug } from "../../helpers/stringHelper";
import { DatasetRelationshipType } from "../../types/Datasets/DatasetRelationshipType";
import { SpecificationDatasetRelationshipsViewModelItem } from "../../types/Datasets/SpecificationDatasetRelationshipsViewModel";
import { JobNotification } from "../../types/Jobs/JobSubscriptionModels";
import { DateTimeFormatter } from "../DateTimeFormatter";
import { LoadingFieldStatus } from "../LoadingFieldStatus";
import { LoadingStatus } from "../LoadingStatus";
import { NoData } from "../NoData";
import { TextLink } from "../TextLink";

export interface SpecificationDataRelationshipsGridProps {
  isLoadingDatasetRelationships: boolean;
  datasetRelationships: SpecificationDatasetRelationshipsViewModelItem[];
  converterWizardJobs: JobNotification[];
  jobs : JobNotification[];
}

interface DataRelationshipItemRowProps {
  item: SpecificationDatasetRelationshipsViewModelItem;
  converterWizardJobs: JobNotification[];
  jobs: JobNotification[];
}

interface DataSetDetailsProps {
  item: SpecificationDatasetRelationshipsViewModelItem;
}

const SpecificationDataRelationshipsGrid = React.memo(
  ({
    isLoadingDatasetRelationships,
    datasetRelationships,
    converterWizardJobs,
    jobs,
  }: SpecificationDataRelationshipsGridProps) => {
    if (isLoadingDatasetRelationships) {
      return <LoadingStatus title={"Loading data sets"} />;
    }

    if (!datasetRelationships?.length) {
      return <NoData excludeSearchTips={true} />;
    }

    return (
      <table id="datarelationship-table" data-testid={"datarelationship-table"} className="govuk-table">
        <thead className="govuk-table__head">
          <tr className="govuk-table__row">
            <th scope="col" className="govuk-table__header govuk-!-width-one-quarter">
              Data set
            </th>
            <th scope="col" className="govuk-table__header govuk-!-width-one-quarter">
              Data set type
            </th>
            <th scope="col" className="govuk-table__header govuk-!-width-one-quarter">
              Mapped data source
            </th>
            <th scope="col" className="govuk-table__header govuk-!-width-one-quarter">
              Status
            </th>
            <th scope="col" className="govuk-table__header govuk-!-width-one-quarter">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="govuk-table__body">
          {datasetRelationships.map((item, index) => (
            <DataRelationshipItemRow key={index} item={item} jobs={jobs} converterWizardJobs={converterWizardJobs} />
          ))}
        </tbody>
      </table>
    );
  }
);

const DataSetDetails = ({ item }: DataSetDetailsProps) => {
  return (
    <details
      className="govuk-details govuk-!-margin-bottom-0 govuk-!-margin-top-2"
      data-module="govuk-details"
    >
      <summary className="govuk-details__summary">
        <span className="govuk-details__summary-text">Data set details</span>
      </summary>
      {item.relationshipType === DatasetRelationshipType.Uploaded || item.relationshipType === DatasetRelationshipType.FDS ? (
        <div className="govuk-details__text">
          <p className="govuk-body">
            <strong>Data schema:</strong> {item.definitionName}
          </p>
          <p className="govuk-body">
            <strong>Description:</strong> {item.definitionDescription}
          </p>
          <p className="govuk-body">
            <strong>Last mapped:</strong> <DateTimeFormatter date={item.lastUpdatedDate} />
          </p>
          <p className="govuk-body">
            <strong>Last mapped by:</strong> {item.lastUpdatedAuthorName}
          </p>
        </div>
      ) : (
        <div className="govuk-details__text">
          <p className="govuk-body">
            <strong>Referenced specification:</strong> {item.referencedSpecificationName}
          </p>
          <p className="govuk-body">
            <strong>Description:</strong> {item.relationshipDescription}
          </p>
          <p className="govuk-body">
            <strong>Last mapped:</strong> <DateTimeFormatter date={item.lastUpdatedDate} />
          </p>
          <p className="govuk-body">
            <strong>Last mapped by:</strong> {item.lastUpdatedAuthorName}
          </p>
        </div>
      )}
    </details>
  );
};

const DataRelationshipItemRow = React.memo(({ item, converterWizardJobs , jobs }: DataRelationshipItemRowProps) => {
  const hasConverterWizardRunning = useMemo(
    () =>
      converterWizardJobs.some(
        (n) => n.latestJob?.triggeredByEntityId === item.relationshipId && n.latestJob?.isActive
      ),
    [item.relationshipId, converterWizardJobs]
  );

  const [statusDescription , setStatusDescription] = useState<string>("");
  const [runningStatus , setRunningStatus] = useState<string>("");

  const [isCompleted , setIsCompleted] = useState<boolean>(false);
  const [isInProgress , setIsinPRogress] = useState<boolean>(false);
  const [isFailed , setIsFailed] = useState<boolean>(false);
  const [isTimedOut , setIsTimedOut] = useState<boolean>(false);
  const [cannotStart , setCannotStart] = useState<boolean>(false);
  const [notStarted , setNotStarted] = useState<boolean>(false);
  
  useEffect(()=>{
    jobs.forEach(x=>{
        if( x.latestJob?.trigger?.entityId === item.relationshipId){
          setStatusDescription(x.latestJob?.statusDescription);          
          setRunningStatus(x.latestJob?.runningStatus);        
        }
      })},[jobs]);

      useEffect(()=>{
        if(statusDescription === "in progress" 
        || statusDescription === "in queue" 
        || statusDescription === "completing" 
        || statusDescription === "in queue"){
          setIsinPRogress(true)
        }
        if(statusDescription === "timed out"){
          setIsTimedOut(true)
        }
        if(statusDescription === "failed" && runningStatus == "Completed" ){
          setIsFailed(true)
        }
        if(!item.datasetName && item.hasDataSourceFileToMap && !cannotStart ){
          setNotStarted(true)
        }
        if(!item.datasetName && !item.hasDataSourceFileToMap){
          setCannotStart(true)
        }
        if(statusDescription === "completed successfully" && runningStatus == "Completed" && !cannotStart || item.datasetName){
          setIsCompleted(true)
        }

    },[statusDescription,  isCompleted,isInProgress, isFailed, isTimedOut, cannotStart, notStarted]);

  return (
    <tr className="govuk-table__row" data-testid={`tr-relationship-${convertToSlug(item.relationshipId)}`}>
      <th scope="row" className="govuk-table__header">
        {item.relationName}
        {item.isProviderData ? (
          <span className="govuk-body-s govuk-!-margin-left-1">(Provider data)</span>
        ) : (
          ""
        )}
        <DataSetDetails item={item} />
      </th>
      <td className="govuk-table__cell">
        {item.relationshipType === DatasetRelationshipType.ReleasedData ? "Released data" : 
          item.relationshipType === DatasetRelationshipType.Uploaded ? "Uploaded data" : "FDS data"}
      </td>
      <td className="govuk-table__cell">
        {hasConverterWizardRunning ? (
          <LoadingFieldStatus title={"Converter wizard running. Please wait."} />
        ) : !item.hasDataSourceFileToMap ? (
          "	No data source file available"
        ) : item.datasetName && item.datasetName.length > 0 ? (
          `${item.datasetName} (version ${item.datasetVersion})`
        ) : (
          "No data sources mapped"
        )}
      </td>
      <td className="govuk-table__cell">



        {isCompleted && !isFailed && !isInProgress && item.datasetName && <strong className="govuk-tag govuk-tag--green govuk-tag-text-original govuk-tag-text-original">Completed</strong>} 
        {isInProgress && !isFailed  && <strong className="govuk-tag govuk-tag--light-blue govuk-tag-text-original ">In progress</strong>}      
        {isFailed && <strong className="govuk-tag govuk-tag--RED govuk-tag-text-original">Error - mapping failed</strong>} 
        {isTimedOut && !isCompleted && !isFailed && !isInProgress && <strong className="govuk-tag govuk-tag--RED govuk-tag-text-original">Timed out</strong>} 
        {notStarted && !isInProgress && !isFailed && <strong className="govuk-tag govuk-tag--blue govuk-tag-text-original">Not started</strong>}
        {cannotStart && !isCompleted && !isFailed && !isInProgress && !isTimedOut && !notStarted && <strong className="govuk-tag__text--grey govuk-tag-text-original" >Cannot start yet</strong>}     
      </td>
      <td className="govuk-table__cell">
        {item.hasDataSourceFileToMap && !hasConverterWizardRunning && (
          <TextLink to={`/Datasets/SelectDataSource/${item.relationshipId}`}>
            {item.datasetName && item.datasetName.length > 0 ? "Change" : "Map"}
          </TextLink>
        )}
      </td>
    </tr>
  );
});

export default SpecificationDataRelationshipsGrid;
