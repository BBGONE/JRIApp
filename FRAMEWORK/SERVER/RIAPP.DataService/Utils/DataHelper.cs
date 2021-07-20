using RIAPP.DataService.Core;
using RIAPP.DataService.Core.Metadata;
using RIAPP.DataService.Core.Types;
using RIAPP.DataService.Resources;
using RIAPP.DataService.Utils.Extensions;
using System;
using System.Collections;
using System.Linq;

namespace RIAPP.DataService.Utils
{
    public class DataHelper<TService> : IDataHelper<TService>
        where TService : BaseDomainService
    {
        private readonly IValueConverter<TService> _valueConverter;
        private readonly ISerializer _serializer;

        public DataHelper(ISerializer serializer, IValueConverter<TService> valueConverter)
        {
            _serializer = serializer ?? throw new ArgumentNullException(nameof(serializer), ErrorStrings.ERR_NO_SERIALIZER);
            _valueConverter = valueConverter ?? throw new ArgumentNullException(nameof(valueConverter));
        }

        protected T Deserialize<T>(string val)
        {
            return (T)_serializer.DeSerialize(val, typeof(T));
        }

        protected object[] SerializeObjectField(object fieldOwner, Field objectFieldInfo)
        {
            Field[] fieldInfos = objectFieldInfo.GetNestedInResultFields();
            object[] res = new object[fieldInfos.Length];

            for (int i = 0; i < fieldInfos.Length; ++i)
            {
                res[i] = SerializeField(fieldOwner, fieldInfos[i]);
            }

            return res;
        }

        protected object[] DeSerializeObjectField(Type propType, Field objectFieldInfo, object[] values)
        {
            Field[] fieldInfos = objectFieldInfo.GetNestedInResultFields();
            object[] res = new object[fieldInfos.Length];

            for (int i = 0; i < fieldInfos.Length; ++i)
            {
                res[i] = DeserializeField(propType, fieldInfos[i], values[i]);
            }

            return res;
        }

        /// <summary>
        /// extracts field value from entity, and converts value to a serialized form
        /// </summary>
        protected virtual object SerializeField(object fieldOwner, Field fieldInfo, bool optional)
        {
            Type enityType = fieldOwner.GetType();
            System.Reflection.PropertyInfo pinfo = enityType.GetProperty(fieldInfo.fieldName);

            if (pinfo == null)
            {
                if (!optional)
                {
                    throw new Exception(string.Format(ErrorStrings.ERR_PROPERTY_IS_MISSING, enityType.Name, fieldInfo.fieldName));
                }

                return null;
            }

            object propValue = pinfo.GetValue(fieldOwner, null);

            return (fieldInfo.fieldType == FieldType.Object) ? (object)SerializeObjectField(propValue, fieldInfo) : _valueConverter.SerializeField(pinfo.PropertyType, fieldInfo, propValue);
        }

        public object GetValue(object obj, string propertyName, bool throwErrors)
        {
            string[] parts = propertyName.Split('.');
            Type enityType = obj.GetType();
            System.Reflection.PropertyInfo pinfo = enityType.GetProperty(parts[0]);

            if (pinfo == null && throwErrors)
            {
                throw new Exception(string.Format(ErrorStrings.ERR_PROPERTY_IS_MISSING, enityType.Name, propertyName));
            }

            if (pinfo == null)
            {
                return null;
            }

            if (parts.Length == 1)
            {
                return pinfo.GetValue(obj, null);
            }

            object pval = pinfo.GetValue(obj, null) ?? throw new Exception(string.Format(ErrorStrings.ERR_PPROPERTY_ISNULL, enityType.Name, pinfo.Name));

            return GetValue(pval, string.Join(".", parts.Skip(1)), throwErrors);
        }

        public bool SetValue(object obj, string propertyName, object value, bool throwErrors)
        {
            string[] parts = propertyName.Split('.');
            Type enityType = obj.GetType();
            System.Reflection.PropertyInfo pinfo = enityType.GetProperty(parts[0]);

            if (pinfo == null && throwErrors)
            {
                throw new Exception(string.Format(ErrorStrings.ERR_PROPERTY_IS_MISSING, enityType.Name, propertyName));
            }

            if (pinfo == null)
            {
                return false;
            }

            if (parts.Length == 1)
            {
                if (!pinfo.CanWrite)
                {
                    if (throwErrors)
                    {
                        throw new Exception(string.Format(ErrorStrings.ERR_PROPERTY_IS_READONLY, enityType.Name,
                            propertyName));
                    }

                    return false;
                }

                pinfo.SetValue(obj, value, null);
                return true;
            }

            object pval = pinfo.GetValue(obj, null) ?? throw new Exception(string.Format(ErrorStrings.ERR_PPROPERTY_ISNULL, enityType.Name, pinfo.Name));

            return SetValue(pval, string.Join(".", parts.Skip(1)), value, throwErrors);
        }

        public object SetFieldValue(object entity, string fullName, Field fieldInfo, string value)
        {
            string[] parts = fullName.Split('.');
            Type enityType = entity.GetType();
            System.Reflection.PropertyInfo pinfo = enityType.GetProperty(parts[0]) ?? throw new Exception(string.Format(ErrorStrings.ERR_PROPERTY_IS_MISSING, enityType.Name,
                    fieldInfo.fieldName));

            if (parts.Length == 1)
            {
                if (!pinfo.CanWrite)
                {
                    throw new Exception(string.Format(ErrorStrings.ERR_PROPERTY_IS_READONLY, enityType.Name,
                        fieldInfo.fieldName));
                }

                Type propType = pinfo.PropertyType;
                object val = _valueConverter.DeserializeField(propType, fieldInfo, value);

                if (val != null)
                {
                    pinfo.SetValue(entity, val, null);
                }
                else
                {
                    if (propType.IsNullableType())
                    {
                        pinfo.SetValue(entity, val, null);
                    }
                    else if (!propType.IsValueType)
                    {
                        pinfo.SetValue(entity, val, null);
                    }
                    else
                    {
                        throw new Exception(string.Format(ErrorStrings.ERR_FIELD_IS_NOT_NULLABLE, fieldInfo.fieldName));
                    }
                }

                return val;
            }

            object pval = pinfo.GetValue(entity, null) ?? throw new Exception(string.Format(ErrorStrings.ERR_PPROPERTY_ISNULL, enityType.Name, pinfo.Name));

            return SetFieldValue(pval, string.Join(".", parts.Skip(1)), fieldInfo, value);
        }

        public object SerializeField(object fieldOwner, Field fieldInfo)
        {
            return SerializeField(fieldOwner, fieldInfo, false);
        }

        public string SerializeField(object fieldOwner, string fullName, Field fieldInfo)
        {
            string[] parts = fullName.Split('.');

            if (parts.Length == 1)
            {
                Type enityType = fieldOwner.GetType();
                System.Reflection.PropertyInfo pinfo = enityType.GetProperty(fieldInfo.fieldName) ?? throw new Exception(string.Format(ErrorStrings.ERR_PROPERTY_IS_MISSING, enityType.Name,
                        fieldInfo.fieldName));

                object fieldValue = pinfo.GetValue(fieldOwner, null);
                return _valueConverter.SerializeField(pinfo.PropertyType, fieldInfo, fieldValue);
            }

            for (int i = 0; i < parts.Length - 1; i += 1)
            {
                Type enityType = fieldOwner.GetType();
                System.Reflection.PropertyInfo pinfo = enityType.GetProperty(parts[i]) ?? throw new Exception(string.Format(ErrorStrings.ERR_PROPERTY_IS_MISSING, enityType.Name, parts[i]));
                fieldOwner = pinfo.GetValue(fieldOwner, null);
            }

            return SerializeField(fieldOwner, parts[parts.Length - 1], fieldInfo);
        }

        public object DeserializeField(Type entityType, Field fieldInfo, object value)
        {
            System.Reflection.PropertyInfo propInfo = entityType.GetProperty(fieldInfo.fieldName);

            if (propInfo == null)
            {
                throw new Exception(string.Format(ErrorStrings.ERR_PROPERTY_IS_MISSING, entityType.Name, fieldInfo.fieldName));
            }

            if (fieldInfo.fieldType == FieldType.Object)
            {
                return DeSerializeObjectField(propInfo.PropertyType, fieldInfo, (object[])value);
            }

            return _valueConverter.DeserializeField(propInfo.PropertyType, fieldInfo, (string)value);
        }

        private IEnumerable ToEnumerable(Type elementType, ParamMetadata pinfo, string[] arr)
        {
            foreach (string v in arr)
            {
                yield return ParseParameter(elementType, pinfo, false, v);
            }
        }

        private object ParseArray(Type paramType, ParamMetadata pinfo, string val)
        {
            string[] arr = Deserialize<string[]>(val);

            if (arr == null)
            {
                return null;
            }

            Type elementType = paramType.GetElementType();

            IEnumerable data = ToEnumerable(elementType, pinfo, arr);

            return data.ToArray(elementType);
        }

        public object ParseParameter(Type paramType, ParamMetadata pinfo, bool isArray, string val)
        {
            return (isArray && val != null) ? ParseArray(paramType, pinfo, val) : _valueConverter.DeserializeValue(paramType, pinfo.dataType, pinfo.dateConversion, val);
        }

        public Field GetFieldInfo(DbSetInfo dbSetInfo, string fullName)
        {
            System.Collections.Generic.Dictionary<string, Field> fieldsByName = dbSetInfo.GetFieldByNames();
            return fieldsByName[fullName];
        }

        public void ForEachFieldInfo(string path, Field rootField, Action<string, Field> callBack)
        {
            if (rootField.fieldType == FieldType.Object)
            {
                callBack(path + rootField.fieldName, rootField);
                rootField.nested.ForEach(
                    fieldInfo => { ForEachFieldInfo(path + rootField.fieldName + ".", fieldInfo, callBack); });
            }
            else
            {
                callBack(path + rootField.fieldName, rootField);
            }
        }
    }
}