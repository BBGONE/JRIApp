using RIAPP.DataService.Annotations.CodeGen;
using RIAPP.DataService.Core.Exceptions;
using RIAPP.DataService.Core.Metadata;
using RIAPP.DataService.Core.Types;
using RIAPP.DataService.Utils;
using RIAPP.DataService.Utils.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;

namespace RIAPP.DataService.Core.CodeGen
{
    public class TypeScriptHelper
    {
        private readonly List<Type> _clientTypes;
        private readonly RunTimeMetadata _metadata;
        private readonly StringBuilder _sb = new StringBuilder(4096);
        private readonly List<DbSetInfo> _dbSets;
        private readonly List<Association> _associations;
        private readonly ISerializer _serializer;
        private readonly IValueConverter _valueConverter;
        private readonly IDataHelper _dataHelper;

        private readonly CodeGenTemplate _entityTemplate = new CodeGenTemplate("Entity.txt");
        private readonly CodeGenTemplate _entityIntfTemplate = new CodeGenTemplate("EntityInterface.txt");
        private readonly CodeGenTemplate _dictionaryTemplate = new CodeGenTemplate("Dictionary.txt");
        private readonly CodeGenTemplate _listTemplate = new CodeGenTemplate("List.txt");
        private readonly CodeGenTemplate _listItemTemplate = new CodeGenTemplate("ListItem.txt");
        private readonly CodeGenTemplate _dbSetTemplate = new CodeGenTemplate("DbSet.txt");

        public TypeScriptHelper(ISerializer serializer,
            IDataHelper dataHelper,
            IValueConverter valueConverter,
            RunTimeMetadata metadata,
            IEnumerable<Type> clientTypes)
        {
            _serializer = serializer ?? throw new ArgumentNullException(nameof(serializer));
            _dataHelper = dataHelper ?? throw new ArgumentNullException(nameof(dataHelper));
            _valueConverter = valueConverter ?? throw new ArgumentNullException(nameof(valueConverter));
            _metadata = metadata ?? throw new ArgumentNullException(nameof(metadata));
            _clientTypes = new List<Type>(clientTypes ?? Enumerable.Empty<Type>());
            _dbSets = _metadata.DbSets.Values.OrderBy(v => v.dbSetName).ToList();
            _associations = _metadata.Associations.Values.OrderBy(a => a.name).ToList();
        }

        private void _OnNewClientTypeAdded(Type type)
        {
            if (!_clientTypes.Contains(type))
            {
                _clientTypes.Add(type);
            }
        }

        private void WriteString(string str)
        {
            _sb.Append(str);
        }

        private void WriteStringLine(string str)
        {
            _sb.AppendLine(str);
        }

        private void WriteLine()
        {
            _sb.AppendLine();
        }

        private static void AddComment(StringBuilder sb, string comment)
        {
            sb.AppendLine(@"/*");
            sb.AppendLine(comment);
            sb.AppendLine("*/");
            sb.AppendLine();
        }

        private static string TrimEnd(string s)
        {
            if (!string.IsNullOrEmpty(s))
            {
                return s.TrimEnd('\r', '\n', '\t', ' ');
            }

            return string.Empty;
        }

