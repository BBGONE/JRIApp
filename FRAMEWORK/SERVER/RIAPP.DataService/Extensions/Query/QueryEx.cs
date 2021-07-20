using RIAPP.DataService.Core.Exceptions;
using RIAPP.DataService.Core.Types;
using RIAPP.DataService.Resources;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Text;
using System.Threading.Tasks;

namespace RIAPP.DataService.Core.Query
{
    public static class QueryEx
    {
        public static T GetOriginal<T>(this IDataServiceComponent dataService)
            where T : class
        {
            return RequestContext.Current.GetOriginal<T>();
        }

        public static T GetParent<T>(this IDataServiceComponent dataService)
            where T : class
        {
            return RequestContext.Current.GetParent<T>();
        }

        public static QueryRequest GetCurrentQueryInfo(this IDataServiceComponent dataService)
        {
            return RequestContext.Current.CurrentQueryInfo;
        }

        public static IQueryable<T> PerformSort<T>(this IDataServiceComponent dataService, IQueryable<T> entities,
            SortInfo sort)
            where T : class
        {
            IQueryable<T> result = entities;
            if (sort == null || sort.sortItems == null || sort.sortItems.Count == 0)
            {
                return result;
            }

            if (sort == null || sort.sortItems == null || sort.sortItems.Count == 0)
            {
                return result;
            }

            bool first = true;
            StringBuilder sb = new StringBuilder();
            foreach (SortItem si in sort.sortItems)
            {
                string fldName = si.fieldName;
                if (!first)
                {
                    sb.Append(",");
                }

                sb.Append(fldName);
                if (si.sortOrder == SortOrder.DESC)
                {
                    sb.Append(" DESC");
                }
                first = false;
            }

            result = result.OrderBy(sb.ToString());
            return result;
        }

        public static IQueryable<T> PerformFilter<T>(this IDataServiceComponent dataService, IQueryable<T> entities,
            FilterInfo filter, DbSetInfo dbInfo)
            where T : class
        {
            Utils.IDataHelper dataHelper = dataService.ServiceContainer.DataHelper;
            IQueryable<T> result = entities;
            if (filter == null || filter.filterItems == null || filter.filterItems.Count == 0)
            {
                return result;
            }

            int cnt = 0;
            StringBuilder sb = new StringBuilder();
            LinkedList<object> filterParams = new LinkedList<object>();
            foreach (FilterItem filterItem in filter.filterItems)
            {
                Field field = dbInfo.fieldInfos.Where(finf => finf.fieldName == filterItem.fieldName).FirstOrDefault();
                if (field == null)
                {
                    throw new DomainServiceException(string.Format(ErrorStrings.ERR_REC_FIELDNAME_INVALID, dbInfo.dbSetName, filterItem.fieldName));
                }

                if (cnt > 0)
                {
                    sb.Append(" and ");
                }

                switch (filterItem.kind)
                {
                    case FilterType.Equals:
                        if (filterItem.values.Count == 1)
                        {
                            sb.AppendFormat("{0}=@{1}", filterItem.fieldName, cnt++);
                            filterParams.AddLast(dataHelper.DeserializeField(typeof(T), field, filterItem.values.FirstOrDefault()));
                        }
                        else
                        {
                            string args = string.Join(",", filterItem.values.Select(v => string.Format("@{0}", cnt++)));
                            sb.AppendFormat("({0} in ({1}))", filterItem.fieldName, args);

                            foreach (string v in filterItem.values)
                            {
                                filterParams.AddLast(dataHelper.DeserializeField(typeof(T), field, v));
                            }
                        }
                        break;
                    case FilterType.StartsWith:
                        sb.AppendFormat("{0}.StartsWith(@{1})", filterItem.fieldName, cnt++);
                        filterParams.AddLast(dataHelper.DeserializeField(typeof(T), field, filterItem.values.FirstOrDefault()));
                        break;
                    case FilterType.EndsWith:
                        sb.AppendFormat("{0}.EndsWith(@{1})", filterItem.fieldName, cnt++);
                        filterParams.AddLast(dataHelper.DeserializeField(typeof(T), field, filterItem.values.FirstOrDefault()));
                        break;
                    case FilterType.Contains:
                        sb.AppendFormat("{0}.Contains(@{1})", filterItem.fieldName, cnt++);
                        filterParams.AddLast(dataHelper.DeserializeField(typeof(T), field, filterItem.values.FirstOrDefault()));
                        break;
                    case FilterType.Gt:
                        sb.AppendFormat("{0}>@{1}", filterItem.fieldName, cnt++);
                        filterParams.AddLast(dataHelper.DeserializeField(typeof(T), field, filterItem.values.FirstOrDefault()));
                        break;
                    case FilterType.Lt:
                        sb.AppendFormat("{0}<@{1}", filterItem.fieldName, cnt++);
                        filterParams.AddLast(dataHelper.DeserializeField(typeof(T), field, filterItem.values.FirstOrDefault()));
                        break;
                    case FilterType.GtEq:
                        sb.AppendFormat("{0}>=@{1}", filterItem.fieldName, cnt++);
                        filterParams.AddLast(dataHelper.DeserializeField(typeof(T), field, filterItem.values.FirstOrDefault()));
                        break;
                    case FilterType.LtEq:
                        sb.AppendFormat("{0}<=@{1}", filterItem.fieldName, cnt++);
                        filterParams.AddLast(dataHelper.DeserializeField(typeof(T), field, filterItem.values.FirstOrDefault()));
                        break;
                    case FilterType.NotEq:
                        sb.AppendFormat("{0}!=@{1}", filterItem.fieldName, cnt++);
                        filterParams.AddLast(dataHelper.DeserializeField(typeof(T), field, filterItem.values.FirstOrDefault()));
                        break;
                    case FilterType.Between:
                        sb.AppendFormat("({0}>=@{1} and {0}<=@{2})", filterItem.fieldName, cnt++, cnt++);
                        filterParams.AddLast(dataHelper.DeserializeField(typeof(T), field, filterItem.values.FirstOrDefault()));
                        filterParams.AddLast(dataHelper.DeserializeField(typeof(T), field, filterItem.values.LastOrDefault()));
                        break;
                }
            }

            result = entities.Where(sb.ToString(), filterParams.ToArray());
            return result;
        }

