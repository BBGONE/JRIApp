using System.Web.Mvc;

namespace RIAPP.DataService.Mvc.Utils
{
    public class NotModifiedResult : ActionResult
    {
        public override void ExecuteResult(ControllerContext context)
        {
            System.Web.HttpResponseBase response = context.HttpContext.Response;
            response.StatusCode = 304;
            response.StatusDescription = "Not Modified";
            response.SuppressContent = true;
        }
    }
}