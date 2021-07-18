using RIAPP.DataService.Core.Exceptions;
using RIAPP.DataService.Core.Metadata;
using RIAPP.DataService.Resources;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace RIAPP.DataService.Core.Security
{
    public class Authorizer<TService> : IAuthorizer<TService>
        where TService : BaseDomainService
    {
        private const string ANONYMOUS_USER = "ANONYMOUS_USER";
        private readonly Lazy<IEnumerable<IAuthorizeData>> _serviceAuthorization;


        public Authorizer(AuthorizationContext<TService> authorizationContext)
        {
            this.AuthorizationContext = authorizationContext ?? throw new ArgumentNullException(nameof(authorizationContext));
            this._serviceAuthorization = new Lazy<IEnumerable<IAuthorizeData>>(() => AuthorizationContext.Service.GetType().GetTypeAuthorization(), true);
        }

        public AuthorizationContext AuthorizationContext { get; }

        /// <summary>
        ///  throws AccesDeniedExeption if user have no rights to execute operation
        /// </summary>
        /// <param name="changeSet"></param>
        public async Task CheckUserRightsToExecute(IEnumerable<MethodInfoData> methods)
        {
            var authorizationTree = GetServiceAuthorization().GetAuthorizationTree(methods);

            if (!await CheckAccess(authorizationTree))
            {
                throw new AccessDeniedException(string.Format(ErrorStrings.ERR_USER_ACCESS_DENIED, this.UserName));
            }
        }

        public Task<bool> CanAccessMethod(MethodInfoData method)
        {
            var authorizationTree = GetServiceAuthorization().GetAuthorizationTree(new[] { method });
            return CheckAccess(authorizationTree);
        }

        /// <summary>
        ///   throws AccesDeniedExeption if user have no rights to execute operation
        /// </summary>
        /// <param name="changeSet"></param>
        public async Task CheckUserRightsToExecute(MethodInfoData method)
        {
            if (!await CanAccessMethod(method))
            {
                throw new AccessDeniedException(string.Format(ErrorStrings.ERR_USER_ACCESS_DENIED, this.UserName));
            }
        }

        #region Private methods
        private ClaimsPrincipal User => this.AuthorizationContext.User;

        private string UserName => this.User == null || this.User.Identity == null || !this.User.Identity.IsAuthenticated
                    ? ANONYMOUS_USER
                    : this.User.Identity.Name;

        private async Task<bool> CheckAccessCore(IEnumerable<IAuthorizeData> authorizeData)
        {
            await Task.CompletedTask;

            if (User == null)
            {
                return false;
            }

            if (authorizeData == null || !authorizeData.Any())
            {
                return true;
            }

            if (!User.Identity.IsAuthenticated && authorizeData.Any())
            {
                return false;
            }

            var denies = authorizeData.Where(a => a is IDenyAuthorizeData);

            foreach (var item in denies)
            {
                if (!(await item.IsAuthorized(AuthorizationContext)))
                {
                    return false;
                }
            }

            var authorizers = authorizeData.Where(a => !(a is IDenyAuthorizeData));

            int cnt = 0;

            foreach (var item in authorizers)
            {
                ++cnt;

                if (await item.IsAuthorized(AuthorizationContext))
                {
                    return true;
                }
            }

            return cnt > 0 ? false : true;
        }

        private IEnumerable<IAuthorizeData> GetServiceAuthorization()
        {
            return _serviceAuthorization.Value;
        }

        /// <summary>
        /// Checks access to multiple methods. If access to one method fails, then the access is blocked to all the methods
        /// </summary>
        /// <param name="allowServiceAccess"></param>
        /// <param name="methodAuthorizations"></param>
        /// <returns></returns>
        private async Task<bool> CheckMethodAccess(bool allowServiceAccess, IEnumerable<MethodAuthorization> methodAuthorizations)
        {
            bool result = true;

            foreach (var methodAuthorization in methodAuthorizations)
            {
                if (methodAuthorization.IsAllowAnonymous)
                {
                    continue;
                }

                if (User == null)
                {
                    result = false;
                    break;
                }

                // if the method does not override authorization for the service
                if (!methodAuthorization.IsOverride && !allowServiceAccess)
                {
                    // first check authorization at the service level
                    result = false;
                    break;
                }

                // check authorization for the method
                if (!await CheckAccessCore(methodAuthorization.AuthorizeData))
                {
                    result = false;
                    break;
                }
            }

            return result;
        }

        private async Task<bool> CheckOwnerAccess(bool allowServiceAccess, DataManagerAuthorization ownerAuthorization)
        {
            if (ownerAuthorization.IsAllowAnonymous)
            {
                return true;
            }

            if (User == null)
            {
                return false;
            }

            // if it does not overide authorization for the service
            if (!ownerAuthorization.IsOverride && !allowServiceAccess)
            {
                return false;
            }

            // check authorization for the owner
            if (!await CheckAccessCore(ownerAuthorization.AuthorizeData))
            {
                return false;
            }

            return true;
        }

        private async Task<bool> CheckAccess(AuthorizationTree authorizationTree)
        {
            bool result = true;
            // check authorization at the service level
            bool allowServiceAccess = await CheckAccessCore(authorizationTree.DataServiceAuthorization);

            if (authorizationTree.MethodsAuthorization.Any())
            {
                result = await CheckMethodAccess(allowServiceAccess, authorizationTree.MethodsAuthorization);

                if (!result)
                {
                    return result;
                }
            }
            else if (!authorizationTree.DataManagersAuthorization.Any())
            {
                return allowServiceAccess;
            }

            foreach (var ownerAuthorization in authorizationTree.DataManagersAuthorization)
            {
                bool allowOwnerAccess = await CheckOwnerAccess(allowServiceAccess, ownerAuthorization);
                result = await CheckMethodAccess(allowOwnerAccess, ownerAuthorization.MethodsAuthorization);

                if (!result)
                {
                    break;
                }
            }

            return result;
        }

        #endregion
    }
}