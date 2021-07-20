using RIAPP.DataService.Core.Types;
using RIAPP.DataService.Utils;
using System.Collections.Generic;
using System.Linq;

namespace RIAPP.DataService.Core.Metadata
{
    public class MethodMap : MultiMap<string, MethodDescription>
    {
        public IEnumerable<MethodDescription> GetQueryMethods(string dbSetName)
        {
            return this[dbSetName].Where(m => m.GetMethodData().MethodType == MethodType.Query);
        }

        public IEnumerable<MethodDescription> GetInvokeMethods()
        {
            return this[""].Where(m => m.GetMethodData().MethodType == MethodType.Invoke);
        }

        public MethodDescription GetQueryMethod(string dbSetName, string queryName)
        {
            IEnumerable<MethodDescription> list = GetQueryMethods(dbSetName);
            return list.Where(m => m.methodName == queryName).FirstOrDefault();
        }

        public MethodDescription GetInvokeMethod(string methodName)
        {
            IEnumerable<MethodDescription> list = GetInvokeMethods();
            return list.Where(m => m.methodName == methodName).FirstOrDefault();
        }
    }
}