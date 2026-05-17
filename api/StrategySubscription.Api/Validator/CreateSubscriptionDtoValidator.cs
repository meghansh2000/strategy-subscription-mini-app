using FluentValidation;
using StrategySubscription.Api.Subscriptions;

namespace StrategySubscription.Api.Validator
{
    public class CreateSubscriptionDtoValidator
     : AbstractValidator<CreateSubscriptionDto>
    {
        public CreateSubscriptionDtoValidator()
        {
            RuleFor(x => x.StrategyId)
                .GreaterThan(0);

            RuleFor(x => x.AllocatedCapital)
                .GreaterThan(0)
                .WithMessage("Allocated capital must be greater than 0.");
        }
    }
}
