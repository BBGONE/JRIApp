using System;
using System.Collections.Concurrent;
using System.IO;
using System.Net.Mime;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace RIAPP.DataService.Mvc.Utils
{
    /// <summary>
    ///     Optimazes loadinin asset such as css styles, js files
    ///     it caches then in memory
    ///     js - files optionally minified
    ///     it compresses the result with gzip or deflate
    /// </summary>
    public class OptimizationController : Controller
    {
        private const string JavaScriptMediaType = "text/javascript";
        private const string CssMediaType = "text/css";
        private const string ImgPngMediaType = "image/png";

        private static readonly ConcurrentDictionary<string, CachedResult> _cache =
            new ConcurrentDictionary<string, CachedResult>();

        private static readonly ConcurrentBag<Func<string, bool>> _checks1 = new ConcurrentBag<Func<string, bool>>();
        private static readonly ConcurrentBag<Func<string, bool>> _checks2 = new ConcurrentBag<Func<string, bool>>();

        private static readonly string[] _imgMediaTypes =
        {
            ImgPngMediaType, MediaTypeNames.Image.Jpeg,
            MediaTypeNames.Image.Gif
        };


        static OptimizationController()
        {
            _checks1.Add(str => { return str.StartsWith("img/"); });
            _checks1.Add(str => { return str.StartsWith("scripts/"); });
            _checks1.Add(str => { return str.StartsWith("css/"); });
            _checks1.Add(str => { return str.StartsWith("content/"); });

            _checks2.Add(str => { return str.EndsWith(".png"); });
            _checks2.Add(str => { return str.EndsWith(".gif"); });
            _checks2.Add(str => { return str.EndsWith(".jpg"); });
            _checks2.Add(str => { return str.EndsWith(".jpeg"); });
            _checks2.Add(str => { return str.EndsWith(".css"); });
            _checks2.Add(str => { return str.EndsWith(".js"); });
            _checks2.Add(str => { return str.EndsWith(".map"); });
        }

        public virtual bool isOptimizationEnabled => false;

        //[Compress]
        public ActionResult Index(string bust, int min, string path)
        {
            if (!IsAllowed(path))
            {
                return new HttpStatusCodeResult(404);
            }

            DateTime lastModified = DateTime.MinValue;
            if (!DateTime.TryParse(Request.Headers["If-Modified-Since"], out lastModified))
            {
                lastModified = DateTime.MinValue;
            }

            //System.Diagnostics.Trace.WriteLine(path);

            if (_cache.TryGetValue(path, out CachedResult cachedResult))
            {
                if (lastModified >= cachedResult.lastWrite)
                {
                    return new NotModifiedResult();
                }

                Response.Cache.SetCacheability(HttpCacheability.Private);
                Response.Cache.SetMaxAge(TimeSpan.FromDays(365));
                Response.Cache.SetLastModified(cachedResult.lastWrite);
            }
            else
            {
                cachedResult = _cache.GetOrAdd(path, key =>
                {
                    string physicalPath = Server.MapPath("~/" + key);
                    DateTime lastWrite = System.IO.File.GetLastWriteTimeUtc(physicalPath);
                    string contentType = GetContentType(key);

                    Response.Cache.SetCacheability(HttpCacheability.Private);
                    Response.Cache.SetMaxAge(TimeSpan.FromDays(365));
                    Response.Cache.SetLastModified(lastWrite);

                    byte[] bytes = null;

                    if (isOptimizationEnabled && min == 1 && contentType == JavaScriptMediaType)
                    {
                        bytes = MinifyJS(physicalPath);
                    }
                    else if (isOptimizationEnabled && min == 1 && contentType == CssMediaType)
                    {
                        bytes = MinifyCss(physicalPath);
                    }
                    else
                    {
                        bytes = GetFileBytes(physicalPath);
                    }

                    cachedResult = new CachedResult { bytes = bytes, contentType = contentType, lastWrite = lastWrite };
                    return cachedResult;
                });
            }

            bool isImage = Array.IndexOf(_imgMediaTypes, cachedResult.contentType) > -1;

            if (isImage)
            {
                return new NoCompressFileResult(cachedResult.bytes, cachedResult.contentType);
            }

            return new FileContentResult(cachedResult.bytes, cachedResult.contentType);
        }

        private static byte[] MinifyJS(string physicalPath)
        {
            JSMin compressor = new JSMin();
            using (MemoryStream result = new MemoryStream())
            {
                StreamWriter writer = new StreamWriter(result, Encoding.UTF8, 1024, true);
                using (FileStream fs = System.IO.File.OpenRead(physicalPath))
                using (StreamReader reader = new StreamReader(fs, Encoding.UTF8))
                {
                    compressor.Minify(reader, writer);
                }
                result.Position = 0;
                return result.ToArray();
            }
        }

        private static byte[] MinifyCss(string physicalPath)
        {
            string css = System.IO.File.ReadAllText(physicalPath, Encoding.UTF8);
            css = CssMin.RemoveWhiteSpaceFromStylesheets(css);
            return Encoding.UTF8.GetBytes(css);
        }

        private static byte[] GetFileBytes(string physicalPath)
        {
            using (MemoryStream result = new MemoryStream())
            {
                using (FileStream fs = System.IO.File.OpenRead(physicalPath))
                {
                    fs.CopyTo(result);
                }
                result.Position = 0;
                return result.ToArray();
            }
        }

        private bool IsAllowed(string path)
        {
            if (string.IsNullOrEmpty(path))
            {
                return false;
            }

            string lowerPath = path.ToLower();
            if (lowerPath.Contains(".."))
            {
                return false;
            }

            bool isOk = false;
            foreach (Func<string, bool> check in _checks1)
            {
                isOk = check(lowerPath);
                if (isOk)
                {
                    break;
                }
            }
            if (!isOk)
            {
                return false;
            }

            isOk = false;
            foreach (Func<string, bool> check in _checks2)
            {
                isOk = check(lowerPath);
                if (isOk)
                {
                    break;
                }
            }

            return isOk;
        }

        private static string GetContentType(string path)
        {
            string extension = Path.GetExtension(path).ToLowerInvariant();
            switch (extension)
            {
                case ".js":
                    return JavaScriptMediaType;
                case ".css":
                    return CssMediaType;
                case ".png":
                    return ImgPngMediaType;
                case ".jpg":
                case ".jpeg":
                    return MediaTypeNames.Image.Jpeg;
                case ".gif":
                    return MediaTypeNames.Image.Gif;
                default:
                    return MediaTypeNames.Text.Plain;
            }
        }

        private class CachedResult
        {
            public byte[] bytes;
            public string contentType;
            public DateTime lastWrite;
        }
    }
}