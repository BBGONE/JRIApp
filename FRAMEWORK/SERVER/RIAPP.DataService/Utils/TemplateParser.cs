using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace RIAPP.DataService.Utils
{
    public class TemplateParser
    {
        private const char LEFT_CHAR1 = '{';
        private const char RIGHT_CHAR1 = '}';
        private const char LEFT_CHAR2 = '<';
        private const char RIGHT_CHAR2 = '>';
        private readonly LinkedList<Part> list = new LinkedList<Part>();
        private Lazy<IEnumerable<DocPart>> DocParts { get; }

        public TemplateParser(string templateName, string template) :
            this(templateName, () => template)
        {
            DocParts = new Lazy<IEnumerable<DocPart>>(() => ParseTemplate(templateName), true);
        }

        public TemplateParser(string templateName, Func<string> templateProvider)
        {
            TemplateName = templateName;
            DocParts = new Lazy<IEnumerable<DocPart>>(() => ParseTemplate(templateProvider()), true);
        }


        public string TemplateName
        {
            get;
        }

        private DocPart GetDocPart(string str, bool IsTemplateRef = false)
        {
            string[] parts = str.Split(':').Select(s => s.Trim()).ToArray();

            return new DocPart
            {
                isTemplateRef = IsTemplateRef,
                isPlaceHolder = true,
                value = parts[0].Trim(),
                format = parts.Length > 1 ? parts[1] : null
            };
        }

        private IEnumerable<DocPart> ParseTemplate(string template)
        {
            char? prevChar = null;
            bool isPlaceHolder1 = false;
            bool isPlaceHolder2 = false;
            LinkedList<DocPart> list = new LinkedList<DocPart>();

            StringBuilder sb = new StringBuilder(512);

            char[] chars = template.ToCharArray();
            for (int i = 0; i < chars.Length; ++i)
            {
                char ch = chars[i];


                if (ch == LEFT_CHAR1)
                {
                    if (prevChar == LEFT_CHAR1)
                    {
                        if (sb.Length > 0)
                        {
                            list.AddLast(new DocPart { isPlaceHolder = false, value = sb.ToString() });
                            sb = new StringBuilder();
                        }
                        isPlaceHolder1 = true;
                    }
                    else if (prevChar == LEFT_CHAR2)
                    {
                        sb.Append(prevChar);
                    }
                }
                else if (ch == LEFT_CHAR2)
                {
                    if (prevChar == LEFT_CHAR2)
                    {
                        if (sb.Length > 0)
                        {
                            list.AddLast(new DocPart { isPlaceHolder = false, value = sb.ToString() });
                            sb = new StringBuilder();
                        }
                        isPlaceHolder2 = true;
                    }
                    else if (prevChar == LEFT_CHAR1)
                    {
                        sb.Append(prevChar);
                    }
                }
                else if (isPlaceHolder1 && ch == RIGHT_CHAR1)
                {
                    if (prevChar == RIGHT_CHAR1)
                    {
                        list.AddLast(GetDocPart(sb.ToString(), IsTemplateRef: false));
                        isPlaceHolder1 = false;
                        sb = new StringBuilder();
                    }
                }
                else if (isPlaceHolder2 && ch == RIGHT_CHAR2)
                {
                    if (prevChar == RIGHT_CHAR2)
                    {
                        list.AddLast(GetDocPart(sb.ToString(), IsTemplateRef: true));
                        isPlaceHolder2 = false;
                        sb = new StringBuilder();
                    }
                }
                else if ((isPlaceHolder1 && prevChar == RIGHT_CHAR1) || (isPlaceHolder2 && prevChar == RIGHT_CHAR2) || (!isPlaceHolder1 && prevChar == LEFT_CHAR1) || (!isPlaceHolder2 && prevChar == LEFT_CHAR2))
                {
                    sb.Append(prevChar);
                    sb.Append(ch);
                }
                else
                {
                    sb.Append(ch);
                }

                prevChar = ch;
            }

            if (sb.Length > 0)
            {
                list.AddLast(new DocPart { isPlaceHolder = false, value = sb.ToString() });
            }

            return list;
        }

        private void ProcessParts(Action<DocPart> partHandler)
        {
            foreach (DocPart part in DocParts.Value)
            {
                partHandler(part);
            }
        }

        private void Execute(IDictionary<string, Func<Context, string>> dic, Func<Context, Part, string> valueGetter)
        {
            if (dic == null)
            {
                dic = new Dictionary<string, Func<Context, string>>();
            }

            list.Clear();

            ProcessParts(part =>
            {
                if (!part.isPlaceHolder)
                {
                    list.AddLast(new Part(TemplateName, string.Empty, (Context context) => part.value, false));
                }
                else
                {
                    string name = part.value;

                    if (part.isTemplateRef)
                    {
                        TemplateParser parser = GetTemplate(name, dic);

                        list.AddLast(new Part(TemplateName, name, (Context context) =>
                        {
                            return parser.ToString(dic, valueGetter);
                        }, true));
                    }
                    else if (dic.TryGetValue(name, out Func<Context, string> fn))
                    {
                        list.AddLast(new Part(TemplateName, name, fn, false));
                    }
                }
            });
        }

        public virtual string ToString(IDictionary<string, Func<Context, string>> dic, Func<Context, Part, string> valueGetter = null)
        {
            if (valueGetter == null)
            {
                valueGetter = (ctxt, part) => part.ValueGetter(ctxt);
            }

            Execute(dic, valueGetter);
            Context context = new Context(list);

            StringBuilder sb = new StringBuilder();

            foreach (Part item in list)
            {
                string value = valueGetter(context, item);
                sb.Append(value);
            }

            string result = sb.ToString();
            return Regex.Replace(result, @"^\s+$[\r\n]*", string.Empty, RegexOptions.Multiline);
        }

        public class Part
        {
            public Part(string templateName, string name, Func<Context, string> valueGetter, bool IsTemplateRef = false)
            {
                TemplateName = templateName;
                Name = name;
                ValueGetter = valueGetter;
                this.IsTemplateRef = IsTemplateRef;
            }

            public bool IsTemplateRef
            {
                get;
            }

            public string TemplateName
            {
                get;
            }

            public string Name
            {
                get;
            }

            public Func<Context, string> ValueGetter
            {
                get;
            }
        }

        public class Context
        {
            internal Context(LinkedList<Part> parts)
            {
                Parts = parts.ToList();
            }

            public List<Part> Parts
            {
                get;
            }
        }

        protected virtual TemplateParser GetTemplate(string name, IDictionary<string, Func<Context, string>> dic)
        {
            throw new NotImplementedException();
        }

        private struct DocPart
        {
            public bool isTemplateRef;
            public bool isPlaceHolder;
            public string value;
            public string format;
        }
    }
}