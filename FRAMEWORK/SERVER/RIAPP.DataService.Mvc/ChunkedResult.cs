using RIAPP.DataService.Utils;
using System.Web.Mvc;

namespace RIAPP.DataService.Mvc
{
    public class ChunkedResult<T> : ActionResult
        where T : class
    {
        private static readonly string ResultContentType = "application/json";
        private readonly ISerializer _serializer;

        public ChunkedResult(T res, ISerializer serializer)
        {
            Data = res;
            _serializer = serializer;
        }

        public T Data { get; set; }

        public override void ExecuteResult(ControllerContext context)
        {
            System.Web.HttpResponseBase response = context.HttpContext.Response;
            response.ContentType = ResultContentType;
            response.Buffer = false;
            System.IO.Stream stream = context.HttpContext.Response.OutputStream;
            _serializer.SerializeAsync(Data, stream).GetAwaiter().GetResult();
            response.End();
        }
    }
}