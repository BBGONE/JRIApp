using System;

namespace RIAPP.DataService.Core
{
    public interface IInvokeOperationsUseCaseFactory
    {
        IInvokeOperationsUseCase Create(BaseDomainService service, Func<Exception, string> onError);
    }

    public interface IInvokeOperationsUseCaseFactory<TService> : IInvokeOperationsUseCaseFactory
        where TService : BaseDomainService
    {
        IInvokeOperationsUseCase<TService> Create(TService service, Func<Exception, string> onError);
    }
}