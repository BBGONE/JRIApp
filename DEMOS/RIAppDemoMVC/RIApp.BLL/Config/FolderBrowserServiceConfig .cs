using Microsoft.Extensions.DependencyInjection;
using RIAPP.DataService.Core.Config;
using System;

namespace RIAppDemo.BLL.DataServices.Config
{
    public static class FolderBrowserServiceConfig
    {
        public static void AddFolderBrowser(this IServiceCollection services,
           Action<SvcOptions> configure)
        {
            services.AddDomainService<FolderBrowserService>((options) =>
            {
                SvcOptions svcOptions = new SvcOptions();
                configure?.Invoke(svcOptions);

                options.UserFactory = svcOptions.GetUser;
            });
        }
    }
}
