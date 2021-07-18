using Pipeline;
using RIAPP.DataService.Core.Types;
using System;
using System.Collections.Generic;
using System.Runtime.ExceptionServices;

namespace RIAPP.DataService.Core.UseCases.InvokeMiddleware
{
    public class InvokeContext<TService> : IRequestContext
        where TService : BaseDomainService
    {
        private ExceptionDispatchInfo _ExceptionInfo;

        public InvokeContext(
            InvokeRequest request,
            InvokeResponse response,
            TService service,
            IServiceContainer<TService> serviceContainer)
        {
            _ExceptionInfo = null;
            Request = request;
            Response = response;
            Service = service;
            ServiceContainer = serviceContainer;
            Properties = new Dictionary<string, object>();
        }

        public static RequestContext CreateRequestContext(TService service)
        {
            return new RequestContext(service, operation: ServiceOperationType.InvokeMethod);
        }


        // Gets a key/value collection that can be used to share data between middleware.
        public IDictionary<string, object> Properties { get; }

        public void AddLogItem(string str)
        {
        }

        public InvokeRequest Request { get; }
        public InvokeResponse Response { get; }
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
