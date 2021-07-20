using RIAPP.DataService.Core.Types;
using RIAPP.DataService.Resources;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Xml.Linq;

namespace RIAPP.DataService.Utils
{
    public static class DiffGram
    {
        private static object GetValue(object obj, string propertyName)
        {
            string[] parts = propertyName.Split('.');
            System.Type objType = obj.GetType();
            System.Reflection.PropertyInfo pinfo = objType.GetProperty(parts[0]);
            if (pinfo == null)
            {
                throw new Exception(string.Format(ErrorStrings.ERR_PROPERTY_IS_MISSING, objType.Name, propertyName));
            }

            if (parts.Length == 1)
            {
                return pinfo.GetValue(obj, null);
            }
            object pval = pinfo.GetValue(obj, null);
            if (pval == null)
            {
                throw new Exception(string.Format(ErrorStrings.ERR_PPROPERTY_ISNULL, objType.Name, pinfo.Name));
            }

            return GetValue(pval, string.Join(".", parts.Skip(1)));
        }

        private static Dictionary<string, object> GetValues(Type t, object obj, string[] propNames)
        {
            Dictionary<string, object> res = new Dictionary<string, object>();
            if (obj == null)
            {
                return res;
            }

            foreach (string name in propNames)
            {
                res.Add(name, GetValue(obj, name));
            }
            return res;
        }

        public static string GetDiffGram(Dictionary<string, object> d1, Dictionary<string, object> d2, Type t, string[] pkNames, Dictionary<string, object> dpk, ChangeType changeType, string dbSetName)
        {
            LinkedList<Vals> lst = new LinkedList<Vals>();

            foreach (string pnm in d1.Keys.Intersect(d2.Keys))
            {
                object val1 = d1[pnm];
                object val2 = d2[pnm];

                if (val2 != null && val1 != null)
                {
                    if (!val2.ToString().Equals(val1.ToString(), StringComparison.Ordinal))
                    {
                        lst.AddLast(new Vals
                        {
                            Val1 = Convert.ToString(val1, CultureInfo.InvariantCulture),
                            Val2 = Convert.ToString(val2, CultureInfo.InvariantCulture),
                            Name = pnm
                        });
                    }
                }
                else if (val1 == null && val2 != null)
                {
                    lst.AddLast(new Vals
                    {
                        Val1 = "NULL",
                        Val2 = Convert.ToString(val2, CultureInfo.InvariantCulture),
                        Name = pnm
                    });
                }
                else if (val1 != null && val2 == null)
                {
                    lst.AddLast(new Vals
                    {
                        Val1 = Convert.ToString(val1, CultureInfo.InvariantCulture),
                        Val2 = "NULL",
                        Name = pnm
                    });
                }
            }

            foreach (string pnm in d1.Keys.Except(d2.Keys))
            {
                object val1 = d1[pnm];
                if (val1 != null)
                {
                    lst.AddLast(new Vals
                    {
                        Val1 = Convert.ToString(val1, CultureInfo.InvariantCulture),
                        Val2 = "",
                        Name = pnm
                    });
                }
                /*
                else if (val1 == null)
                {
                    lst.AddLast(new Vals {Val1 = "NULL", Val2 = "", Name = pnm});
                }
                */
            }

            foreach (string pnm in d2.Keys.Except(d1.Keys))
            {
                object val2 = d2[pnm];
                if (val2 != null)
                {
                    lst.AddLast(new Vals
                    {
                        Val1 = "",
                        Val2 = Convert.ToString(val2, CultureInfo.InvariantCulture),
                        Name = pnm
                    });
                }
                /*
                else if (val2 == null)
                {
                    lst.AddLast(new Vals {Val1 = "", Val2 = "NULL", Name = pnm});
                }
                */
            }

            string pkval = string.Join(",", pkNames.Select(nm => dpk[nm].ToString()));

            XElement x = new XElement("diffgram",
                new XAttribute("dbset-name", dbSetName),
                new XAttribute("key-name", string.Join(",", pkNames)),
                new XAttribute("key-val", pkval),
                new XAttribute("change-type", changeType),
                from v in lst
                select new XElement(v.Name,
                    new XAttribute("old", v.Val1),
                    new XAttribute("new", v.Val2))
                );
            return x.ToString();
        }

        public static string GetDiffGram(object obj1, object obj2, Type t, string[] propNames, string[] pkNames, ChangeType changeType, string dbSetName)
        {
            Dictionary<string, object> d1 = GetValues(t, obj1, propNames);
            Dictionary<string, object> d2 = GetValues(t, obj2, propNames);
            object obj = obj2 == null ? obj1 : obj2;
            Dictionary<string, object> dpk = GetValues(t, obj, pkNames);

            return GetDiffGram(d1, d2, t, pkNames, dpk, changeType, dbSetName);
        }

        private struct Vals
        {
            public string Name { get; set; }

            public string Val1 { get; set; }

            public string Val2 { get; set; }
        }
    }
}