export enum FundingActionType {
  Refresh = "Refresh",
  Approve = "Approve",
  Release = "Release",
  Reprofile = "Reprofile"
}

export interface PublishedProviderFundingCount {
  count: number;
  paidProviderCount: number;
  indicativeProviderCount: number;
  providerTypes: ProviderTypeSubType[];
  providerTypesCount: number;
  localAuthorities: string[];
  localAuthoritiesCount: number;
  fundingStreamsFundings: PublishedProviderFundingStreamFunding[];
  totalFunding: number | null;
  paidProvidersTotalFunding: number | null;
  indicativeProviderTotalFunding: number | null;
}

export interface ProviderTypeSubType {
  providerType: string;
  providerSubType: string;
}

export interface PublishedProviderFundingStreamFunding {
  fundingStreamId: string;
  totalFunding: number | null;
}

export interface PublishedProviderReprofilingSummary{
  totalProviders: number;
  totalEligibleProviders: number;
  Url: string;
  ProviderSummaryResult: ProviderSummaryResult[];
}

export interface ProviderSummaryResult{
  UKPRN: string;
  name: string;
  openDate: string;
  isEligible: boolean;
  errorMessage: string;
}
