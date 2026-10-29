using CalculateFunding.Common.ApiClient.Models;
using CalculateFunding.Common.ApiClient.Publishing;
using CalculateFunding.Common.ApiClient.Publishing.Models;
using CalculateFunding.Common.ApiClient.Publishing.Models.Reprofiling;
using CalculateFunding.Common.Identity.Authorization.Models;
using CalculateFunding.Frontend.Controllers;
using CalculateFunding.Frontend.Extensions;
using CalculateFunding.Frontend.Helpers;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;

namespace CalculateFunding.Frontend.UnitTests.Controllers
{
    [TestClass]
    public class ReprofilingControllerTests
    {
        private const string ValidSpecificationId = "A VALID SPECIFICATION ID";
        private PublishedProviderIdsRequest _publishedProviderids;

        private IAuthorizationHelper _authorizationHelper;
        private IPublishingApiClient _publishingApiClient;
        private ValidatedApiResponse<ReprofilingSummaryResult> _validatedApiResponse;
        private ValidatedApiResponse<JobCreationResponse> _jobCreationResponse;

        private ReprofilingController _reprofilingController;

        [TestInitialize]
        public void Setup()
        {
            _authorizationHelper = Substitute.For<IAuthorizationHelper>();
            _publishingApiClient = Substitute.For<IPublishingApiClient>();
            _jobCreationResponse = new ValidatedApiResponse<JobCreationResponse>(HttpStatusCode.OK,
             new JobCreationResponse()
            {
                JobId = "jobid"
            });
            _validatedApiResponse =
                new ValidatedApiResponse<ReprofilingSummaryResult>(HttpStatusCode.OK,
                    new ReprofilingSummaryResult
                    {
                        TotalProviders = 1,
                        TotalEligibleProviders = 1,
                        Url = "Some valid url",
                        ProviderSummaryResult = new List<ProviderSummaryResult> { new ProviderSummaryResult
                        {
                            UKPRN = "1000345",
                            IsEligible = true,
                        } }
                    });
            _publishedProviderids = new PublishedProviderIdsRequest()
            {
                PublishedProviderIds = new List<string>()
                {
                    "GAG-AC-2223-10084305",
                    "GAG-AC-2223-10084306"
                }
            };
            _reprofilingController =
                new ReprofilingController(_publishingApiClient, _authorizationHelper);
        }

        [TestMethod]
        public async Task Reprofiling_Returns_Forbid_Result_Given_User_Does_Not_Have_Refresh_Funding_Permission()
        {
            IActionResult result = await _reprofilingController.GetProviderBatchForReprofiling(_publishedProviderids, ValidSpecificationId);

            result.Should().BeAssignableTo<ForbidResult>();
        }


        [TestMethod]
        public async Task Reprofiling_Returns_OK_Result_Given_User_Has_Required_Permission()
        {
            SetupAuthorizedUser(SpecificationActionTypes.CanRefreshFunding);

            _publishingApiClient.GetProviderBatchForReprofilingSummary(_publishedProviderids, Arg.Any<string>()).Returns(_validatedApiResponse);

            IActionResult result = await _reprofilingController.GetProviderBatchForReprofiling(_publishedProviderids, ValidSpecificationId);

            result.Should().BeAssignableTo<OkObjectResult>();
        }

        [TestMethod]
        public async Task Reprofiling_Returns_BadRequestForBadRequestApiResponses()
        {
            SetupAuthorizedUser(SpecificationActionTypes.CanRefreshFunding);

            _validatedApiResponse = new ValidatedApiResponse<ReprofilingSummaryResult>(HttpStatusCode.BadRequest);

            _publishingApiClient.GetProviderBatchForReprofilingSummary(_publishedProviderids, Arg.Any<string>()).Returns(_validatedApiResponse);

            IActionResult result = await _reprofilingController.GetProviderBatchForReprofiling(_publishedProviderids, string.Empty);

            result
                .Should()
                .BeOfType<BadRequestObjectResult>();
        }

        [TestMethod]
        public async Task ValidateSpecificationForReprofiling_ReturnsInternalServerResult_ForNonSuccessApiResponses()
        {
            SetupAuthorizedUser(SpecificationActionTypes.CanRefreshFunding);

            ValidatedApiResponse<ReprofilingSummaryResult> apiResponse
                = new ValidatedApiResponse<ReprofilingSummaryResult>(HttpStatusCode.InternalServerError, null);

            _publishingApiClient.GetProviderBatchForReprofilingSummary(_publishedProviderids, Arg.Any<string>()).Returns(apiResponse);

            IActionResult result = await _reprofilingController.GetProviderBatchForReprofiling(_publishedProviderids, ValidSpecificationId);

            result
                .Should()
                .BeOfType<InternalServerErrorResult>();
        }
        [TestMethod]
        public async Task ReProfilingOnDemand_Returns_BadRequestForBadRequestApiResponses()
        {
            _jobCreationResponse = new ValidatedApiResponse<JobCreationResponse>(HttpStatusCode.BadRequest);

            _publishingApiClient.ReProfilingOnDemand(Arg.Any<string>(), _publishedProviderids).Returns(_jobCreationResponse);

            IActionResult result = await _reprofilingController.ReProfilingOnDemand(_publishedProviderids, string.Empty);

            result
                .Should()
                .BeOfType<BadRequestObjectResult>();
        }

        [TestMethod]
        public async Task ValidateSpecificationForReProfilingOnDemand_ReturnsInternalServerResult_ForNonSuccessApiResponses()
        {
            SetupAuthorizedUser(SpecificationActionTypes.CanRefreshFunding);

            ValidatedApiResponse<JobCreationResponse> apiResponse
                = new ValidatedApiResponse<JobCreationResponse>(HttpStatusCode.InternalServerError, null);

            IActionResult result = await _reprofilingController.GetProviderBatchForReprofiling(_publishedProviderids, ValidSpecificationId);

            result
                .Should()
                .BeOfType<InternalServerErrorResult>();
        }
        private void SetupAuthorizedUser(SpecificationActionTypes specificationActionType)
        {
            _authorizationHelper.DoesUserHavePermission(
                    _reprofilingController.User,
                    Arg.Any<string>(),
                    specificationActionType)
                .Returns(true);
        }
    }
}
