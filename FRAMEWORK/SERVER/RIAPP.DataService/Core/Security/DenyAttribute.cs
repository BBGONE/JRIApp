using System;
using System.Threading.Tasks;

namespace RIAPP.DataService.Core.Security
{
    /// <summary>
    ///     This atribute assignes roles for the method or datamanager which override the roles assigned in the dataservice or
    ///     the other authorize attributes
    /// </summary>
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, Inherited = false)]
    public class DenyAttribute : AuthorizeAttribute, IDenyAuthorizeData
    {
        public DenyAttribute() : base()
        {
        }

        public override async Task<bool> IsAuthorized(AuthorizationContext authorizationContext)
        {
            await Task.CompletedTask;

            foreach (string role in Roles)
            {
                if (authorizationContext.User.IsInRole(role))
                {
                    return false;
                }
            }

            return true;
        }
    }
}