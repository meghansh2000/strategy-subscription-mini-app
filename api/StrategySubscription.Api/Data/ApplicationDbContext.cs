using Microsoft.EntityFrameworkCore;
using StrategySubscription.Api.Entities;

namespace StrategySubscription.Api.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Strategy> Strategies => Set<Strategy>();

    public DbSet<User> Users => Set<User>();

    public DbSet<Subscription> Subscriptions => Set<Subscription>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // STRATEGIES TABLE
        modelBuilder.Entity<Strategy>(entity =>
        {
            entity.ToTable("strategies");

            entity.HasKey(e => e.Id);

            entity.Property(e => e.Id)
                .HasColumnName("id");

            entity.Property(e => e.Name)
                .HasColumnName("name");

            entity.Property(e => e.Category)
                .HasColumnName("category");

            entity.Property(e => e.RiskLevel)
                .HasColumnName("risk_level");

            entity.Property(e => e.MinCapital)
                .HasColumnName("min_capital");

            entity.Property(e => e.ExpectedReturnPct)
                .HasColumnName("expected_return_pct");

            entity.Property(e => e.IsActive)
                .HasColumnName("is_active");

            entity.Property(e => e.CreatedAt)
                .HasColumnName("created_at");
        });

        // USERS TABLE
        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("users");

            entity.HasKey(e => e.Id);

            entity.Property(e => e.Id)
                .HasColumnName("id");

            entity.Property(e => e.Name)
                .HasColumnName("name");

            entity.Property(e => e.Email)
                .HasColumnName("email");

            entity.Property(e => e.AvailableCapital)
                .HasColumnName("available_capital");

            entity.Property(e => e.CreatedAt)
                .HasColumnName("created_at");
        });

        // SUBSCRIPTIONS TABLE
        modelBuilder.Entity<Subscription>(entity =>
        {
            entity.ToTable("subscriptions");

            entity.HasKey(e => e.Id);

            entity.Property(e => e.Id)
                .HasColumnName("id");

            entity.Property(e => e.UserId)
                .HasColumnName("user_id");

            entity.Property(e => e.StrategyId)
                .HasColumnName("strategy_id");

            entity.Property(e => e.SubscribedAt)
                .HasColumnName("subscribed_at");

            entity.Property(e => e.Status)
                .HasColumnName("status");

            entity.Property(e => e.AllocatedCapital)
                .HasColumnName("allocated_capital");

            entity.HasOne(s => s.User)
                .WithMany(u => u.Subscriptions)
                .HasForeignKey(s => s.UserId);

            entity.HasOne(s => s.Strategy)
                .WithMany(st => st.Subscriptions)
                .HasForeignKey(s => s.StrategyId);
        });
    }
}