using RIAPP.DataService.Core;
using RIAPP.DataService.Core.Query;
using RIAPP.DataService.Core.Types;
using RIAppDemo.DAL.EF;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace RIAppDemo.BLL.DataServices.DataManagers
{
    public class AdWDataManager<TModel> : BaseDataManager<RIAppDemoServiceEF, TModel>
        where TModel : class
    {
        protected const string USERS_ROLE = RIAppDemoServiceEF.USERS_ROLE;
        protected const string ADMINS_ROLE = RIAppDemoServiceEF.ADMINS_ROLE;

        protected ADWDbContext DB => DataService.DB;

        protected PerformQueryResult<TModel> PerformQuery(Func<IQueryable<TModel>, Task<int>> totalCountFunc)
        {
            System.Data.Entity.DbSet<TModel> dbset = DB.Set<TModel>();
            return this.PerformQuery(dbset.AsNoTracking(), totalCountFunc);
        }

        protected PerformQueryResult<TEntity> PerformQuery<TEntity>(Func<IQueryable<TEntity>, Task<int>> totalCountFunc)
            where TEntity : class
        {
            System.Data.Entity.DbSet<TEntity> dbset = DB.Set<TEntity>();
            return this.PerformQuery(dbset.AsNoTracking(), totalCountFunc);
        }
    }
}