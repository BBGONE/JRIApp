namespace RIAPP.DataService.Utils.Extensions
{
    public static class DictionaryEx
    {
        public static T Get<T>(this System.Collections.Generic.IDictionary<string, object> dic, string key)
        {
            if (!dic.TryGetValue(key, out object obj))
            {
                return (T)(object)null;
            }
            return (T)obj;
        }

        public static T Get<T>(this System.Collections.Generic.IDictionary<string, T> dic, string key)
            where T : class
        {
            if (!dic.TryGetValue(key, out T obj))
            {
                return (T)(object)null;
            }
            return obj;
        }
    }
}