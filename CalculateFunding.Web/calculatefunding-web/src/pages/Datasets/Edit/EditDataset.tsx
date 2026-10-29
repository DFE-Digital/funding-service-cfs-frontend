import React, { useEffect, useState } from "react";
import { RouteComponentProps, useHistory, useLocation } from "react-router";
import { LoadingStatus } from "../../../components/LoadingStatus";
import { Main } from "../../../components/Main";
import { useErrors } from "../../../hooks/useErrors";
import { useSpecificationSummary } from "../../../hooks/useSpecificationSummary";
import { Section } from "../../../types/Sections";
import { Breadcrumbs, Breadcrumb } from "components/Breadcrumbs";
import { MultipleErrorSummary } from "components/MultipleErrorSummary";
import { Link } from "react-router-dom";
import { useFundingConfiguration } from "hooks/useFundingConfiguration";
import * as datasetService from "../../../services/datasetService";
import { DatasetSchemaVerionRequestModel } from "types/Datasets/DatasetSchemaVerionRequestModel";
import { LoadingStatusNotifier } from "components/LoadingStatusNotifier";
import { WARNINGMESSAGECONSTANTS } from "../../../constants";
import { WarningText } from "components/WarningText";
import { AffectedCalcsTable } from "components/Datasets/AffectedCalcsTable";
import { RemovedFieldsTable } from "components/Datasets/RemovedFieldsTable";
import { DataSchemaVersionDetailsTable } from "components/Datasets/DataSchemaVersionDetailsTable";
import { AffectedCalculationResponse } from "types/Datasets/AffectedCalculationResponse";
import { getFundingPeriods } from "services/policyService";
const SafeLink = Link as any;

export interface EditDatasetRouteProps {
  specificationId: string;
}

export function EditDataset({
  match,
}: RouteComponentProps<EditDatasetRouteProps>): JSX.Element {
  const specificationId = match.params.specificationId;
  const history = useHistory();
  const { errors, addError, clearErrorMessages} = useErrors();
  const { specification, isLoadingSpecification } = useSpecificationSummary(specificationId, (err) =>
    addError({
      error: err,
      description: "Error while loading specification",
    })
  );
  const fundingPeriodId = (specification && specification?.fundingPeriod?.id) ?? "";
  const fundingStreamId =
    (specification?.fundingStreams?.length && specification?.fundingStreams[0].id) || "";
  const { fundingConfiguration, isLoadingFundingConfiguration } = useFundingConfiguration(
    fundingStreamId,
    fundingPeriodId,
    (err) => addError({ error: err, description: "Error while loading funding configuration" })
  );

  const dataset : any = useLocation().state;     
  const [isUpdating, setIsUpdating] = useState<boolean>(false)  
  const [isSaveBtnDisabled, setIsSaveBtnDisabled] = useState<boolean>(false)  
  const [newDataSchema, setNewDataSchema] = useState<any>();
  const [hasRemovedFields, setHasRemovedFields] = useState<boolean>(false);  
  const [removedFields, setRemovedFields] = useState<any>([]);  
  const [removedFieldsIsLoading, setRemovedFieldsIsLoading] = useState<boolean>(true);  
  const [includeAffectedCalcs, setIncludeAffectedCalcs] = useState<boolean>(false);  
  const [affectedCalculations, setAffectedCalculations] = useState<AffectedCalculationResponse[]>([]);   
  const [hasAffectedCalculations, setHasAffectedCalculations] = useState<any>(false);  
  const [calcsRemoved, setCalcsRemoved] = useState<any>(false);  
  const [fundingPeriod, setFundingPeriod] = useState<string | undefined>();
  
  const model : DatasetSchemaVerionRequestModel = {
    DatasetDefinitionName : dataset.ds.definition.name,
    FundingPeriodCode: fundingPeriod ? fundingPeriod : specification ? specification?.fundingPeriod?.id : "",
    FundingStreamCode : fundingStreamId,}
  
    useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getFundingPeriods();
        setFundingPeriod(response.data.find((fp) => fp.name === dataset.ds.fundingPeriodName)?.id);
      } catch (error: any) {
        addError(error);
      }
    };
    fetchData();
  }, [fundingConfiguration?.displayFundingPeriod === true]);

  useEffect(() => {
    datasetService
      .getNewFdsDatasetSchemaVersion(model)
      .then((response) => {
        setNewDataSchema(response.data);
      })
      .catch((e) => {
        addError(e);
      });
  }, [fundingPeriod]);
  
async function submitUpdateDataset() {
  if (dataset.ds && newDataSchema 
    ) {
        setIsUpdating(true);
          await datasetService.updateFdsDatasetSchemaVersionOfRelationship(dataset.ds.id, newDataSchema.id, removedFields)
          .then((response : any) => {
          setAffectedCalculations(response.data.affectedCalculations)
          if(response.data.current && response.data.affectedCalculations == null && response.status == 200 || response.data.affectedCalculations.length == 0 && response.status == 200){
            setIsUpdating(false);
            setIsSaveBtnDisabled(false);
            clearErrorMessages();
            const latestVersion = newDataSchema.version;
            const dataSchema = newDataSchema.name;
            const datasetName = dataset.ds.name;
            history.push(`/ViewSpecification/${specificationId}?showDatasets=true`, { latestVersion, dataSchema, datasetName,  isSuccess:true });
          } 
          else if(response.data.affectedCalculations != null){
            if (response.status == 200 && response.data.affectedCalculations.length > 0){
              setIsUpdating(false);
              setIsSaveBtnDisabled(true);
              setHasAffectedCalculations(true);
              addError({ error: WARNINGMESSAGECONSTANTS.CalculationsAffectedErrorMessage});
              setIncludeAffectedCalcs(true);
            }
        }
      }).catch((error : any) =>  {
          addError({
            error: error,
          })
          setIsUpdating(false);
          setIsSaveBtnDisabled(true);}
          )
    }
}