        public string CreateTypeScript(string comment = null)
        {
            using (DotNet2TS dotNet2TS = new DotNet2TS(_valueConverter, (t) => _OnNewClientTypeAdded(t)))
            {
                _sb.Length = 0;
                if (!string.IsNullOrWhiteSpace(comment))
                {
                    AddComment(_sb, comment);
                }
                WriteStringLine(CreateHeader());
                WriteLine();

                ProcessMethodArgs(dotNet2TS);

                string isvcMethods = CreateISvcMethods(dotNet2TS);

                //create typed Lists and Dictionaries
                string listTypes = CreateClientTypes(dotNet2TS);
                //get interface declarations for all client types
                string sbInterfaceDefs = dotNet2TS.GetInterfaceDeclarations();

                if (!string.IsNullOrWhiteSpace(sbInterfaceDefs))
                {
                    WriteStringLine(@"//******BEGIN INTERFACE REGION******");
                    WriteStringLine(sbInterfaceDefs);
                    WriteStringLine(@"//******END INTERFACE REGION******");
                    WriteLine();
                }

                if (!string.IsNullOrWhiteSpace(isvcMethods))
                {
                    WriteStringLine(isvcMethods);
                    WriteLine();
                }

                if (!string.IsNullOrWhiteSpace(listTypes))
                {
                    WriteStringLine(@"//******BEGIN LISTS REGION******");
                    WriteStringLine(listTypes);
                    WriteStringLine(@"//******END LISTS REGION******");
                    WriteLine();
                }

                //this.WriteStringLine(this.createQueryNames());

                ComplexTypeBuilder ctbuilder = new ComplexTypeBuilder(dotNet2TS);

                _dbSets.ForEach(dbSetInfo =>
                {
                    dbSetInfo.fieldInfos.ForEach(fieldInfo =>
                    {
                        if (fieldInfo.fieldType == FieldType.Object)
                        {
                            ctbuilder.CreateComplexType(dbSetInfo, fieldInfo, 0);
                        }
                    });
                });

                string complexTypes = ctbuilder.GetComplexTypes();

                if (!string.IsNullOrWhiteSpace(complexTypes))
                {
                    WriteStringLine(@"//******BEGIN COMPLEX TYPES REGION*****");
                    WriteStringLine(complexTypes);
                    WriteStringLine(@"//******END COMPLEX TYPES REGION******");
                    WriteLine();
                }

                _dbSets.ForEach(dbSetInfo =>
                {
                    EntityDefinition entityDef = CreateEntityType(dbSetInfo, dotNet2TS);
                    WriteStringLine(entityDef.interfaceDefinition);
                    WriteLine();
                    WriteStringLine(entityDef.entityDefinition);
                    WriteLine();
                    WriteStringLine(CreateDbSetType(entityDef, dbSetInfo, dotNet2TS));
                    WriteLine();
                });

                WriteStringLine(CreateIAssocs());
                WriteLine();
                WriteStringLine(CreateDbContextType());
                WriteLine();

                return _sb.ToString();
            }
        }

        private string CreateHeader()
        {
            Dictionary<string, Func<TemplateParser.Context, string>> dic = new Dictionary<string, Func<TemplateParser.Context, string>>();
            StringBuilder sb = new StringBuilder();
            foreach (string str in _metadata.TypeScriptImports)
            {
                sb.AppendLine($"import {str};");
            }
            string imports = sb.ToString();
            dic.Add("IMPORTS", (context) => imports);
            return new CodeGenTemplate("Header.txt").ToString(dic);
        }

        private string CreateDbSetProps()
        {
            StringBuilder sb = new StringBuilder(512);
            _dbSets.ForEach(dbSetInfo =>
            {
                string dbSetType = GetDbSetTypeName(dbSetInfo.dbSetName);
                sb.AppendFormat("\tget {0}() {{ return <{1}>this.getDbSet(\"{0}\"); }}", dbSetInfo.dbSetName, dbSetType);
                sb.AppendLine();
            });

            return TrimEnd(sb.ToString());
        }

        private string CreateIAssocs()
        {
            StringBuilder sb = new StringBuilder(512);
            sb.AppendLine("export interface IAssocs");
            sb.AppendLine("{");
            foreach (Association assoc in _associations)
            {
                sb.AppendFormat("\tget{0}: {1};", assoc.name, "()=> dbMOD.Association");
                sb.AppendLine();
            }
            sb.AppendLine("}");
            return sb.ToString();
        }

        private string _CreateParamSignature(ParamMetadata paramInfo, DotNet2TS dotNet2TS)
        {
            return string.Format("{0}{1}: {2}{3};", paramInfo.name, paramInfo.isNullable ? "?" : "",
                paramInfo.dataType == DataType.None
                    ? dotNet2TS.RegisterType(paramInfo.GetParameterType())
                    : DotNet2TS.DataTypeToTypeName(paramInfo.dataType),
                paramInfo.dataType != DataType.None && paramInfo.isArray ? "[]" : "");
        }

