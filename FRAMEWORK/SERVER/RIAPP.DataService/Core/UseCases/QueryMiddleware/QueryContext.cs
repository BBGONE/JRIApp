using Pipeline;
using RIAPP.DataService.Core.Types;
using System;
using System.Collections.Generic;
using System.Runtime.ExceptionServices;

namespace RIAPP.DataService.Core.UseCases.QueryMiddleware
{
    public class QueryContext<TService> : IRequestContext
        where TService : BaseDomainService
    {
        private ExceptionDispatchInfo _ExceptionInfo;

        public QueryContext(
            QueryRequest request,
            QueryResponse response,
            TService service,
            IServiceContainer<TService> serviceContainer,
            bool isMultyPage)
        {
            _ExceptionInfo = null;
            Request = request;
            Response = response;
            Service = service;
            ServiceContainer = serviceContainer;
            Properties = new Dictionary<string, object>();
            IsMultyPage = isMultyPage;
        }

        public static RequestContext CreateRequestContext(TService service, QueryRequest queryInfo)
        {
            return new RequestContext(service, queryInfo: queryInfo, operation: ServiceOperationType.Query);
        }


        // Gets a key/value collection that can be used to share data between middleware.
        public IDictionary<string, object> Properties { get; }

        public bool IsMultyPage { get; }

        public void AddLogItem(string str)
        {
        }

        public QueryRequest Request { get; }
        public QueryResponse Response { get; }
        public IServiceProvider RequestServices => ServiceContainer.ServiceProvider;

        public void CaptureException(Exception ex)
        {
            _ExceptionInfo = ExceptionDispatchInfo.Capture(ex);
        }

        public Exception ProcessingException => _ExceptionInfo?.SourceException;

        public IServiceContainer<TService> ServiceContainer { get; }

        public TService Service { get; }

        public void ReThrow()
        {
            _ExceptionInfo?.Throw();
        }
    }
}
