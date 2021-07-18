using RIAPP.DataService.Core.Exceptions;
using RIAPP.DataService.Core.Types;
using RIAPP.DataService.Utils.Extensions;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Reflection;
using System.Xml.Linq;

namespace RIAPP.DataService.Core.Metadata
{
    public class DesignTimeMetadata
    {
        // private static readonly XNamespace NS_XAML_PRESENTATION = "http://schemas.microsoft.com/winfx/2006/xaml/presentation";
        private static readonly XNamespace NS_DATA = $"clr-namespace:{typeof(DbSetInfo).Namespace};assembly={typeof(DbSetInfo).Assembly.GetName().Name}";
        private static readonly XNamespace NS_XAML = "http://schemas.microsoft.com/winfx/2006/xaml";

        [DesignerSerializationVisibility(DesignerSerializationVisibility.Content)]
        public DBSetList DbSets { get; } = new DBSetList();

        [DesignerSerializationVisibility(DesignerSerializationVisibility.Content)]
        public AssocList Associations { get; } = new AssocList();

        public List<string> TypeScriptImports = new List<string>();


        public string ToXML()
        {
            Type dbSetType = DbSets.Any() ? DbSets.First().GetEntityType() : GetType();

            XNamespace ns_dal = $"clr-namespace:{dbSetType.Namespace};assembly={dbSetType.Assembly.GetName().Name}";

            var xElement = new XElement(NS_DATA + "Metadata",
                new XAttribute(XNamespace.Xmlns + "x", NS_XAML.ToString()),
                new XAttribute(XNamespace.Xmlns + "data", NS_DATA.ToString()),
                new XAttribute(XNamespace.Xmlns + "dal", ns_dal.ToString()),
                new XAttribute(NS_XAML + "Key", "ResourceKey"),
                new XElement(NS_DATA + "Metadata.DbSets",
                    from dbset in DbSets
                    select new XElement(NS_DATA + "DbSetInfo",
                        new XAttribute("dbSetName", dbset.dbSetName),
                        new[] { new XAttribute("isTrackChanges", dbset.GetIsTrackChanges()) },
                        new XAttribute("enablePaging", dbset.enablePaging),
                        dbset.enablePaging ? new[] { new XAttribute("pageSize", dbset.pageSize) } : new XAttribute[0],
                        new XAttribute("EntityType", $"{{x:Type dal:{dbset.GetEntityType().Name}}}"),
                        new XElement(NS_DATA + "DbSetInfo.fieldInfos", _FieldsToXElements(dbset.fieldInfos)
                            ))),
                new XElement(NS_DATA + "Metadata.Associations",
                    from assoc in Associations
                    select new XElement(NS_DATA + "Association",
                        new XAttribute("name", assoc.name),
                        string.IsNullOrWhiteSpace(assoc.parentDbSetName)
                            ? new XAttribute[0]
                            : new[] { new XAttribute("parentDbSetName", assoc.parentDbSetName) },
                        string.IsNullOrWhiteSpace(assoc.childDbSetName)
                            ? new XAttribute[0]
                            : new[] { new XAttribute("childDbSetName", assoc.childDbSetName) },
                        string.IsNullOrWhiteSpace(assoc.childToParentName)
                            ? new XAttribute[0]
                            : new[] { new XAttribute("childToParentName", assoc.childToParentName) },
                        string.IsNullOrWhiteSpace(assoc.parentToChildrenName)
                            ? new XAttribute[0]
                            : new[] { new XAttribute("parentToChildrenName", assoc.parentToChildrenName) },
                        assoc.onDeleteAction == DeleteAction.NoAction
                            ? new XAttribute[0]
                            : new[] { new XAttribute("onDeleteAction", assoc.onDeleteAction) },
                        new XElement(NS_DATA + "Association.fieldRels",
                            from fldRel in assoc.fieldRels
                            select new XElement(NS_DATA + "FieldRel",
                                new XAttribute("parentField", fldRel.parentField),
                                new XAttribute("childField", fldRel.childField)
                                )
                            )
                        ))
                );

            var xml = xElement.ToString();
            return xml;
        }