        private void ProcessMethodArgs(DotNet2TS dotNet2TS)
        {
            foreach (MethodDescription methodInfo in _metadata.GetInvokeMethods())
            {
                if (methodInfo.parameters.Count() > 0)
                {
                    methodInfo.parameters.ForEach(paramInfo =>
                    {
                        //if this is complex type parse parameter to create its typescript interface
                        if (paramInfo.dataType == DataType.None)
                        {
                            dotNet2TS.RegisterType(paramInfo.GetParameterType());
                        }
                    });
                }
            }
        }

        private string CreateISvcMethods(DotNet2TS dotNet2TS)
        {
            StringBuilder sbISvcMeth = new StringBuilder(512);
            sbISvcMeth.AppendLine("export interface ISvcMethods");
            sbISvcMeth.AppendLine("{");
            StringBuilder sbArgs = new StringBuilder(255);
            List<MethodDescription> svcMethods = _metadata.GetInvokeMethods().OrderBy(m => m.methodName).ToList();
            svcMethods.ForEach(methodInfo =>
            {
                sbArgs.Length = 0;
                if (methodInfo.parameters.Count() > 0)
                {
                    sbArgs.AppendLine("(args: {");

                    methodInfo.parameters.ForEach(paramInfo =>
                    {
                        sbArgs.Append("\t\t");
                        sbArgs.AppendFormat(_CreateParamSignature(paramInfo, dotNet2TS));
                        sbArgs.AppendLine();
                    });

                    if (methodInfo.methodResult)
                    {
                        sbArgs.Append("\t}) => RIAPP.IPromise<");
                        sbArgs.Append(dotNet2TS.RegisterType(methodInfo.GetMethodData().MethodInfo.ReturnType.GetTaskResultType()));
                        sbArgs.Append(">");
                    }
                    else
                    {
                        sbArgs.Append("\t}) => RIAPP.IPromise<void>");
                    }
                }
                else
                {
                    if (methodInfo.methodResult)
                    {
                        sbArgs.Append("() => RIAPP.IPromise<");
                        sbArgs.Append(dotNet2TS.RegisterType(methodInfo.GetMethodData().MethodInfo.ReturnType.GetTaskResultType()));
                        sbArgs.Append(">");
                    }
                    else
                    {
                        sbArgs.Append("() => RIAPP.IPromise<void>");
                    }
                }

                sbISvcMeth.AppendFormat("\t{0}: {1};", methodInfo.methodName, sbArgs.ToString());
                sbISvcMeth.AppendLine();
            });

            sbISvcMeth.AppendLine("}");

            return TrimEnd(sbISvcMeth.ToString());
        }

        private string CreateClientTypes(DotNet2TS dotNet2TS)
        {
            StringBuilder sb = new StringBuilder(1024);

            for (int i = 0; i < _clientTypes.Count(); ++i)
            {
                Type type = _clientTypes[i];
                sb.Append(CreateClientType(type, dotNet2TS));
            }

            return TrimEnd(sb.ToString());
        }

        private string CreateDictionary(string name, string keyName, string itemName, string aspectName,
            string valsName, string properties, List<PropertyInfo> propList, DotNet2TS dotNet2TS)
        {
            PropertyInfo pkProp = propList.Where(propInfo => keyName == propInfo.Name).SingleOrDefault();
            if (pkProp == null)
            {
                throw new Exception(string.Format("Dictionary item does not have a property with a name {0}", keyName));
            }

            string pkVals = pkProp.Name.ToCamelCase() + ": " + dotNet2TS.RegisterType(pkProp.PropertyType);

            Dictionary<string, Func<TemplateParser.Context, string>> dic = new Dictionary<string, Func<TemplateParser.Context, string>>
            {
                { "DICT_NAME", (context) => name },
                { "ITEM_TYPE_NAME", (context) => string.Format("_{0}", itemName) },
                { "ASPECT_NAME", (context) => aspectName },
                { "VALS_NAME", (context) => valsName },
                { "INTERFACE_NAME", (context) => itemName },
                { "PROPS", (context) => properties },
                { "KEY_NAME", (context) => keyName },
                { "PK_VALS", (context) => pkVals }
            };

            return _dictionaryTemplate.ToString(dic);
        }

