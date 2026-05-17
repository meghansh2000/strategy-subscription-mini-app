using StrategySubscription.Api.DTOs;

namespace StrategySubscription.Api.Subscriptions
{
    public interface ISubscriptionService
    {
        Task<(bool Success, string? ErrorMessage, int StatusCode, SubscriptionResponseDto? Data)>
            CreateSubscriptionAsync(
                int userId,
                CreateSubscriptionDto request);

        Task<List<UserSubscriptionDto>>GetUserSubscriptionsAsync(int userId);

        Task<(bool Success, string? ErrorMessage, int StatusCode)>UpdateSubscriptionStatusAsync( int subscriptionId,UpdateSubscriptionStatusDto request);
    }
}
