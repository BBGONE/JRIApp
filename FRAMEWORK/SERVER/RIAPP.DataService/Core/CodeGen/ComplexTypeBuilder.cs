using RIAPP.DataService.Core.Types;
using RIAPP.DataService.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace RIAPP.DataService.Core.CodeGen
{
    public class ComplexTypeBuilder
    {
        private readonly Dictionary<string, string> _complexTypes;
        private readonly DotNet2TS _dotNet2TS;

        public ComplexTypeBuilder(DotNet2TS dotNet2TS)
        {
            _dotNet2TS = dotNet2TS ?? throw new ArgumentNullException(nameof(dotNet2TS));
            _complexTypes = new Dictionary<string, string>();
        }

        private static string TrimEnd(string s)
        {
            if (!string.IsNullOrEmpty(s))
            {
                return s.TrimEnd('\r', '\n', '\t', ' ');
            }

            return string.Empty;
        }

        public string CreateComplexType(DbSetInfo dbSetInfo, Field fieldInfo, int level)
        {
            string typeName;
            if (level == 0)
            {
                typeName = string.Format("{0}_{1}", dbSetInfo.dbSetName, fieldInfo.fieldName);
            }
            else
            {
                //to prevent names collision the type name is a three part name
                typeName = string.Format("{0}_{1}{2}", dbSetInfo.dbSetName, fieldInfo.fieldName, level);
            }
            string interfaceName = string.Format("I{0}", typeName);
            fieldInfo.SetTypeScriptDataType(typeName);

            StringBuilder sbProperties = new StringBuilder();
            StringBuilder sbFieldsDef = new StringBuilder();
            StringBuilder sbFieldsInit = new StringBuilder();
            StringBuilder sbInterfaceFields = new StringBuilder();

            Action<Field> AddProperty = f =>
            {
                string dataType = GetFieldDataType(f);
                sbProperties.AppendFormat("\tget {0}(): {2} {{ return this.getValue('{1}'); }}", f.fieldName,
                    f.GetFullName(), dataType);
                sbProperties.AppendLine();
                if (!f.isReadOnly)
                {
                    sbProperties.AppendFormat("\tset {0}(v: {2}) {{ this.setValue('{1}', v); }}", f.fieldName,
                        f.GetFullName(), dataType);
                    sbProperties.AppendLine();
                }

                sbInterfaceFields.AppendFormat("\t{0}{1}: {2};", f.isReadOnly ? "readonly " : "", f.fieldName, dataType);
                sbInterfaceFields.AppendLine();
            };

            Action<Field> AddCalculatedProperty = f =>
            {
                string dataType = GetFieldDataType(f);
                sbProperties.AppendFormat("\tget {0}(): {2} {{ return this.getEntity()._getCalcFieldVal('{1}'); }}",
                    f.fieldName, f.GetFullName(), dataType);
                sbProperties.AppendLine();

                sbInterfaceFields.AppendFormat("\treadonly {0}: {1};", f.fieldName, dataType);
                sbInterfaceFields.AppendLine();
            };

            Action<Field, string> AddComplexProperty = (f, dataType) =>
            {
                string interfName = string.Format("I{0}", dataType);
                sbProperties.AppendFormat(
                    "\tget {0}(): {2} {{ if (!this._{0}) {{this._{0} = new {1}('{0}', this);}} return this._{0}; }}",
                    f.fieldName, dataType, interfName);
                sbProperties.AppendLine();
                sbFieldsDef.AppendFormat("\tprivate _{0}: {1};", f.fieldName, dataType);
                sbFieldsDef.AppendLine();
                sbFieldsInit.AppendFormat("\t\tthis._{0} = null;", f.fieldName);
                sbFieldsInit.AppendLine();

                sbInterfaceFields.AppendFormat("\treadonly {0}: {1};", f.fieldName, interfName);
                sbInterfaceFields.AppendLine();
            };

            fieldInfo.nested.ForEach(f =>
            {
                if (f.fieldType == FieldType.Calculated)
                {
                    AddCalculatedProperty(f);
                }
                else if (f.fieldType == FieldType.Navigation)
                {
                    throw new InvalidOperationException("Navigation fields are not allowed on complex type properties");
                }
                else if (f.fieldType == FieldType.Object)
                {
                    string dataType = CreateComplexType(dbSetInfo, f, level + 1);
                    AddComplexProperty(f, dataType);
                }
                else
                {
                    AddProperty(f);
                }
            });

            string templateName = "RootComplexProperty.txt";
            if (level > 0)
            {
                templateName = "ChildComplexProperty.txt";
            }

            Dictionary<string, Func<TemplateParser.Context, string>> dic = new Dictionary<string, Func<TemplateParser.Context, string>>
            {
                { "PROPERTIES", (context) => TrimEnd(sbProperties.ToString()) },
                { "TYPE_NAME", (context) => typeName },
                { "FIELDS_DEF", (context) => sbFieldsDef.ToString() },
                { "FIELDS_INIT", (context) => sbFieldsInit.ToString() },
                { "INTERFACE_NAME", (context) => interfaceName },
                { "INTERFACE_FIELDS", (context) => TrimEnd(sbInterfaceFields.ToString()) }
            };

            string complexType = new CodeGenTemplate(templateName).ToString(dic);

            _complexTypes.Add(typeName, complexType);
            return typeName;
        }

        public string GetComplexTypes()
        {
            StringBuilder sb = new StringBuilder(1024);
            _complexTypes.Values.ToList().ForEach(typeDef =>
            {
                sb.AppendLine(typeDef);
                sb.AppendLine();
            });
            return sb.ToString().TrimEnd('\r', '\n');
        }

        private string GetFieldDataType(Field fieldInfo)
        {
            string fieldName = fieldInfo.fieldName;
            string fieldType = "any";
            DataType dataType = fieldInfo.dataType;

            fieldType = DotNet2TS.DataTypeToTypeName(dataType);
            return fieldType;
        }
    }
}