import React, { useEffect, useState } from "react";

import { DatasetVersionSearchResponse } from "../../types/Datasets/DatasetVersionSearchResponse";
import { DatasetWithVersions } from "../../types/Datasets/DataSourceRelationshipResponseViewModel";
import { DataSourceSelection } from "../../types/Datasets/DataSourceSelection";
import { DateTimeFormatter } from "../DateTimeFormatter";
import { InlineFieldset } from "../Fieldset";
import { LoadingFieldStatus } from "../LoadingFieldStatus";
import { NoData } from "../NoData";
import { TableNavBottom } from "../TableNavBottom";

export interface DatasetVersionSelectorProps {
  dataset: DatasetWithVersions;
  versionCount: number;
  versionSearchResult?: DatasetVersionSearchResponse | undefined;
  isSearchingForDataSetVersions: boolean;
  isViewingAllVersions: boolean;
  selection: DataSourceSelection;
  onExpand: (datasetId: string) => void;
  setPage?: (page: number) => void;
  onVersionSelected: (datasetId: string, newVersion: number) => void;
}

export const DataSetVersionSelector: React.FunctionComponent<DatasetVersionSelectorProps> = ({
  dataset,
  versionCount,
  versionSearchResult,
  isSearchingForDataSetVersions,
  isViewingAllVersions,
  selection,
  setPage,
  onExpand,
  onVersionSelected,
}) => {
  // ✅ Always call hooks at the top level
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null);

  useEffect(() => {
    if (selection?.version) {
      setSelectedVersion(selection.version);
    }
  }, [selection]);

  // ✅ Move conditional returns **below** the hooks
  if (dataset && !dataset.versions.length) {
    return <NoData excludeSearchTips={true} />;
  }

  const isSelectedDataSet = dataset.id === selection?.dataset?.id || !selection.dataset;

  function onExpandAllVersions() {
    onExpand(dataset.id);
  }

  const maxItems = (isViewingAllVersions && versionSearchResult?.results?.length) || 5;

  return (
    <div className="govuk-radios__conditional" data-testid="data-set-version-selector">
      <div className="govuk-form-group">
        <InlineFieldset token="dataset-version" heading="Select data source version">
          {isSearchingForDataSetVersions ? (
            <LoadingFieldStatus title="Loading versions..." />
          ) : (
            <div className="govuk-radios govuk-radios--small">
              {(isViewingAllVersions && versionSearchResult ? versionSearchResult.results : dataset.versions)
                .slice(0, maxItems)
                .map((dataSetVersion, index) => (
                  <DatasetVersionOption
                    key={index}
                    version={dataSetVersion.version}
                    versionNotes={"changeNote" in dataSetVersion ? dataSetVersion.changeNote : dataSetVersion.comment}
                    versionDate={"lastUpdatedDate" in dataSetVersion ? dataSetVersion.lastUpdatedDate : dataSetVersion.date}
                    versionBy={"lastUpdatedByName" in dataSetVersion ? dataSetVersion.lastUpdatedByName : dataSetVersion.author?.name || "Unknown"}
                    dataSetId={dataset.id}
                    dataSetName={dataset.name}
                    isSelected={isSelectedDataSet && dataSetVersion.version === selection?.version}
                    onSelected={onVersionSelected}
                  />
                ))}
            </div>
          )}
        </InlineFieldset>
        {!isViewingAllVersions && maxItems < versionCount && (
          <button
            className="govuk-link govuk-!-margin-top-5"
            name="expandButton"
            onClick={onExpandAllVersions}
          >
            View all versions
          </button>
        )}
        {isViewingAllVersions && versionSearchResult && setPage && (
          <div className="govuk-form-group">
            <TableNavBottom
              totalCount={versionSearchResult.totalResults}
              startItemNumber={versionSearchResult.startItemNumber}
              endItemNumber={versionSearchResult.endItemNumber}
              currentPage={versionSearchResult.pagerState.currentPage}
              lastPage={versionSearchResult.pagerState.lastPage}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

interface DatasetVersionOptionProps {
  version: number;
  versionNotes: string;
  versionDate: Date;
  versionBy: string;
  dataSetId: string;
  dataSetName: string;
  isSelected: boolean;
  onSelected: (dataSetId: string, newVersion: number) => void;
}

const DatasetVersionOption = ({
  version,
  versionNotes,
  versionDate,
  versionBy,
  dataSetId,
  dataSetName,
  isSelected,
  onSelected,
}: DatasetVersionOptionProps) => {
  function onChange() {
    if (!isSelected) {
      onSelected(dataSetId, version);
    }
  }

  return (
    <div className="govuk-radios__item">
      <input
        className="govuk-radios__input"
        id={`datasource-${version}`}
        name={`datasource-${dataSetId}`}
        type="radio"
        value={version}
        checked={isSelected}
        onChange={onChange}
      />
      <label className="govuk-label govuk-radios__label" htmlFor={`datasource-${version}`}>
        {dataSetName} (version {version})
        <div className="govuk-!-margin-top-1">
          <details className="govuk-details summary-margin-removal" data-module="govuk-details">
            <div className="govuk-details__text summary-margin-removal">
              <p className="govuk-body-s">
                <strong>Version notes:</strong> {versionNotes}
              </p>
              <p className="govuk-body-s">
                <strong>Last updated:</strong>
                <DateTimeFormatter date={versionDate} />
              </p>
              <p className="govuk-body-s">
                <strong>Last updated by:</strong> {versionBy}
              </p>
            </div>
          </details>
        </div>
      </label>
    </div>
  );
};
