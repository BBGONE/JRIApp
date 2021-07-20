using Pipeline.Middleware;
using RIAPP.DataService.Core;
using System;

namespace Pipeline.Extensions
{
    public static class MapWhenExtensions
    {
        public class MapWhenOptions<TContext>
        {
            private Predicate<TContext> _predicate;

            /// <summary>
            /// The user callback that determines if the branch should be taken.
            /// </summary>
            public Predicate<TContext> Predicate
            {
                get => _predicate;
                set
                {
                    if (value == null)
                    {
                        throw new ArgumentNullException(nameof(value));
                    }

                    _predicate = value;
                }
            }

            /// <summary>
            /// The branch taken for a positive match.
            /// </summary>
            public RequestDelegate<TContext> Branch { get; set; }
        }


        public static IPipelineBuilder<TService, TContext> MapWhen<TService, TContext>(this IPipelineBuilder<TService, TContext> app, Predicate<TContext> predicate, Action<IPipelineBuilder<TService, TContext>> configuration)
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

            // create branch
            PipelineBuilder<TService, TContext> branchBuilder = app.New();
            configuration(branchBuilder);
            RequestDelegate<TContext> branch = branchBuilder.Build();

            // put middleware in pipeline
            MapWhenOptions<TContext> options = new MapWhenOptions<TContext>
            {
                Predicate = predicate,
                Branch = branch,
            };

            return app.Use(next => new MapWhenMiddleware<TContext>(next, options).Invoke);
        }
    }
}