        public static DesignTimeMetadata FromXML(string xml)
        {
            var metadata = new DesignTimeMetadata();
            var xdoc = XDocument.Parse(xml);
            var xmetadata = xdoc.Element(NS_DATA + "Metadata");
            var xdbSets = xmetadata.Element(NS_DATA + "Metadata.DbSets");
            var ximports = xmetadata.Nodes().Where(n => n is XProcessingInstruction && (n as XProcessingInstruction).Target == "import").Cast<XProcessingInstruction>();

            foreach (var xpc in ximports)
            {
                metadata.TypeScriptImports.Add(xpc.Data);
            }

            if (xdbSets != null)
            {
                foreach (var xdbSet in xdbSets.Elements(NS_DATA + "DbSetInfo"))
                {
                    var xType = xdbSet.Attribute("EntityType").Value;
                    var _entityType = _GetTypeFromXType(xType, xdoc);

                    var dbSetInfo = new DbSetInfo
                    {
                        dbSetName = (string)xdbSet.Attribute("dbSetName")
                    };
                    dbSetInfo.SetEntityType(_entityType);

                    if (xdbSet.Attributes("enablePaging").Any())
                    {
                        dbSetInfo.enablePaging = (bool)xdbSet.Attribute("enablePaging");
                    }

                    if (xdbSet.Attributes("pageSize").Any())
                    {
                        dbSetInfo.pageSize = (int)xdbSet.Attribute("pageSize");
                    }

                    if (xdbSet.Attributes("isTrackChanges").Any())
                    {
                        dbSetInfo.SetIsTrackChanges((bool)xdbSet.Attribute("isTrackChanges"));
                    }

                    metadata.DbSets.Add(dbSetInfo);

                    var xFields = xdbSet.Element(NS_DATA + "DbSetInfo.fieldInfos");
                    var fields = xFields.Elements(NS_DATA + "Field");
                    dbSetInfo.fieldInfos.AddRange(_XElementsToFieldList(fields));
                }
            }

            var xAssocs = xmetadata.Element(NS_DATA + "Metadata.Associations");
            if (xAssocs != null)
            {
                foreach (var xAssoc in xAssocs.Elements(NS_DATA + "Association"))
                {
                    var assoc = new Association
                    {
                        name = (string)xAssoc.Attribute("name")
                    };
                    if (xAssoc.Attributes("parentDbSetName").Any())
                    {
                        assoc.parentDbSetName = (string)xAssoc.Attribute("parentDbSetName");
                    }

                    if (xAssoc.Attributes("childDbSetName").Any())
                    {
                        assoc.childDbSetName = (string)xAssoc.Attribute("childDbSetName");
                    }

                    if (xAssoc.Attributes("childToParentName").Any())
                    {
                        assoc.childToParentName = (string)xAssoc.Attribute("childToParentName");
                    }

                    if (xAssoc.Attributes("parentToChildrenName").Any())
                    {
                        assoc.parentToChildrenName = (string)xAssoc.Attribute("parentToChildrenName");
                    }

                    if (xAssoc.Attributes("onDeleteAction").Any())
                    {
                        assoc.onDeleteAction =
                            (DeleteAction)Enum.Parse(typeof(DeleteAction), xAssoc.Attribute("onDeleteAction").Value);
                    }

                    var xFieldRels = xAssoc.Element(NS_DATA + "Association.fieldRels");
                    if (xFieldRels != null)
                    {
                        foreach (var xFieldRel in xFieldRels.Elements(NS_DATA + "FieldRel"))
                        {
                            var fldRel = new FieldRel
                            {
                                parentField = (string)xFieldRel.Attribute("parentField"),
                                childField = (string)xFieldRel.Attribute("childField")
                            };
                            assoc.fieldRels.Add(fldRel);
                        }
                    }

                    metadata.Associations.Add(assoc);
                }
            }

            return metadata;
        }

