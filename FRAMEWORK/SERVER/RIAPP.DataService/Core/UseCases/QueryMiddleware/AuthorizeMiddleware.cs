using Pipeline;
using RIAPP.DataService.Core.Metadata;
using System.Threading.Tasks;

namespace RIAPP.DataService.Core.UseCases.QueryMiddleware
{
    public class AuthorizeMiddleware<TService>
         where TService : BaseDomainService
    {
        private readonly RequestDelegate<QueryContext<TService>> _next;

        public AuthorizeMiddleware(RequestDelegate<QueryContext<TService>> next, QueryMiddlewareOptions<TService> options)
        {
            _next = next;
        }

        public async Task Invoke(QueryContext<TService> ctx)
        {
            Security.IAuthorizer<TService> authorizer = ctx.ServiceContainer.GetAuthorizer();
            RunTimeMetadata metadata = ctx.Service.GetMetadata();

            MethodDescription method = metadata.GetQueryMethod(ctx.Request.dbSetName, ctx.Request.queryName);
            await authorizer.CheckUserRightsToExecute(method.GetMethodData());

            await _next(ctx);
        }
    }
}
