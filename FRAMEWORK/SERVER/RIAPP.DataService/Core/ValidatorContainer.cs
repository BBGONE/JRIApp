using RIAPP.DataService.Core.Config;
using System;

namespace RIAPP.DataService.Core
{
    public class ValidatorContainer<TService> : IValidatorContainer<TService>
        where TService : BaseDomainService
    {
        private readonly IServiceContainer<TService> _serviceContainer;
        private readonly IValidatorRegister _validatorRegister;

        public ValidatorContainer(IServiceContainer<TService> serviceContainer,
            IValidatorRegister validatorRegister)
        {
            _serviceContainer = serviceContainer ?? throw new ArgumentNullException(nameof(serviceContainer));
            _validatorRegister = validatorRegister ?? throw new ArgumentNullException(nameof(validatorRegister));
        }

        public IValidator GetValidator(Type modelType)
        {
            if (_validatorRegister.TryGetDescriptor(modelType, out ServiceTypeDescriptor descriptor))
            {
                return (IValidator)_serviceContainer.GetService(descriptor.ServiceType);
            }

            return null;
        }

        public IValidator<TModel> GetValidator<TModel>()
        {
            var res = GetValidator(typeof(TModel));
            return (IValidator<TModel>)res;
        }
    }
}