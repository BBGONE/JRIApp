using System;

namespace RIAPP.DataService.Core
{
    public interface IRefreshOperationsUseCaseFactory
    {
        IRefreshOperationsUseCase Create(BaseDomainService service, Func<Exception, string> onError);
    }

    public interface IRefreshOperationsUseCaseFactory<TService> : IRefreshOperationsUseCaseFactory
        where TService : BaseDomainService
    {
        IRefreshOperationsUseCase<TService> Create(TService service, Func<Exception, string> onError);
    }
}
