using System;

namespace RIAPP.DataService.Utils.Extensions
{
    public static class StringEx
    {
        private const string INPUT_ERROR = "Invalid serialized input byte array";

        public static string ToCamelCase(this string str)
        {
            return str.Length > 1 ? str.Substring(0, 1).ToLower() + str.Substring(1, str.Length - 1) : str.ToLower();
        }

        private static int GetBytesCount(string value)
        {
            int i = 0;
            int brace1Pos = -1;
            int brace2Pos = -1;
            int byteCnt = 0;

            char[] lastValue = new char[3];
            int lastValueSize = 0;
            bool lastComma = false;

            try
            {
                foreach (char ch in value)
                {
                    if (ch == '[')
                    {
                        if (lastComma)
                        {
                            throw new InvalidOperationException(INPUT_ERROR);
                        }
                        else if (brace1Pos > -1)
                        {
                            throw new InvalidOperationException(INPUT_ERROR);
                        }

                        brace1Pos = i;
                    }
                    else if (ch == ']')
                    {
                        if (lastComma)
                        {
                            throw new InvalidOperationException(INPUT_ERROR);
                        }
                        else if (brace2Pos > -1)
                        {
                            throw new InvalidOperationException(INPUT_ERROR);
                        }

                        lastComma = false;
                        brace2Pos = i;

                        if (lastValueSize > 0)
                        {
                            ++byteCnt;
                        }
                        lastValueSize = 0;
                    }
                    else if (ch == ',')
                    {
                        if (lastComma)
                        {
                            throw new InvalidOperationException(INPUT_ERROR);
                        }
                        else if (brace2Pos > -1)
                        {
                            throw new InvalidOperationException(INPUT_ERROR);
                        }
                        else if (lastValueSize == 0)
                        {
                            throw new InvalidOperationException(INPUT_ERROR);
                        }

                        lastComma = true;
                        ++byteCnt;
                        lastValueSize = 0;
                    }
                    else if (!char.IsWhiteSpace(ch))
                    {
                        if (!char.IsDigit(ch))
                        {
                            throw new InvalidOperationException(INPUT_ERROR);
                        }
                        else if (brace1Pos == -1)
                        {
                            throw new InvalidOperationException(INPUT_ERROR);
                        }
                        else if (brace2Pos > -1)
                        {
                            throw new InvalidOperationException(INPUT_ERROR);
                        }
                        else if (lastValueSize > 2)
                        {
                            throw new InvalidOperationException(INPUT_ERROR);
                        }

                        lastComma = false;
                        lastValue[lastValueSize++] = ch;
                    }

                    ++i;
                }
            }
            finally
            {
                if (lastComma)
                {
                    throw new InvalidOperationException(INPUT_ERROR);
                }

                if (brace1Pos == -1)
                {
                    throw new InvalidOperationException(INPUT_ERROR);
                }

                if (brace2Pos == -1)
                {
                    throw new InvalidOperationException(INPUT_ERROR);
                }
            }

            return byteCnt;
        }

        public static byte[] ConvertToBinary(this string value)
        {
            int byteCnt = GetBytesCount(value);
            byte[] result = new byte[byteCnt];

            if (byteCnt == 0)
            {
                return result;
            }

            int cnt = 0;
            char[] lastValue = new char[3];
            int lastValueSize = 0;

            foreach (char ch in value)
            {
                if (ch == ']')
                {
                    if (lastValueSize > 0)
                    {
                        result[cnt++] = byte.Parse(new String(lastValue, 0, lastValueSize));
                    }
                    lastValueSize = 0;

                    return result;
                }
                else if (ch == ',')
                {
                    result[cnt++] = byte.Parse(new String(lastValue, 0, lastValueSize));
                    lastValueSize = 0;
                }
                else if (!char.IsWhiteSpace(ch) && ch != '[')
                {
                    lastValue[lastValueSize++] = ch;
                }
            }


            throw new InvalidOperationException(INPUT_ERROR);
        }
    }
}