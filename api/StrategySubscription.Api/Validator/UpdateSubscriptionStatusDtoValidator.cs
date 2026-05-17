using FluentValidation;
using StrategySubscription.Api.DTOs;

namespace StrategySubscription.Api.Validator
{
    public class UpdateSubscriptionStatusDtoValidator
     : AbstractValidator<UpdateSubscriptionStatusDto>
    {
        public UpdateSubscriptionStatusDtoValidator()
        {
            RuleFor(x => x.Status)
                .NotEmpty()
                .Must(status =>
                    status == "Active" ||
                    status == "Paused" ||
                    status == "Cancelled")
                .WithMessage(
                    "Status must be Active, Paused, or Cancelled.");
        }
    }
}
