using RIAPP.DataService.Core.Types;
using RIAPP.DataService.Utils;
using System;
using System.Dynamic;
using System.Security.Claims;

namespace RIAPP.DataService.Core
{
    public class RequestContext : IEntityVersionProvider
    {
        public RequestContext(BaseDomainService dataService,
            DbSet dbSet = null,
            ChangeSetRequest changeSet = null,
            RowInfo rowInfo = null,
            QueryRequest queryInfo = null,
            ServiceOperationType operation = ServiceOperationType.None)
        {
            DataService = dataService ?? throw new ArgumentNullException(nameof(dataService));
            CurrentDbSet = dbSet;
            CurrentChangeSet = changeSet;
            CurrentRowInfo = rowInfo;
            CurrentQueryInfo = queryInfo;
            CurrentOperation = operation;
            _dataBag = null;
        }

        public static RequestContext Current
        {
            get
            {
                RequestContext reqCtxt = RequestCallContext.CurrentContext;
                if (reqCtxt == null)
                {
                    throw new InvalidOperationException("Current RequestCallContext is null");
                }

                return reqCtxt;
            }
        }

        public ClaimsPrincipal User => DataService.User;

        public DbSet CurrentDbSet { get; }

        public ChangeSetRequest CurrentChangeSet { get; }

        public RowInfo CurrentRowInfo { get; }

        public QueryRequest CurrentQueryInfo { get; }

        public ServiceOperationType CurrentOperation { get; }

        public dynamic DataBag => _dataBag.Value;

        public BaseDomainService DataService
        {
            get;
        }

        #region Private Fields

        private readonly Lazy<dynamic> _dataBag = new Lazy<dynamic>(() => new ExpandoObject(), true);

        #endregion

        #region IEntityVersionProvider

        object IEntityVersionProvider.GetOriginal()
        {
            return DataService.ServiceContainer.ServiceHelper.GetOriginalEntity(CurrentRowInfo);
        }

        public object GetParent(Type entityType)
        {
            return DataService.ServiceContainer.ServiceHelper.GetParentEntity(entityType, CurrentRowInfo);
        }

        public TModel GetOriginal<TModel>()
            where TModel : class
        {
            return DataService.ServiceContainer.ServiceHelper.GetOriginalEntity<TModel>(CurrentRowInfo);
        }

        public TModel GetParent<TModel>()
            where TModel : class
        {
            return DataService.ServiceContainer.ServiceHelper.GetParentEntity<TModel>(CurrentRowInfo);
        }

        #endregion
    }
}