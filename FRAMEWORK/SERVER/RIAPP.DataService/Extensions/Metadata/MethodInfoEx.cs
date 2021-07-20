using RIAPP.DataService.Core.Types;
using RIAPP.DataService.Utils;
using System;
using System.Collections.Generic;
using System.Linq;

namespace RIAPP.DataService.Core.Metadata
{
    public static class MethodInfoEx
    {
        public static IEnumerable<MethodInfoData> GetQueryOnly(this IEnumerable<MethodInfoData> allList)
        {
            return allList.Where(info => info.MethodType == MethodType.Query);
        }

        public static IEnumerable<MethodInfoData> GetQueryAndInvokeOnly(this IEnumerable<MethodInfoData> allList)
        {
            return allList.Where(info => info.MethodType == MethodType.Query || info.MethodType == MethodType.Invoke);
        }

        public static IEnumerable<MethodInfoData> GetOthersOnly(this IEnumerable<MethodInfoData> allList)
        {
            return allList.Where(info => !(info.MethodType == MethodType.Query || info.MethodType == MethodType.Invoke ||
                          info.MethodType == MethodType.None));
        }

        public static MethodsList GetSvcMethods(this IEnumerable<MethodInfoData> allList, IValueConverter valueConverter)
        {
            MethodInfoData[] queryAndInvokes = allList.GetQueryAndInvokeOnly().ToArray();
            MethodsList methodList = new MethodsList();

            Array.ForEach(queryAndInvokes, info =>
            {
                MethodDescription methodDescription = MethodDescription.FromMethodInfo(info, valueConverter);
                methodList.Add(methodDescription);
            });

            return methodList;
        }
    }
}