        /// <summary>
        ///     Helps to obtain XML for any class type in the form that are usable for the metadata
        /// </summary>
        /// <param name="classTypes"></param>
        /// <returns></returns>
        public static string ClassTypesToXML(IEnumerable<Type> classTypes)
        {
            classTypes = classTypes.Where(t => t.IsClass && !t.IsArray);
            var dic_types = new Dictionary<Type, string>();

            foreach (var classType in classTypes)
            {
                var ns_dal = $"clr-namespace:{classType.Namespace};assembly={classType.Assembly.GetName().Name}";
                dic_types.Add(classType, ns_dal);
            }

            var dic_ns_prefix = new Dictionary<string, string>();
            var dal_ns_attributes = new LinkedList<XAttribute>();
            int i = 0;

            foreach (var ns in dic_types.Values)
            {
                if (!dic_ns_prefix.ContainsKey(ns))
                {
                    ++i;
                    var prefix = $"dal{i}";
                    dic_ns_prefix.Add(ns, prefix);
                    dal_ns_attributes.AddLast(new XAttribute(XNamespace.Xmlns + prefix, ns));
                }
            }

            var xElement = new XElement(NS_DATA + "Metadata",
                new XAttribute(XNamespace.Xmlns + "x", NS_XAML.ToString()),
                new XAttribute(XNamespace.Xmlns + "data", NS_DATA.ToString()),
                dal_ns_attributes.ToArray(),
                new XAttribute(NS_XAML + "Key", "ResourceKey"),
                new XElement(NS_DATA + "Metadata.DbSets",
                    from classType in classTypes
                    select new XElement(NS_DATA + "DbSetInfo",
                        new XAttribute("dbSetName", classType.Name),
                        new XAttribute("enablePaging", true),
                        new XAttribute("pageSize", 25),
                        new XAttribute("EntityType", $"{{x:Type {dic_ns_prefix[dic_types[classType]]}:{classType.Name}}}"),
                        new XElement(NS_DATA + "DbSetInfo.fieldInfos", _PropsToXElements(classType.GetProperties(), 0)
                            )))
                );

            return xElement.ToString();
        }

        public static string ClassTypeToXML(Type classType)
        {
            return ClassTypesToXML(new[] { classType });
        }

        #region Helper methods

        private const int MAX_DEPTH = 2;

        private static IEnumerable<XElement> _PropsToXElements(PropertyInfo[] props, int level)
        {
            if (level > MAX_DEPTH)
            {
                return Enumerable.Empty<XElement>();
            }

            DataType toDataType(Type propType)
            {
                DataType res;
                try
                {
                    res = propType.IsArrayType() ? DataType.None : propType.GetDataType();
                }
                catch (UnsupportedTypeException)
                {
                    res = DataType.None;
                }

                return res;
            };

            bool isComplexType(Type propType)
            {
                return propType.IsClass && propType != typeof(string) && !propType.IsArray &&
                       propType.GetProperties().Any();
            };

            return from prop in props
                   select new XElement(NS_DATA + "Field",
                       new XAttribute("fieldName", prop.Name),
                       new XAttribute("dataType", toDataType(prop.PropertyType)),
                       prop.PropertyType.IsNullableType() || prop.PropertyType == typeof(string)
                           ? new[] { new XAttribute("isNullable", true) }
                           : new XAttribute[0],
                       prop.SetMethod == null ? new[] { new XAttribute("isReadOnly", true) } : new XAttribute[0],
                       isComplexType(prop.PropertyType)
                           ? new[] { new XAttribute("fieldType", FieldType.Object) }
                           : new XAttribute[0],
                       isComplexType(prop.PropertyType) && level < MAX_DEPTH
                           ? new[]
                           {
                            new XElement(NS_DATA + "Field.nested",
                                _PropsToXElements(prop.PropertyType.GetProperties(), level + 1))
                           }
                           : new XElement[0]
                       );
        }

