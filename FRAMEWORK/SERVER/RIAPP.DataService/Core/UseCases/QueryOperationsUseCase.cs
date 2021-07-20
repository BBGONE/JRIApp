using Pipeline;
using RIAPP.DataService.Core.Types;
using RIAPP.DataService.Core.UseCases.QueryMiddleware;
using RIAPP.DataService.Utils.Extensions;
using System;
using System.Reflection;
using System.Threading.Tasks;

namespace RIAPP.DataService.Core
{
    public class QueryOperationsUseCase<TService> : IQueryOperationsUseCase<TService>
         where TService : BaseDomainService
    {
        private readonly BaseDomainService _service;
        private readonly IServiceContainer<TService> _serviceContainer;
        private readonly Func<Exception, string> _onError;
        private readonly RequestDelegate<QueryContext<TService>> _pipeline;

        public QueryOperationsUseCase(BaseDomainService service, Func<Exception, string> onError, RequestDelegate<QueryContext<TService>> pipeline)
        {
            _serviceContainer = (IServiceContainer<TService>)service.ServiceContainer;
            _service = service;
            _onError = onError ?? throw new ArgumentNullException(nameof(onError));
            _pipeline = pipeline;
        }

        public async Task<bool> Handle(QueryRequest message, IOutputPort<QueryResponse> outputPort)
        {
            QueryResponse response = new QueryResponse
            {
                pageIndex = message.pageIndex,
                pageCount = message.pageCount,
                dbSetName = message.dbSetName,
                rows = new Row[0],
                totalCount = null,
                error = null
            };

            try
            {
                Metadata.RunTimeMetadata metadata = _service.GetMetadata();
                DbSetInfo dbSetInfo = metadata.DbSets.Get(message.dbSetName) ?? throw new InvalidOperationException($"The DbSet {message.dbSetName} was not found in metadata");
                message.SetDbSetInfo(dbSetInfo);

                bool isMultyPageRequest = dbSetInfo.enablePaging && message.pageCount > 1;

                QueryContext<TService> context = new QueryContext<TService>(message,
                    response,
                    (TService)_service,
                    _serviceContainer,
                    isMultyPageRequest);

                await _pipeline(context);
            }
            catch (Exception ex)
            {
                if (ex is TargetInvocationException)
                {
                    ex = ex.InnerException;
                }

                string err = _onError(ex);
                response.error = new ErrorInfo(err, ex.GetType().Name);
            }

            outputPort.Handle(response);

            return true;
        }
    }
}
