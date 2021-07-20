using Pipeline;
using RIAPP.DataService.Core.Exceptions;
using RIAPP.DataService.Core.Metadata;
using RIAPP.DataService.Core.Security;
using RIAPP.DataService.Core.Types;
using RIAPP.DataService.Resources;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RIAPP.DataService.Core.UseCases.CRUDMiddleware
{
    public class AuthorizeMiddleware<TService>
         where TService : BaseDomainService
    {
        private readonly RequestDelegate<CRUDContext<TService>> _next;

        public AuthorizeMiddleware(RequestDelegate<CRUDContext<TService>> next, CRUDMiddlewareOptions<TService> options)
        {
            _next = next;
        }

        public async Task Invoke(CRUDContext<TService> ctx)
        {
            IAuthorizer<TService> authorizer = ctx.ServiceContainer.GetAuthorizer();
            RunTimeMetadata metadata = ctx.Service.GetMetadata();

            foreach (DbSet dbSet in ctx.Request.dbSets)
            {
                //methods on domain service which are attempted to be executed by client (SaveChanges triggers their execution)
                Dictionary<string, MethodInfoData> domainServiceMethods = new Dictionary<string, MethodInfoData>();
                DbSetInfo dbInfo = metadata.DbSets[dbSet.dbSetName];

                dbSet.rows.Aggregate<RowInfo, Dictionary<string, MethodInfoData>>(domainServiceMethods, (dict, rowInfo) =>
                {
                    MethodInfoData method = rowInfo.GetCRUDMethodInfo(metadata, dbInfo.dbSetName);
                    if (method == null)
                    {
                        throw new DomainServiceException(string.Format(ErrorStrings.ERR_REC_CHANGETYPE_INVALID,
                            dbInfo.GetEntityType().Name, rowInfo.changeType));
                    }

                    string dicKey = string.Format("{0}:{1}", method.OwnerType.FullName, method.MethodInfo.Name);
                    if (!dict.ContainsKey(dicKey))
                    {
                        dict.Add(dicKey, method);
                    }
                    return dict;
                });

                await authorizer.CheckUserRightsToExecute(domainServiceMethods.Values);
            }

            await _next(ctx);
        }
    }
}
