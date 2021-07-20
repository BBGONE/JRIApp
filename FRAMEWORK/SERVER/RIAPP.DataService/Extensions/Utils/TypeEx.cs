using RIAPP.DataService.Core.Exceptions;
using RIAPP.DataService.Core.Types;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RIAPP.DataService.Utils.Extensions
{
    public static class TypeEx
    {
        public static Type GetTaskResultType(this Type type)
        {
            if (type.IsGenericType && typeof(Task).IsAssignableFrom(type))
            {
                return type.GetGenericArguments().First();
            }

            return type;
        }

        public static bool IsNullableType(this Type type)
        {
            return type.IsGenericType && type.GetGenericTypeDefinition() == typeof(System.Nullable<>);
        }

        public static bool IsArrayType(this Type type)
        {
            bool isArray = type.IsArray;
            if (isArray)
            {
                return typeof(byte) == type.GetElementType() ? false : true;
            }
            else
            {
                return false;
            }

        }

        private static readonly Dictionary<Type, DataType> typeMap = new Dictionary<Type, DataType>
        {
            { typeof(byte), DataType.Binary },
            { typeof(string), DataType.String },
            { typeof(short), DataType.Integer },
            { typeof(int), DataType.Integer },
            { typeof(long), DataType.Integer },
            { typeof(ushort), DataType.Integer },
            { typeof(uint), DataType.Integer },
            { typeof(ulong), DataType.Integer },
            { typeof(decimal), DataType.Decimal },
            { typeof(double), DataType.Float },
            { typeof(float), DataType.Float },
            { typeof(DateTime), DataType.DateTime },
            { typeof(DateTimeOffset), DataType.DateTime },
            { typeof(TimeSpan), DataType.Time },
            { typeof(bool), DataType.Bool },
            { typeof(Guid), DataType.Guid }
        };

        public static DataType GetDataType(this Type type)
        {
            bool isArray = type.IsArray;
            if (isArray)
            {
                type = type.GetElementType();
            }

            bool isNullable = type.IsNullableType();
            Type realType = (!isNullable) ? type : Nullable.GetUnderlyingType(type);

            if (typeMap.TryGetValue(realType, out DataType dataType))
            {
                if (dataType == DataType.Binary && !isArray)
                {
                    dataType = DataType.Integer;
                }

                return dataType;
            }
            else
            {
                throw new UnsupportedTypeException($"Unsupported type {type.FullName}");
            }
        }
    }
}