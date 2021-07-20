using Pipeline;
using RIAPP.DataService.Core.Exceptions;
using RIAPP.DataService.Core.Metadata;
using RIAPP.DataService.Core.Types;
using RIAPP.DataService.Resources;
using RIAPP.DataService.Utils;
using System;
using System.Threading.Tasks;

namespace RIAPP.DataService.Core.UseCases.CRUDMiddleware
{
    public class ApplyChangesMiddleware<TService>
         where TService : BaseDomainService
    {
        private readonly RequestDelegate<CRUDContext<TService>> _next;

        public ApplyChangesMiddleware(RequestDelegate<CRUDContext<TService>> next, CRUDMiddlewareOptions<TService> options)
        {
            _next = next;
        }

        private void CheckRowInfo(RowInfo rowInfo)
        {
            DbSetInfo dbSetInfo = rowInfo.GetDbSetInfo();

            if (dbSetInfo.GetEntityType() == null)
            {
                throw new DomainServiceException(string.Format(ErrorStrings.ERR_DB_ENTITYTYPE_INVALID,
                    dbSetInfo.dbSetName));
            }

            if (rowInfo.changeType == ChangeType.None)
            {
                throw new DomainServiceException(string.Format(ErrorStrings.ERR_REC_CHANGETYPE_INVALID,
                                dbSetInfo.GetEntityType().Name, rowInfo.changeType));
            }
        }

        private async Task Insert(CRUDContext<TService> ctx, RunTimeMetadata metadata, ChangeSetRequest changeSet, IChangeSetGraph graph, RowInfo rowInfo)
        {
            TService service = ctx.Service;
            IServiceOperationsHelper<TService> serviceHelper = ctx.ServiceContainer.GetServiceHelper();

            CheckRowInfo(rowInfo);

            using (RequestCallContext callContext = new RequestCallContext(CRUDContext<TService>.CreateRequestContext(service, changeSet, rowInfo)))
            {
                rowInfo.SetChangeState(new EntityChangeState { ParentRows = graph.GetParents(rowInfo) });
                await serviceHelper.InsertEntity(metadata, rowInfo);
            }
        }

        private async Task Update(CRUDContext<TService> ctx, RunTimeMetadata metadata, ChangeSetRequest changeSet, RowInfo rowInfo)
        {
            TService service = ctx.Service;
            IServiceOperationsHelper<TService> serviceHelper = ctx.ServiceContainer.GetServiceHelper();

            CheckRowInfo(rowInfo);

            using (RequestCallContext callContext = new RequestCallContext(CRUDContext<TService>.CreateRequestContext(service, changeSet, rowInfo)))
            {
                rowInfo.SetChangeState(new EntityChangeState());
                await serviceHelper.UpdateEntity(metadata, rowInfo);
            }
        }

        private async Task Delete(CRUDContext<TService> ctx, RunTimeMetadata metadata, ChangeSetRequest changeSet, RowInfo rowInfo)
        {
            TService service = ctx.Service;
            IServiceOperationsHelper<TService> serviceHelper = ctx.ServiceContainer.GetServiceHelper();

            CheckRowInfo(rowInfo);

            using (RequestCallContext callContext = new RequestCallContext(CRUDContext<TService>.CreateRequestContext(service, changeSet, rowInfo)))
            {
                rowInfo.SetChangeState(new EntityChangeState());
                await serviceHelper.DeleteEntity(metadata, rowInfo); ;
            }
        }

        public async Task Invoke(CRUDContext<TService> ctx)
        {
            IServiceOperationsHelper<TService> serviceHelper = ctx.ServiceContainer.GetServiceHelper();
            RunTimeMetadata metadata = ctx.Service.GetMetadata();
            ChangeSetRequest changeSet = ctx.Request;

            ChangeSetGraph graph = new ChangeSetGraph(ctx.Request, metadata);
            graph.Prepare();
            ctx.Properties.Add(CRUDContext<TService>.CHANGE_GRAPH_KEY, graph);

            RowInfo currentRowInfo = null;

            try
            {
                foreach (RowInfo rowInfo in graph.InsertList)
                {
                    currentRowInfo = rowInfo;
                    await Insert(ctx, metadata, changeSet, graph, rowInfo);
                }

                foreach (RowInfo rowInfo in graph.UpdateList)
                {
                    currentRowInfo = rowInfo;
                    await Update(ctx, metadata, changeSet, rowInfo);
                }

                foreach (RowInfo rowInfo in graph.DeleteList)
                {
                    currentRowInfo = rowInfo;
                    await Delete(ctx, metadata, changeSet, rowInfo);
                }
            }
            catch (Exception ex)
            {
                if (currentRowInfo != null)
                {
                    object dbEntity = currentRowInfo.GetChangeState()?.Entity;
                    currentRowInfo.SetChangeState(new EntityChangeState { Entity = dbEntity, Error = ex });
                }
                throw;
            }

            await _next(ctx);
        }
    }
}
