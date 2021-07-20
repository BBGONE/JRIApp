using RIAPP.DataService.Core;
using System;

namespace Pipeline.Extensions
{
    public static class UseWhenExtensions
    {
        /// <summary>
        /// Conditionally creates a branch in the request pipeline that is rejoined to the main pipeline.
        /// </summary>
        /// <param name="app"></param>
        /// <param name="predicate">Invoked with the request environment to determine if the branch should be taken</param>
        /// <param name="configuration">Configures a branch to take</param>
        /// <returns></returns>
        public static IPipelineBuilder<TService, TContext> UseWhen<TService, TContext>(this IPipelineBuilder<TService, TContext> app, Predicate<TContext> predicate, Action<IPipelineBuilder<TService, TContext>> configuration)
             where TService : BaseDomainService
             where TContext : IRequestContext
        {
            if (app == null)
            {
                throw new ArgumentNullException(nameof(app));
            }

            if (predicate == null)
            {
                throw new ArgumentNullException(nameof(predicate));
            }

            if (configuration == null)
            {
                throw new ArgumentNullException(nameof(configuration));
            }

            // Create and configure the branch builder right away; otherwise,
            // we would end up running our branch after all the components
            // that were subsequently added to the main builder.
            PipelineBuilder<TService, TContext> branchBuilder = app.New();
            configuration(branchBuilder);

            return app.Use(main =>
            {
                // This is called only when the main application builder 
                // is built, not per request.
                branchBuilder.Run(main);
                RequestDelegate<TContext> branch = branchBuilder.Build();

                return context =>
                {
                    if (predicate(context))
                    {
                        return branch(context);
                    }
                    else
                    {
                        return main(context);
                    }
                };
            });
        }
    }
}
