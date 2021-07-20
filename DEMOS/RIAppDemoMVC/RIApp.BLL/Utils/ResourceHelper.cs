using System;
using System.IO;
using System.Text;

namespace RIAppDemo.BLL.Utils
{
    public class ResourceHelper
    {
        public static string GetResourceString(string ID)
        {
            System.Reflection.Assembly a = typeof(ResourceHelper).Assembly;
            //string[] resNames = a.GetManifestResourceNames();
            using (Stream stream = a.GetManifestResourceStream(ID))
            {
                if (null == stream)
                {
                    throw new Exception("Can not find resource: \"" + ID + "\"");
                }
                StreamReader rd = new StreamReader(stream, Encoding.UTF8);
                string txt = rd.ReadToEnd();
                return txt;
            }
        }
    }
}