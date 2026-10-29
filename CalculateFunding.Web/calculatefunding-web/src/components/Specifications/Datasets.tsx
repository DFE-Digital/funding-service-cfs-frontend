import { AxiosError } from "axios";
import * as React from "react";
import { ChangeEvent, useEffect, useState} from "react";
import { useMutation } from "react-query";
import { Link } from "react-router-dom";
import {useHistory, useLocation } from "react-router";

import { useSpecificationDatasets } from "../../hooks/DataSets/useSpecificationDatasets";
import { useErrors } from "../../hooks/useErrors";
import { useFeatureFlags } from "../../hooks/useFeatureFlags";
import * as datasetService from "../../services/datasetService";
import { DatasetRelationshipType } from "../../types/Datasets/DatasetRelationshipType";
import { ToggleDatasetSchemaRequest } from "../../types/Datasets/ToggleDatasetSchemaRequest";
import { DateTimeFormatter } from "../DateTimeFormatter";
import { LoadingStatus } from "../LoadingStatus";
import { MultipleErrorSummary } from "../MultipleErrorSummary";
import { TextLink } from "../TextLink";
import { BackToTop } from "components/BackToTop";
import { DatasetRelationship } from "types/DatasetRelationship";
import { getSpecificationSummaryService } from "services/specificationService";
import { SpecificationSummary } from "types/SpecificationSummary";
import { useFundingConfiguration } from "hooks/useFundingConfiguration";
const SafeLink = Link as any;

export function Datasets({
  specificationId,
  lastConverterWizardReportDate,
}: {
  specificationId: string;
  lastConverterWizardReportDate: Date | undefined;
}) {
  const featureFlags = useFeatureFlags();
  const { datasets, isLoadingDatasets, refetchDatasets } = useSpecificationDatasets({
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

  const { mutate: handleToggleConverter } = useMutation<boolean, AxiosError, ToggleDatasetSchemaRequest>(
    async (request) => (await datasetService.toggleDatasetRelationshipService(request)).data,
    {
      onError: (err) =>
        addError({
          error: err,
          description: "Error whilst setting enable copy data for provider",
        }),
      onSuccess: () => refetchDatasets(),
    }
  );  

  const history = useHistory();
  const { errors, addError } = useErrors();
  const [isSuccess, setIsSuccess] = useState<Boolean>(false);
  const [dataSchema, setDataSchema] = useState<string>("");
  const [latestVersion,setLatestVersion] = useState<string>("");
  const [datasetName, setDatasetName] = useState<string>("");
  const location : any = useLocation();  
  const [fdsType, setFdsType] = useState<DatasetRelationship[]>([]);
  const [uploadedType, setUploadedType] = useState<DatasetRelationship[]>([]);
  const [releasedType, setReleasedType] = useState<DatasetRelationship[]>([]);
  const [specSummery, setSpecSummery] = useState<SpecificationSummary>();
  
  useEffect(() => {
    if (datasets) {
      const fdsType = datasets.filter(data => data.relationshipType === "FDS");
      const uploadedType = datasets.filter(data => data.relationshipType === "Uploaded");
      const releasedType = datasets.filter(data => data.relationshipType === "ReleasedData");
  
      setFdsType(fdsType);
      setUploadedType(uploadedType);
      setReleasedType(releasedType);
    }
  }, [datasets]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responce = await getSpecificationSummaryService(specificationId);
        setSpecSummery(responce.data)
      } catch (error) {
        console.error("Failed to fetch spec summary:", error);
      }
    };
    if (specificationId) {
      fetchData();
    }
  }, [specificationId]);

  useEffect(() => {
  if(location.state && location.state.isSuccess){
    setIsSuccess(location.state.isSuccess );
    setDataSchema(location.state.dataSchema); 
    setLatestVersion(location.state.latestVersion);
    setDatasetName(location.state.datasetName);
  } else{
    setIsSuccess(false);
  } } , [location.state])

  const { fundingConfiguration, isLoadingFundingConfiguration } = useFundingConfiguration(
      specSummery?.fundingStreams[0].id,
      specSummery?.fundingPeriod.id,
      (err) => addError({ error: err, description: "Error while loading funding configuration" })
  );

