using RIAPP.DataService.Utils;
using System.Linq;
using System.Text;

namespace RIAPP.DataService.Core.Types
{
    public static class RowInfoEx
    {
        public static object[] GetPKValues(this RowInfo rowInfo, IDataHelper dataHelper)
        {
            DbSetInfo dbSetInfo = rowInfo.GetDbSetInfo();
            System.Type entityType = dbSetInfo.GetEntityType();
            Field[] finfos = dbSetInfo.GetPKFields();
            object[] result = new object[finfos.Length];
            for (int i = 0; i < finfos.Length; ++i)
            {
                ValueChange fv = rowInfo.values.Single(v => v.fieldName == finfos[i].fieldName);
                result[i] = dataHelper.DeserializeField(entityType, finfos[i], fv.val);
            }
            return result;
        }

        public static string GetWherePKPredicate(this RowInfo rowInfo)
        {
            DbSetInfo dbSetInfo = rowInfo.GetDbSetInfo();
            Field[] pkFieldsInfo = dbSetInfo.GetPKFields();
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < pkFieldsInfo.Length; ++i)
            {
                if (i > 0)
                {
                    sb.Append(" and ");
                }
                sb.Append($"{pkFieldsInfo[i].fieldName}.Equals(@{i})");
            }
            string predicate = sb.ToString();
            return predicate;
        }

        public static string GetRowKeyAsString(this RowInfo rowInfo)
        {
            Field[] finfos = rowInfo.GetDbSetInfo().GetPKFields();
            string[] vals = new string[finfos.Length];
            for (int i = 0; i < finfos.Length; ++i)
            {
                ValueChange fv = rowInfo.values.Single(v => v.fieldName == finfos[i].fieldName);
                vals[i] = fv.val;
            }
            return string.Join(";", vals);
        }

        public static DbSetInfo GetDbSetInfo(this RowInfo rowInfo)
        {
            return rowInfo._dbSetInfo;
        }

        public static void SetDbSetInfo(this RowInfo rowInfo, DbSetInfo dbSetInfo)
        {
            rowInfo._dbSetInfo = dbSetInfo;
        }

        public static EntityChangeState GetChangeState(this RowInfo rowInfo)
        {
            return rowInfo._changeState;
        }

        public static void SetChangeState(this RowInfo rowInfo, EntityChangeState changeState)
        {
            rowInfo._changeState = changeState;
        }
    }
}