using Microsoft.Extensions.DependencyInjection;
using RIAPP.DataService.EF2;
using RIAppDemo.BLL.Models;
using RIAppDemo.DAL.EF;
using System;

namespace RIAppDemo.BLL.DataServices.Config
{
    public static class RIAppDemoServiceEFConfig
    {
        public static void AddRIAppDemoService(this IServiceCollection services,
            Action<SvcOptions> configure)
        {
            services.AddEF2DomainService<RIAppDemoServiceEF, ADWDbContext>((options) =>
            {

                ValidatorConfig.RegisterValidators(options.ValidatorRegister);
                DataManagerConfig.RegisterDataManagers(options.DataManagerRegister);

                options.ClientTypes = () => new[] { typeof(TestModel), typeof(KeyVal), typeof(StrKeyVal), typeof(RadioVal), typeof(HistoryItem), typeof(TestEnum2) };

                SvcOptions svcOptions = new SvcOptions();
                configure?.Invoke(svcOptions);

                options.UserFactory = svcOptions.GetUser;
            });

            services.AddScoped<ADWDbContext>((sp) =>
            {
                ADWDbContext res = new ADWDbContext(sp.GetRequiredService<DBConnectionFactory>().GetRIAppDemoConnection());
                return res;
            });
        }
    }
}
