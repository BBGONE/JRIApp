using RIAPP.DataService.Core;
using RIAPP.DataService.Core.Types;
using RIAPP.DataService.Resources;
using RIAPP.DataService.Utils.Extensions;
using System;
using System.Collections.Generic;
using System.Globalization;

namespace RIAPP.DataService.Utils
{
    public class ValueConverter<TService> : IValueConverter<TService>
        where TService : BaseDomainService
    {
        private readonly ISerializer serializer;
        private readonly Dictionary<Type, Func<object, Field, string>> convertMap;

        public ValueConverter(ISerializer serializer)
        {
            this.serializer = serializer ?? throw new ArgumentNullException(nameof(serializer), ErrorStrings.ERR_NO_SERIALIZER);

            this.convertMap = new Dictionary<Type, Func<object, Field, string>>
            {
                { typeof(Guid), (value, fieldInfo) =>  GuidToString(value) },
                { typeof(DateTime), (value, fieldInfo) =>  DateToString(value, fieldInfo.dateConversion) },
                { typeof(TimeSpan), (value, fieldInfo) =>  TimeToString(value, fieldInfo.dateConversion) },
                { typeof(DateTimeOffset), (value, fieldInfo) =>  DateOffsetToString(value, fieldInfo.dateConversion) },
                { typeof(bool), (value, fieldInfo) =>  BoolToString(value) },
                { typeof(byte[]), (value, fieldInfo) =>  BinaryToString(value) }
            };
        }

        public virtual object DeserializeField(Type propType, Field fieldInfo, string value)
        {
            return DeserializeValue(propType, fieldInfo.dataType, fieldInfo.dateConversion, value);
        }

        public virtual object DeserializeValue(Type propType, DataType dataType, DateConversion dateConversion,
            string value)
        {
            object result;
            bool IsNullable = propType.IsNullableType();
            Type propMainType = (!IsNullable) ? propType : Nullable.GetUnderlyingType(propType);

            switch (dataType)
            {
                case DataType.Bool:
                    result = ConvertToBool(value, IsNullable);
                    break;
                case DataType.DateTime:
                case DataType.Date:
                case DataType.Time:
                    result = ConvertToDate(value, IsNullable, dateConversion);
                    if (result != null)
                    {
                        if (propMainType == typeof(DateTimeOffset))
                        {
                            result = new DateTimeOffset((DateTime)result);
                        }
                        else if (propMainType == typeof(TimeSpan))
                        {
                            result = ((DateTime)result).TimeOfDay;
                        }
                    }
                    break;
                case DataType.Guid:
                    result = ConvertToGuid(value, IsNullable);
                    break;
                case DataType.Integer:
                case DataType.Decimal:
                case DataType.Float:
                    result = ConvertToNumber(value, IsNullable, propType, propMainType);
                    break;
                case DataType.Binary:
                    result = ConvertToBinary(value, propType);
                    break;
                case DataType.String:
                    result = ConvertToString(value, propType);
                    break;
                case DataType.None:
                    result = (propType == typeof(string)) ? value : ConvertTo(value, propType, propMainType);
                    break;
                default:
                    throw new Exception(string.Format(ErrorStrings.ERR_VAL_DATATYPE_INVALID, dataType));
            }

            return result;
        }



        public virtual string SerializeField(Type propType, Field fieldInfo, object value)
        {
            if (value == null)
            {
                return null;
            }

            bool isNullable = propType.IsNullableType();
            Type mainType = (!isNullable) ? propType : Nullable.GetUnderlyingType(propType);

            if (convertMap.TryGetValue(mainType, out var converter))
            {
                return converter(value, fieldInfo);
            }
            /*
            else if (mainType.IsEnum)
            {
                var val = Convert.ChangeType(value, Enum.GetUnderlyingType(mainType), CultureInfo.InvariantCulture);
                return (string)Convert.ChangeType(val, typeof(string), CultureInfo.InvariantCulture);
            }
            */
            else if (mainType.IsValueType)
            {
                return (string)Convert.ChangeType(value, typeof(string), CultureInfo.InvariantCulture);
            }
            else
            {
                return value.ToString();
            }
        }

        public virtual DataType DataTypeFromType(Type type)
        {
            return type.GetDataType();
        }

        /*
        protected object CreateGenericInstance(Type propType, Type propMainType, object[] constructorArgs)
        {
            var typeToConstruct = propType.GetGenericTypeDefinition();
            Type[] argsType = { propMainType };
            var concreteType = typeToConstruct.MakeGenericType(argsType);
            var val = Activator.CreateInstance(concreteType, constructorArgs);
            return val;
        }
        */

        protected virtual object ConvertToBool(string value, bool IsNullableType)
        {
            return value == null ? (bool?)null : bool.Parse(value);
        }

        protected virtual object ConvertToDate(string value, bool IsNullableType, DateConversion dateConversion)
        {
            return value == null ? (DateTime?)null : DateTimeHelper.ParseDateTime(value, dateConversion);
        }

        protected virtual object ConvertToGuid(string value, bool IsNullableType)
        {
            return value == null ? (Guid?)null : new Guid(value);
        }

        protected virtual object ConvertToNumber(string value, bool IsNullableType, Type propType, Type propMainType)
        {
            return value == null ? null : Convert.ChangeType(value, propMainType, CultureInfo.InvariantCulture);

            // commented, because no need to create nullable type here - on boxing it turns into ordinary value anyway
            // return (IsNullableType)? CreateGenericInstance(propType, propMainType, new[] { typedVal }): typedVal;
        }

        protected virtual object ConvertToBinary(string value, Type propType)
        {
            if (value == null)
            {
                return null;
            }

            if (propType != typeof(byte[]))
            {
                throw new Exception(string.Format(ErrorStrings.ERR_VAL_DATATYPE_INVALID, propType.FullName));
            }

            return value.ConvertToBinary();
        }

        protected virtual object ConvertToString(string value, Type propType)
        {
            if (value == null)
            {
                return null;
            }

            return propType == typeof(string) ? value : throw new Exception(string.Format(ErrorStrings.ERR_VAL_DATATYPE_INVALID, propType.FullName));
        }

        protected virtual object ConvertTo(string value, Type propType, Type propMainType)
        {
            if (value == null)
            {
                return null;
            }

            object typedVal;

            if (!propMainType.IsValueType)
            {
                typedVal = this.serializer.DeSerialize(value, propMainType);
            }
            else
            {
                try
                {
                    typedVal = Convert.ChangeType(value, propMainType, CultureInfo.InvariantCulture);
                }
                catch (InvalidCastException)
                {
                    typedVal = this.serializer.DeSerialize(value, propMainType);
                }
            }

            return typedVal;

            // commented, because no need to create nullable type here - on boxing it turns into ordinary value anyway
            // return IsNullableType ? CreateGenericInstance(propType, propMainType, new[] { typedVal }) : typedVal;
        }

        protected virtual string GuidToString(object value)
        {
            return (value == null) ? null : value.ToString();
        }

        protected virtual string DateOffsetToString(object value, DateConversion dateConversion)
        {
            return (value == null) ? null : DateTimeHelper.DateOffsetToString((DateTimeOffset)value, dateConversion);
        }

        protected virtual string DateToString(object value, DateConversion dateConversion)
        {
            return (value == null) ? null : DateTimeHelper.DateToString((DateTime)value, dateConversion);
        }

        protected virtual string TimeToString(object value, DateConversion dateConversion)
        {
            return (value == null) ? null : DateTimeHelper.TimeToString((TimeSpan)value, dateConversion);
        }

        protected virtual string BoolToString(object value)
        {
            return (value == null) ? null : value.ToString().ToLowerInvariant();
        }

        protected virtual string BinaryToString(object value)
        {
            if (value == null)
            {
                return null;
            }

            byte[] bytes = (byte[])value;
            return bytes.ConvertToString();
        }
    }
}