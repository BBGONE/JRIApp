using System;
using System.Threading.Tasks;

namespace RIAPP.DataService.Core.Security
{
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, AllowMultiple = true, Inherited = false)]
    public class AuthorizeAttribute : Attribute, IAuthorizeData
    {
        public AuthorizeAttribute()
        {
            Roles = new string[0];
        }

        public string[] Roles { get; set; }

        public string RolesString
        {
            get => string.Join(",", Roles);
            set
            {
                if (string.IsNullOrWhiteSpace(value))
                {
                    Roles = new string[0];
                }
                else
                {
                    Roles = value.Split(',', ';');
                }
            }
        }

        public virtual async Task<bool> IsAuthorized(AuthorizationContext authorizationContext)
        {
            await Task.CompletedTask;

            int cnt = 0;

            foreach (string role in Roles)
            {
                ++cnt;

                if (authorizationContext.User.IsInRole(role))
                {
                    return true;
                }
            }

            return cnt > 0 ? false : true;
        }
    }
}