        private static IEnumerable<XElement> _FieldsToXElements(FieldsList fields)
        {
            return from fld in fields
                   select new XElement(NS_DATA + "Field",
                       new XAttribute("fieldName", fld.fieldName),
                       fld.dataType != DataType.None ? new XAttribute("dataType", fld.dataType) : null,
                       fld.isPrimaryKey > 0 ? new[] { new XAttribute("isPrimaryKey", fld.isPrimaryKey) } : new XAttribute[0],
                       fld.dataType == DataType.String && fld.maxLength > -1
                           ? new[] { new XAttribute("maxLength", fld.maxLength) }
                           : new XAttribute[0],
                       !fld.isNullable ? new[] { new XAttribute("isNullable", fld.isNullable) } : new XAttribute[0],
                       fld.isAutoGenerated
                           ? new[] { new XAttribute("isAutoGenerated", fld.isAutoGenerated) }
                           : new XAttribute[0],
                       fld.allowClientDefault
                           ? new[] { new XAttribute("allowClientDefault", fld.allowClientDefault) }
                           : new XAttribute[0],
                       !fld.isNeedOriginal
                           ? new[] { new XAttribute("isNeedOriginal", fld.isNeedOriginal) }
                           : new XAttribute[0],
                       fld.isReadOnly ? new[] { new XAttribute("isReadOnly", fld.isReadOnly) } : new XAttribute[0],
                       fld.fieldType != FieldType.None
                           ? new[] { new XAttribute("fieldType", fld.fieldType) }
                           : new XAttribute[0],
                       fld.dateConversion != DateConversion.None
                           ? new[] { new XAttribute("dateConversion", fld.dateConversion) }
                           : new XAttribute[0],
                       !string.IsNullOrWhiteSpace(fld.range)
                           ? new[] { new XAttribute("range", fld.range) }
                           : new XAttribute[0],
                       !string.IsNullOrWhiteSpace(fld.regex)
                           ? new[] { new XAttribute("regex", fld.regex) }
                           : new XAttribute[0],
                       !string.IsNullOrWhiteSpace(fld.dependentOn)
                           ? new[] { new XAttribute("dependentOn", fld.dependentOn) }
                           : new XAttribute[0],
                       !string.IsNullOrWhiteSpace(fld.GetDataTypeName())
                           ? new[] { new XAttribute("dataTypeName", fld.GetDataTypeName()) }
                           : new XAttribute[0],
                       !fld.IsHasNestedFields()
                           ? new XElement[0]
                           : new[] { new XElement(NS_DATA + "Field.nested", _FieldsToXElements(fld.nested)) }
                       );
        }

