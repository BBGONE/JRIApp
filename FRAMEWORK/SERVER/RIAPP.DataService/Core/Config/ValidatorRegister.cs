using System;
using System.Collections.Concurrent;
using System.Collections.Generic;

namespace RIAPP.DataService.Core.Config
{
    public class ValidatorRegister : IValidatorRegister
    {
        private readonly ConcurrentDictionary<Type, ServiceTypeDescriptor> _validators;

        public ValidatorRegister()
        {
            _validators = new ConcurrentDictionary<Type, ServiceTypeDescriptor>();
        }

        public bool TryGetDescriptor(Type modelType, out ServiceTypeDescriptor descriptor)
        {
            descriptor = null;
            return _validators.TryGetValue(modelType, out descriptor);
        }

        public void RegisterValidator(Type ModelType, Type ValidatorType)
        {
            Type unboundType = typeof(IValidator<>);
            Type[] argsType = { ModelType };
            Type serviceType = unboundType.MakeGenericType(argsType);

            ServiceTypeDescriptor descriptor = new ServiceTypeDescriptor
            {
                ImplementationType = ValidatorType,
                ServiceType = serviceType,
                ModelType = ModelType
            };

            _validators.TryAdd(ModelType, descriptor);
        }

        public void RegisterValidator<TModel, TValidator>()
            where TModel : class
            where TValidator : IValidator<TModel>
        {
            ServiceTypeDescriptor descriptor = new ServiceTypeDescriptor
            {
                ImplementationType = typeof(TValidator),
                ServiceType = typeof(IValidator<TModel>),
                ModelType = typeof(TModel)
            };

            _validators.TryAdd(typeof(TModel), descriptor);
        }

        public IEnumerable<ServiceTypeDescriptor> Descriptors => _validators.Values;
    }
}