        public static IQueryable<T> GetPage<T>(this IDataServiceComponent dataService, IQueryable<T> entities, int pageIndex,
            int pageSize, int pageCount, DbSetInfo dbInfo)
            where T : class
        {
            IQueryable<T> result = entities;
            if (!dbInfo.enablePaging || pageIndex < 0)
            {
                return result;
            }

            if (pageSize < 0)
            {
                pageSize = 0;
            }

            int skipRows = pageIndex * pageSize;
            result = Queryable.Take(Queryable.Skip(entities, skipRows), pageSize * pageCount);
            return result;
        }

        private static IQueryable<T> PerformQuery<T>(this IDataServiceComponent dataService, IQueryable<T> entities, out IQueryable<T> totalCountQuery)
           where T : class
        {
            totalCountQuery = null;
            RequestContext reqCtxt = RequestContext.Current;
            QueryRequest queryInfo = reqCtxt.CurrentQueryInfo;
            entities = PerformFilter(dataService, entities, queryInfo.filterInfo, queryInfo.GetDbSetInfo());
            if (queryInfo.isIncludeTotalCount)
            {
                totalCountQuery = entities;
            }
            entities = PerformSort(dataService, entities, queryInfo.sortInfo);
            entities = GetPage(dataService, entities, queryInfo.pageIndex, queryInfo.pageSize, queryInfo.pageCount, queryInfo.GetDbSetInfo());
            return entities;
        }

        public static IQueryable<T> PerformQuery<T>(this IDataServiceComponent dataService, IQueryable<T> entities)
           where T : class
        {
            return PerformQuery(dataService, entities, out IQueryable<T> countQuery);
        }

        public static PerformQueryResult<T> PerformQuery<T>(this IDataServiceComponent dataService, IQueryable<T> entities, Func<IQueryable<T>, Task<int>> totalCountFunc)
            where T : class
        {
            IQueryable<T> result = PerformQuery(dataService, entities, out IQueryable<T> countQuery);
            Func<Task<int?>> dataCount = () => Task.FromResult<int?>(null);

            if (countQuery != null && totalCountFunc != null)
            {
                dataCount = () => totalCountFunc(countQuery).ContinueWith(t =>
                {
                    return (int?)t.Result;
                }, TaskContinuationOptions.ExecuteSynchronously);
            }
            return new PerformQueryResult<T>(result, dataCount);
        }


        public static IQueryable<T> PerformQuery<T>(this IDataServiceComponent dataService, IQueryable<T> entities, ref int? totalCount)
            where T : class
        {
            IQueryable<T> result = PerformQuery(dataService, entities, out IQueryable<T> countQuery);

            if (countQuery != null && !totalCount.HasValue)
            {
                totalCount = countQuery.Count();
            }
            return result;
        }

        public static IQueryable<T> GetRefreshedEntityQuery<T>(this IDataServiceComponent dataService, IQueryable<T> entities, RefreshRequest info)
            where T : class
        {
            Utils.IDataHelper dataHelper = dataService.ServiceContainer.DataHelper;
            object[] keyValue = info.rowInfo.GetPKValues(dataHelper);
            return FindEntityQuery(entities, info.rowInfo, keyValue);
        }

        public static int? GetTotalCount<T>(this IDataServiceComponent dataService, IQueryable<T> entities, FilterInfo filter, DbSetInfo dbSetInfo)
            where T : class
        {
            IQueryable filtered_entities = PerformFilter(dataService, entities, filter, dbSetInfo);
            return filtered_entities.Count();
        }

        public static IQueryable<T> FindEntityQuery<T>(IQueryable<T> entities, RowInfo rowInfo, object[] pkValues)
        {
            string predicate = rowInfo.GetWherePKPredicate();

            if (pkValues == null || pkValues.Length < 1 || pkValues.Any(kv => kv == null))
            {
                throw new DomainServiceException(string.Format(ErrorStrings.ERR_ROWINFO_PKVAL_INVALID,
                    rowInfo.GetDbSetInfo().GetEntityType().Name, string.Join(";", pkValues)));
            }

            return entities.Where(predicate, pkValues);
        }
    }
}