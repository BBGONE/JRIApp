using Microsoft.Extensions.DependencyInjection;
using RIAPP.DataService.Core.CodeGen;
using RIAPP.DataService.Core.Security;
using RIAPP.DataService.Utils;
using System;
using System.Collections.Generic;
using System.Threading;

namespace RIAPP.DataService.Core
{
    public class ServiceContainer<TService> : IServiceContainer<TService>, IDisposable
        where TService : BaseDomainService
    {
        private IDisposable _scope;
        private readonly IServiceProvider _provider;
        private readonly ISerializer _serializer;

        public ServiceContainer(IServiceProvider serviceProvider, ISerializer serializer)
        {
            _provider = serviceProvider ?? throw new ArgumentNullException(nameof(serviceProvider));
            _serializer = serializer ?? throw new ArgumentNullException(nameof(serializer));
            _scope = null;
        }

        private ServiceContainer(ServiceContainer<TService> serviceContainer, ISerializer serializer)
        {
            IServiceScopeFactory scopeFactory = serviceContainer.GetRequiredService<IServiceScopeFactory>();
            IServiceScope scope = scopeFactory.CreateScope();
            _provider = scope.ServiceProvider;
            _scope = scope;
            _serializer = serializer;
        }

        IServiceContainer IServiceContainer.CreateScope()
        {
            return this.CreateScope();
        }

        public IServiceContainer<TService> CreateScope()
        {
            return new ServiceContainer<TService>(this, _serializer);
        }

        public object GetService(Type serviceType)
        {
            return _provider.GetService(serviceType);
        }

        public T GetService<T>()
        {
            return _provider.GetService<T>();
        }

        public T GetRequiredService<T>()
        {
            return _provider.GetRequiredService<T>();
        }

        public IEnumerable<object> GetServices(Type serviceType)
        {
            return _provider.GetServices(serviceType);
        }

        public IEnumerable<T> GetServices<T>()
        {
            return _provider.GetServices<T>();
        }

        public IServiceProvider ServiceProvider => _provider;

        public ISerializer Serializer => _serializer;


        IServiceOperationsHelper IServiceContainer.ServiceHelper => this.GetServiceHelper();

        IDataHelper IServiceContainer.DataHelper => this.GetDataHelper();

        IValueConverter IServiceContainer.ValueConverter => this.GetValueConverter();

        IAuthorizer IServiceContainer.Authorizer => this.GetAuthorizer();

        ICodeGenFactory IServiceContainer.CodeGenFactory => this.GetCodeGenFactory();

        IDataManagerContainer IServiceContainer.DataManagerContainer => this.GetDataManagerContainer();

        IValidatorContainer IServiceContainer.ValidatorContainer => this.GetValidatorContainer();

        ICRUDOperationsUseCaseFactory IServiceContainer.CRUDOperationsUseCaseFactory => this.GetCRUDOperationsUseCaseFactory();

        IQueryOperationsUseCaseFactory IServiceContainer.QueryOperationsUseCaseFactory => this.GetQueryOperationsUseCaseFactory();

        IRefreshOperationsUseCaseFactory IServiceContainer.RefreshOperationsUseCaseFactory => this.GetRefreshOperationsUseCaseFactory();

        IInvokeOperationsUseCaseFactory IServiceContainer.InvokeOperationsUseCaseFactory => this.GetInvokeOperationsUseCaseFactory();

        public void Dispose()
        {
            IDisposable scope = Interlocked.Exchange(ref this._scope, null);
            scope?.Dispose();
        }
    }
}