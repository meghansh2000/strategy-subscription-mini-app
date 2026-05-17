using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StrategySubscription.Api.DTOs;
using StrategySubscription.Api.Subscriptions;

namespace StrategySubscription.Api.Controllers
{
    [ApiController]
    [Route("api/subscriptions")]
    public class SubscriptionsController : ControllerBase
    {
        private readonly ISubscriptionService _subscriptionService;

        public SubscriptionsController(
            ISubscriptionService subscriptionService)
        {
            _subscriptionService = subscriptionService;
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> UpdateSubscriptionStatus(int id, [FromBody] UpdateSubscriptionStatusDto request)
        {
            var result = await _subscriptionService
                .UpdateSubscriptionStatusAsync(id, request);

            if (!result.Success)
            {
                return StatusCode(result.StatusCode, new
                {
                    message = result.ErrorMessage
                });
            }

            return Ok(new
            {
                message = "Subscription status updated successfully."
            });
        }
    }
}
