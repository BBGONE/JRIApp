using System;

namespace RIAPP.DataService.Core
{
    public class RefreshOperationsUseCaseFactory<TService> : IRefreshOperationsUseCaseFactory<TService>
        where TService : BaseDomainService
    {
        private readonly Func<BaseDomainService, Func<Exception, string>, IRefreshOperationsUseCase<TService>> _func;

        public RefreshOperationsUseCaseFactory(Func<BaseDomainService, Func<Exception, string>, IRefreshOperationsUseCase<TService>> func)
        {
            _func = func;
        }

        public IRefreshOperationsUseCase Create(BaseDomainService service, Func<Exception, string> onError)
        {
            return _func(service, onError);
        }

        public IRefreshOperationsUseCase<TService> Create(TService service, Func<Exception, string> onError)
        {
            return _func(service, onError);
        }
    }
}
