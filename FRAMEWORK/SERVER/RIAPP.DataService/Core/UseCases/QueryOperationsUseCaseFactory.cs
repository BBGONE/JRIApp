using System;

namespace RIAPP.DataService.Core
{
    public class QueryOperationsUseCaseFactory<TService> : IQueryOperationsUseCaseFactory<TService>
        where TService : BaseDomainService
    {
        private readonly Func<BaseDomainService, Func<Exception, string>, IQueryOperationsUseCase<TService>> _func;

        public QueryOperationsUseCaseFactory(Func<BaseDomainService, Func<Exception, string>, IQueryOperationsUseCase<TService>> func)
        {
            _func = func;
        }

        public IQueryOperationsUseCase Create(BaseDomainService service, Func<Exception, string> onError)
        {
            return _func(service, onError);
        }

        public IQueryOperationsUseCase<TService> Create(TService service, Func<Exception, string> onError)
        {
            return _func(service, onError);
        }

    }
}
