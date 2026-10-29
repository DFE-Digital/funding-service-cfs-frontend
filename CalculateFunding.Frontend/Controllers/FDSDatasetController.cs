using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using CalculateFunding.Common.ApiClient.DataSets;
using CalculateFunding.Common.ApiClient.DataSets.Models;
using CalculateFunding.Common.ApiClient.FDS;
using CalculateFunding.Common.ApiClient.FDS.Models;
using CalculateFunding.Common.ApiClient.Models;
using CalculateFunding.Common.ApiClient.Policies;
using CalculateFunding.Common.Utility;
using CalculateFunding.Frontend.Extensions;
using CalculateFunding.Frontend.Helpers;
using CalculateFunding.Common.Helpers;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using DatasetDefinitionByFundingStream = CalculateFunding.Common.ApiClient.FDS.Models.DatasetDefinitionByFundingStream;

namespace CalculateFunding.Frontend.Controllers
{
    public class FDSDatasetController : Controller
    {
        private readonly IFDSApiClient _fdsApiClient;
        private readonly IAuthorizationHelper _authorizationHelper;
        private readonly ILogger _logger;
        private readonly IDatasetsApiClient _datasetApiClient;
        private IPoliciesApiClient _policiesApiClient;

        public FDSDatasetController(IFDSApiClient fdsApiClient, ILogger logger, IAuthorizationHelper authorizationHelper,
            IDatasetsApiClient datasetApiClient, IPoliciesApiClient policiesApiClient)
        {
            Guard.ArgumentNotNull(fdsApiClient, nameof(fdsApiClient));
            Guard.ArgumentNotNull(logger, nameof(logger));
            Guard.ArgumentNotNull(authorizationHelper, nameof(authorizationHelper));
            Guard.ArgumentNotNull(datasetApiClient, nameof(_datasetApiClient));
            Guard.ArgumentNotNull(policiesApiClient, nameof(policiesApiClient));

            _fdsApiClient = fdsApiClient;
            _logger = logger;
            _authorizationHelper = authorizationHelper;
            _datasetApiClient = datasetApiClient;
            _policiesApiClient = policiesApiClient;
        }

        [HttpGet]
        [Route("api/fds/datasets/get-datasets-for-fundingstream/{fundingStreamId}/{fundingPeriodId}")]
        public async Task<IActionResult> GetDatasetsForFundingStream(string fundingStreamId, string fundingPeriodId)
        {
            Guard.ArgumentNotNull(fundingStreamId, nameof(fundingStreamId));
            Guard.ArgumentNotNull(fundingPeriodId, nameof(fundingPeriodId));

            ApiResponse<IEnumerable<DatasetDefinitionByFundingStream>> result =
                await _fdsApiClient.GetFDSDataSchema(fundingStreamId, fundingPeriodId);

            List<DatasetDefinitionByFundingStream> fdsDataSchemaContents = result.Content.ToList();

            if (AdultStream.IsExists(fundingStreamId))
            {
                const string MultiYearSchemaName = "Master Allocation Sheet";

                var fundingConfigurationResponse = await _policiesApiClient.GetFundingConfiguration(fundingStreamId, fundingPeriodId);
                if (fundingConfigurationResponse != null && fundingConfigurationResponse.Content.AdultNonApplicableSchemas != null)
                {
                    fdsDataSchemaContents = fdsDataSchemaContents.Where(_ => !fundingConfigurationResponse.Content.AdultNonApplicableSchemas.Contains(_.Name)).ToList();
                }
                //Do it only if the multiyear schema is not present in the avoided list.
                if (fdsDataSchemaContents.Where(_ => _.Name.Equals(MultiYearSchemaName)).Any())
                {
                    fdsDataSchemaContents.RemoveAll(item => item.Name == "Master Allocation Sheet");

                    // this for-loop will fetch last 3 years of data including current year in total 4 FDS data schema for a drop down while creating fds data for ALL only.
                    for (int i = 0; i < 4; i++)
                    {
                        string fundingPeriod = FormatStrings.GetPreviousFundingPeriod(fundingPeriodId, i);

                        ApiResponse<IEnumerable<DatasetDefinitionByFundingStream>> resultSchema =
                            await _fdsApiClient.GetFDSDataSchema(fundingStreamId, fundingPeriod);
                       
                        if (resultSchema != null && resultSchema.Content.Any())
                        {
                            UpdateFDSDataSchemaByYear(fundingStreamId, fundingPeriod, MultiYearSchemaName, fdsDataSchemaContents, resultSchema.Content);
                        }
                        else
                        {
                            _logger.Error($"No FDS data schemas exist for {MultiYearSchemaName} {fundingPeriod}");
                        }                        
                    }
                }
            }
            return result.Handle(nameof(DatasetDefinitionByFundingStream),
                onSuccess: x => Ok(fdsDataSchemaContents.OrderBy(_ => _.Name).ToList()),
                onNotFound: x => NotFound("No FDS data schemas exist for the selected funding stream"));
        }

        [HttpGet]
        [Route("api/fds/datasets/get-new-fds-dataschema-version")]
        public async Task<IActionResult> GetNewFdsDatasetSchemaVersion([FromQuery] string fundingStreamCode, [FromQuery] string fundingPeriodCode, [FromQuery] string datasetDefinitionName)
        {
            Guard.ArgumentNotNull(fundingPeriodCode, nameof(fundingPeriodCode));
            Guard.ArgumentNotNull(fundingStreamCode, nameof(fundingPeriodCode));
            Guard.ArgumentNotNull(datasetDefinitionName, nameof(datasetDefinitionName));

            ApiResponse<DatasetDefinitionViewModel> result = await _datasetApiClient.GetNewFDSDatasetSchemaVersion(fundingStreamCode, fundingPeriodCode, datasetDefinitionName);

            if (result.StatusCode == HttpStatusCode.PreconditionFailed)
            {
                _logger.Error(result.Message);
                return new PreconditionFailedResult(result.Message);
            }

            if (result.Content == null || result.StatusCode != HttpStatusCode.OK)
            {
                _logger.Error("Failed to find new FDS schema version");
                return new NotFoundResult();
            }

            DatasetDefinitionViewModel datasetDefinitionViewModel = new DatasetDefinitionViewModel
            {
                Id = result.Content.Id,
                Name = result.Content.Name.Replace("_FDS" + result.Content.Id, String.Empty),
                Description = result.Content.Description,
                Version = result.Content.Version,
                LastUpdatedBy = result.Content.LastUpdatedBy,
                LastUpdatedDt = result.Content.LastUpdatedDt,
                IsLatestVersion = result.Content.IsLatestVersion,
                Comment = result.Content.Comment
            };
            return new OkObjectResult(datasetDefinitionViewModel);
        }

        #region Private methods
        private async void UpdateFDSDataSchemaByYear(string fundingStreamId, string fundingPeriod, string schemaName, List<DatasetDefinitionByFundingStream> originalFDSDataSchemaContents, IEnumerable<DatasetDefinitionByFundingStream> previousFDSDataSchemaContents)
        {
            try
            {
                if (previousFDSDataSchemaContents != null && previousFDSDataSchemaContents.Any())
                {
                    var masData = previousFDSDataSchemaContents.Where(_ => _.Name.Equals(schemaName)).FirstOrDefault();
                    if (masData != null)
                    {
                        masData.Name = $"{schemaName} {fundingPeriod}";
                        originalFDSDataSchemaContents.Add(masData);
                    }
                }
            }
            catch(Exception e)
            {
                _logger.Error(e.Message);
            }           
        }
        #endregion
    }
}
