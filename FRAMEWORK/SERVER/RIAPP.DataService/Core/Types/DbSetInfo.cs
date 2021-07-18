using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;

namespace RIAPP.DataService.Core.Types
{

    public class DbSetInfo
    {
        internal FieldsList _fieldInfos = new FieldsList();
        internal Dictionary<string, Field> _fieldsByNames;
        private readonly Lazy<Field[]> _inResultFields;
        private readonly Lazy<Field[]> _pkFields;
        private readonly Lazy<Field> _timestampField;

        public DbSetInfo()
        {
            _inResultFields = new Lazy<Field[]>(
                    () => _fieldInfos.Where(f => f.GetIsIncludeInResult()).OrderBy(f => f.GetOrdinal()).ToArray(), true);
            _pkFields = new Lazy<Field[]>(
                    () => fieldInfos.Where(fi => fi.isPrimaryKey > 0).OrderBy(fi => fi.isPrimaryKey).ToArray(), true);
            _timestampField = new Lazy<Field>(() => fieldInfos.Where(fi => fi.fieldType == FieldType.RowTimeStamp).FirstOrDefault(),
                    true);

            enablePaging = true;
            pageSize = 100;
            _isTrackChanges = false;
        }

        [DesignerSerializationVisibility(DesignerSerializationVisibility.Content)]

        public FieldsList fieldInfos => _fieldInfos;


        public bool enablePaging { get; set; }


        public int pageSize { get; set; }


        public string dbSetName { get; set; }

        #region NonSerializable properties
        public DbSetInfo ShallowCopy()
        {
            return (DbSetInfo)this.MemberwiseClone();
        }

        public Field[] GetInResultFields()
        {
            return _inResultFields.Value;
        }

        public Field[] GetPKFields()
        {
            return _pkFields.Value;
        }

        public Field GetTimeStampField()
        {
            return _timestampField.Value;
        }


        internal Type _EntityType { get; set; }

        [DefaultValue(false)]
        internal bool _isTrackChanges { get; set; }
        #endregion
    }
}