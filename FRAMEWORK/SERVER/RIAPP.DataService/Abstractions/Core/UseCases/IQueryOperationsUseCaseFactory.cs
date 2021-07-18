using System;

namespace RIAPP.DataService.Core
{
    public interface IQueryOperationsUseCaseFactory
    {
        IQueryOperationsUseCase Create(BaseDomainService service, Func<Exception, string> onError);
    }

    public interface IQueryOperationsUseCaseFactory<TService> : IQueryOperationsUseCaseFactory
        where TService : BaseDomainService
    {
        IQueryOperationsUseCase<TService> Create(TService service, Func<Exception, string> onError);
    }
}