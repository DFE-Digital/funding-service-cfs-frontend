import axios, { AxiosResponse } from "axios";

import { CalculationSearchRequestViewModel } from "../types/CalculationSearchRequestViewModel";
import { CalculationSearchResultResponse } from "../types/CalculationSearchResponse";
import { PublishStatus } from "../types/PublishStatusModel";
import { CreateSpecificationModel } from "../types/Specifications/CreateSpecificationModel";
import {
  FundingLineProfileVariationPointer,
  ProfileVariationPointer,
} from "../types/Specifications/ProfileVariationPointer";
import { ReportMetadataViewModel } from "../types/Specifications/ReportMetadataViewModel";
import { SpecificationListResults } from "../types/Specifications/SpecificationListResults";
import { UpdateSpecificationModel } from "../types/Specifications/UpdateSpecificationModel";
import { SpecificationSearchRequestViewModel } from "../types/SpecificationSearchRequestViewModel";
import { FundingStreamWithSpecificationSelectedForFunding } from "../types/SpecificationSelectedForFunding";
import { SpecificationSummary } from "../types/SpecificationSummary";
import { FundingPeriod, Specification } from "../types/viewFundingTypes";

const baseURL = "/api/specs";

export async function getSpecificationSummaryService(
  specificationId: string
): Promise<AxiosResponse<SpecificationSummary>> {
  return axios(`${baseURL}/specification-summary-by-id/${specificationId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/query+json",
      "x-ms-documentdb-isquery": "True",
    },
  });
}

export async function getAdditionalCalculationsForSpecificationService(
  calculationSearchRequestViewModel: CalculationSearchRequestViewModel
): Promise<AxiosResponse<CalculationSearchResultResponse>> {
  return axios("/api/calculations/getcalculationsforspecification", {
    method: "POST",
    headers: {
      "Content-Type": "application/query+json",
      "x-ms-documentdb-isquery": "True",
    },
    data: {
      specificationId: calculationSearchRequestViewModel.specificationId,
      calculationType: calculationSearchRequestViewModel.calculationType,
      status: calculationSearchRequestViewModel.status,
      pageNumber: calculationSearchRequestViewModel.pageNumber,
      searchTerm: calculationSearchRequestViewModel.searchTerm,
      orderBy: calculationSearchRequestViewModel.orderBy,
    },
  });
}

export async function getFundingStreamIdsWithSpecsService(): Promise<AxiosResponse<string[]>> {
  return axios(`${baseURL}/fundingstream-id-for-specifications`, {
    method: "GET",
    headers: { 
      "Content-Type": "application/query+json",
      "x-ms-documentdb-isquery": "True"},
  });
}

export async function getFundingPeriodsByFundingStreamIdService(fundingStreamId: string) {
  return axios.request<FundingPeriod[]>({
    url: `/api/policy/fundingPeriods/${fundingStreamId}`,
    method: "GET",
    headers: { 
      "Content-Type": "application/query+json",
      "x-ms-documentdb-isquery": "True"},
  });
}

export async function getSpecificationsByFundingPeriodAndStreamIdService(
  fundingStreamId: string,
  fundingPeriodId: string
): Promise<AxiosResponse<Specification[]>> {
  return axios(
    `${baseURL}/specifications-by-fundingperiod-and-fundingstream/${fundingPeriodId}/${fundingStreamId}`,
    {
      method: "GET",
      headers: { 
      "Content-Type": "application/query+json",
      "x-ms-documentdb-isquery": "True"},
    }
  );
}

export async function getSpecificationsWithResultsService(fundingStreamId: string, fundingPeriodId: string) {
  return axios.request<SpecificationSummary[]>({
    url: `${baseURL}/specifications-by-fundingperiod-and-fundingstream/${fundingPeriodId}/${fundingStreamId}/with-results`,
    method: "GET",
    headers: { 
      "Content-Type": "application/query+json",
      "x-ms-documentdb-isquery": "True"},
  });
}

export async function getAllSpecificationsService(
  searchRequest: SpecificationSearchRequestViewModel
): Promise<AxiosResponse<SpecificationListResults>> {
  const queryString = require("query-string");
  const stringSearchRequest = queryString.stringify(searchRequest);

  return axios(`${baseURL}/get-all-specifications/?${stringSearchRequest}`, {
    method: "GET",
    headers: { 
      "Content-Type": "application/query+json",
      "x-ms-documentdb-isquery": "True"},
  });
}

export async function approveSpecification(specificationId: string): Promise<AxiosResponse<PublishStatus>> {
  return axios(`${baseURL}/${specificationId}/status`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/query+json",
      "x-ms-documentdb-isquery": "True"},
    data: { publishStatus: PublishStatus.Approved },
  });
}

export async function createSpecificationService(
  createSpecificationViewModel: CreateSpecificationModel
): Promise<AxiosResponse<SpecificationSummary>> {
  return axios(`${baseURL}/create`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/query+json",
      "x-ms-documentdb-isquery": "True"},
    data: createSpecificationViewModel,
  });
}

export async function updateSpecificationService(
  updateSpecificationViewModel: UpdateSpecificationModel,
  specificationId: string
) {
  return axios(`${baseURL}/update/${specificationId}`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/query+json",
      "x-ms-documentdb-isquery": "True"},
    data: updateSpecificationViewModel,
  });
}

export async function getDownloadableReportsService(
  specificationId: string,
  fundingPeriodId = ""
): Promise<AxiosResponse<ReportMetadataViewModel[]>> {
  return axios(`${baseURL}/${specificationId}/get-report-metadata/${fundingPeriodId}`, {
    method: "GET",
    headers: { 
      "Content-Type": "application/query+json",
      "x-ms-documentdb-isquery": "True"},
  });
}

export async function getProfileVariationPointersService(
  specificationId: string
): Promise<AxiosResponse<FundingLineProfileVariationPointer[]>> {
  return axios(`${baseURL}/${specificationId}/profile-variation-pointers`, {
    method: "GET",
    headers: { 
      "Content-Type": "application/query+json",
      "x-ms-documentdb-isquery": "True"},
  });
}

export async function setProfileVariationPointersService(
  specificationId: string,
  profileVariationPointer: ProfileVariationPointer[]
) {
  return axios(`${baseURL}/${specificationId}/profile-variation-pointers`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/query+json",
      "x-ms-documentdb-isquery": "True"},
    data: profileVariationPointer,
  });
}

export async function mergeProfileVariationPointersService(
  specificationId: string,
  profileVariationPointer: ProfileVariationPointer[]
) {
  return axios(`${baseURL}/${specificationId}/profile-variation-pointers`, {
    method: "PATCH",
    headers: { 
      "Content-Type": "application/query+json",
      "x-ms-documentdb-isquery": "True"},
    data: profileVariationPointer,
  });
}

export async function getSpecificationsSelectedForFundingService(): Promise<
  AxiosResponse<FundingStreamWithSpecificationSelectedForFunding[]>
> {
  return axios("/api/specs/funding-selections", {
    method: "GET",
    headers: { 
      "Content-Type": "application/query+json",
      "x-ms-documentdb-isquery": "True"},
  });
}

export async function getSpecificationsSelectedForFundingByPeriodAndStreamService(
  fundingPeriodId: string,
  fundingStreamId: string
): Promise<AxiosResponse<Specification[]>> {
  return axios(
    `${baseURL}/selected-specifications-by-fundingperiod-and-fundingstream/${fundingPeriodId}/${fundingStreamId}`,
    {
      method: "GET",
      headers: { 
      "Content-Type": "application/query+json",
      "x-ms-documentdb-isquery": "True"},
    }
  );
}
