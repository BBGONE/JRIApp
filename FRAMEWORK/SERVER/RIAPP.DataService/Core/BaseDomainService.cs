using RIAPP.DataService.Core.CodeGen;
using RIAPP.DataService.Core.Exceptions;
using RIAPP.DataService.Core.Metadata;
using RIAPP.DataService.Core.Security;
using RIAPP.DataService.Core.Types;
using RIAPP.DataService.Utils;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace RIAPP.DataService.Core
{
    public abstract class BaseDomainService : IDomainService, IDataServiceComponent, IMetaDataProvider
    {
        public BaseDomainService(IServiceContainer serviceContainer)
        {
            ServiceContainer = serviceContainer;
        }

        public ClaimsPrincipal User => ServiceContainer.GetUserProvider().User;

        public ISerializer Serializer => ServiceContainer.Serializer;

        public IServiceContainer ServiceContainer
        {
            get;
        }

        BaseDomainService IDataServiceComponent.DataService => this;

        public RunTimeMetadata GetMetadata()
        {
            return MetadataHelper.GetInitializedMetadata(this, ServiceContainer.DataHelper, ServiceContainer.ValueConverter);
        }

        DesignTimeMetadata IMetaDataProvider.GetDesignTimeMetadata(bool isDraft)
        {
            return GetDesignTimeMetadata(isDraft);
        }

        protected internal void _OnError(Exception ex)
        {
            if (ex is DummyException)
            {
                return;
            }

            OnError(ex);
        }

        #region Overridable Methods
        protected abstract DesignTimeMetadata GetDesignTimeMetadata(bool isDraft);

        /// <summary>
        ///     Can be used for tracking what is changed by CRUD methods
        /// </summary>
        /// <param name="dbSetName">name of the entity which is currently tracked</param>
        /// <param name="changeType">enum meaning which CRUD method was invoked</param>
        /// <param name="diffgram">xml representing values as was before and after CRUD operation</param>
        protected virtual void OnTrackChange(string dbSetName, ChangeType changeType, string diffgram)
        {
        }

        protected virtual void OnError(Exception ex)
        {
        }

        protected virtual string GetFriendlyErrorMessage(Exception ex)
        {
            return ex.GetFriendlyMessage();
        }

        protected abstract Task ExecuteChangeSet();

        protected virtual Task AfterExecuteChangeSet(ChangeSetRequest message)
        {
            return Task.CompletedTask;
        }

        protected virtual Task AfterChangeSetCommited(ChangeSetRequest message, SubResultList refreshResult)
        {
            return Task.CompletedTask;
        }

        protected virtual void TrackChangesToEntity(RowInfo rowInfo)
        {
            DbSetInfo dbSetInfo = rowInfo.GetDbSetInfo();

            if (!dbSetInfo.GetIsTrackChanges())
            {
                return;
            }

            try
            {
                string[] changed = new string[0];
                switch (rowInfo.changeType)
                {
                    case ChangeType.Updated:
                        {
                            changed = rowInfo.GetChangeState().ChangedFieldNames;
                        }
                        break;
                    default:
                        {
                            changed = dbSetInfo.GetNames().Select(f => f.n).ToArray();
                        }
                        break;
                }

                string[] pknames = dbSetInfo.GetPKFields().Select(f => f.fieldName).ToArray();
                string diffgram = DiffGram.GetDiffGram(rowInfo.GetChangeState().OriginalEntity,
                    rowInfo.changeType == ChangeType.Deleted ? null : rowInfo.GetChangeState().Entity,
                    dbSetInfo.GetEntityType(), changed, pknames, rowInfo.changeType, dbSetInfo.dbSetName);

                OnTrackChange(dbSetInfo.dbSetName, rowInfo.changeType, diffgram);
            }
            catch (Exception ex)
            {
                _OnError(ex);
            }
        }

        #endregion

        #region DataService Data Operations

        /// <summary>
        ///     Utility method to obtain data from the dataservice's query method
        ///     mainly used to embed query data on a page load.
        ///     best for small datasets which needs to be present on the client when the page loads
        /// </summary>
        /// <param name="dbSetName"></param>
        /// <param name="queryName"></param>
        /// <returns></returns>
        public async Task<QueryResponse> GetQueryData(string dbSetName, string queryName)
        {
            QueryRequest getInfo = new QueryRequest { dbSetName = dbSetName, queryName = queryName };
            return await ServiceGetData(getInfo);
        }

        #endregion

        #region IDomainService Methods

        public string ServiceCodeGen(CodeGenArgs args)
        {
            ICodeGenFactory codeGenfactory = ServiceContainer.CodeGenFactory;
            try
            {
                ICodeGenProvider codeGen = codeGenfactory.GetCodeGen(this, args.lang);
                return codeGen.GenerateScript(args.comment, args.isDraft);
            }
            catch (Exception ex)
            {
                _OnError(ex);
                throw;
            }
        }

        public async Task<Permissions> ServiceGetPermissions()
        {
            try
            {
                await Task.CompletedTask;
                RunTimeMetadata metadata = GetMetadata();
                Permissions result = new Permissions() { serverTimezone = DateTimeHelper.GetTimezoneOffset() };
                IAuthorizer authorizer = ServiceContainer.Authorizer;
                foreach (DbSetInfo dbInfo in metadata.DbSets.Values)
                {
                    DbSetPermit permissions = await authorizer.GetDbSetPermissions(metadata, dbInfo.dbSetName);
                    result.permissions.Add(permissions);
                }

                return result;
            }
            catch (Exception ex)
            {
                _OnError(ex);
                throw new DummyException(ex.GetFullMessage(), ex);
            }
        }

        public MetadataResult ServiceGetMetadata()
        {
            try
            {
                RunTimeMetadata metadata = GetMetadata();
                MetadataResult result = new MetadataResult() { methods = metadata.MethodDescriptions };
                result.associations.AddRange(metadata.Associations.Values);
                result.dbSets.AddRange(metadata.DbSets.Values.OrderBy(d => d.dbSetName));
                return result;
            }
            catch (Exception ex)
            {
                _OnError(ex);
                throw new DummyException(ex.GetFullMessage(), ex);
            }
        }

        public async Task<QueryResponse> ServiceGetData(QueryRequest message)
        {
            IQueryOperationsUseCaseFactory factory = ServiceContainer.QueryOperationsUseCaseFactory;
            IQueryOperationsUseCase uc = factory.Create(this, (err) => { _OnError(err); return GetFriendlyErrorMessage(err); });
            IResponsePresenter<QueryResponse, QueryResponse> output = ServiceContainer.GetRequiredService<IResponsePresenter<QueryResponse, QueryResponse>>();

            bool res = await uc.Handle(message, output);

            return output.Response;
        }

        public async Task<ChangeSetResponse> ServiceApplyChangeSet(ChangeSetRequest changeSet)
        {
            ICRUDOperationsUseCaseFactory factory = ServiceContainer.CRUDOperationsUseCaseFactory;
            CRUDServiceMethods serviceMethods = new CRUDServiceMethods(
                (err) => { _OnError(err); return GetFriendlyErrorMessage(err); },
                (row) => TrackChangesToEntity(row),
                async () =>
                {
                    await ExecuteChangeSet();
                },
                async () =>
                {
                    await AfterExecuteChangeSet(changeSet);
                },
                async (subResults) =>
                {
                    await AfterChangeSetCommited(changeSet, subResults);
                });

            ICRUDOperationsUseCase uc = factory.Create(this, serviceMethods);

            IResponsePresenter<ChangeSetResponse, ChangeSetResponse> output = ServiceContainer.GetRequiredService<IResponsePresenter<ChangeSetResponse, ChangeSetResponse>>();

            bool res = await uc.Handle(changeSet, output);

            return output.Response;
        }

        public async Task<RefreshResponse> ServiceRefreshRow(RefreshRequest message)
        {
            IRefreshOperationsUseCaseFactory factory = ServiceContainer.RefreshOperationsUseCaseFactory;
            IRefreshOperationsUseCase uc = factory.Create(this, (err) => { _OnError(err); return GetFriendlyErrorMessage(err); });
            IResponsePresenter<RefreshResponse, RefreshResponse> output = ServiceContainer.GetRequiredService<IResponsePresenter<RefreshResponse, RefreshResponse>>();

            bool res = await uc.Handle(message, output);

            return output.Response;
        }

        public async Task<InvokeResponse> ServiceInvokeMethod(InvokeRequest message)
        {
            IInvokeOperationsUseCaseFactory factory = ServiceContainer.InvokeOperationsUseCaseFactory;
            IInvokeOperationsUseCase uc = factory.Create(this, (err) => { _OnError(err); return GetFriendlyErrorMessage(err); });
            IResponsePresenter<InvokeResponse, InvokeResponse> output = ServiceContainer.GetRequiredService<IResponsePresenter<InvokeResponse, InvokeResponse>>();

            bool res = await uc.Handle(message, output);

            return output.Response;
        }
        #endregion

        #region IDisposable Members

        protected virtual void Dispose(bool isDisposing)
        {

        }

        void IDisposable.Dispose()
        {
            Dispose(true);
        }

        #endregion
    }
}