        private string CreateList(string name, string itemName, string aspectName, string valsName,
            string properties)
        {
            Dictionary<string, Func<TemplateParser.Context, string>> dic = new Dictionary<string, Func<TemplateParser.Context, string>>
            {
                { "LIST_NAME", (context) => name },
                { "ITEM_TYPE_NAME", (context) => string.Format("_{0}", itemName) },
                { "ASPECT_NAME", (context) => aspectName },
                { "VALS_NAME", (context) => valsName },
                { "INTERFACE_NAME", (context) => itemName },
                { "PROP_INFOS", (context) => properties }
            };

            return _listTemplate.ToString(dic);
        }

        private string CreateListItem(string itemName, string aspectName, string valsName,
            List<PropertyInfo> propInfos, DotNet2TS dotNet2TS)
        {
            StringBuilder sbProps = new StringBuilder(512);
            propInfos.ForEach(propInfo =>
            {
                sbProps.AppendLine(string.Format("\tget {0}():{1} {{ return <{1}>this._aspect._getProp('{0}'); }}",
                    propInfo.Name, dotNet2TS.RegisterType(propInfo.PropertyType)));
                sbProps.AppendLine(string.Format("\tset {0}(v:{1}) {{ this._aspect._setProp('{0}', v); }}",
                    propInfo.Name, dotNet2TS.RegisterType(propInfo.PropertyType)));
            });

            Dictionary<string, Func<TemplateParser.Context, string>> dic = new Dictionary<string, Func<TemplateParser.Context, string>>
            {
                { "LIST_ITEM_NAME", (context) => string.Format("_{0}", itemName) },
                { "VALS_NAME", (context) => valsName },
                { "INTERFACE_NAME", (context) => itemName },
                { "ASPECT_NAME", (context) => aspectName },
                { "ITEM_PROPS", (context) => sbProps.ToString() }
            };

            return _listItemTemplate.ToString(dic);
        }

        private string CreateClientType(Type type, DotNet2TS dotNet2TS)
        {
            DictionaryAttribute dictAttr = type.GetCustomAttributes(typeof(DictionaryAttribute), false)
                    .OfType<DictionaryAttribute>()
                    .FirstOrDefault();
            ListAttribute listAttr = type.GetCustomAttributes(typeof(ListAttribute), false).OfType<ListAttribute>().FirstOrDefault();

            if (dictAttr != null && dictAttr.KeyName == null)
            {
                throw new ArgumentException("DictionaryAttribute KeyName property must not be null");
            }

            StringBuilder sb = new StringBuilder(512);
            string dictName = null;
            string listName = null;
            if (dictAttr != null)
            {
                dictName = dictAttr.DictionaryName == null
                    ? $"{type.Name}Dict"
                    : dictAttr.DictionaryName;
            }

            if (listAttr != null)
            {
                listName = listAttr.ListName == null ? $"{type.Name}List" : listAttr.ListName;
            }

            bool isListItem = dictAttr != null || listAttr != null;
            string valsName = dotNet2TS.RegisterType(type);

            //can return here if no need to create Dictionary or List
            if (!type.IsClass || !isListItem)
            {
                return sb.ToString();
            }

            string itemName = $"{type.Name}ListItem";
            string aspectName = $"T{type.Name}ItemAspect";
            List<PropertyInfo> propInfos = type.GetProperties().ToList();
            string list_properties = string.Empty;

            #region Define fn_Properties

            Func<List<PropertyInfo>, string> fn_Properties = props =>
            {
                StringBuilder sbProps = new StringBuilder(256);

                sbProps.Append("[");
                bool isFirst = true;

                props.ForEach(propInfo =>
                {
                    if (!isFirst)
                    {
                        sbProps.Append(",");
                    }

                    DataType dataType = DataType.None;

                    try
                    {
                        dataType = propInfo.PropertyType.IsArrayType() ? DataType.None : dotNet2TS.DataTypeFromDotNetType(propInfo.PropertyType);
                    }
                    catch (UnsupportedTypeException)
                    {
                        dataType = DataType.None;
                    }

                    sbProps.Append("{");
                    sbProps.Append(string.Format("name:'{0}',dtype:{1}", propInfo.Name, (int)dataType));
                    sbProps.Append("}");
                    isFirst = false;
                });

                sbProps.Append("]");

                return sbProps.ToString();
            };

            #endregion

            if (dictAttr != null || listAttr != null)
            {
                sb.AppendLine(CreateListItem(itemName, aspectName, valsName, propInfos, dotNet2TS));
                sb.AppendLine();
                list_properties = fn_Properties(propInfos);
            }

            if (dictAttr != null)
            {
                sb.AppendLine(CreateDictionary(dictName, dictAttr.KeyName, itemName, aspectName, valsName,
                    list_properties, propInfos, dotNet2TS));
                sb.AppendLine();
            }

            if (listAttr != null)
            {
                sb.AppendLine(CreateList(listName, itemName, aspectName, valsName, list_properties));
                sb.AppendLine();
            }


            return sb.ToString();
        }

