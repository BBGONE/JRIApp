using RIAPP.DataService.Mvc;
using RIAppDemo.BLL.DataServices;
using RIAppDemo.BLL.Utils;
using System.Web.Mvc;
using System.Web.SessionState;

namespace RIAppDemo.Controllers
{
    [SessionState(SessionStateBehavior.Disabled)]
    public class RIAppDemoServiceEFController : DataServiceController<RIAppDemoServiceEF>, IHostAddrService
    {
        public RIAppDemoServiceEFController(RIAppDemoServiceEF domainService) :
            base(domainService)
        {
        }

        [ChildActionOnly]
        public string ProductModelData()
        {
            System.Threading.Tasks.Task<RIAPP.DataService.Core.Types.QueryResponse> info = GetDomainService().GetQueryData("ProductModel", "ReadProductModel");
            return Serializer.Serialize(info);
        }

        [ChildActionOnly]
        public string ProductCategoryData()
        {
            System.Threading.Tasks.Task<RIAPP.DataService.Core.Types.QueryResponse> info = GetDomainService().GetQueryData("ProductCategory", "ReadProductCategory");
            return Serializer.Serialize(info);
        }

        public string GetIPAddress()
        {
            return Request.UserHostAddress;
        }
    }
}