namespace StrategySubscription.Api.Subscriptions
{
    public class SubscriptionResponseDto
    {
        public int Id { get; set; }

        public string StrategyName { get; set; } = string.Empty;

        public string Status { get; set; } = string.Empty;

        public decimal AllocatedCapital { get; set; }

        public DateTime SubscribedAt { get; set; }
    }
}
