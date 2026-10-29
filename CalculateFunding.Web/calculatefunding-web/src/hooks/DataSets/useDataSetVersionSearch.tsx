import { AxiosError } from "axios";
import { useQuery } from "react-query";

import * as datasetService from "../../services/datasetService";
import { DatasetVersionSearchResponse } from "../../types/Datasets/DatasetVersionSearchResponse";

export interface DataSetVersionSearchQuery {
  datasetType : string | undefined
  relationshipId: string | undefined;
  dataSetId: string | undefined;
  pageNumber: number;
  pageSize: number;
  enabled: boolean | undefined;
  onError: (err: AxiosError) => void;
}

export interface DataSetVersionSearchQueryResult {
  datasetVersionSearchResponse: DatasetVersionSearchResponse | undefined;
  isSearchingForDataSetVersions: boolean;
}

export const useDataSetVersionSearch = ({
  relationshipId,
  datasetType,
  dataSetId,
  pageNumber,
  pageSize,
  enabled,
  onError,
}: DataSetVersionSearchQuery): DataSetVersionSearchQueryResult => {
  const { data, isLoading } = useQuery<DatasetVersionSearchResponse, AxiosError>(
    [
      "data-set-versions",
      {
        datasetType : datasetType,
        relationshipId: relationshipId,
        dataSetId: dataSetId,
        pageNumber: pageNumber,
        pageSize: pageSize,
      },
    ],
    async () => (await datasetService.searchDatasetVersions(dataSetId as string, datasetType as string, pageNumber, pageSize)).data,
    {
      onError: onError,
      enabled: enabled && !!dataSetId && !!relationshipId,
    }
  );

  return {
    datasetVersionSearchResponse: data,
    isSearchingForDataSetVersions: isLoading,
  };
};
