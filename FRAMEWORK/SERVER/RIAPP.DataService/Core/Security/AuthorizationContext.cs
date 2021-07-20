using RIAPP.DataService.Resources;
using RIAPP.DataService.Utils;
using System;
using System.Security.Claims;

namespace RIAPP.DataService.Core.Security
{
    public class AuthorizationContext
    {
        private readonly IUserProvider _userProvider;

        public AuthorizationContext(BaseDomainService service, IUserProvider userProvider, IServiceFactory serviceFactory)
        {
            Service = service;
            _userProvider = userProvider ?? throw new ArgumentNullException(nameof(userProvider), ErrorStrings.ERR_NO_USER);
            ServiceFactory = serviceFactory ?? throw new ArgumentNullException(nameof(serviceFactory));
        }

        public ClaimsPrincipal User => _userProvider.User;

        public BaseDomainService Service { get; }

        public IServiceFactory ServiceFactory { get; }
    }

    public class AuthorizationContext<TService> : AuthorizationContext
        where TService : BaseDomainService
    {
        public AuthorizationContext(TService service, IUserProvider userProvider, IServiceFactory<TService> serviceFactory)
            : base(service, userProvider, serviceFactory)
        {
        }

        public new TService Service => (TService)base.Service;

        public new IServiceFactory<TService> ServiceFactory => (IServiceFactory<TService>)base.ServiceFactory;
    }
}