        private string CreateDbSetQueries(DbSetInfo dbSetInfo, DotNet2TS dotNet2TS)
        {
            StringBuilder sb = new StringBuilder(256);
            StringBuilder sbArgs = new StringBuilder(256);
            IEnumerable<MethodDescription> queries = _metadata.GetQueryMethods(dbSetInfo.dbSetName);
            string entityInterfaceName = GetEntityInterfaceName(dbSetInfo.dbSetName);
            string valsInterfaceName = GetValsInterfaceName(dbSetInfo.dbSetName);

            foreach (MethodDescription methodDescription in queries)
            {
                sbArgs.Length = 0;
                sbArgs.AppendLine("args?: {");
                int cnt = 0;
                methodDescription.parameters.ForEach(paramInfo =>
                {
                    sbArgs.Append("\t\t");
                    sbArgs.AppendFormat(_CreateParamSignature(paramInfo, dotNet2TS));
                    sbArgs.AppendLine();
                    ++cnt;
                });
                sbArgs.Append("\t}");
                if (cnt == 0)
                {
                    sbArgs.Length = 0;
                }
                sb.AppendFormat("\tcreate{0}Query({1}): dbMOD.DataQuery<{2}, {3}>", methodDescription.methodName, sbArgs.ToString(), entityInterfaceName, valsInterfaceName);
                sb.AppendLine();
                sb.Append("\t{");
                sb.AppendLine();
                if (sbArgs.Length > 0)
                {
                    sb.AppendFormat("\t\tvar query = this.createQuery('{0}');", methodDescription.methodName);
                    sb.AppendLine();
                    sb.AppendLine("\t\tquery.params = args;");
                    sb.AppendLine("\t\treturn query;");
                }
                else
                {
                    sb.AppendFormat("\t\treturn this.createQuery('{0}');", methodDescription.methodName);
                    sb.AppendLine();
                }
                sb.AppendLine("\t}");
            };

            return TrimEnd(sb.ToString());
        }

        private string CreateCalcFields(DbSetInfo dbSetInfo)
        {
            string entityType = GetEntityTypeName(dbSetInfo.dbSetName);
            string entityInterfaceName = GetEntityInterfaceName(dbSetInfo.dbSetName);
            StringBuilder sb = new StringBuilder(256);

            dbSetInfo.fieldInfos.ForEach(fieldInfo =>
            {
                _dataHelper.ForEachFieldInfo("", fieldInfo, (fullName, f) =>
                {
                    if (f.fieldType == FieldType.Calculated)
                    {
                        sb.AppendFormat("\tdefine{0}Field(getFunc: (item: {1}) => {2})", fullName.Replace('.', '_'),
                            entityInterfaceName, GetFieldDataType(f));
                        sb.Append(" { ");
                        sb.AppendFormat("this._defineCalculatedField('{0}', getFunc);", fullName);
                        sb.Append(" }");
                        sb.AppendLine();
                    }
                });
            });

            return TrimEnd(sb.ToString());
        }

