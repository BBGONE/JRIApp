using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

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
            this.TemplateName = templateName;
            DocParts = new Lazy<IEnumerable<DocPart>>(() => ParseTemplate(templateProvider()), true);
        }


        public string TemplateName
        {
            get;
        }

        private DocPart GetDocPart(string str, bool IsTemplateRef = false)
        {
            var parts = str.Split(':').Select(s => s.Trim()).ToArray();

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
            var list = new LinkedList<DocPart>();

            var sb = new StringBuilder(512);

            var chars = template.ToCharArray();
            for (var i = 0; i < chars.Length; ++i)
            {
                var ch = chars[i];


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
            foreach (var part in DocParts.Value)
            {
                partHandler(part);
            }
        }

        public IEnumerable<Part> Execute(IDictionary<string, Func<Context, string>> dic)
        {
            if (dic == null)
            {
                dic = new Dictionary<string, Func<Context, string>>();
            }

            this.list.Clear();

            this.ProcessParts(part =>
            {
                if (!part.isPlaceHolder)
                {
                    this.list.AddLast(new Part(this.TemplateName, string.Empty, (Context context) => part.value, null, false));
                }
                else
                {
                    string name = part.value;

                    if (part.isTemplateRef)
                    {
                        IEnumerable<Part> res = this.GetTemplate(name, dic);

                        this.list.AddLast(new Part(this.TemplateName, name, (Context context) => {
                            StringBuilder sb = new StringBuilder();
                            foreach (var item in res)
                            {
                                sb.Append(context.GetPartValue(item));
                            }
                            return sb.ToString();
                        }, res, true));
                    }
                    else if (dic.TryGetValue(name, out var fn))
                    {
                        this.list.AddLast(new Part(this.TemplateName, name, fn, null, false));
                    }
                }
            });

            return list.ToList();
        }

        public virtual string ToString(IDictionary<string, Func<Context, string>> dic, Func<Context, Part, string> valueGetter = null)
        {
            if (valueGetter == null)
            {
                valueGetter = (ctxt, part) => part.ValueGetter(ctxt);
            }

            var res = this.Execute(dic);
            Context context = new Context(res.ToList(), valueGetter);
            StringBuilder sb = new StringBuilder();
            foreach (var item in res)
            {
                sb.Append(context.GetPartValue(item));
            }
            string result = sb.ToString();
            return result;
        }

        public class Part
        {
            public Part(string templateName, string name, Func<Context, string> valueGetter, IEnumerable<Part> subparts = null, bool IsTemplateRef = false)
            {
                this.TemplateName = templateName;
                this.Name = name;
                this.ValueGetter = valueGetter;
                this.SubParts = subparts ?? Enumerable.Empty<Part>();
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

            public IEnumerable<Part> SubParts
            {
                get;
            }
        }

        public class Context
        {
            private readonly Func<Context, Part, string> valueGetter;
            public Context(IEnumerable<Part> parts, Func<Context, Part, string> valueGetter)
            {
                this.Parts = parts;
                this.valueGetter = valueGetter;
            }

            public IEnumerable<Part> Parts
            {
                get;
            }

            public string GetPartValue(Part part)
            {
                string value = this.valueGetter(this, part);
                return value;
            }
        }

        protected virtual IEnumerable<Part> GetTemplate(string name, IDictionary<string, Func<Context, string>> dic)
        {
            return Enumerable.Empty<Part>();
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