using RIAppDemo.BLL.Utils;
using System;
using System.IO;
using System.Linq;
using System.Web.Mvc;

namespace RIAppDemo.Models
{
    public static class UploadExtensions
    {
        private static UploadedFile RetrieveFileFromRequest(Controller controller)
        {
            System.Web.HttpRequestBase Request = controller.Request;
            int? chunkSize = Request.Headers.Keys.OfType<string>().Contains("X-Chunk-Size") ? int.Parse(Request.Headers["X-Chunk-Size"]) : (int?)null;
            int fileSize = chunkSize.HasValue ? int.Parse(Request.Headers["X-File-Size"]) : Request.ContentLength;
            string filename = Uri.UnescapeDataString(Request.Headers["X-File-Name"]);
            string fileType = Request.Headers["X-File-Type"];
            int id = int.Parse(Request.Headers["X-Data-ID"]);
            return new UploadedFile()
            {
                FileName = filename,
                ContentType = fileType,
                FileSize = fileSize,
                Content = Request.InputStream,
                DataID = id,
                ChunkNum = Request.Headers.Keys.OfType<string>().Contains("X-Chunk-Num") ? int.Parse(Request.Headers["X-Chunk-Num"]) : (int?)null,
                ChunkSize = chunkSize,
                ChunkTotal = Request.Headers.Keys.OfType<string>().Contains("X-Chunk-Count") ? int.Parse(Request.Headers["X-Chunk-Count"]) : (int?)null
            };
        }

        private static string SaveChunk(Controller controller, UploadedFile file)
        {
            string dir = controller.ControllerContext.HttpContext.Server.MapPath(@"~/App_Data");
            dir = Path.Combine(dir, "TEMP");
            string filepath = Path.Combine(dir, string.Format("{0}{1}.tmp", Path.GetFileNameWithoutExtension(file.FileName), file.DataID));
            if (!System.IO.Directory.Exists(dir))
            {
                System.IO.Directory.CreateDirectory(dir);
            }

            using (FileStream fileStream = (file.ChunkNum == 1) ? System.IO.File.Create(filepath) : System.IO.File.Open(filepath, FileMode.Append))
            {
                file.Content.CopyTo(fileStream);
            }

            return filepath;
        }

        public static UploadedFile GetFileFromRequest(this Controller controller)
        {
            UploadedFile file = RetrieveFileFromRequest(controller);
            if (file.IsChunked)
            {
                string filepath = SaveChunk(controller, file);

                if (file.IsLastChunk)
                {
                    file.DataContent = new FileContent(filepath);
                }
            }
            else
            {
                file.DataContent = new StreamContent(file.Content);
            }

            return file;
        }
    }

    public class UploadedFile
    {
        public int DataID { get; set; }
        public int FileSize { get; set; }
        public string FileName { get; set; }
        public string ContentType { get; set; }
        public Stream Content { get; set; }
        public IDataContent DataContent { get; set; }

        public int? ChunkNum { get; set; }

        public int? ChunkSize { get; set; }

        public int? ChunkTotal { get; set; }

        public bool IsLastChunk => ChunkTotal.HasValue && ChunkTotal.Value == ChunkNum.Value;

        public bool IsChunked => ChunkTotal.HasValue;
    }
}