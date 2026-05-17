namespace StrategySubscription.Api.Entities
{
    public class Strategy
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Category { get; set; } = string.Empty;

        public string RiskLevel { get; set; } = string.Empty;

        public decimal MinCapital { get; set; }

        public decimal ExpectedReturnPct { get; set; }

        public bool IsActive { get; set; }

        public DateTime CreatedAt { get; set; }

        public ICollection<Subscription> Subscriptions { get; set; } = new List<Subscription>();
    }
}
