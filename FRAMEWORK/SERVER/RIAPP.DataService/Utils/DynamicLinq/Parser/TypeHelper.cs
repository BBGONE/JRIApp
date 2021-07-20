using System.Collections.Generic;
using System.Linq.Dynamic.Core.Validation;
using System.Reflection;

namespace System.Linq.Dynamic.Core.Parser
{
    internal static class TypeHelper
    {
        public static Type FindGenericType(Type generic, Type type)
        {
            while (type != null && type != typeof(object))
            {
                if (type.GetTypeInfo().IsGenericType && type.GetGenericTypeDefinition() == generic)
                {
                    return type;
                }

                if (generic.GetTypeInfo().IsInterface)
                {
                    foreach (Type intfType in type.GetInterfaces())
                    {
                        Type found = FindGenericType(generic, intfType);
                        if (found != null)
                        {
                            return found;
                        }
                    }
                }

                type = type.GetTypeInfo().BaseType;
            }

            return null;
        }

        public static bool IsCompatibleWith(Type source, Type target)
        {
            if (source == target)
            {
                return true;
            }
            if (!target.GetTypeInfo().IsValueType)
            {
                return target.IsAssignableFrom(source);
            }
            Type st = GetNonNullableType(source);
            Type tt = GetNonNullableType(target);

            if (st != source && tt == target)
            {
                return false;
            }
            Type sc = st.GetTypeInfo().IsEnum ? typeof(object) : st;
            Type tc = tt.GetTypeInfo().IsEnum ? typeof(object) : tt;

            if (sc == typeof(sbyte))
            {
                if (tc == typeof(sbyte) || tc == typeof(short) || tc == typeof(int) || tc == typeof(long) || tc == typeof(float) || tc == typeof(double) || tc == typeof(decimal))
                {
                    return true;
                }
            }
            else if (sc == typeof(byte))
            {
                if (tc == typeof(byte) || tc == typeof(short) || tc == typeof(ushort) || tc == typeof(int) || tc == typeof(uint) || tc == typeof(long) || tc == typeof(ulong) || tc == typeof(float) || tc == typeof(double) || tc == typeof(decimal))
                {
                    return true;
                }
            }
            else if (sc == typeof(short))
            {
                if (tc == typeof(short) || tc == typeof(int) || tc == typeof(long) || tc == typeof(float) || tc == typeof(double) || tc == typeof(decimal))
                {
                    return true;
                }
            }
            else if (sc == typeof(ushort))
            {
                if (tc == typeof(ushort) || tc == typeof(int) || tc == typeof(uint) || tc == typeof(long) || tc == typeof(ulong) || tc == typeof(float) || tc == typeof(double) || tc == typeof(decimal))
                {
                    return true;
                }
            }
            else if (sc == typeof(int))
            {
                if (tc == typeof(int) || tc == typeof(long) || tc == typeof(float) || tc == typeof(double) || tc == typeof(decimal))
                {
                    return true;
                }
            }
            else if (sc == typeof(uint))
            {
                if (tc == typeof(uint) || tc == typeof(long) || tc == typeof(ulong) || tc == typeof(float) || tc == typeof(double) || tc == typeof(decimal))
                {
                    return true;
                }
            }
            else if (sc == typeof(long))
            {
                if (tc == typeof(long) || tc == typeof(float) || tc == typeof(double) || tc == typeof(decimal))
                {
                    return true;
                }
            }
            else if (sc == typeof(ulong))
            {
                if (tc == typeof(ulong) || tc == typeof(float) || tc == typeof(double) || tc == typeof(decimal))
                {
                    return true;
                }
            }
            else if (sc == typeof(float))
            {
                if (tc == typeof(float) || tc == typeof(double))
                {
                    return true;
                }
            }

            if (st == tt)
            {
                return true;
            }

            return false;
        }

        public static bool IsEnumType(Type type)
        {
            return GetNonNullableType(type).GetTypeInfo().IsEnum;
        }

        public static bool IsNumericType(Type type)
        {
            return GetNumericTypeKind(type) != 0;
        }

        public static bool IsNullableType(Type type)
        {
            Check.NotNull(type, nameof(type));

            return type.GetTypeInfo().IsGenericType && type.GetGenericTypeDefinition() == typeof(Nullable<>);
        }

        public static Type ToNullableType(Type type)
        {
            Check.NotNull(type, nameof(type));

            return IsNullableType(type) ? type : typeof(Nullable<>).MakeGenericType(type);
        }

        public static bool IsSignedIntegralType(Type type)
        {
            return GetNumericTypeKind(type) == 2;
        }

        public static bool IsUnsignedIntegralType(Type type)
        {
            return GetNumericTypeKind(type) == 3;
        }

        private static int GetNumericTypeKind(Type type)
        {
            type = GetNonNullableType(type);

            if (type.GetTypeInfo().IsEnum)
            {
                return 0;
            }

            if (type == typeof(char) || type == typeof(float) || type == typeof(double) || type == typeof(decimal))
            {
                return 1;
            }

            if (type == typeof(sbyte) || type == typeof(short) || type == typeof(int) || type == typeof(long))
            {
                return 2;
            }

            if (type == typeof(byte) || type == typeof(ushort) || type == typeof(uint) || type == typeof(ulong))
            {
                return 3;
            }

            return 0;
        }

        public static string GetTypeName(Type type)
        {
            Type baseType = GetNonNullableType(type);

            string name = baseType.Name;
            if (type != baseType)
            {
                name += '?';
            }

            return name;
        }

        public static Type GetNonNullableType(Type type)
        {
            Check.NotNull(type, nameof(type));

            return IsNullableType(type) ? type.GetTypeInfo().GetGenericTypeArguments()[0] : type;
        }

        public static Type GetUnderlyingType(Type type)
        {
            Check.NotNull(type, nameof(type));

            Type[] genericTypeArguments = type.GetGenericArguments();
            if (genericTypeArguments.Any())
            {
                Type outerType = GetUnderlyingType(genericTypeArguments.LastOrDefault());
                return Nullable.GetUnderlyingType(type) == outerType ? type : outerType;
            }

            return type;
        }

        public static IEnumerable<Type> GetSelfAndBaseTypes(Type type)
        {
            if (type.GetTypeInfo().IsInterface)
            {
                List<Type> types = new List<Type>();
                AddInterface(types, type);
                return types;
            }
            return GetSelfAndBaseClasses(type);
        }

        private static IEnumerable<Type> GetSelfAndBaseClasses(Type type)
        {
            while (type != null)
            {
                yield return type;
                type = type.GetTypeInfo().BaseType;
            }
        }

        private static void AddInterface(List<Type> types, Type type)
        {
            if (!types.Contains(type))
            {
                types.Add(type);
                foreach (Type t in type.GetInterfaces())
                {
                    AddInterface(types, t);
                }
            }
        }

        public static object ParseEnum(string value, Type type)
        {
            if (type.GetTypeInfo().IsEnum && Enum.IsDefined(type, value))
            {
                return Enum.Parse(type, value, true);
            }

            return null;
        }
    }
}
