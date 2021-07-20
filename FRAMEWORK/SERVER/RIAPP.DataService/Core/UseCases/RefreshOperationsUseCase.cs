using Pipeline;
using RIAPP.DataService.Core.Types;
using RIAPP.DataService.Core.UseCases.RefreshMiddleware;
using RIAPP.DataService.Utils.Extensions;
using System;
using System.Threading.Tasks;

namespace RIAPP.DataService.Core
{
    public class RefreshOperationsUseCase<TService> : IRefreshOperationsUseCase<TService>
         where TService : BaseDomainService
    {
        private readonly BaseDomainService _service;
        private readonly IServiceContainer<TService> _serviceContainer;
        private readonly Func<Exception, string> _onError;
        private readonly RequestDelegate<RefreshContext<TService>> _pipeline;

        public RefreshOperationsUseCase(BaseDomainService service, Func<Exception, string> onError, RequestDelegate<RefreshContext<TService>> pipeline)
        {
            _serviceContainer = (IServiceContainer<TService>)service.ServiceContainer;
            _service = service;
            _onError = onError ?? throw new ArgumentNullException(nameof(onError));
            _pipeline = pipeline;
        }

        public async Task<bool> Handle(RefreshRequest message, IOutputPort<RefreshResponse> outputPort)
        {
            RefreshResponse response = new RefreshResponse { rowInfo = message.rowInfo, dbSetName = message.dbSetName };

            try
            {
                Metadata.RunTimeMetadata metadata = _service.GetMetadata();
                DbSetInfo dbSetInfo = metadata.DbSets.Get(message.dbSetName) ?? throw new InvalidOperationException($"The DbSet {message.dbSetName} was not found in metadata");
                message.SetDbSetInfo(dbSetInfo);
                message.rowInfo.SetDbSetInfo(dbSetInfo);

                RefreshContext<TService> context = new RefreshContext<TService>(message,
                response,
                (TService)_service,
                _serviceContainer);

                await _pipeline(context);
            }
            catch (Exception ex)
            {

                if (ex is System.Reflection.TargetInvocationException)
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
