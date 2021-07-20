using System;
using System.Collections;
using System.Collections.Concurrent;
using System.Linq;
using System.Reflection;

namespace RIAPP.DataService.Utils.Extensions
{
    public static class EnumerableEx
    {
        private static readonly ConcurrentDictionary<Type, Func<IEnumerable, IEnumerable>> _cacheToArray = new ConcurrentDictionary<Type, Func<IEnumerable, IEnumerable>>();

        public static IEnumerable ToArray(this IEnumerable list, Type elementType)
        {
            Func<IEnumerable, IEnumerable> del = _cacheToArray.GetOrAdd(elementType, Internal.GetToArrayDelegate);
            return del(list);
        }

        private static class Internal
        {
            private static readonly MethodInfo ToArrayDelegateMI = typeof(Internal).GetMethod(nameof(Internal._GetToArrayDelegate), BindingFlags.Public | BindingFlags.Static);

            public static Func<IEnumerable, IEnumerable> GetToArrayDelegate(Type type)
            {
                MethodInfo miConstructed = ToArrayDelegateMI.MakeGenericMethod(type);
                return (Func<IEnumerable, IEnumerable>)miConstructed.Invoke(null, null);
            }

            public static Func<IEnumerable, IEnumerable> _GetToArrayDelegate<T>()
            {
                return delegate (IEnumerable list)
                {
                    return list.Cast<T>().ToArray();
                };
            }
        }
    }
}