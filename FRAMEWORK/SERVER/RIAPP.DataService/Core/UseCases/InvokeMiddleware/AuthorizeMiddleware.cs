using Pipeline;
using RIAPP.DataService.Core.Metadata;
using System.Threading.Tasks;

namespace RIAPP.DataService.Core.UseCases.InvokeMiddleware
{
    public class AuthorizeMiddleware<TService>
         where TService : BaseDomainService
    {
        private readonly RequestDelegate<InvokeContext<TService>> _next;

        public AuthorizeMiddleware(RequestDelegate<InvokeContext<TService>> next, InvokeMiddlewareOptions<TService> options)
        {
            _next = next;
        }

        public async Task Invoke(InvokeContext<TService> ctx)
        {
            Security.IAuthorizer<TService> authorizer = ctx.ServiceContainer.GetAuthorizer();
            RunTimeMetadata metadata = ctx.Service.GetMetadata();

            MethodDescription method = metadata.GetInvokeMethod(ctx.Request.methodName);
            await authorizer.CheckUserRightsToExecute(method.GetMethodData());

            await _next(ctx);
        }
    }
}
