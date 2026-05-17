namespace StrategySubscription.Api.Entities
{
    public class Subscription
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public int StrategyId { get; set; }

        public DateTime SubscribedAt { get; set; }

        public string Status { get; set; } = string.Empty;

        public decimal AllocatedCapital { get; set; }

        public User User { get; set; } = null!;

        public Strategy Strategy { get; set; } = null!;
    }
}
