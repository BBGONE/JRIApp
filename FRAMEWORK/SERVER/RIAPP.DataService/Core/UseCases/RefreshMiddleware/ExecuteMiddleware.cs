using Pipeline;
using RIAPP.DataService.Core.Metadata;
using RIAPP.DataService.Core.Types;
using RIAPP.DataService.Utils;
using System;
using System.Threading.Tasks;

namespace RIAPP.DataService.Core.UseCases.RefreshMiddleware
{
    public class ExecuteMiddleware<TService>
         where TService : BaseDomainService
    {
        private readonly RequestDelegate<RefreshContext<TService>> _next;

        public ExecuteMiddleware(RequestDelegate<RefreshContext<TService>> next, RefreshMiddlewareOptions<TService> options)
        {
            _next = next;
        }

        public async Task Invoke(RefreshContext<TService> ctx)
        {
            DbSetInfo dbSetInfo = ctx.Request.GetDbSetInfo() ?? throw new InvalidOperationException($"Could not get the DbSet for {ctx.Request.dbSetName}");
            IServiceOperationsHelper<TService> serviceHelper = ctx.ServiceContainer.GetServiceHelper();
            RunTimeMetadata metadata = ctx.Service.GetMetadata();

            RequestContext req = RefreshContext<TService>.CreateRequestContext(ctx.Service, ctx.Request.rowInfo);
            using (RequestCallContext callContext = new RequestCallContext(req))
            {
                MethodInfoData methodData = metadata.GetOperationMethodInfo(ctx.Request.dbSetName, MethodType.Refresh);
                object instance = serviceHelper.GetMethodOwner(methodData);
                object invokeRes = methodData.MethodInfo.Invoke(instance, new object[] { ctx.Request });
                object dbEntity = await serviceHelper.GetMethodResult(invokeRes);

                if (dbEntity != null)
                {
                    serviceHelper.UpdateRowInfoFromEntity(dbEntity, ctx.Request.rowInfo);
                }
                else
                {
                    throw new InvalidOperationException($"Refresh Operation for {ctx.Request.dbSetName} did not return a result");
                }
            }

            await _next(ctx);
        }
    }
}
