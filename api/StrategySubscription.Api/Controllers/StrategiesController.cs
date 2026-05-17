using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StrategySubscription.Api.Services;

namespace StrategySubscription.Api.Controllers
{
    [ApiController]
    [Route("api/strategies")]
    public class StrategiesController : ControllerBase
    {
        private readonly IStrategyService _strategyService;

        public StrategiesController(IStrategyService strategyService)
        {
            _strategyService = strategyService;
        }

        [HttpGet]
        public async Task<IActionResult> GetStrategies(
            [FromQuery] string? category,
            [FromQuery] string? riskLevel)
        {
            var strategies = await _strategyService
                .GetStrategiesAsync(category, riskLevel);

            return Ok(strategies);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetStrategyById(int id)
        {
            var strategy = await _strategyService
                .GetStrategyByIdAsync(id);

            if (strategy == null)
            {
                return NotFound(new
                {
                    message = "Strategy not found."
                });
            }

            return Ok(strategy);
        }
    }
}
