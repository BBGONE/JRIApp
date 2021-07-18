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
            var a = typeof(CodeGenTemplate).Assembly;
            //string[] resNames = a.GetManifestResourceNames();
            using (var stream = a.GetManifestResourceStream(string.Format("{0}.{1}", NAMESPACE, ID)))
            {
                if (null == stream)
                {
                    throw new Exception("Can not find embedded string resource: \"" + ID + "\"");
                }
                var rd = new StreamReader(stream, Encoding.UTF8);
                var txt = rd.ReadToEnd();
                return txt;
            }
        }

        protected override IEnumerable<Part> GetTemplate(string name, IDictionary<string, Func<Context, string>> dic)
        {
            CodeGenTemplate parser = new CodeGenTemplate(name);
            var result = parser.Execute(dic);
            return result;
        }

        public CodeGenTemplate(string ID) :
            base(ID, () => GetTemplate(ID))
        {

        }
    }
}