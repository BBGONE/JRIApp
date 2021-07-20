using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;

namespace RIAPP.DataService.Utils
{
    public class MultiMap<K, V> : IMultiMap<K, V>
    {
        private readonly ConcurrentDictionary<K, IEnumerable<V>> _dictionary =
            new ConcurrentDictionary<K, IEnumerable<V>>();

        private volatile bool _isReadOnly;

        public bool Add(K key, V value)
        {
            lock (_dictionary)
            {
                if (_isReadOnly)
                {
                    throw new InvalidOperationException("The MultyMap is ReadOnly");
                }

                IProducerConsumerCollection<V> list = GetListByKey(key) as IProducerConsumerCollection<V>;
                if (list == null)
                {
                    throw new InvalidOperationException("The MultyMap is ReadOnly");
                }

                return list.TryAdd(value);
            }
        }

        public IEnumerable<K> Keys => _dictionary.Keys;

        public IEnumerable<V> Values
        {
            get
            {
                ICollection<IEnumerable<V>> lists = _dictionary.Values;
                List<V> res = new List<V>();
                foreach (IEnumerable<V> list in lists)
                {
                    foreach (V val in list)
                    {
                        res.Add(val);
                    }
                }
                return res.Distinct<V>();
            }
        }


        public IEnumerable<V> this[K key] => GetListByKey(key);

        public void MakeReadOnly()
        {
            if (_isReadOnly)
            {
                return;
            }

            lock (_dictionary)
            {
                if (_isReadOnly)
                {
                    return;
                }

                _isReadOnly = true;
                List<K> keys = Keys.ToList();
                keys.ForEach(k =>
                {
                    V[] vals = _dictionary[k].ToArray();
                    _dictionary[k] = vals;
                });
            }
        }

        public bool IsReadOnly => _isReadOnly;


        private static IEnumerable<V> ListFactory(K key)
        {
            return new ConcurrentBag<V>();
        }

        private IEnumerable<V> GetListByKey(K key)
        {
            if (_isReadOnly)
            {
                if (_dictionary.TryGetValue(key, out IEnumerable<V> val))
                {
                    return val;
                }

                return new V[0];
            }
            return _dictionary.GetOrAdd(key, ListFactory);
        }
    }
}