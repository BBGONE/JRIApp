using System.Configuration;
using System.IO;
using System.Web;
using System.Web.Mvc;

namespace RIAPP.DataService.Mvc.Utils
{
    public static class UrlHelperEx
    {
        public static string Content(this UrlHelper Url, string Path, bool addTimeStamp)
        {
            if (!addTimeStamp)
            {
                return Url.Content(Path);
            }

            string serverPath = HttpContext.Current.Server.MapPath(Path);
            System.DateTime lastWrite = File.GetLastWriteTimeUtc(serverPath);
            string result = lastWrite.Ticks.ToString();
            return Url.Content(Path) + "?t=" + result;
        }

        public static string Asset(this UrlHelper Url, string path, bool minify)
        {
            string bust = Bust(Url);
            string min = minify ? "1" : "0";

            return Url.RouteUrl("Assets", new { bust, min, path });
        }

        public static string Bust(this UrlHelper Url)
        {
            return ConfigurationManager.AppSettings["browserCacheBust"];
        }
    }
}