using Pipeline;
using RIAPP.DataService.Core.Types;
using RIAPP.DataService.Core.UseCases.InvokeMiddleware;
using System;
using System.Reflection;
using System.Threading.Tasks;

namespace RIAPP.DataService.Core
{
    public class InvokeOperationsUseCase<TService> : IInvokeOperationsUseCase<TService>
         where TService : BaseDomainService
    {
        private readonly BaseDomainService _service;
        private readonly IServiceContainer<TService> _serviceContainer;
        private readonly Func<Exception, string> _onError;
        private readonly RequestDelegate<InvokeContext<TService>> _pipeline;

        public InvokeOperationsUseCase(BaseDomainService service, Func<Exception, string> onError, RequestDelegate<InvokeContext<TService>> pipeline)
        {
            _serviceContainer = (IServiceContainer<TService>)service.ServiceContainer;
            _service = service;
            _onError = onError ?? throw new ArgumentNullException(nameof(onError));
            _pipeline = pipeline;
        }

        public async Task<bool> Handle(InvokeRequest message, IOutputPort<InvokeResponse> outputPort)
        {
            InvokeResponse response = new InvokeResponse();

            try
            {
                InvokeContext<TService> context = new InvokeContext<TService>(message,
                 response,
                 (TService)_service,
                 _serviceContainer);

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
