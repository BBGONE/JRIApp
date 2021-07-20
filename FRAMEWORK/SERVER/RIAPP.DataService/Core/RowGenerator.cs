using RIAPP.DataService.Core.Types;
using RIAPP.DataService.Utils;
using System;
using System.Collections.Generic;

namespace RIAPP.DataService.Core
{
    internal class RowGenerator
    {
        private readonly IDataHelper _dataHelper;
        private readonly IEnumerable<object> _dataSource;
        private readonly DbSetInfo _dbSetInfo;
        private readonly Field[] fieldInfos;
        private readonly Field[] pkInfos;

        public RowGenerator(DbSetInfo dbSetInfo, IEnumerable<object> dataSource, IDataHelper dataHelper)
        {
            _dbSetInfo = dbSetInfo ?? throw new ArgumentNullException(nameof(dbSetInfo));
            _dataSource = dataSource ?? throw new ArgumentNullException(nameof(dataSource));
            _dataHelper = dataHelper ?? throw new ArgumentNullException(nameof(dataHelper));
            fieldInfos = _dbSetInfo.GetInResultFields();
            pkInfos = _dbSetInfo.GetPKFields();
        }

        public IEnumerable<Row> CreateRows()
        {
            foreach (object entity in _dataSource)
            {
                yield return CreateRow(entity);
            }
        }

        public IEnumerable<Row> CreateDistinctRows()
        {
            // map by PK
            HashSet<string> keys = new HashSet<string>();
            foreach (object entity in _dataSource)
            {
                Row row = CreateRow(entity);
                if (!keys.Contains(row.k))
                {
                    keys.Add(row.k);
                    yield return row;
                }
            }
        }

        private Row CreateRow(object entity)
        {
            int fieldCnt = fieldInfos.Length;
            string[] pk = new string[pkInfos.Length];
            object[] v = new object[fieldCnt];
            for (int i = 0; i < fieldCnt; ++i)
            {
                Field fieldInfo = fieldInfos[i];
                object fv = _dataHelper.SerializeField(entity, fieldInfo);

                int keyIndex = Array.IndexOf(pkInfos, fieldInfo);
                if (keyIndex > -1)
                {
                    if (fv == null)
                    {
                        throw new Exception(string.Format("Primary Key Field \"{0}\" Has a NULL Value", fieldInfo.GetFullName()));
                    }

                    pk[keyIndex] = fv.ToString();
                }
                v[i] = fv;
            }
            string k = string.Join(";", pk);
            return new Row(v, k);
        }
    }
}