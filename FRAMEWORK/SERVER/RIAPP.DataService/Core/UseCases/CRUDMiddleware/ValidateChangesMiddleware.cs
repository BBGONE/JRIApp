using Pipeline;
using RIAPP.DataService.Core.Exceptions;
using RIAPP.DataService.Core.Metadata;
using RIAPP.DataService.Core.Types;
using RIAPP.DataService.Resources;
using RIAPP.DataService.Utils;
using RIAPP.DataService.Utils.Extensions;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RIAPP.DataService.Core.UseCases.CRUDMiddleware
{
    public class ValidateChangesMiddleware<TService>
         where TService : BaseDomainService
    {
        private readonly RequestDelegate<CRUDContext<TService>> _next;

        public ValidateChangesMiddleware(RequestDelegate<CRUDContext<TService>> next, CRUDMiddlewareOptions<TService> options)
        {
            _next = next;
        }

        private async Task<bool> ValidateRows(CRUDContext<TService> ctx, ChangeSetRequest changeSet, RunTimeMetadata metadata, IEnumerable<RowInfo> rows)
        {
            TService service = ctx.Service;
            IServiceOperationsHelper<TService> serviceHelper = ctx.ServiceContainer.GetServiceHelper();

            foreach (RowInfo rowInfo in rows)
            {
                RequestContext req = CRUDContext<TService>.CreateRequestContext(service, changeSet, rowInfo);
                using (RequestCallContext callContext = new RequestCallContext(req))
                {
                    if (!await serviceHelper.ValidateEntity(metadata, req))
                    {
                        rowInfo.invalid = rowInfo.GetChangeState().ValidationErrors;
                        return false;
                    }
                }
            }
            return true;
        }

        public async Task Invoke(CRUDContext<TService> ctx)
        {
            RunTimeMetadata metadata = ctx.Service.GetMetadata();
            ChangeSetRequest changeSet = ctx.Request;

            IChangeSetGraph graph = ctx.Properties.Get<IChangeSetGraph>(CRUDContext<TService>.CHANGE_GRAPH_KEY) ?? throw new InvalidOperationException("Could not get Graph changes from properties");

            if (!await ValidateRows(ctx, changeSet, metadata, graph.InsertList))
            {
                throw new ValidationException(ErrorStrings.ERR_SVC_CHANGES_ARENOT_VALID);
            }

            if (!await ValidateRows(ctx, changeSet, metadata, graph.UpdateList))
            {
                throw new ValidationException(ErrorStrings.ERR_SVC_CHANGES_ARENOT_VALID);
            }

            await _next(ctx);
        }
    }
}
