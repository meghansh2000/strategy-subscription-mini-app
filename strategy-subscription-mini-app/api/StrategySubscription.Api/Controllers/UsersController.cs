using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StrategySubscription.Api.Subscriptions;

namespace StrategySubscription.Api.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UsersController : ControllerBase
    {
        private readonly ISubscriptionService _subscriptionService;

        public UsersController(ISubscriptionService subscriptionService)
        {
            _subscriptionService = subscriptionService;
        }

        [HttpPost("{userId}/subscriptions")]
        public async Task<IActionResult> CreateSubscription(int userId,[FromBody] CreateSubscriptionDto request)
        {
            var result = await _subscriptionService
                .CreateSubscriptionAsync(userId, request);

            if (!result.Success)
            {
                return StatusCode(result.StatusCode, new
                {
                    message = result.ErrorMessage
                });
            }

            return StatusCode(result.StatusCode, result.Data);
        }

        [HttpGet("{userId}/subscriptions")]
        public async Task<IActionResult> GetUserSubscriptions(int userId)
        {
            var subscriptions = await _subscriptionService
                .GetUserSubscriptionsAsync(userId);

            return Ok(subscriptions);
        }
    }
}
