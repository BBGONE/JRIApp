using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Security.Claims;

namespace RIAPP.DataService.Core.Config
{
    public class ServiceOptions : IServiceOptions
    {
        public ServiceOptions(IServiceCollection services)
        {
            Services = services;
            DataManagerRegister = new DataManagerRegister();
            ValidatorRegister = new ValidatorRegister();
        }

        public Func<IServiceProvider, ClaimsPrincipal> UserFactory { get; set; }

        public Func<IEnumerable<Type>> ClientTypes { get; set; }

        public IValidatorRegister ValidatorRegister
        {
            get;
        }

        public IDataManagerRegister DataManagerRegister
        {
            get;
        }

        public IServiceCollection Services
        {
            get;
        }
    }
}