        private string CreateDbContextType()
        {
            StringBuilder sb = new StringBuilder(512);
            string[] dbSetNames = _dbSets.Select(d => d.dbSetName).ToArray();
            StringBuilder sbCreateDbSets = new StringBuilder(512);
            _dbSets.ForEach(dbSetInfo =>
            {
                string dbSetType = GetDbSetTypeName(dbSetInfo.dbSetName);
                sbCreateDbSets.AppendFormat("\t\tthis._createDbSet(\"{0}\",{1});", dbSetInfo.dbSetName, dbSetType);
                sbCreateDbSets.AppendLine();
            });

            Dictionary<string, Func<TemplateParser.Context, string>> dic = new Dictionary<string, Func<TemplateParser.Context, string>>
            {
                { "DBSETS_NAMES", (context) => _serializer.Serialize(dbSetNames) },
                { "DBSETS_PROPS", (context) => CreateDbSetProps() },
                { "DBSETS", (context) => sbCreateDbSets.ToString().Trim('\r', '\n', ' ') },
                { "TIMEZONE", (context) => DateTimeHelper.GetTimezoneOffset().ToString() },
                { "ASSOCIATIONS", (context) => _serializer.Serialize(_associations) },
                { "METHODS", (context) => _serializer.Serialize(_metadata.MethodDescriptions.OrderByDescending(m => m.isQuery).ThenBy(m => m.methodName)) }
            };

            return new CodeGenTemplate("DbContext.txt").ToString(dic);
        }


        private class EntityDefinition
        {
            public string valsName;
            public string interfaceName;
            public string entityName;
            public string aspectName;
            public string interfaceDefinition;
            public string entityDefinition;
        }

        private string CreateDbSetType(EntityDefinition entityDef, DbSetInfo dbSetInfo, DotNet2TS dotNet2TS)
        {
            StringBuilder sb = new StringBuilder(512);
            string dbSetType = GetDbSetTypeName(dbSetInfo.dbSetName);
            List<Association> childAssoc = _associations.Where(assoc => assoc.childDbSetName == dbSetInfo.dbSetName).ToList();
            List<Association> parentAssoc = _associations.Where(assoc => assoc.parentDbSetName == dbSetInfo.dbSetName).ToList();
            FieldsList fieldInfos = dbSetInfo.fieldInfos;

            Field[] pkFields = dbSetInfo.GetPKFields();
            string pkVals = "";
            foreach (Field pkField in pkFields)
            {
                if (!string.IsNullOrEmpty(pkVals))
                {
                    pkVals += ", ";
                }

                pkVals += pkField.fieldName.ToCamelCase() + ": " + GetFieldDataType(pkField);
            }
            Dictionary<string, Func<TemplateParser.Context, string>> dic = new Dictionary<string, Func<TemplateParser.Context, string>>
            {
                { "DBSET_NAME", (context) => dbSetInfo.dbSetName },
                { "DBSET_TYPE", (context) => dbSetType },
                { "ENTITY_NAME", (context) => entityDef.entityName },
                { "ASPECT_NAME", (context) => entityDef.aspectName },
                { "INTERFACE_NAME", (context) => entityDef.interfaceName },
                { "VALS_NAME", (context) => entityDef.valsName },
                {
                    "DBSET_INFO",
                    (context) =>
                     {
                        //we are making copy of the object, in order that we don't change original object
                        //while it can be accessed by other threads
                        //we change our own copy, making it threadsafe
                        DbSetInfo copy = dbSetInfo.ShallowCopy();
                        copy.SetFieldInfos(new FieldsList()); //serialze with empty field infos
                        return _serializer.Serialize(copy);
                     }
                },
                { "FIELD_INFOS", (context) => _serializer.Serialize(dbSetInfo.fieldInfos) },
                { "CHILD_ASSOC", (context) => _serializer.Serialize(childAssoc) },
                { "PARENT_ASSOC", (context) => _serializer.Serialize(parentAssoc) },
                { "QUERIES", (context) => CreateDbSetQueries(dbSetInfo, dotNet2TS) },
                { "CALC_FIELDS", (context) => CreateCalcFields(dbSetInfo) },
                { "PK_VALS", (context) => pkVals }
            };

            return _dbSetTemplate.ToString(dic);
        }

