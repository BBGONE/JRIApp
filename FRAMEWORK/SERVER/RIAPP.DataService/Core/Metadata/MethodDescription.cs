using RIAPP.DataService.Core.Types;
using RIAPP.DataService.Utils;
using System.Collections.Generic;
using System.ComponentModel;
using System.Threading.Tasks;

namespace RIAPP.DataService.Core.Metadata
{

    public class MethodDescription
    {
        public MethodDescription(MethodInfoData data)
        {
            _methodData = data;
            parameters = new List<ParamMetadata>();
        }


        public string methodName => _methodData.MethodInfo.Name;


        public List<ParamMetadata> parameters { get; set; }


        [Description("Is it returns or not result from method's invocation")]
        public bool methodResult
        {
            get
            {
                System.Type returnType = _methodData.MethodInfo.ReturnType;
                bool isVoid = returnType == typeof(void) || returnType == typeof(Task);
                return !isVoid;
            }
        }


        [Description("Is it a Query method")]
        public bool isQuery => _methodData.MethodType == MethodType.Query;


        internal MethodInfoData _methodData { get; }

        /// <summary>
        ///     Generates Data Services' method description which is convertable to JSON
        ///     and can be consumed by clients
        /// </summary>
        public static MethodDescription FromMethodInfo(MethodInfoData data, IValueConverter valueConverter)
        {
            MethodDescription methDescription = new MethodDescription(data);
            //else Result is Converted to JSON
            System.Reflection.ParameterInfo[] paramsInfo = data.MethodInfo.GetParameters();
            for (int i = 0; i < paramsInfo.Length; ++i)
            {
                ParamMetadata param = ParamMetadata.FromParamInfo(paramsInfo[i], valueConverter);
                param.ordinal = i;
                methDescription.parameters.Add(param);
            }
            return methDescription;
        }
    }
}