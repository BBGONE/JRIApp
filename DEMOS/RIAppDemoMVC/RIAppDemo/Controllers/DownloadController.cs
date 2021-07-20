using RIAppDemo.BLL.Utils;
using System;
using System.IO;
using System.Net.Mime;
using System.Threading.Tasks;
using System.Web.Mvc;
using System.Web.SessionState;

namespace RIAppDemo.Controllers
{
    [SessionState(SessionStateBehavior.Disabled)]
    public class DownloadController : Controller
    {
        private readonly IThumbnailService _thumbnailService;

        public DownloadController(IThumbnailService thumbnailService)
        {
            _thumbnailService = thumbnailService;
        }


        public ActionResult Index()
        {
            return new EmptyResult();
        }

        public async Task<ActionResult> ThumbnailDownload(int id)
        {
            try
            {
                MemoryStream stream = new MemoryStream();
                string fileName = await _thumbnailService.GetThumbnail(id, stream);
                if (string.IsNullOrEmpty(fileName))
                {
                    return new HttpStatusCodeResult(400);
                }

                stream.Position = 0;
                FileStreamResult res = new FileStreamResult(stream, MediaTypeNames.Image.Jpeg)
                {
                    FileDownloadName = fileName
                };
                return res;
            }
            catch (Exception)
            {
                return new HttpStatusCodeResult(404);
            }
        }

        public ActionResult DownloadTemplate(string name)
        {
            string baseDir = AppDomain.CurrentDomain.BaseDirectory;
            string path1 = Path.Combine(baseDir, "Templates");
            string path2 = Path.GetFullPath(Path.Combine(path1, string.Format("{0}.html", name)));
            if (!path2.StartsWith(path1))
            {
                throw new Exception("template name is invalid");
            }

            return new FilePathResult(path2, MediaTypeNames.Text.Plain);
        }
    }
}