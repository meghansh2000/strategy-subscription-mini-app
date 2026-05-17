namespace StrategySubscription.Api.DTOs
{
    public class UserSubscriptionDto
    {
        public int Id { get; set; }

        public string StrategyName { get; set; } = string.Empty;

        public string Category { get; set; } = string.Empty;

        public string RiskLevel { get; set; } = string.Empty;

        public decimal AllocatedCapital { get; set; }

        public string Status { get; set; } = string.Empty;

        public DateTime SubscribedAt { get; set; }
    }
}
