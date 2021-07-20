using RIAPP.DataService.Core.Exceptions;
using RIAPP.DataService.Core.Metadata;
using RIAPP.DataService.Core.Types;
using RIAPP.DataService.Resources;
using RIAPP.DataService.Utils;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RIAPP.DataService.Core
{
    public class ServiceOperationsHelper<TService> : IServiceOperationsHelper<TService>, IDisposable
        where TService : BaseDomainService
    {
        /// <summary>
        ///    Already created instances of DataManagers indexed by modelType
        /// </summary>
        private readonly ConcurrentDictionary<Type, object> _dataManagers;
        private readonly IDataHelper<TService> _dataHelper;
        private readonly IDataManagerContainer<TService> _dataManagerContainer;
        private readonly IValidatorContainer<TService> _validatorsContainer;
        private readonly IValidationHelper<TService> _validationHelper;
        private TService _domainService;

        public IDataHelper DataHelper => _dataHelper;

        public IValidationHelper ValidationHelper => _validationHelper;

        public ServiceOperationsHelper(TService domainService,
            IDataHelper<TService> dataHelper,
            IValidationHelper<TService> validationHelper,
            IDataManagerContainer<TService> dataManagerContainer,
            IValidatorContainer<TService> validatorsContainer)
        {
            _domainService = domainService ?? throw new ArgumentNullException(nameof(domainService));
            _dataHelper = dataHelper ?? throw new ArgumentNullException(nameof(dataHelper));
            _validationHelper = validationHelper ?? throw new ArgumentNullException(nameof(validationHelper));
            _dataManagerContainer = dataManagerContainer ?? throw new ArgumentNullException(nameof(dataManagerContainer));
            _validatorsContainer = validatorsContainer ?? throw new ArgumentNullException(nameof(validatorsContainer));
            _dataManagers = new ConcurrentDictionary<Type, object>();
        }

        public void Dispose()
        {
            _domainService = null;
            IDisposable[] dataManagers = _dataManagers.Values.Where(m => m is IDisposable).Select(m => (IDisposable)m).ToArray();
            Array.ForEach(dataManagers, m => { m.Dispose(); });
            _dataManagers.Clear();
        }

        public object GetMethodOwner(MethodInfoData methodData)
        {
            if (!methodData.IsInDataManager)
            {
                return _domainService;
            }

            if (methodData.EntityType == null)
            {
                return _domainService;
            }

            RunTimeMetadata metadata = _domainService.GetMetadata();
            object managerInstance = _dataManagers.GetOrAdd(methodData.EntityType,
                t => { return _dataManagerContainer.GetDataManager(t); });
            return managerInstance;
        }

        public async Task AfterExecuteChangeSet(ChangeSetRequest changeSet)
        {
            IEnumerable<IDataManager> dataManagers = _dataManagers.Values.Select(m => (IDataManager)m);
            foreach (IDataManager dataManager in dataManagers)
            {
                await dataManager.AfterExecuteChangeSet(changeSet);
            }
        }

        public async Task AfterChangeSetCommited(ChangeSetRequest changeSet, SubResultList refreshResult)
        {
            IEnumerable<IDataManager> dataManagers = _dataManagers.Values.Select(m => (IDataManager)m);
            foreach (IDataManager dataManager in dataManagers)
            {
                await dataManager.AfterChangeSetCommited(changeSet, refreshResult);
            }
        }

        public void ApplyValues(object entity, RowInfo rowInfo, string path, ValueChange[] values, bool isOriginal)
        {
            DbSetInfo dbSetInfo = rowInfo.GetDbSetInfo();
            Array.ForEach(values, val =>
            {
                string fullName = path + val.fieldName;
                Field fieldInfo = _dataHelper.GetFieldInfo(dbSetInfo, fullName);
                if (!fieldInfo.GetIsIncludeInResult())
                {
                    return;
                }
                //Server Side calculated fields are never set on entities from updates
                if (fieldInfo.fieldType == FieldType.ServerCalculated)
                {
                    return;
                }

                if (fieldInfo.fieldType == FieldType.Object && val.nested != null)
                {
                    ApplyValues(entity, rowInfo, fullName + '.', val.nested.ToArray(), isOriginal);
                }
                else
                {
                    ApplyValue(entity, rowInfo, fullName, fieldInfo, val, isOriginal);
                }
            });
        }

        private void ApplyValue(object entity, RowInfo rowInfo, string fullName, Field fieldInfo, ValueChange val,
            bool isOriginal)
        {
            if (isOriginal)
            {
                if ((val.flags & ValueFlags.Setted) == ValueFlags.Setted)
                {
                    _dataHelper.SetFieldValue(entity, fullName, fieldInfo, val.orig);
                }
            }
            else
            {
                switch (rowInfo.changeType)
                {
                    case ChangeType.Deleted:
                        {
                            // for delete fill only original values
                            if ((val.flags & ValueFlags.Setted) == ValueFlags.Setted)
                            {
                                _dataHelper.SetFieldValue(entity, fullName, fieldInfo, val.orig);
                            }
                        }
                        break;
                    case ChangeType.Added:
                        {
                            if ((val.flags & ValueFlags.Changed) == ValueFlags.Changed)
                            {
                                if (fieldInfo.isReadOnly && val.val != null && !fieldInfo.allowClientDefault)
                                {
                                    throw new ValidationException(string.Format(ErrorStrings.ERR_PROPERTY_IS_READONLY,
                                        entity.GetType().Name, fieldInfo.fieldName));
                                }

                                if (!fieldInfo.isAutoGenerated && !fieldInfo.isNullable && val.val == null)
                                {
                                    throw new ValidationException(string.Format(ErrorStrings.ERR_FIELD_IS_NOT_NULLABLE,
                                        entity.GetType().Name, fieldInfo.fieldName));
                                }

                                _dataHelper.SetFieldValue(entity, fullName, fieldInfo, val.val);
                            }
                        }
                        break;
                    case ChangeType.Updated:
                        {
                            if ((val.flags & ValueFlags.Changed) == ValueFlags.Changed)
                            {
                                if (fieldInfo.isReadOnly)
                                {
                                    throw new ValidationException(string.Format(ErrorStrings.ERR_PROPERTY_IS_READONLY,
                                        entity.GetType().Name, fieldInfo.fieldName));
                                }

                                if (!fieldInfo.isNullable && val.val == null)
                                {
                                    throw new ValidationException(string.Format(ErrorStrings.ERR_FIELD_IS_NOT_NULLABLE,
                                        fieldInfo.fieldName));
                                }

                                _dataHelper.SetFieldValue(entity, fullName, fieldInfo, val.val);
                            }
                            else if ((val.flags & ValueFlags.Setted) == ValueFlags.Setted)
                            {
                                // when not changed then original value must be the same as current
                                if ((fieldInfo.isPrimaryKey > 0 || fieldInfo.fieldType == FieldType.RowTimeStamp || fieldInfo.isNeedOriginal) && val.val != val.orig)
                                {
                                    throw new ValidationException(string.Format(ErrorStrings.ERR_VAL_ORIGINAL_INVALID,
                                        fieldInfo.fieldName));
                                }

                                _dataHelper.SetFieldValue(entity, fullName, fieldInfo, val.val);
                            }
                        }
                        break;
                }
            }
        }

        public void UpdateEntityFromRowInfo(object entity, RowInfo rowInfo, bool isOriginal)
        {
            DbSetInfo dbSetInfo = rowInfo.GetDbSetInfo();
            ValuesList values = rowInfo.values;
            ApplyValues(entity, rowInfo, "", values.ToArray(), isOriginal);

            if (!isOriginal && rowInfo.changeType == ChangeType.Added)
            {
                foreach (ParentChildNode pn in rowInfo.GetChangeState().ParentRows)
                {
                    if (!_dataHelper.SetValue(entity, pn.Association.childToParentName, pn.ParentRow.GetChangeState().Entity, false))
                    {
                        throw new DomainServiceException(string.Format(ErrorStrings.ERR_CAN_NOT_SET_PARENT_FIELD,
                            pn.Association.childToParentName, dbSetInfo.GetEntityType().Name));
                    }
                }
            }
        }

        public void UpdateValuesFromEntity(object entity, string path, DbSetInfo dbSetInfo, ValueChange[] values)
        {
            Array.ForEach(values, val =>
            {
                string fullName = path + val.fieldName;
                Field fieldInfo = _dataHelper.GetFieldInfo(dbSetInfo, fullName);
                if (!fieldInfo.GetIsIncludeInResult())
                {
                    return;
                }

                if (fieldInfo.fieldType == FieldType.Object && val.nested != null)
                {
                    UpdateValuesFromEntity(entity, fullName + '.', dbSetInfo, val.nested.ToArray());
                }
                else
                {
                    val.val = _dataHelper.SerializeField(entity, fullName, fieldInfo);
                    val.flags = val.flags | ValueFlags.Refreshed;
                }
            });
        }

        public void CheckValuesChanges(RowInfo rowInfo, string path, ValueChange[] values)
        {
            DbSetInfo dbSetInfo = rowInfo.GetDbSetInfo();
            Array.ForEach(values, val =>
            {
                string fullName = path + val.fieldName;
                Field fieldInfo = _dataHelper.GetFieldInfo(dbSetInfo, fullName);
                if (!fieldInfo.GetIsIncludeInResult())
                {
                    return;
                }

                if (fieldInfo.fieldType == FieldType.Object && val.nested != null)
                {
                    CheckValuesChanges(rowInfo, fullName + '.', val.nested.ToArray());
                }
                else
                {
                    if (isEntityValueChanged(rowInfo, fullName, fieldInfo, out string newVal))
                    {
                        val.val = newVal;
                        val.flags = val.flags | ValueFlags.Refreshed;
                    }
                }
            });
        }

        public void UpdateRowInfoFromEntity(object entity, RowInfo rowInfo)
        {
            DbSetInfo dbSetInfo = rowInfo.GetDbSetInfo();
            UpdateValuesFromEntity(entity, "", dbSetInfo, rowInfo.values.ToArray());
            if (rowInfo.changeType == ChangeType.Added)
            {
                rowInfo.serverKey = rowInfo.GetRowKeyAsString();
            }
        }

        public bool isEntityValueChanged(RowInfo rowInfo, string fullName, Field fieldInfo, out string newVal)
        {
            EntityChangeState changeState = rowInfo.GetChangeState();
            string oldVal = null;
            newVal = _dataHelper.SerializeField(changeState.Entity, fullName, fieldInfo);
            if (changeState.OriginalEntity != null)
            {
                oldVal = _dataHelper.SerializeField(changeState.OriginalEntity, fullName, fieldInfo);
            }

            return newVal != oldVal;
        }

        public void UpdateRowInfoAfterUpdates(RowInfo rowInfo)
        {
            CheckValuesChanges(rowInfo, "", rowInfo.values.ToArray());

            if (rowInfo.changeType == ChangeType.Added)
            {
                rowInfo.serverKey = rowInfo.GetRowKeyAsString();
            }
        }

        public object GetOriginalEntity(RowInfo rowInfo)
        {
            if (rowInfo == null)
            {
                throw new DomainServiceException(ErrorStrings.ERR_METH_APPLY_INVALID);
            }
            return rowInfo.GetChangeState().OriginalEntity;
        }

        public T GetOriginalEntity<T>(RowInfo rowInfo)
            where T : class
        {
            return (T)GetOriginalEntity(rowInfo);
        }

        public object GetOriginalEntity(object entity, RowInfo rowInfo)
        {
            object dbEntity = Activator.CreateInstance(entity.GetType());
            UpdateEntityFromRowInfo(dbEntity, rowInfo, true);
            return dbEntity;
        }

        public object GetParentEntity(Type entityType, RowInfo rowInfo)
        {
            if (rowInfo == null)
            {
                throw new DomainServiceException(ErrorStrings.ERR_METH_APPLY_INVALID);
            }
            ParentChildNode[] parents = rowInfo.GetChangeState().ParentRows;
            if (parents.Length == 0)
            {
                return null;
            }

            return
                parents.Where(p => p.ParentRow.GetDbSetInfo().GetEntityType() == entityType)
                    .Select(p => p.ParentRow.GetChangeState().Entity)
                    .FirstOrDefault();
        }

        public T GetParentEntity<T>(RowInfo rowInfo)
            where T : class
        {
            return (T)GetParentEntity(typeof(T), rowInfo);
        }


        public async Task InsertEntity(RunTimeMetadata metadata, RowInfo rowInfo)
        {
            DbSetInfo dbSetInfo = rowInfo.GetDbSetInfo();
            if (rowInfo.changeType != ChangeType.Added)
            {
                throw new DomainServiceException(string.Format(ErrorStrings.ERR_REC_CHANGETYPE_INVALID,
                    dbSetInfo.GetEntityType().Name, rowInfo.changeType));
            }

            MethodInfoData methodData = metadata.GetOperationMethodInfo(dbSetInfo.dbSetName, MethodType.Insert);
            if (methodData == null)
            {
                throw new DomainServiceException(string.Format(ErrorStrings.ERR_DB_INSERT_NOT_IMPLEMENTED,
                    dbSetInfo.GetEntityType().Name, GetType().Name));
            }

            object dbEntity = Activator.CreateInstance(dbSetInfo.GetEntityType());
            UpdateEntityFromRowInfo(dbEntity, rowInfo, false);
            rowInfo.GetChangeState().Entity = dbEntity;
            object instance = GetMethodOwner(methodData);
            object res = methodData.MethodInfo.Invoke(instance, new[] { dbEntity });
            if (res is Task)
            {
                await (res as Task);
            }
        }

        public async Task UpdateEntity(RunTimeMetadata metadata, RowInfo rowInfo)
        {
            DbSetInfo dbSetInfo = rowInfo.GetDbSetInfo();
            if (rowInfo.changeType != ChangeType.Updated)
            {
                throw new DomainServiceException(string.Format(ErrorStrings.ERR_REC_CHANGETYPE_INVALID,
                    dbSetInfo.GetEntityType().Name, rowInfo.changeType));
            }

            MethodInfoData methodData = metadata.GetOperationMethodInfo(dbSetInfo.dbSetName, MethodType.Update);
            if (methodData == null)
            {
                throw new DomainServiceException(string.Format(ErrorStrings.ERR_DB_UPDATE_NOT_IMPLEMENTED,
                    dbSetInfo.GetEntityType().Name, GetType().Name));
            }

            object dbEntity = Activator.CreateInstance(dbSetInfo.GetEntityType());
            UpdateEntityFromRowInfo(dbEntity, rowInfo, false);
            object original = GetOriginalEntity(dbEntity, rowInfo);
            rowInfo.GetChangeState().Entity = dbEntity;
            rowInfo.GetChangeState().OriginalEntity = original;
            object instance = GetMethodOwner(methodData);
            //apply this changes to entity that is in the database (this is done in user domain service method)
            object res = methodData.MethodInfo.Invoke(instance, new[] { dbEntity });
            if (res is Task)
            {
                await (res as Task);
            }
        }

        public async Task DeleteEntity(RunTimeMetadata metadata, RowInfo rowInfo)
        {
            DbSetInfo dbSetInfo = rowInfo.GetDbSetInfo();
            if (rowInfo.changeType != ChangeType.Deleted)
            {
                throw new DomainServiceException(string.Format(ErrorStrings.ERR_REC_CHANGETYPE_INVALID,
                    dbSetInfo.GetEntityType().Name, rowInfo.changeType));
            }

            MethodInfoData methodData = metadata.GetOperationMethodInfo(dbSetInfo.dbSetName, MethodType.Delete);
            if (methodData == null)
            {
                throw new DomainServiceException(string.Format(ErrorStrings.ERR_DB_DELETE_NOT_IMPLEMENTED,
                    dbSetInfo.GetEntityType().Name, GetType().Name));
            }

            object dbEntity = Activator.CreateInstance(dbSetInfo.GetEntityType());
            UpdateEntityFromRowInfo(dbEntity, rowInfo, true);
            rowInfo.GetChangeState().Entity = dbEntity;
            rowInfo.GetChangeState().OriginalEntity = dbEntity;
            object instance = GetMethodOwner(methodData);
            object res = methodData.MethodInfo.Invoke(instance, new[] { dbEntity });
            if (res is Task)
            {
                await (res as Task);
            }
        }

        public async Task<bool> ValidateEntity(RunTimeMetadata metadata, RequestContext requestContext)
        {
            RowInfo rowInfo = requestContext.CurrentRowInfo;
            DbSetInfo dbSetInfo = rowInfo.GetDbSetInfo();
            IEnumerable<ValidationErrorInfo> errs1 = null;
            IEnumerable<ValidationErrorInfo> errs2 = null;
            LinkedList<string> mustBeChecked = new LinkedList<string>();
            LinkedList<string> skipCheckList = new LinkedList<string>();

            if (rowInfo.changeType == ChangeType.Added)
            {
                foreach (ParentChildNode pn in rowInfo.GetChangeState().ParentRows)
                {
                    foreach (FieldRel frel in pn.Association.fieldRels)
                    {
                        skipCheckList.AddLast(frel.childField);
                    }
                }
            }

            foreach (Field fieldInfo in dbSetInfo.fieldInfos)
            {
                _dataHelper.ForEachFieldInfo("", fieldInfo, (fullName, f) =>
                {
                    if (!f.GetIsIncludeInResult())
                    {
                        return;
                    }

                    if (f.fieldType == FieldType.Object || f.fieldType == FieldType.ServerCalculated)
                    {
                        return;
                    }

                    string value = _dataHelper.SerializeField(rowInfo.GetChangeState().Entity, fullName, f);

                    switch (rowInfo.changeType)
                    {
                        case ChangeType.Added:
                            {
                                bool isSkip = f.isAutoGenerated || skipCheckList.Any(n => n == fullName);
                                if (!isSkip)
                                {
                                    _validationHelper.CheckValue(f, value);
                                    mustBeChecked.AddLast(fullName);
                                }
                            }
                            break;
                        case ChangeType.Updated:
                            {
                                bool isChanged = isEntityValueChanged(rowInfo, fullName, f, out string newVal);
                                if (isChanged)
                                {
                                    _validationHelper.CheckValue(f, newVal);
                                    mustBeChecked.AddLast(fullName);
                                }
                            }
                            break;
                    }
                });
            }

            rowInfo.GetChangeState().ChangedFieldNames = mustBeChecked.ToArray();

            MethodInfoData methodData = metadata.GetOperationMethodInfo(dbSetInfo.dbSetName, MethodType.Validate);
            if (methodData != null)
            {
                object instance = GetMethodOwner(methodData);
                object invokeRes = methodData.MethodInfo.Invoke(instance,
                    new[] { rowInfo.GetChangeState().Entity, rowInfo.GetChangeState().ChangedFieldNames });
                errs1 = (IEnumerable<ValidationErrorInfo>)await GetMethodResult(invokeRes);
            }

            if (errs1 == null)
            {
                errs1 = Enumerable.Empty<ValidationErrorInfo>();
            }

            IValidator validator = _validatorsContainer.GetValidator(rowInfo.GetDbSetInfo().GetEntityType());
            if (validator != null)
            {
                errs2 = await validator.ValidateModelAsync(rowInfo.GetChangeState().Entity,
                            rowInfo.GetChangeState().ChangedFieldNames);
            }

            if (errs2 == null)
            {
                errs2 = Enumerable.Empty<ValidationErrorInfo>();
            }

            errs1 = errs1.Concat(errs2);

            rowInfo.GetChangeState().ValidationErrors = errs1.ToArray();

            return rowInfo.GetChangeState().ValidationErrors.Length == 0;
        }

        public async Task<object> GetMethodResult(object invokeRes)
        {
            System.Type typeInfo = invokeRes != null ? invokeRes.GetType() : null;
            if (typeInfo != null && invokeRes is Task)
            {
                await ((Task)invokeRes);
                if (typeInfo.IsGenericType)
                {
                    return typeInfo.GetProperty("Result").GetValue(invokeRes, null);
                }
                else
                {
                    return null;
                }
            }
            return invokeRes;
        }
    }
}