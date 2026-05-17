using Microsoft.EntityFrameworkCore;
using StrategySubscription.Api.Data;
using StrategySubscription.Api.DTOs;

namespace StrategySubscription.Api.Services;

public class StrategyService : IStrategyService
{
    private readonly ApplicationDbContext _context;

    public StrategyService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<StrategyResponseDto>> GetStrategiesAsync(
        string? category,
        string? riskLevel)
    {
        var query = _context.Strategies
            .Where(s => s.IsActive)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(category))
        {
            query = query.Where(s => s.Category == category);
        }

        if (!string.IsNullOrWhiteSpace(riskLevel))
        {
            query = query.Where(s => s.RiskLevel == riskLevel);
        }

        return await query
            .Select(s => new StrategyResponseDto
            {
                Id = s.Id,
                Name = s.Name,
                Category = s.Category,
                RiskLevel = s.RiskLevel,
                MinCapital = s.MinCapital,
                ExpectedReturnPct = s.ExpectedReturnPct
            })
            .ToListAsync();
    }

    public async Task<StrategyResponseDto?> GetStrategyByIdAsync(int id)
    {
        return await _context.Strategies
            .Where(s => s.Id == id && s.IsActive)
            .Select(s => new StrategyResponseDto
            {
                Id = s.Id,
                Name = s.Name,
                Category = s.Category,
                RiskLevel = s.RiskLevel,
                MinCapital = s.MinCapital,
                ExpectedReturnPct = s.ExpectedReturnPct
            })
            .FirstOrDefaultAsync();
    }
}