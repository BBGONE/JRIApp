using Microsoft.Extensions.DependencyInjection;
using Pipeline.Middleware;
using RIAPP.DataService.Core;
using System;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Threading.Tasks;

namespace Pipeline.Extensions
{
    /// <summary>
    /// Extension methods for adding typed middleware.
    /// </summary>
    public static class UseMiddlewareExtensions
    {
        internal const string InvokeMethodName = "Invoke";
        internal const string InvokeAsyncMethodName = "InvokeAsync";

        private static readonly MethodInfo GetServiceInfo = typeof(UseMiddlewareExtensions).GetMethod(nameof(GetService), BindingFlags.NonPublic | BindingFlags.Static);

        /// <summary>
        /// Adds a middleware type to the application's request pipeline.
        /// </summary>
        /// <typeparam name="TMiddleware">The middleware type.</typeparam>
        /// <param name="app">The <see cref="IPipelineBuilder"/> instance.</param>
        /// <param name="args">The arguments to pass to the middleware type instance's constructor.</param>
        /// <returns>The <see cref="IPipelineBuilder"/> instance.</returns>
        public static IPipelineBuilder<TService, TContext> UseMiddleware<TMiddleware, TService, TContext>(this IPipelineBuilder<TService, TContext> app, params object[] args)
             where TService : BaseDomainService
             where TContext : IRequestContext
        {
            return app.UseMiddleware(typeof(TMiddleware), args);
        }

        /// <summary>
        /// Adds a middleware type to the application's request pipeline.
        /// </summary>
        /// <param name="app">The <see cref="IPipelineBuilder"/> instance.</param>
        /// <param name="middleware">The middleware type.</param>
        /// <param name="args">The arguments to pass to the middleware type instance's constructor.</param>
        /// <returns>The <see cref="IPipelineBuilder"/> instance.</returns>
        public static IPipelineBuilder<TService, TContext> UseMiddleware<TService, TContext>(this IPipelineBuilder<TService, TContext> app, Type middleware, params object[] args)
            where TService : BaseDomainService
            where TContext : IRequestContext
        {
            if (typeof(IMiddleware<TContext>).GetTypeInfo().IsAssignableFrom(middleware.GetTypeInfo()))
            {
                // IMiddleware doesn't support passing args directly since it's
                // activated from the container
                if (args.Length > 0)
                {
                    throw new NotSupportedException("UseMiddlewareExplicitArgumentsNotSupported(typeof(IMiddleware))");
                }

                return UseMiddlewareInterface(app, middleware);
            }

            IServiceProvider applicationServices = app.ApplicationServices;

            return app.Use(next =>
            {
                MethodInfo[] methods = middleware.GetMethods(BindingFlags.Instance | BindingFlags.Public);
                MethodInfo[] invokeMethods = methods.Where(m =>
                    string.Equals(m.Name, InvokeMethodName, StringComparison.Ordinal)
                    || string.Equals(m.Name, InvokeAsyncMethodName, StringComparison.Ordinal)
                    ).ToArray();

                if (invokeMethods.Length > 1)
                {
                    throw new InvalidOperationException("UseMiddleMutlipleInvokes(InvokeMethodName, InvokeAsyncMethodName)");
                }

                if (invokeMethods.Length == 0)
                {
                    throw new InvalidOperationException("UseMiddlewareNoInvokeMethod(InvokeMethodName, InvokeAsyncMethodName, middleware)");
                }

                MethodInfo methodInfo = invokeMethods[0];
                if (!typeof(Task).IsAssignableFrom(methodInfo.ReturnType))
                {
                    throw new InvalidOperationException("UseMiddlewareNonTaskReturnType(InvokeMethodName, InvokeAsyncMethodName, nameof(Task))");
                }

                ParameterInfo[] parameters = methodInfo.GetParameters();
                if (parameters.Length == 0 || parameters[0].ParameterType != typeof(TContext))
                {
                    throw new InvalidOperationException("UseMiddlewareNoParameters(InvokeMethodName, InvokeAsyncMethodName, nameof(HttpContext))");
                }

                object[] ctorArgs = new object[args.Length + 1];
                ctorArgs[0] = next;
                Array.Copy(args, 0, ctorArgs, 1, args.Length);
                object instance = ActivatorUtilities.CreateInstance(app.ApplicationServices, middleware, ctorArgs);
                if (parameters.Length == 1)
                {
                    return (RequestDelegate<TContext>)methodInfo.CreateDelegate(typeof(RequestDelegate<TContext>), instance);
                }

                Func<object, TContext, IServiceProvider, Task> factory = Compile<object, TContext>(methodInfo, parameters);

                return context =>
                {
                    IServiceProvider serviceProvider = context.RequestServices ?? applicationServices;
                    if (serviceProvider == null)
                    {
                        throw new InvalidOperationException("UseMiddlewareIServiceProviderNotAvailable(nameof(IServiceProvider))");
                    }

                    return factory(instance, context, serviceProvider);
                };
            });
        }

