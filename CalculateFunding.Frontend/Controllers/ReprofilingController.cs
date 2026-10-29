using CalculateFunding.Common.ApiClient.Graph.Models;
using CalculateFunding.Common.ApiClient.Models;
using CalculateFunding.Common.ApiClient.Publishing;
using CalculateFunding.Common.ApiClient.Publishing.Models;
using CalculateFunding.Common.ApiClient.Publishing.Models.Reprofiling;
using CalculateFunding.Common.Identity.Authorization.Models;
using CalculateFunding.Common.Utility;
using CalculateFunding.Frontend.Helpers;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;

namespace CalculateFunding.Frontend.Controllers
{
    public class ReprofilingController : Controller
    {

        private readonly IPublishingApiClient _publishingApiClient;
        private readonly IAuthorizationHelper _authorizationHelper;

        public ReprofilingController(IPublishingApiClient publishingApiClient, IAuthorizationHelper authorizationHelper)
        {
            Guard.ArgumentNotNull(publishingApiClient, nameof(publishingApiClient));
            Guard.ArgumentNotNull(authorizationHelper, nameof(authorizationHelper));

            _publishingApiClient = publishingApiClient;
            _authorizationHelper = authorizationHelper;
        }

        [HttpPost("api/specs/{specificationId}/summary-for-reprofiling-on-demand")]
        public async Task<IActionResult> GetProviderBatchForReprofiling([FromBody] PublishedProviderIdsRequest providers, [FromRoute] string specificationId)
        {
            if (specificationId.IsNullOrEmpty())
            {
                ModelState.AddModelError(nameof(specificationId), "Missing " + nameof(specificationId));
            }
            if (providers.PublishedProviderIds.IsNullOrEmpty())
            {
                ModelState.AddModelError(nameof(providers.PublishedProviderIds), "Missing " + nameof(providers.PublishedProviderIds));
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (!await _authorizationHelper.DoesUserHavePermission(
                User,
                specificationId,
                SpecificationActionTypes.CanRefreshFunding))
            {
                return new ForbidResult();
            }

            ApiResponse<ReprofilingSummaryResult> response = await _publishingApiClient.GetProviderBatchForReprofilingSummary(providers, specificationId);

            return response.Handle(nameof(ReprofilingController),
                onSuccess: x => Ok(x.Content));
        }


        [HttpPost("api/specs/{specificationId}/reprofilingondemand")]
        public async Task<IActionResult> ReProfilingOnDemand([FromBody] PublishedProviderIdsRequest publishedProviderIdsRequest, [FromRoute] string specificationId)
        {
            if (specificationId.IsNullOrEmpty())
            {
                ModelState.AddModelError(nameof(specificationId), "Missing " + nameof(specificationId));
            }

            if (publishedProviderIdsRequest.PublishedProviderIds.IsNullOrEmpty())
            {
                ModelState.AddModelError(nameof(publishedProviderIdsRequest.PublishedProviderIds), "Missing " + nameof(publishedProviderIdsRequest.PublishedProviderIds));
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            ValidatedApiResponse<JobCreationResponse> response = await _publishingApiClient.ReProfilingOnDemand(specificationId, publishedProviderIdsRequest);

            return response.Handle(nameof(Specification),
                onSuccess: x => Ok(x.Content));
        }
    }
}
