using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;

namespace RIAppDemo.Utils
{
    public static class ServiceProviderExtensions
    {
        public static IServiceCollection AddControllersAsServices(this IServiceCollection services, IEnumerable<Type> controllerTypes)
        {
            foreach (Type type in controllerTypes)
            {
                services.AddTransient(type);
            }

            return services;
        }
    }

}