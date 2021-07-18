using System;
using System.Collections.Generic;
using System.Linq;

namespace RIAPP.DataService.Core.Types
{
    public class QueryResult
    {
        private readonly Lazy<SubResultList> _subResults;

        public QueryResult()
        {
            _subResults = new Lazy<SubResultList>(() => new SubResultList(), true);
        }

        public int? TotalCount { get; set; }

        public IEnumerable<object> Result { get; set; }

        public object extraInfo { get; set; }

        public SubResultList subResults => _subResults.Value;
    }

    public class QueryResult<T> : QueryResult
        where T : class
    {
        public QueryResult()
            : this(Enumerable.Empty<T>(), null)
        {
        }

        public QueryResult(IEnumerable<T> result)
            : this(result, null)
        {
        }

        public QueryResult(IEnumerable<T> result, int? totalCount)
        {
            Result = result;
            TotalCount = totalCount;
        }

        public IEnumerable<T> getResult()
        {
            return (IEnumerable<T>)Result;
        }
    }
}