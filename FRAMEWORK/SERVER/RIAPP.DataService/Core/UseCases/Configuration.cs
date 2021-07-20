using Pipeline;
using Pipeline.Extensions;
using RIAPP.DataService.Core.Types;
using RIAPP.DataService.Core.UseCases.CRUDMiddleware;
using RIAPP.DataService.Core.UseCases.InvokeMiddleware;
using RIAPP.DataService.Core.UseCases.QueryMiddleware;
using RIAPP.DataService.Core.UseCases.RefreshMiddleware;
using RIAPP.DataService.Utils.Extensions;
using System;
using System.Threading.Tasks;

namespace RIAPP.DataService.Core.UseCases
{
    public class Configuration
    {
        public static void ConfigureCRUD<TService>(PipelineBuilder<TService, CRUDContext<TService>> builder)
             where TService : BaseDomainService
        {
            CRUDMiddlewareOptions<TService> middlewareOptions = new CRUDMiddlewareOptions<TService>();

            builder.UseMiddleware<CRUDMiddleware.AuthorizeMiddleware<TService>, TService, CRUDContext<TService>>(middlewareOptions);
            builder.UseMiddleware<ApplyChangesMiddleware<TService>, TService, CRUDContext<TService>>(middlewareOptions);
            builder.UseMiddleware<ValidateChangesMiddleware<TService>, TService, CRUDContext<TService>>(middlewareOptions);
            builder.UseMiddleware<CommitChangesMiddleware<TService>, TService, CRUDContext<TService>>(middlewareOptions);

            builder.Run(ctx =>
            {
                IChangeSetGraph graph = ctx.Properties.Get<IChangeSetGraph>(CRUDContext<TService>.CHANGE_GRAPH_KEY) ?? throw new InvalidOperationException("Could not get Graph changes from properties");
                CRUDServiceMethods serviceMethods = ctx.Properties.Get<CRUDServiceMethods>(CRUDContext<TService>.CHANGE_METHODS_KEY) ?? throw new InvalidOperationException("Could not get CRUD Service methods from properties");


                foreach (RowInfo rowInfo in graph.AllList)
                {
                    serviceMethods.TrackChanges(rowInfo);
                }

                return Task.CompletedTask;
            });
        }

        public static void ConfigureQuery<TService>(PipelineBuilder<TService, QueryContext<TService>> builder)
          where TService : BaseDomainService
        {
            QueryMiddlewareOptions<TService> middlewareOptions = new QueryMiddlewareOptions<TService>();

            builder.UseMiddleware<QueryMiddleware.AuthorizeMiddleware<TService>, TService, QueryContext<TService>>(middlewareOptions);
            builder.UseMiddleware<QueryMiddleware.ExecuteMiddleware<TService>, TService, QueryContext<TService>>(middlewareOptions);

            builder.Run(ctx =>
            {
                return Task.CompletedTask;
            });
        }

        public static void ConfigureInvoke<TService>(PipelineBuilder<TService, InvokeContext<TService>> builder)
          where TService : BaseDomainService
        {
            InvokeMiddlewareOptions<TService> middlewareOptions = new InvokeMiddlewareOptions<TService>();

            builder.UseMiddleware<InvokeMiddleware.AuthorizeMiddleware<TService>, TService, InvokeContext<TService>>(middlewareOptions);
            builder.UseMiddleware<InvokeMiddleware.ExecuteMiddleware<TService>, TService, InvokeContext<TService>>(middlewareOptions);

            builder.Run(ctx =>
            {
                return Task.CompletedTask;
            });
        }

        public static void ConfigureRefresh<TService>(PipelineBuilder<TService, RefreshContext<TService>> builder)
         where TService : BaseDomainService
        {
            RefreshMiddlewareOptions<TService> middlewareOptions = new RefreshMiddlewareOptions<TService>();

            builder.UseMiddleware<RefreshMiddleware.AuthorizeMiddleware<TService>, TService, RefreshContext<TService>>(middlewareOptions);
            builder.UseMiddleware<RefreshMiddleware.ExecuteMiddleware<TService>, TService, RefreshContext<TService>>(middlewareOptions);

            builder.Run(ctx =>
            {
                return Task.CompletedTask;
            });
        }
    }
}