        private string CreateEntityInterface(EntityDefinition entityDef, string valsFields, string entityFields)
        {
            Dictionary<string, Func<TemplateParser.Context, string>> dic = new Dictionary<string, Func<TemplateParser.Context, string>>
            {
                { "VALS_NAME", (context) => entityDef.valsName },
                { "INTERFACE_NAME", (context) => entityDef.interfaceName },
                { "ASPECT_NAME", (context) => entityDef.aspectName },
                { "VALS_FIELDS", (context) => valsFields },
                { "ENTITY_FIELDS", (context) => entityFields }
            };

            return TrimEnd(_entityIntfTemplate.ToString(dic));
        }

        private EntityDefinition CreateEntityType(DbSetInfo dbSetInfo, DotNet2TS dotNet2TS)
        {
            EntityDefinition entityDef = new EntityDefinition();

            string dbSetType = GetDbSetTypeName(dbSetInfo.dbSetName);
            entityDef.interfaceName = GetEntityInterfaceName(dbSetInfo.dbSetName);
            entityDef.valsName = GetValsInterfaceName(dbSetInfo.dbSetName);
            entityDef.entityName = GetEntityTypeName(dbSetInfo.dbSetName);
            entityDef.aspectName = string.Format("T{0}Aspect", entityDef.interfaceName);

            FieldsList fieldInfos = dbSetInfo.fieldInfos;
            StringBuilder sbFields = new StringBuilder();
            StringBuilder sbFieldsDef = new StringBuilder();
            StringBuilder sbFieldsInit = new StringBuilder();

            StringBuilder sbEntityFields = new StringBuilder();
            StringBuilder sbValsFields = new StringBuilder();

            if (dotNet2TS.IsTypeNameRegistered(entityDef.interfaceName))
            {
                throw new ApplicationException(
                    string.Format("Names collision. Name '{0}' can not be used for an entity type's name because this name is used for a client's type.",
                        entityDef.interfaceName));
            }

            Action<Field> AddCalculatedField = f =>
            {
                string dataType = GetFieldDataType(f);
                sbFields.AppendFormat("\tget {0}(): {1} {{ return this._aspect._getCalcFieldVal('{0}'); }}", f.fieldName,
                    dataType);
                sbFields.AppendLine();

                sbEntityFields.AppendFormat("\treadonly {0}: {1};", f.fieldName, dataType);
                sbEntityFields.AppendLine();
            };

            Action<Field> AddNavigationField = f =>
            {
                string dataType = GetFieldDataType(f);
                sbFields.AppendFormat("\tget {0}(): {1} {{ return this._aspect._getNavFieldVal('{0}'); }}", f.fieldName,
                    dataType);
                sbFields.AppendLine();
                //no writable properties to ParentToChildren navigation fields
                bool isReadonly = dataType.EndsWith("[]");
                if (!isReadonly)
                {
                    sbFields.AppendFormat("\tset {0}(v: {1}) {{ this._aspect._setNavFieldVal('{0}',v); }}", f.fieldName,
                        dataType);
                    sbFields.AppendLine();
                }

                sbEntityFields.AppendFormat("\t{0}{1}: {2};", isReadonly ? "readonly " : "", f.fieldName, dataType);
                sbEntityFields.AppendLine();
            };

            Action<Field> AddComplexTypeField = f =>
            {
                string dataType = GetFieldDataType(f);
                string interfName = string.Format("I{0}", dataType);
                sbFields.AppendFormat("\tget {0}(): {2} {{ if (!this._{0}) {{this._{0} = new {1}('{0}', this._aspect);}} return this._{0}; }}",
                    f.fieldName, dataType, interfName);
                sbFields.AppendLine();
                sbFieldsDef.AppendFormat("\tprivate _{0}: {1};", f.fieldName, dataType);
                sbFieldsDef.AppendLine();
                sbFieldsInit.AppendFormat("\t\tthis._{0} = null;", f.fieldName);
                sbFieldsInit.AppendLine();

                sbValsFields.AppendFormat("\treadonly {0}: {1};", f.fieldName, interfName);
                sbValsFields.AppendLine();
            };

            Action<Field> AddSimpleField = f =>
            {
                string dataType = GetFieldDataType(f);
                sbFields.AppendFormat("\tget {0}(): {1} {{ return this._aspect._getFieldVal('{0}'); }}", f.fieldName,
                    dataType);
                sbFields.AppendLine();
                if (!f.isReadOnly || f.allowClientDefault)
                {
                    sbFields.AppendFormat("\tset {0}(v: {1}) {{ this._aspect._setFieldVal('{0}',v); }}", f.fieldName,
                        dataType);
                    sbFields.AppendLine();
                }

                sbValsFields.AppendFormat("\t{0}{1}: {2};", (!f.isReadOnly || f.allowClientDefault) ? "" : "readonly ", f.fieldName, dataType);
                sbValsFields.AppendLine();
            };

            fieldInfos.ForEach(fieldInfo =>
            {
                if (fieldInfo.fieldType == FieldType.Calculated)
                {
                    AddCalculatedField(fieldInfo);
                }
                else if (fieldInfo.fieldType == FieldType.Navigation)
                {
                    AddNavigationField(fieldInfo);
                }
                else if (fieldInfo.fieldType == FieldType.Object)
                {
                    AddComplexTypeField(fieldInfo);
                }
                else
                {
                    AddSimpleField(fieldInfo);
                }
            });

            Dictionary<string, Func<TemplateParser.Context, string>> dic = new Dictionary<string, Func<TemplateParser.Context, string>>
            {
                { "DBSET_NAME", (context) => dbSetInfo.dbSetName },
                { "DBSET_TYPE", (context) => dbSetType },
                { "ENTITY_NAME", (context) => entityDef.entityName },
                { "INTERFACE_NAME", (context) => entityDef.interfaceName },
                { "VALS_NAME", (context) => entityDef.valsName },
                { "ASPECT_NAME", (context) => entityDef.aspectName },
                { "ENTITY_FIELDS", (context) => TrimEnd(sbFields.ToString()) },
                { "FIELDS_DEF", (context) => TrimEnd(sbFieldsDef.ToString()) },
                { "FIELDS_INIT", (context) => TrimEnd(sbFieldsInit.ToString()) }
            };

            entityDef.entityDefinition = TrimEnd(_entityTemplate.ToString(dic));
            entityDef.interfaceDefinition = CreateEntityInterface(entityDef, TrimEnd(sbValsFields.ToString()), TrimEnd(sbEntityFields.ToString()));

            return entityDef;
        }

