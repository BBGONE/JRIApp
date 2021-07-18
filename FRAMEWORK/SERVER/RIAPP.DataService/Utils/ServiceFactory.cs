using RIAPP.DataService.Core;
using System;
using System.Collections.Generic;

namespace RIAPP.DataService.Utils
{
    public interface IServiceFactory
    {
        object GetInstance(Type serviceType);
    }

    public interface IServiceFactory<TService> : IServiceFactory
         where TService : BaseDomainService
    {
    }

    public static class ServiceFactoryExtensions
    {
        public static T GetInstance<T>(this IServiceFactory factory)
        {
            return (T)factory.GetInstance(typeof(T));
        }

        public static IEnumerable<T> GetInstances<T>(this IServiceFactory factory)
        {
            return (IEnumerable<T>)factory.GetInstance(typeof(IEnumerable<T>));
        }
    }
}