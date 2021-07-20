using RIAPP.DataService.Annotations.Metadata;
using RIAPP.DataService.Core.Exceptions;
using RIAPP.DataService.Core.Types;
using RIAPP.DataService.Utils;
using RIAPP.DataService.Utils.Extensions;
using System;
using System.ComponentModel;
using System.Linq;
using System.Reflection;

namespace RIAPP.DataService.Core.Metadata
{
    /// <summary>
    ///     Stores information about parameter
    ///     used to check values recieved from client
    ///     before service method invocations
    /// </summary>

    public class ParamMetadata
    {
        public ParamMetadata()
        {
            name = "";
            dataType = DataType.None;
            ordinal = -1;
            isNullable = false;
            isArray = false;
            dateConversion = DateConversion.None;
        }


        [Description("Parameter name")]
        public string name { get; set; }


        [Description("Parameter type")]
        public DataType dataType { get; set; }


        [Description("True if parameter is array")]
        public bool isArray { get; set; }


        [Description("Parameter position")]
        public bool isNullable { get; set; }


        [Description("How adjust date timezone between server and client")]
        public DateConversion dateConversion { get; set; }


        [Description("Parameter position")]
        public int ordinal { get; set; }

        internal Type _ParameterType { get; set; }


        /// <summary>
        ///     Extracts from ParameterInfo all information about method parameter
        /// </summary>
        /// <returns>ParamMetadataInfo</returns>
        public static ParamMetadata FromParamInfo(ParameterInfo pinfo, IValueConverter valueConverter)
        {
            Type ptype = pinfo.ParameterType;

            if (pinfo.IsOut)
            {
                throw new DomainServiceException("Out parameters are not supported in service methods");
            }

            ParamMetadata paramInfo = new ParamMetadata
            {
                isNullable = ptype.IsNullableType(),
                name = pinfo.Name
            };
            paramInfo.SetParameterType(ptype);
            Type realType = paramInfo.isNullable ? Nullable.GetUnderlyingType(ptype) : ptype;

            IDateConversionData dateConvert = (IDateConversionData)pinfo.GetCustomAttributes(false).FirstOrDefault(a => a is IDateConversionData);

            if (dateConvert != null)
            {
                paramInfo.dateConversion = dateConvert.DateConversion;
            }

            paramInfo.isArray = realType.IsArrayType();
            try
            {
                paramInfo.dataType = valueConverter.DataTypeFromType(realType);
            }
            catch (UnsupportedTypeException)
            {
                paramInfo.dataType = DataType.None;
            }

            return paramInfo;
        }
    }
}