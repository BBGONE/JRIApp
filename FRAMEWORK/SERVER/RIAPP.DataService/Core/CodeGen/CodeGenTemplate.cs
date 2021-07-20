using RIAPP.DataService.Utils;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace RIAPP.DataService.Core.CodeGen
{
    public class CodeGenTemplate : TemplateParser
    {
        private const string NAMESPACE = "RIAPP.DataService.Resources";

        private static string GetTemplate(string ID)
        {
            System.Reflection.Assembly a = typeof(CodeGenTemplate).Assembly;
            //string[] resNames = a.GetManifestResourceNames();
            using (Stream stream = a.GetManifestResourceStream(string.Format("{0}.{1}", NAMESPACE, ID)))
            {
                if (null == stream)
                {
                    throw new Exception("Can not find embedded string resource: \"" + ID + "\"");
                }
                StreamReader rd = new StreamReader(stream, Encoding.UTF8);
                string txt = rd.ReadToEnd();
                return txt;
            }
        }

        protected override TemplateParser GetTemplate(string name, IDictionary<string, Func<Context, string>> dic)
        {
            return new CodeGenTemplate(name);
        }

        public CodeGenTemplate(string ID) :
            base(ID, () => GetTemplate(ID))
        {

        }
    }
}