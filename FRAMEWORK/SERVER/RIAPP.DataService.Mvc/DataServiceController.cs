using RIAPP.DataService.Core;
using RIAPP.DataService.Core.CodeGen;
using RIAPP.DataService.Core.Types;
using RIAPP.DataService.Mvc.Utils;
using RIAPP.DataService.Utils;
using System;
using System.Net.Mime;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using System.Web.SessionState;

namespace RIAPP.DataService.Mvc
{
    [NoCache]
    [SessionState(SessionStateBehavior.Disabled)]
    public abstract class DataServiceController<TService> : Controller
        where TService : BaseDomainService
    {
        private readonly TService _DomainService;

        public DataServiceController(TService domainService)
        {
            _DomainService = domainService;
        }

        protected IDomainService DomainService => _DomainService;

        public ISerializer Serializer => _DomainService.Serializer;

        [ActionName("typescript")]
        [HttpGet]
        public ActionResult GetTypeScript()
        {
            string url = ControllerContext.HttpContext.Request.RawUrl;
            DateTime now = DateTime.Now;
            string comment = $"\tGenerated from: {url} on {now:yyyy-MM-dd} at {now:HH:mm}\r\n\tDon't make manual changes here, they will be lost when this interface will be regenerated!";
            string content = DomainService.ServiceCodeGen(new CodeGenArgs("ts") { comment = comment });
            ContentResult res = new ContentResult
            {
                ContentType = MediaTypeNames.Text.Plain,
                Content = content
            };
            return res;
        }

        [ActionName("xaml")]
        [HttpGet]
        public ActionResult GetXAML(bool isDraft = true)
        {
            string content = DomainService.ServiceCodeGen(new CodeGenArgs("xaml") { isDraft = isDraft });
            ContentResult res = new ContentResult
            {
                ContentEncoding = Encoding.UTF8,
                ContentType = MediaTypeNames.Text.Plain,
                Content = content
            };
            return res;
        }

        [ActionName("csharp")]
        [HttpGet]
        public ActionResult GetCSharp()
        {
            string content = DomainService.ServiceCodeGen(new CodeGenArgs("csharp"));
            ContentResult res = new ContentResult
            {
                ContentEncoding = Encoding.UTF8,
                ContentType = MediaTypeNames.Text.Plain,
                Content = content
            };
            return res;
        }

        [ChildActionOnly]
        public string PermissionsInfo()
        {
            Permissions info = DomainService.ServiceGetPermissions().Result;
            return Serializer.Serialize(info);
        }

        [ActionName("code")]
        [HttpGet]
        public ActionResult GetCode(string lang)
        {
            if (lang != null)
            {
                switch (lang.ToLowerInvariant())
                {
                    case "ts":
                    case "typescript":
                        return GetTypeScript();
                    case "xml":
                    case "xaml":
                        return GetXAML();
                    case "csharp":
                    case "c#":
                        return GetCSharp();
                    default:
                        throw new Exception(string.Format("Unknown lang argument: {0}", lang));
                }
            }
            return GetTypeScript();
        }

        [ActionName("permissions")]
        [HttpGet]
        public async Task<ActionResult> GetPermissions()
        {
            Permissions res = await DomainService.ServiceGetPermissions();
            return new ChunkedResult<Permissions>(res, Serializer);
        }

        [ActionName("query")]
        [HttpPost]
        public async Task<ActionResult> PerformQuery([ServiceParamsBinder] QueryRequest request)
        {
            QueryResponse response = await DomainService.ServiceGetData(request);
            return new ChunkedResult<QueryResponse>(response, Serializer);
        }

        [ActionName("save")]
        [HttpPost]
        public async Task<ActionResult> Save([ServiceParamsBinder] ChangeSetRequest changeSet)
        {
            ChangeSetResponse response = await DomainService.ServiceApplyChangeSet(changeSet);
            return new ChunkedResult<ChangeSetResponse>(response, Serializer);
        }

        [ActionName("refresh")]
        [HttpPost]
        public async Task<ActionResult> Refresh([ServiceParamsBinder] RefreshRequest refreshInfo)
        {
            RefreshResponse response = await DomainService.ServiceRefreshRow(refreshInfo);
            return new ChunkedResult<RefreshResponse>(response, Serializer);
        }

        [ActionName("invoke")]
        [HttpPost]
        public async Task<ActionResult> Invoke([ServiceParamsBinder] InvokeRequest invokeInfo)
        {
            InvokeResponse response = await DomainService.ServiceInvokeMethod(invokeInfo);
            return new ChunkedResult<InvokeResponse>(response, Serializer);
        }

        protected TService GetDomainService()
        {
            return _DomainService;
        }

    }
}