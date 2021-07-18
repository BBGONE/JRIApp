using Pipeline;
using RIAPP.DataService.Core.Types;
using System;
using System.Collections.Generic;
using System.Runtime.ExceptionServices;

namespace RIAPP.DataService.Core.UseCases.RefreshMiddleware
{
    public class RefreshContext<TService> : IRequestContext
        where TService : BaseDomainService
    {
        private ExceptionDispatchInfo _ExceptionInfo;

        public RefreshContext(
            RefreshRequest request,
            RefreshResponse response,
            TService service,
            IServiceContainer<TService> serviceContainer
          )
        {
            _ExceptionInfo = null;
            Request = request;
            Response = response;
            Service = service;
            ServiceContainer = serviceContainer;
            Properties = new Dictionary<string, object>();
        }

        public static RequestContext CreateRequestContext(TService service, RowInfo rowInfo)
        {
            return new RequestContext(service, rowInfo: rowInfo, operation: ServiceOperationType.RowRefresh);
        }


        // Gets a key/value collection that can be used to share data between middleware.
        public IDictionary<string, object> Properties { get; }

        public bool IsMultyPage { get; }

        public void AddLogItem(string str)
        {
        }

        public RefreshRequest Request { get; }
        public RefreshResponse Response { get; }
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