        private static FieldsList _XElementsToFieldList(IEnumerable<XElement> xFields)
        {
            var fields = new FieldsList();

            foreach (var xField in xFields)
            {
                var field = new Field
                {
                    fieldName = (string)xField.Attribute("fieldName")
                };
                if (xField.Attributes("isPrimaryKey").Any())
                {
                    field.isPrimaryKey = (short)xField.Attribute("isPrimaryKey");
                }

                if (xField.Attributes("dataType").Any())
                {
                    field.dataType = (DataType)Enum.Parse(typeof(DataType), xField.Attribute("dataType").Value);
                }

                if (xField.Attributes("maxLength").Any())
                {
                    field.maxLength = (short)xField.Attribute("maxLength");
                }

                if (xField.Attributes("isNullable").Any())
                {
                    field.isNullable = (bool)xField.Attribute("isNullable");
                }

                if (xField.Attributes("isReadOnly").Any())
                {
                    field.isReadOnly = (bool)xField.Attribute("isReadOnly");
                }

                if (xField.Attributes("isAutoGenerated").Any())
                {
                    field.isAutoGenerated = (bool)xField.Attribute("isAutoGenerated");
                }

                if (xField.Attributes("allowClientDefault").Any())
                {
                    field.allowClientDefault = (bool)xField.Attribute("allowClientDefault");
                }

                if (xField.Attributes("isNeedOriginal").Any())
                {
                    field.isNeedOriginal = (bool)xField.Attribute("isNeedOriginal");
                }

                if (xField.Attributes("dateConversion").Any())
                {
                    field.dateConversion =
                        (DateConversion)Enum.Parse(typeof(DateConversion), xField.Attribute("dateConversion").Value);
                }

                if (xField.Attributes("fieldType").Any())
                {
                    field.fieldType = (FieldType)Enum.Parse(typeof(FieldType), xField.Attribute("fieldType").Value);
                }

                if (xField.Attributes("range").Any())
                {
                    field.range = (string)xField.Attribute("range");
                }

                if (xField.Attributes("regex").Any())
                {
                    field.regex = (string)xField.Attribute("regex");
                }

                if (xField.Attributes("dependentOn").Any())
                {
                    field.dependentOn = (string)xField.Attribute("dependentOn");
                }

                if (xField.Attributes("dataTypeName").Any())
                {
                    field.SetDataTypeName((string)xField.Attribute("dataTypeName"));
                }

                if (xField.Elements(NS_DATA + "Field.nested").Any())
                {
                    field.nested.AddRange(_XElementsToFieldList(xField.Element(NS_DATA + "Field.nested").Elements(NS_DATA + "Field")));
                }

                fields.Add(field);
            }

            return fields;
        }

        private static Type _GetTypeFromXType(string xType, XDocument xdoc)
        {
            if (!(xType.StartsWith("{") && xType.EndsWith("}")))
            {
                throw new Exception(string.Format("Invalid EntityType attribute value: {0}", xType));
            }

            var typeParts = xType.TrimStart('{').TrimEnd('}').Split(' ');
            if (typeParts.Length != 2)
            {
                throw new Exception(string.Format("Invalid entity type: {0}", xType));
            }

            var typeParts1 = typeParts[0].Split(':').Select(s => s.Trim()).ToArray();
            var typeParts2 = typeParts[1].Split(':').Select(s => s.Trim()).ToArray();

            var xaml_ns = xdoc.Root.GetNamespaceOfPrefix(typeParts1[0]);
            if (xaml_ns != NS_XAML)
            {
                throw new Exception(string.Format("Can not get xaml namespace for xType: {0}", typeParts1[0]));
            }

            if (typeParts1[1] != "Type")
            {
                throw new Exception(string.Format("Invalid EntityType attribute value: {0}", xType));
            }

            var xEntity_ns = xdoc.Root.GetNamespaceOfPrefix(typeParts2[0]);
            if (xEntity_ns == null)
            {
                throw new Exception(string.Format("Can not get clr namespace for the prefix: {0}", typeParts2[0]));
            }
            if (xEntity_ns.ToString().IndexOf("clr-namespace:") < 0)
            {
                throw new Exception(string.Format("The namespace: {0} is not valid clr namespace", xEntity_ns));
            }

            var entity_ns = RemoveWhitespace(xEntity_ns.ToString()).Replace("clr-namespace:", "");
            var entityTypeName = typeParts2[1];
            var nsparts = entity_ns.Split(';');

            entityTypeName = $"{nsparts[0]}.{entityTypeName}";
            if (nsparts.Length == 2 && nsparts[1].IndexOf("assembly=") >= 0)
            {
                entityTypeName = $"{entityTypeName}, {nsparts[1].Replace("assembly=", "")}";
            }
            var entityType = Type.GetType(entityTypeName, true);
            return entityType;
        }

        private static string RemoveWhitespace(string input)
        {
            return new string(input.ToCharArray()
                .Where(c => !char.IsWhiteSpace(c))
                .ToArray());
        }

        #endregion
    }
}