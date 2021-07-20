using System;

namespace RIAPP.DataService.Core
{
    public class InvokeOperationsUseCaseFactory<TService> : IInvokeOperationsUseCaseFactory<TService>
        where TService : BaseDomainService
    {
        private readonly Func<BaseDomainService, Func<Exception, string>, IInvokeOperationsUseCase<TService>> _func;

        public InvokeOperationsUseCaseFactory(Func<BaseDomainService, Func<Exception, string>, IInvokeOperationsUseCase<TService>> func)
        {
            _func = func;
        }

        public IInvokeOperationsUseCase Create(BaseDomainService service, Func<Exception, string> onError)
        {
            return _func(service, onError);
        }

        public IInvokeOperationsUseCase<TService> Create(TService service, Func<Exception, string> onError)
        {
            return _func(service, onError);
        }
    }
}
