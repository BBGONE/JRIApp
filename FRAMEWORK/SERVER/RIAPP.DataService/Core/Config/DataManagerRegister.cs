using System;
using System.Collections.Concurrent;
using System.Collections.Generic;

namespace RIAPP.DataService.Core.Config
{
    public class DataManagerRegister : IDataManagerRegister
    {
        private readonly ConcurrentDictionary<Type, ServiceTypeDescriptor> _managers;

        public DataManagerRegister()
        {
            _managers = new ConcurrentDictionary<Type, ServiceTypeDescriptor>();
        }

        public bool isDataManagerRegistered(Type modelType)
        {
            return _managers.TryGetValue(modelType, out ServiceTypeDescriptor descriptor);
        }

        public bool TryGetDescriptor(Type modelType, out ServiceTypeDescriptor descriptor)
        {
            descriptor = null;
            return _managers.TryGetValue(modelType, out descriptor);
        }

        public void RegisterDataManager(Type ModelType, Type DataManagerType)
        {
            Type unboundType = typeof(IDataManager<>);
            Type[] argsType = { ModelType };
            Type serviceType = unboundType.MakeGenericType(argsType);

            ServiceTypeDescriptor descriptor = new ServiceTypeDescriptor
            {
                ImplementationType = DataManagerType,
                ServiceType = serviceType,
                ModelType = ModelType
            };
            _managers.TryAdd(ModelType, descriptor);
        }

        public void RegisterDataManager<TModel, TDataManager>()
            where TModel : class
            where TDataManager : IDataManager<TModel>
        {
            ServiceTypeDescriptor descriptor = new ServiceTypeDescriptor
            {
                ImplementationType = typeof(TDataManager),
                ServiceType = typeof(IDataManager<TModel>),
                ModelType = typeof(TModel)
            };
            _managers.TryAdd(typeof(TModel), descriptor);
        }

        public IEnumerable<ServiceTypeDescriptor> Descriptors => _managers.Values;
    }
}