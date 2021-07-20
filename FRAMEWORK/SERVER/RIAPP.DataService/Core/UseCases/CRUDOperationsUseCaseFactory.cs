using System;

namespace RIAPP.DataService.Core
{

    public class CRUDOperationsUseCaseFactory<TService> : ICRUDOperationsUseCaseFactory<TService>
        where TService : BaseDomainService
    {
        private readonly Func<BaseDomainService, CRUDServiceMethods, ICRUDOperationsUseCase<TService>> _func;

        public CRUDOperationsUseCaseFactory(Func<BaseDomainService, CRUDServiceMethods, ICRUDOperationsUseCase<TService>> func)
        {
            _func = func;
        }

        public ICRUDOperationsUseCase Create(BaseDomainService service, CRUDServiceMethods serviceMethods)
        {
            return _func(service, serviceMethods);
        }

        public ICRUDOperationsUseCase<TService> Create(TService service, CRUDServiceMethods serviceMethods)
        {
            return _func(service, serviceMethods);
        }
    }
}
