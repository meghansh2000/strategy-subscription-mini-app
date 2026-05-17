namespace StrategySubscription.Api.Subscriptions
{
    public class CreateSubscriptionDto
    {
        public int StrategyId { get; set; }

        public decimal AllocatedCapital { get; set; }
    }
}
