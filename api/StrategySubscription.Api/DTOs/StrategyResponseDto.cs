namespace StrategySubscription.Api.DTOs
{
    public class StrategyResponseDto
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Category { get; set; } = string.Empty;

        public string RiskLevel { get; set; } = string.Empty;

        public decimal MinCapital { get; set; }

        public decimal ExpectedReturnPct { get; set; }
    }
}
