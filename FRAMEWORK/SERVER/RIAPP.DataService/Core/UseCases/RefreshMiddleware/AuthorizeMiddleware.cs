using Pipeline;
using RIAPP.DataService.Core.Metadata;
using RIAPP.DataService.Core.Types;
using RIAPP.DataService.Resources;
using System;
using System.Threading.Tasks;

namespace RIAPP.DataService.Core.UseCases.RefreshMiddleware
{
    public class AuthorizeMiddleware<TService>
         where TService : BaseDomainService
    {
        private readonly RequestDelegate<RefreshContext<TService>> _next;

        public AuthorizeMiddleware(RequestDelegate<RefreshContext<TService>> next, RefreshMiddlewareOptions<TService> options)
        {
            _next = next;
        }

        public async Task Invoke(RefreshContext<TService> ctx)
        {
            DbSetInfo dbSetInfo = ctx.Request.GetDbSetInfo() ?? throw new InvalidOperationException($"Could not get the DbSet for {ctx.Request.dbSetName}");
            Security.IAuthorizer<TService> authorizer = ctx.ServiceContainer.GetAuthorizer();
            RunTimeMetadata metadata = ctx.Service.GetMetadata();

            MethodInfoData methodData = metadata.GetOperationMethodInfo(ctx.Request.dbSetName, MethodType.Refresh);
            if (methodData == null)
            {
                throw new InvalidOperationException(string.Format(ErrorStrings.ERR_REC_REFRESH_INVALID,
                    dbSetInfo.GetEntityType().Name, GetType().Name));
            }

            await authorizer.CheckUserRightsToExecute(methodData);

            await _next(ctx);
        }
    }
}
