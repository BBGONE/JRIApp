using RIAPP.DataService.Core.Types;
using System;
using System.Threading.Tasks;

namespace RIAPP.DataService.Core
{
    public class BaseDataManager<TDataService, TModel> : IDataManager<TModel>, IDataServiceComponent
        where TModel : class
        where TDataService : BaseDomainService
    {
        BaseDomainService IDataServiceComponent.DataService => this.DataService;

        public TDataService DataService => (TDataService)RequestContext.DataService;

        protected RequestContext RequestContext => RequestContext.Current;

        protected QueryRequest CurrentQueryInfo => RequestContext.CurrentQueryInfo;

        public virtual Task AfterExecuteChangeSet(ChangeSetRequest changeSet)
        {
            return Task.CompletedTask;
        }

        public virtual Task AfterChangeSetCommited(ChangeSetRequest changeSet, SubResultList refreshResult)
        {
            return Task.CompletedTask;
        }

        public IServiceContainer ServiceContainer => DataService.ServiceContainer;


        public object GetParent(Type entityType)
        {
            return RequestContext.GetParent(entityType);
        }

        public TModel GetOriginal()
        {
            return RequestContext.GetOriginal<TModel>();
        }

        public TModel2 GetParent<TModel2>()
            where TModel2 : class
        {
            return RequestContext.GetParent<TModel2>();
        }
    }
}