const SuccessMassage = () => {
    return (          
      <div className="govuk-notification-banner govuk-notification-banner--success" role="alert"
        aria-labelledby="govuk-notification-banner-title"
        data-module="govuk-notification-banner">
        <div className="govuk-notification-banner__header">
          <h2 className="govuk-notification-banner__title" id="govuk-notification-banner-title">
            Success
          </h2>
        </div>  
        <div className="govuk-notification-banner__content">
          <h2 className="govuk-heading-s">
            {datasetName} has been successfully updated to V{latestVersion} of the {dataSchema} data schema.
          </h2>             
        </div>
      </div>)
  }
    
  return (
    <section className="govuk-tabs__panel" id="datasets">
      <LoadingStatus
        title={"Loading data sets"}
        hidden={!isLoadingDatasets}
        description={"Please wait whilst data sets are loading"}
      />
      <MultipleErrorSummary errors={errors} />
      <div className="govuk-grid-row" hidden={isLoadingDatasets}>
          {isSuccess&&
            <SuccessMassage/>                  
            }             
        <div className="govuk-grid-column-two-thirds">
          <h2 className="govuk-heading-m govuk-!-margin-bottom-0">Datasets</h2>
          <h2 className="govuk-heading-s">Datasets with corresponding data schemas</h2>
        </div>
        <div className="govuk-grid-column-one-third">
          <div>
            <SafeLink
              role="link"
              to={`/Datasets/DataRelationships/${specificationId}`}
              id="dataset-specification-relationship-button"
              className="govuk-link govuk-link--no-visited-state"
              data-module="govuk-button"
            >
              Map data source file to data set
            </SafeLink>
          </div>
          <div>
            <TextLink
              to={
                featureFlags.specToSpec
                  ? `/Datasets/Create/SelectDatasetTypeToCreate/${specificationId}`
                  : `/Datasets/CreateDataset/${specificationId}`
              }
            >
              Create dataset
            </TextLink>
          </div>
          {lastConverterWizardReportDate && (
            <div>
              <a
                className="govuk-link govuk-link--no-visited-state"
                href={`/api/datasets/reports/${specificationId}/download`}
              >
                Converter wizard report
              </a>
              <br />
              <p className="govuk-body-s">
                Converter wizard last run: <DateTimeFormatter date={lastConverterWizardReportDate} />
              </p>
            </div>
          )}
        </div>
      </div>
      {fdsType.length >= 1 &&(
        <>
          <h2 className="govuk-heading-m govuk-!-margin-bottom-0">FDS data</h2>
          <table className="govuk-table" hidden={isLoadingDatasets}>
            <thead className="govuk-table__head">
              <tr className="govuk-table__row">
                <th scope="col" className="govuk-table__header govuk-!-width-one-quarter">
                  Dataset
                </th>
                {fundingConfiguration?.displayFundingPeriod === true && (
                    <th scope="col" className="govuk-table__header">
                      Funding period
                    </th>)}
                <th scope="col" className="govuk-table__header govuk-!-width-one-quarter">
                  Data schema
                </th>
                <th scope="col" className="govuk-table__header govuk-!-width-one-quarter">
                  Version
                </th>
                <th scope="col" className="govuk-table__header govuk-!-width-one-sixth">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="govuk-table__body">              
              {fdsType?.map((ds)=>{                            
                return (               
                  <tr className="govuk-table__row" key={ds.id}>
                    <td scope="row" className="govuk-table__cell">
                      {ds.relationshipType === DatasetRelationshipType.FDS ? (ds.name) : (
                      <TextLink to={`/Datasets/${ds.id}/Edit/${specificationId}`}>{ds.name}</TextLink>)}
                      <div className="govuk-!-margin-top-2">
                        <details className="govuk-details govuk-!-margin-bottom-0" data-module="govuk-details">
                          <summary className="govuk-details__summary">
                            <span className="govuk-details__summary-text">Dataset Description</span>
                          </summary>
                          <div className="govuk-details__text">{ds.relationshipDescription}</div>
                        </details>
                      </div>
                    </td>
                    {fundingConfiguration?.displayFundingPeriod === true && ( 
                        <td scope="row" className="govuk-table__cell">
                              {ds.fundingPeriodName}
                        </td>)}
                    <td className="govuk-table__cell">{ds.definition?.name || ds.name}</td> 
                    {ds.definition.version ? <td className="govuk-table__cell">V{ds.definition.version}&nbsp;                      
                      {!ds.definition.isLatestVersion && <strong className="govuk-tag govuk-tag--blue">NEW VERSION AVAILABLE</strong>}
                    <div className="govuk-!-margin-top-2">
                      <button className="govuk-link govuk-link--no-visited-state" 
                        onClick={() => {history.push(`/Datasets/DataSchemaDetails/${specificationId}`, {ds}); window.scrollTo(0, 0);}}>
                        Data schema details
                      </button>                                     
                    </div></td> : <td className="govuk-table__cell"></td>}                     
                    <td className="govuk-table__cell">
                      {!ds.definition.isLatestVersion && ds.definition.version ? <button className="govuk-link govuk-link--no-visited-state" 
                        onClick={() => {history.push(`/Datasets/EditDataset/${specificationId}`, {ds})}}>
                        Edit dataset
                      </button> : <></>}                     
                    </td>                 
                  </tr>)})}                 
            </tbody>
          </table>
        </>
        )       
      }
    
      {releasedType.length >= 1 &&(
        <>
          <h2 className="govuk-heading-m govuk-!-margin-bottom-0">Released data</h2>
          <table className="govuk-table" hidden={isLoadingDatasets}>
            <thead className="govuk-table__head">
              <tr className="govuk-table__row">
                <th scope="col" className="govuk-table__header govuk-!-width-one-quarter">
                  Dataset
                </th>
                <th scope="col" className="govuk-table__header">
                  Data schema
                </th>
                <th scope="col" className="govuk-table__header">                  
                </th>
              </tr>
            </thead>
            <tbody className="govuk-table__body">
              {releasedType?.map((ds)=>{               
                return (               
                  <tr className="govuk-table__row" key={ds.id}>
                    <td scope="row" className="govuk-table__cell">
                    <TextLink to={`/Datasets/${ds.id}/Edit/${specificationId}`}>{ds.name}</TextLink>
                      <div className="govuk-!-margin-top-2">
                        <details className="govuk-details govuk-!-margin-bottom-0" data-module="govuk-details">
                          <summary className="govuk-details__summary">
                            <span className="govuk-details__summary-text">Dataset Description</span>
                          </summary>
                          <div className="govuk-details__text">{ds.relationshipDescription}</div>
                        </details>
                      </div>
                    </td>
                    <td className="govuk-table__cell">{ds.definition?.name || ds.name}</td> 
                    <td className="govuk-table__cell"></td>                                          
                  </tr>)})}                 
            </tbody>
          </table>
        </>
        )       
      }
      {uploadedType.length>=1 &&(
        <>
          <h2 className="govuk-heading-m govuk-!-margin-bottom-0">Uploaded data</h2>
          <table className="govuk-table" hidden={isLoadingDatasets}>
            <thead className="govuk-table__head">
              <tr className="govuk-table__row">
                <th scope="col" className="govuk-table__header govuk-!-width-one-quarter">Dataset</th>
                <th scope="col" className="govuk-table__header ">Data schema</th>
                <th scope="col" className="govuk-table__header govuk-!-width-one-quarter">Enable copy data for provider</th>
              </tr>
            </thead>
          <tbody className="govuk-table__body">
            {uploadedType?.map((ds) => {
              const onToggleConverter = (e: ChangeEvent<HTMLInputElement>) => {
                const request: ToggleDatasetSchemaRequest = {
                  relationshipId: ds.id,
                  converterEnabled: e.target.value === "true",
                };
                handleToggleConverter(request);
              };
              return (
                <tr className="govuk-table__row" key={ds.id}>
                  <td scope="row" className="govuk-table__cell">
                    {ds.relationshipType === DatasetRelationshipType.Uploaded 
                    || ds.relationshipType === DatasetRelationshipType.FDS ? (
                      ds.name
                    ) : (
                      <TextLink to={`/Datasets/${ds.id}/Edit/${specificationId}`}>{ds.name}</TextLink>
                    )}
                    <div className="govuk-!-margin-top-2">
                      <details className="govuk-details govuk-!-margin-bottom-0" data-module="govuk-details">
                        <summary className="govuk-details__summary">
                          <span className="govuk-details__summary-text">Dataset Description</span>
                        </summary>
                        <div className="govuk-details__text">{ds.relationshipDescription}</div>
                      </details>
                    </div>
                  </td>
                  <td className="govuk-table__cell">{ds.definition?.name || ds.name}</td>
                  <td className="govuk-table__cell">
                    {ds.converterEligible && (ds.relationshipType === DatasetRelationshipType.Uploaded) && (
                      <div className="govuk-form-group" data-testid={`converter-enabled-${ds.id}`}>
                        <div className="govuk-radios govuk-radios--inline">
                          <div className="govuk-radios__item">
                            <input
                              className="govuk-radios__input"
                              id={`converter-enabled-${ds.id}.yes`}
                              name={`converter-enabled-${ds.id}`}
                              type="radio"
                              value="true"
                              defaultChecked={ds.converterEnabled}
                              onChange={onToggleConverter}
                            />
                            <label
                              className="govuk-label govuk-radios__label"
                              htmlFor={`converter-enabled-${ds.id}.yes`}
                            >
                              Yes
                            </label>
                          </div>
                          <div className="govuk-radios__item">
                            <input
                              className="govuk-radios__input"
                              id={`converter-enabled-${ds.id}.no`}
                              name={`converter-enabled-${ds.id}`}
                              type="radio"
                              value="false"
                              defaultChecked={!ds.converterEnabled}
                              onChange={onToggleConverter}
                            />
                            <label
                              className="govuk-label govuk-radios__label"
                              htmlFor={`converter-enabled-${ds.id}.no`}
                            >
                              No
                            </label>
                          </div>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              );
          })}
          </tbody>
        </table>
        </>
      )}      
      <BackToTop id={"top"} />
    </section>
  );
}
