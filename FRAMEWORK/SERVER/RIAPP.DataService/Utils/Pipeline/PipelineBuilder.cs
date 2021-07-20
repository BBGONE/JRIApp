using RIAPP.DataService.Core;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Pipeline
{
    public class PipelineBuilder<TService, TContext> : IPipelineBuilder<TService, TContext>
        where TService : BaseDomainService
        where TContext : IRequestContext
    {
        public PipelineBuilder(IServiceProvider services)
        {
            ApplicationServices = services;
        }

        public IServiceProvider ApplicationServices
        {
            get;
        }

        public PipelineBuilder<TService, TContext> New()
        {
            return new PipelineBuilder<TService, TContext>(ApplicationServices);
        }

        public RequestDelegate<TContext> Build()
        {
            LinkedListNode<MiddlewareComponentNode<TContext>> node = _components.Last;
            while (node != null)
            {
                node.Value.Next = GetNextFunc(node);
                node.Value.Process = node.Value.Component(node.Value.Next);
                node = node.Previous;
            }

            return _components.First.Value.Process;

            // if needed to catch unhandled exceptions
            // return GetCatchError(_components.First.Value.Process);
        }

        protected virtual async Task OnError(Exception ex, TContext ctx)
        {
            ctx.CaptureException(ex);
            ctx.AddLogItem($"Error: {ex.Message}");
            await Task.CompletedTask;
        }

        private RequestDelegate<TContext> GetNextFunc(LinkedListNode<MiddlewareComponentNode<TContext>> node)
        {
            if (node.Next == null)
            {
                // no more middleware components left in the list 
                return ctx =>
                {
                    ctx.AddLogItem("Nothing to process the request StatusCode = 404");
                    return Task.CompletedTask;
                };
            }
            else
            {
                return node.Next.Value.Process;
            }
        }

        private RequestDelegate<TContext> GetCatchError(RequestDelegate<TContext> next)
        {
            RequestDelegate<TContext> catchErrorDelegate = async ctx =>
            {
                try
                {
                    await next(ctx);
                }
                catch (Exception ex)
                {
                    await OnError(ex, ctx);
                }
            };

            return catchErrorDelegate;
        }

        public PipelineBuilder<TService, TContext> Use(Func<RequestDelegate<TContext>, RequestDelegate<TContext>> component)
        {
            MiddlewareComponentNode<TContext> node = new MiddlewareComponentNode<TContext>
            {
                Component = component
            };

            _components.AddLast(node);
            return this;
        }

        private readonly LinkedList<MiddlewareComponentNode<TContext>> _components = new LinkedList<MiddlewareComponentNode<TContext>>();
    }
}
