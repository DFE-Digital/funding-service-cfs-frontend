import React, { useState } from "react";
import { RouteComponentProps, useHistory } from "react-router";

import { Breadcrumb, Breadcrumbs } from "../../../components/Breadcrumbs";
import Form from "../../../components/Form";
import { Main } from "../../../components/Main";
import { MultipleErrorSummary } from "../../../components/MultipleErrorSummary";
import { PermissionStatus } from "../../../components/PermissionStatus";
import RadioOption from "../../../components/RadioOption";
import { useSpecificationPermissions } from "../../../hooks/Permissions/useSpecificationPermissions";
import { useErrors } from "../../../hooks/useErrors";
import { useSpecificationSummary } from "../../../hooks/useSpecificationSummary";
import { Permission } from "../../../types/Permission";
import { Section } from "../../../types/Sections";
import { useFundingConfiguration } from "hooks/useFundingConfiguration";

export interface CreateDatasetRouteProps {
  forSpecId: string;
}

export function SelectDatasetTypeToCreate({
  match,
}: RouteComponentProps<CreateDatasetRouteProps>): JSX.Element {
  const forSpecId: string = match.params.forSpecId;
  const { errors, addError, clearErrorMessages } = useErrors();
  const [referenceReleased, setReferenceReleased] = useState<boolean | undefined>();
  const [referenceFDSData, setReferenceFDSData] = useState<boolean | undefined>();
  const [uploadedData, setUploadedData] = useState<boolean | undefined>();
  const { isCheckingForPermissions, isPermissionsFetched, hasMissingPermissions, missingPermissions } =
    useSpecificationPermissions(forSpecId, [Permission.CanEditSpecification]);
  const { specification } = useSpecificationSummary(forSpecId, (err) =>
    addError({
      error: err,
      description: "Error while loading specification",
    })
  );
  const { fundingConfiguration } = useFundingConfiguration(
    specification?.fundingStreams[0]?.id,
    specification?.fundingPeriod?.id,
    (err) => addError({ error: err, description: "Error while loading funding configuration" })
  );
  const history = useHistory();

  const onCancel = () => {
    history.push(`/ViewSpecification/${forSpecId}?showDatasets=true`);
  };

  const onSelectReferencedData = () => {
    setReferenceReleased(true);
    setReferenceFDSData(false);
    setUploadedData(false);
  };

  const onSelectUploadedData = () => {
    setReferenceReleased(false);
    setReferenceFDSData(false);
    setUploadedData(true);
  };

  const onSelectFDSData = () => {
    setReferenceFDSData(true);
    setReferenceReleased(false);
    setUploadedData(false);
  };

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    clearErrorMessages();

    if (referenceReleased === undefined) {
      addError({
        error: "Select released data or uploaded data " + (fundingConfiguration?.useFDSData ? "or FDS data":""),
      });
      return;
    }

    referenceReleased
      ? history.push(`/Datasets/Create/SelectReferenceSpecification/${forSpecId}`)
      : uploadedData 
      ? history.push(`/Datasets/CreateDataset/${forSpecId}`)
      : history.push({
        pathname:`/Datasets/CreateDataset/${forSpecId}`,
        state: "fds"
      });
  };

  return (
    <Main location={Section.Datasets}>
      <Breadcrumbs>
        <Breadcrumb name="Home" url="/" />
        <Breadcrumb name="View specifications" url="/SpecificationsList" />
        <Breadcrumb
          name={specification ? specification.name : "Specification"}
          url={specification ? `/ViewSpecification/${specification.id}` : "#"}
        />
      </Breadcrumbs>
      <PermissionStatus
        requiredPermissions={missingPermissions}
        hidden={isCheckingForPermissions || !isPermissionsFetched || !hasMissingPermissions}
      />
      <MultipleErrorSummary errors={errors} />
      <section>
        <Form token="select-dataset-type" heading="Which data set type?">
          <div className="govuk-grid-row govuk-!-margin-bottom-4">
            <div className="govuk-grid-column-two-thirds">
              <div className="govuk-radios">
                <RadioOption
                  token="released"
                  label="Released data"
                  value="released"
                  disabled={hasMissingPermissions}
                  checked={referenceReleased === true}
                  callback={onSelectReferencedData}
                  hint="Data set referencing released allocations data from another CFS specification"
                />
                <RadioOption
                  token="uploaded"
                  label="Uploaded data"
                  value="uploaded"
                  disabled={hasMissingPermissions}
                  checked={uploadedData === true}
                  callback={onSelectUploadedData}
                  hint="Data set referencing data uploaded into CFS"
                />
                {(fundingConfiguration?.useFDSData) ? (
                <RadioOption
                  token="fdsdata"
                  label="FDS data"
                  value="fdsdata"
                  disabled={hasMissingPermissions}
                  checked={referenceFDSData === true}
                  callback={onSelectFDSData}
                  hint="Data set referencing data uploaded into FDS"
                />
                ) : ""}
              </div>
            </div>
          </div>
          <Actions hasMissingPermissions={hasMissingPermissions} onSubmit={onSubmit} onCancel={onCancel} />
        </Form>
      </section>
    </Main>
  );
}

const Actions = (props: {
  hasMissingPermissions: boolean;
  onSubmit: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onCancel: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) => (
  <div className="govuk-grid-row">
    <div className="govuk-grid-column-two-thirds">
      <button
        id="patternLink"
        type="button"
        onClick={(e) => props.onSubmit(e as React.MouseEvent<HTMLButtonElement>)}
        disabled={props.hasMissingPermissions}
        className="govuk-button govuk-!-margin-right-1"
        data-module="govuk-button"
      >
        Continue
      </button>

      <button
        className="govuk-button govuk-button--secondary"
        data-module="govuk-button"
        onClick={(e) => props.onCancel(e as React.MouseEvent<HTMLButtonElement>)}
      >
        Cancel
      </button>
    </div>
  </div>
);