useEffect(() => { 
  if (dataset.ds && newDataSchema) {     
    datasetService.getFdsDatasetComparisonResult(fundingStreamId, fundingPeriodId, dataset.ds.definition.name, dataset.ds.targetSpecificationId, dataset.ds.id)
    .then(response => {
      setRemovedFields(response.data.removedFields);
      setIncludeAffectedCalcs(response.data.includeAffectedCalcs);
      setRemovedFieldsIsLoading(false);
    }) 
  }
}, [newDataSchema]);  

useEffect(() => { 
    if(removedFields && removedFields.length > 0){
      setHasRemovedFields(true);
    }
}, [removedFields]); 

async function refreshDataset (){
  await datasetService.getFdsDatasetComparisonResult(fundingStreamId, fundingPeriodId, dataset.ds.definition.name, dataset.ds.targetSpecificationId, dataset.ds.id, includeAffectedCalcs, removedFields)
  .then(result => {
    if(result.data.affectedCalculations != null && result.data.affectedCalculations.length > 0){
      setAffectedCalculations(result.data.affectedCalculations)
    }
    else{
      setHasAffectedCalculations(false)
      setIsSaveBtnDisabled(false)
      setCalcsRemoved(true)
      clearErrorMessages()
    }
  })
}

  document.title = "Edit dataset - Calculate funding";
  
  return (
    <Main location={Section.Specifications}>      
      <Breadcrumbs>
        <Breadcrumb name="Home" url="/" />
        <Breadcrumb name={"View specifications"} url={"/SpecificationsList"} />
        <Breadcrumb
          name={specification ? specification.name : "specification"}
          url={`/ViewSpecification/${specificationId}`}
        />
      </Breadcrumbs>
      <MultipleErrorSummary errors={errors} />

      <LoadingStatusNotifier
        notifications={[
          {
            isActive: isUpdating,
            title: "Checking for errors using calculations based on this data schema",
            subTitle: "This could take a few minutes...",
            description:"Do not refresh the page. You will be redirected automatically."
          }
        ]}
      />
      {(isLoadingSpecification || isLoadingFundingConfiguration || !newDataSchema || removedFieldsIsLoading) && (
        <LoadingStatus
        title={"Loading data set"}
        hidden={newDataSchema && !removedFieldsIsLoading}
        description={"Please wait whilst dataset is loading"}
      />
      )}
      { specification && fundingConfiguration && newDataSchema && !isLoadingFundingConfiguration && !isUpdating && !removedFieldsIsLoading && (
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-full">
              <h1 className="govuk-heading-xl govuk-!-margin-bottom-1">{specification.name}</h1>
              <span className="govuk-caption-l govuk-!-margin-bottom-7">
                {specification.fundingStreams[0].name} for {specification.fundingPeriod.name}
              </span>
              <h2 className="govuk-heading-l">Edit data set</h2>

              <div className="govuk-form-group govuk-!-margin-bottom-7"> 
                <label className="govuk-heading-m govuk-!-margin-bottom-1" >
                  <strong> Name of the data set </strong>
                </label>       
                <p className="govuk-body" >
                  {dataset.ds.name}
                </p>                
              </div>

              <div className="govuk-form-group govuk-!-margin-bottom-7"> 
                <label className="govuk-heading-m govuk-!-margin-bottom-1" >
                  <strong> Name of the data schema </strong>
                </label>       
                <p className="govuk-body" >
                  {newDataSchema.name}
                </p>                
              </div>   

              <div className="govuk-form-group govuk-!-margin-bottom-7"> 
                <label className="govuk-heading-m govuk-!-margin-bottom-1" >
                  <strong> Data schema version details </strong>
                </label>       
                <p className="govuk-body" >
                  You can view the new data schema version details here.
                </p>                
              </div>      
              <DataSchemaVersionDetailsTable newDataSchema={newDataSchema}/> 

            {hasRemovedFields &&
              <RemovedFieldsTable removedFields={removedFields} />}

            {hasAffectedCalculations && 
              <AffectedCalcsTable affectedCalculations={affectedCalculations} />}

            {!hasRemovedFields && 
              <div className="govuk-warning-text govuk-!-margin-bottom-7">
                <WarningText text={WARNINGMESSAGECONSTANTS.noFieldsRemovedWarningMessage}/>
              </div>}
          
            {hasRemovedFields && !isSaveBtnDisabled && !hasAffectedCalculations &&
              <div className="govuk-warning-text govuk-!-margin-bottom-7">
                <WarningText text={!calcsRemoved ? WARNINGMESSAGECONSTANTS.CalculationsAffectedWarningMessage : WARNINGMESSAGECONSTANTS.removedCalculationsMessage} />         
              </div>}

            <button
              className="govuk-button govuk-!-margin-right-1"
              data-module="govuk-button"
              disabled={isSaveBtnDisabled}
              onClick={submitUpdateDataset}
            >
              Save
            </button>
            {isSaveBtnDisabled && hasAffectedCalculations &&
              <button
                className="govuk-button govuk-button--secondary govuk-!-margin-right-1"
                data-module="govuk-button"
                onClick={refreshDataset}
              >
                Refresh
              </button>
            }
            <SafeLink
              to={`/ViewSpecification/${specificationId}?showDatasets=true`}
              className="govuk-button govuk-button--secondary govuk-!-margin-left-1"
              data-module="govuk-button"
            >
              Cancel
            </SafeLink>
          </div>
        </div>
      )}
    </Main>
  );
}