        private string GetFieldDataType(Field fieldInfo)
        {
            string result;
            DataType dataType = fieldInfo.dataType;

            if (fieldInfo.fieldType == FieldType.Navigation)
            {
                result = fieldInfo.GetTypeScriptDataType();
            }
            else if (fieldInfo.fieldType == FieldType.Object)
            {
                result = fieldInfo.GetTypeScriptDataType();
            }
            else if (dataType == DataType.None && !string.IsNullOrWhiteSpace(fieldInfo.GetDataTypeName()))
            {
                result = fieldInfo.GetDataTypeName();
            }
            else
            {
                result = fieldInfo.isNullable ? $"{DotNet2TS.DataTypeToTypeName(dataType)} | null" : DotNet2TS.DataTypeToTypeName(dataType);
            }

            return result;
        }

        public static string GetDbSetTypeName(string dbSetName)
        {
            return string.Format("{0}Db", dbSetName);
        }

        public static string GetEntityTypeName(string dbSetName)
        {
            return string.Format("{0}Entity", dbSetName);
        }

        public static string GetEntityInterfaceName(string dbSetName)
        {
            return string.Format("{0}", dbSetName);
        }

        public static string GetValsInterfaceName(string dbSetName)
        {
            return string.Format("I{0}", dbSetName);
        }
    }
}