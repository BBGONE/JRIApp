using Pipeline;
using RIAPP.DataService.Core.Types;
using RIAPP.DataService.Core.UseCases.CRUDMiddleware;
using System;
using System.Reflection;
using System.Threading.Tasks;

namespace RIAPP.DataService.Core
{
    public class CRUDOperationsUseCase<TService> : ICRUDOperationsUseCase<TService>
         where TService : BaseDomainService
    {
        private readonly IServiceContainer<TService> _serviceContainer;
        private readonly BaseDomainService _service;
        private readonly CRUDServiceMethods _serviceMethods;
        private readonly RequestDelegate<CRUDContext<TService>> _pipeline;

        public CRUDOperationsUseCase(BaseDomainService service,
            CRUDServiceMethods serviceMethods,
            RequestDelegate<CRUDContext<TService>> pipeline)
        {
            _service = service;
            _serviceContainer = (IServiceContainer<TService>)service.ServiceContainer;
            _serviceMethods = serviceMethods;
            _pipeline = pipeline;
        }

        public async Task<bool> Handle(ChangeSetRequest message, IOutputPort<ChangeSetResponse> outputPort)
        {
            ChangeSetResponse response = new ChangeSetResponse(message);

            try
            {
                CRUDContext<TService> context = new CRUDContext<TService>(message, response, (TService)_service, _serviceContainer);
                context.Properties.Add(CRUDContext<TService>.CHANGE_METHODS_KEY, _serviceMethods);

                await _pipeline(context);
            }
            catch (Exception ex)
            {
                if (ex is TargetInvocationException)
                {
                    ex = ex.InnerException;
                }

                string err = _serviceMethods.OnError(ex);
                response.error = new ErrorInfo(err, ex.GetType().Name);
            }

            outputPort.Handle(response);

            return response.error == null;
        }
    }
}
