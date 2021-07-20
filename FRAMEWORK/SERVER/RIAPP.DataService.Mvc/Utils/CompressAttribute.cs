using System.IO.Compression;
using System.Web.Mvc;

namespace RIAPP.DataService.Mvc.Utils
{
    public class CompressAttribute : ActionFilterAttribute
    {
        public override void OnResultExecuting(ResultExecutingContext filterContext)
        {
            if (filterContext.Result is INoCompressResult)
            {
                return;
            }

            System.Web.HttpRequestBase request = filterContext.HttpContext.Request;

            string acceptEncoding = request.Headers["Accept-Encoding"];

            if (string.IsNullOrEmpty(acceptEncoding))
            {
                return;
            }

            acceptEncoding = acceptEncoding.ToUpperInvariant();

            System.Web.HttpResponseBase response = filterContext.HttpContext.Response;

            if (acceptEncoding.Contains("GZIP"))
            {
                response.AppendHeader("Content-encoding", "gzip");
                response.Filter = new GZipStream(response.Filter, CompressionMode.Compress);
            }
            else if (acceptEncoding.Contains("DEFLATE"))
            {
                response.AppendHeader("Content-encoding", "deflate");
                response.Filter = new DeflateStream(response.Filter, CompressionMode.Compress);
            }
        }
    }
}


//public override void OnActionExecuting(ActionExecutingContext filterContext)
//{
//HttpRequestBase request = filterContext.HttpContext.Request;

//string acceptEncoding = request.Headers["Accept-Encoding"];

//if (string.IsNullOrEmpty(acceptEncoding)) return;

//acceptEncoding = acceptEncoding.ToUpperInvariant();

//HttpResponseBase response = filterContext.HttpContext.Response;

//if (acceptEncoding.Contains("GZIP"))
//{
//    response.AppendHeader("Content-encoding", "gzip");
//    response.Filter = new GZipStream(response.Filter, CompressionMode.Compress);
//}
//else if (acceptEncoding.Contains("DEFLATE"))
//{
//    response.AppendHeader("Content-encoding", "deflate");
//    response.Filter = new DeflateStream(response.Filter, CompressionMode.Compress);
//}
//}