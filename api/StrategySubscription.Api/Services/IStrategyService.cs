using StrategySubscription.Api.DTOs;

namespace StrategySubscription.Api.Services;

public interface IStrategyService
{
    Task<List<StrategyResponseDto>> GetStrategiesAsync(
        string? category,
        string? riskLevel
    );

    Task<StrategyResponseDto?> GetStrategyByIdAsync(int id);
}