        private static IPipelineBuilder<TService, TContext> UseMiddlewareInterface<TService, TContext>(IPipelineBuilder<TService, TContext> app, Type middlewareType)
             where TService : BaseDomainService
             where TContext : IRequestContext
        {
            return app.Use(next =>
            {
                return async context =>
                {
                    IMiddlewareFactory<TContext> middlewareFactory = (IMiddlewareFactory<TContext>)context.RequestServices.GetService(typeof(IMiddlewareFactory<TContext>));
                    if (middlewareFactory == null)
                    {
                        // No middleware factory
                        throw new InvalidOperationException("UseMiddlewareNoMiddlewareFactory(typeof(IMiddlewareFactory))");
                    }

                    IMiddleware<TContext> middleware = middlewareFactory.Create(middlewareType);
                    if (middleware == null)
                    {
                        // The factory returned null, it's a broken implementation
                        throw new InvalidOperationException("UseMiddlewareUnableToCreateMiddleware(middlewareFactory.GetType(), middlewareType)");
                    }

                    try
                    {
                        await middleware.InvokeAsync(context, next);
                    }
                    finally
                    {
                        middlewareFactory.Release(middleware);
                    }
                };
            });
        }

        private static Func<T, TContext, IServiceProvider, Task> Compile<T, TContext>(MethodInfo methodInfo, ParameterInfo[] parameters)
             where TContext : IRequestContext
        {
            // If we call something like
            //
            // public class Middleware
            // {
            //    public Task Invoke(HttpContext context, ILoggerFactory loggerFactory)
            //    {
            //
            //    }
            // }
            //

            // We'll end up with something like this:
            //   Generic version:
            //
            //   Task Invoke(Middleware instance, HttpContext httpContext, IServiceProvider provider)
            //   {
            //      return instance.Invoke(httpContext, (ILoggerFactory)UseMiddlewareExtensions.GetService(provider, typeof(ILoggerFactory));
            //   }

            //   Non generic version:
            //
            //   Task Invoke(object instance, HttpContext httpContext, IServiceProvider provider)
            //   {
            //      return ((Middleware)instance).Invoke(httpContext, (ILoggerFactory)UseMiddlewareExtensions.GetService(provider, typeof(ILoggerFactory));
            //   }

            Type middleware = typeof(T);

            ParameterExpression contextArg = Expression.Parameter(typeof(TContext), "context");
            ParameterExpression providerArg = Expression.Parameter(typeof(IServiceProvider), "serviceProvider");
            ParameterExpression instanceArg = Expression.Parameter(middleware, "middleware");

            Expression[] methodArguments = new Expression[parameters.Length];
            methodArguments[0] = contextArg;
            for (int i = 1; i < parameters.Length; i++)
            {
                Type parameterType = parameters[i].ParameterType;
                if (parameterType.IsByRef)
                {
                    throw new NotSupportedException("InvokeDoesNotSupportRefOrOutParams(InvokeMethodName)");
                }

                Expression[] parameterTypeExpression = new Expression[]
                {
                    providerArg,
                    Expression.Constant(parameterType, typeof(Type)),
                    Expression.Constant(methodInfo.DeclaringType, typeof(Type))
                };

                MethodCallExpression getServiceCall = Expression.Call(GetServiceInfo, parameterTypeExpression);
                methodArguments[i] = Expression.Convert(getServiceCall, parameterType);
            }

            Expression middlewareInstanceArg = instanceArg;
            if (methodInfo.DeclaringType != typeof(T))
            {
                middlewareInstanceArg = Expression.Convert(middlewareInstanceArg, methodInfo.DeclaringType);
            }

            MethodCallExpression body = Expression.Call(middlewareInstanceArg, methodInfo, methodArguments);

            Expression<Func<T, TContext, IServiceProvider, Task>> lambda = Expression.Lambda<Func<T, TContext, IServiceProvider, Task>>(body, instanceArg, contextArg, providerArg);

            return lambda.Compile();
        }

        private static object GetService(IServiceProvider sp, Type type, Type middleware)
        {
            object service = sp.GetService(type);
            if (service == null)
            {
                throw new InvalidOperationException("InvokeMiddlewareNoService(type, middleware)");
            }

            return service;
        }
    }
}
