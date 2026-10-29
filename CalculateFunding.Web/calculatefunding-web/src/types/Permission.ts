export enum Permission {
  CanAdministerFundingStream = "Grant and remove permissions to users of a funding stream",
  CanCreateSpecification = "Create a specification for the funding stream",
  CanEditSpecification = "Edit a specification for the funding stream",
  CanApproveSpecification = "Approve a specification for the funding stream",
  CanEditCalculations = "Edit calculations within a specification for the funding stream",
  CanMapDatasets = "Map data source files to datasets within a specification for the funding stream",
  CanChooseFunding = "Choose an approved specification for the funding stream so that funding allocation values are generated and can be approved and released",
  CanRefreshFunding = "Refresh the funding allocation values for a specification for the funding stream that has been chosen for funding",
  CanApproveFunding = "Approve funding allocation values for a specification for the funding stream that has been chosen for funding",
  CanReleaseFunding = "Can release funding",
  CanReleaseFundingForStatement = "Release funding allocation values to the service that manages statements for providers",
  CanReleaseFundingForPaymentOrContract = "Release funding allocation values to the services that manage contracts or payments for providers",
  CanCreateTemplates = "Create templates for the funding stream",
  CanEditTemplates = "Edit templates for the funding stream",
  CanApproveTemplates = "Publish templates for the funding stream",
  CanCreateProfilePattern = "Create profile patterns for funding lines within the funding stream",
  CanEditProfilePattern = "Edit profile patterns for funding lines within the funding stream",
  CanAssignProfilePattern = "Assign profile patterns for funding lines within the funding stream",
  CanApplyCustomProfilePattern = "Apply custom profile patterns for funding lines within the funding stream",
  CanApproveCalculations = "Approve calculations edited by another user", // only if user is not the last editor
  CanApproveAnyCalculations = "Approve any calculations at once", // even if user is the last editor
  CanApproveAllCalculations = "Approve all calculations at once", // only as a batch of all calcs
  CanRefreshPublishedQa = "Push CFS data into SQL for QA",
  CanUploadDataSourceFiles = "Upload or update data source files for a data schema belonging to the funding stream",
}

export const PermissionsCategories: { [key: string]: Permission[] } = {
  "Administration": [Permission.CanAdministerFundingStream],
  "Calculations": [
    Permission.CanApproveAllCalculations,
    Permission.CanApproveAnyCalculations,
    Permission.CanApproveCalculations,
    Permission.CanEditCalculations,
  ],
  "Data": [
    Permission.CanMapDatasets,
    Permission.CanRefreshPublishedQa,
    Permission.CanUploadDataSourceFiles,
  ],
  "Funding": [
    Permission.CanApproveFunding,
    Permission.CanChooseFunding,
    Permission.CanRefreshFunding,
    Permission.CanReleaseFundingForStatement,
    Permission.CanReleaseFundingForPaymentOrContract
  ],
  "Profiles": [
    Permission.CanApplyCustomProfilePattern,
    Permission.CanAssignProfilePattern,
    Permission.CanCreateProfilePattern,
    Permission.CanEditProfilePattern,
  ],
  "Specifications": [
    Permission.CanApproveSpecification,
    Permission.CanCreateSpecification,
    Permission.CanEditSpecification,
  ],
  "Templates": [
    Permission.CanApproveTemplates,
    Permission.CanCreateTemplates,
    Permission.CanEditTemplates,
  ],
};
