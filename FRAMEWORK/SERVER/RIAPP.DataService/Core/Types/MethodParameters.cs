using RIAPP.DataService.Core.Exceptions;
using RIAPP.DataService.Core.Metadata;
using RIAPP.DataService.Utils;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;

namespace RIAPP.DataService.Core.Types
{
    /// <summary>
    ///  Stores parameter description (it's attributes)
    /// </summary>

    public class MethodParameter
    {
        public MethodParameter()
        {
            name = "";
            value = null;
        }


        [Description("Parameter name")]
        public string name { get; set; }



        [Description("Parameter value as string")]
        public string value { get; set; }
    }


    public class MethodParameters
    {
        public MethodParameters()
        {
            parameters = new List<MethodParameter>();
        }


        public List<MethodParameter> parameters { get; set; }

        public object GetValue(string name, MethodDescription methodDescription, IDataHelper dataHelper)
        {
            MethodParameter par = parameters.Where(p => p.name == name).FirstOrDefault();
            if (par == null)
            {
                return null;
            }

            ParamMetadata paraminfo = methodDescription.parameters.Where(p => p.name == name).FirstOrDefault();
            if (paraminfo == null)
            {
                throw new DomainServiceException(string.Format("Method: {0} has no parameter with a name: {1}",
                    methodDescription.methodName, name));
            }
            return dataHelper.ParseParameter(paraminfo.GetParameterType(), paraminfo, paraminfo.isArray,
                par.value);
        }
    }
}