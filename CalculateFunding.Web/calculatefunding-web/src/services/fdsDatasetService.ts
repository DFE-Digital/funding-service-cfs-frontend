import axios, { AxiosResponse } from "axios";

import { DataschemaDetailsViewModel } from "../types/Datasets/DataschemaDetailsViewModel";



const fdsBaseUrl = "/api/fds/datasets";

export async function getFDSDatasetsForFundingStreamService(
    fundingStreamId: string,
    fundingPeriodId: string
  ): Promise<AxiosResponse<DataschemaDetailsViewModel[]>> {
    return axios(`${fdsBaseUrl}/get-datasets-for-fundingstream/${fundingStreamId}/${fundingPeriodId}`, {
      method: "GET",
      headers: { 
      "Content-Type": "application/query+json",
      "x-ms-documentdb-isquery": "True"},
    });
  }
  
