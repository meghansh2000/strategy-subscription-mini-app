using Microsoft.EntityFrameworkCore;
using StrategySubscription.Api.Data;
using StrategySubscription.Api.DTOs;
using StrategySubscription.Api.Entities;

namespace StrategySubscription.Api.Subscriptions
{
    public class SubscriptionService : ISubscriptionService
    {
        private readonly ApplicationDbContext _context;

        public SubscriptionService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<(bool Success, string? ErrorMessage, int StatusCode, SubscriptionResponseDto? Data)>CreateSubscriptionAsync(int userId,CreateSubscriptionDto request)
        {

           // throw new Exception("Test middleware exception");  // for testing middleware global exception handeling (logging)

            using var transaction = await _context.Database.BeginTransactionAsync();

            // CHECK USER HERE
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return (false, "User not found in db", 404, null);
            }

            // CHECKING STRATEGY HERE
            var strategy = await _context.Strategies.FirstOrDefaultAsync(s =>s.Id == request.StrategyId && s.IsActive);

            if (strategy == null)
            {
                return (false, "Strategy not found.", 404, null);
            }

            // DUPLICATE ACTIVE SUBSCRIPTION CHECKING HERE
            var existingSubscription = await _context.Subscriptions.AnyAsync(s =>s.UserId == userId && s.StrategyId == request.StrategyId && s.Status == "Active");

            if (existingSubscription)
            {
                return (false,
                    "User already has an active subscription to this strategy.",
                    409,
                    null);
            }

            // MIN CAPITAL CHECKING HERE
            if (request.AllocatedCapital < strategy.MinCapital)
            {
                return (false,
                    $"Allocated capital must be at least {strategy.MinCapital}.",
                    422,
                    null);
            }

            // TOTAL ACTIVE ALLOCATION CHECK HERE
            var totalAllocatedCapital = await _context.Subscriptions.Where(s =>s.UserId == userId && s.Status == "Active").SumAsync(s => (decimal?)s.AllocatedCapital) ?? 0;

            // AVAILABLE CAPITAL CHECK
            if (totalAllocatedCapital + request.AllocatedCapital >
                user.AvailableCapital)
            {
                return (false,
                    "Allocated capital exceeds user's available capital.",
                    422,
                    null);
            }

            // CREATE SUBSCRIPTION 
            var subscription = new Subscription
            {
                UserId = userId,
                StrategyId = request.StrategyId,
                AllocatedCapital = request.AllocatedCapital,
                Status = "Active",
                SubscribedAt = DateTime.UtcNow
            };

            _context.Subscriptions.Add(subscription);

            await _context.SaveChangesAsync();

            await transaction.CommitAsync();

            return (
                true,
                null,
                201,
                new SubscriptionResponseDto
                {
                    Id = subscription.Id,
                    StrategyName = strategy.Name,
                    Status = subscription.Status,
                    AllocatedCapital = subscription.AllocatedCapital,
                    SubscribedAt = subscription.SubscribedAt
                });
        }



        public async Task<List<UserSubscriptionDto>> GetUserSubscriptionsAsync(int userId)
        {
            return await _context.Subscriptions.Include(s => s.Strategy).Where(s => s.UserId == userId).Select(s => new UserSubscriptionDto
                {
                    Id = s.Id,
                    StrategyName = s.Strategy.Name,
                    Category = s.Strategy.Category,
                    RiskLevel = s.Strategy.RiskLevel,
                    AllocatedCapital = s.AllocatedCapital,
                    Status = s.Status,
                    SubscribedAt = s.SubscribedAt
                })
                .ToListAsync();
        }


        public async Task<(bool Success, string? ErrorMessage, int StatusCode)> UpdateSubscriptionStatusAsync( int subscriptionId,
        UpdateSubscriptionStatusDto request)
        {
            var subscription = await _context.Subscriptions
                .FirstOrDefaultAsync(s => s.Id == subscriptionId);

            if (subscription == null)
            {
                return (false, "Subscription not found.", 404);
            }

            // PREVENT REACTIVATING CANCELLED SUBSCRIPTIONS
            if (subscription.Status == "Cancelled" && request.Status == "Active")
            {
                return (
                    false,
                    "Cancelled subscriptions cannot be reactivated.",
                    422);
            }

            subscription.Status = request.Status;

            await _context.SaveChangesAsync();

            return (true, null, 200);
        }
    }
}
