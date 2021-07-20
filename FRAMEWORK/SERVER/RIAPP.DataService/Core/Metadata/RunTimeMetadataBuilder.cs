using RIAPP.DataService.Annotations;
using RIAPP.DataService.Core.CodeGen;
using RIAPP.DataService.Core.Exceptions;
using RIAPP.DataService.Core.Types;
using RIAPP.DataService.Resources;
using RIAPP.DataService.Utils;
using RIAPP.DataService.Utils.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;

namespace RIAPP.DataService.Core.Metadata
{
    public class RunTimeMetadataBuilder
    {
        private readonly Type domainServiceType;
        private readonly DesignTimeMetadata designTimeMetadata;
        private readonly IDataHelper dataHelper;
        private readonly IValueConverter valueConverter;
        private readonly IDataManagerContainer dataManagerContainer;

        public RunTimeMetadataBuilder(Type domainServiceType,
            DesignTimeMetadata designTimeMetadata,
            IDataHelper dataHelper,
            IValueConverter valueConverter,
            IDataManagerContainer dataManagerContainer)
        {
            this.domainServiceType = domainServiceType;
            this.designTimeMetadata = designTimeMetadata;
            this.dataHelper = dataHelper;
            this.valueConverter = valueConverter;
            this.dataManagerContainer = dataManagerContainer;
        }

        public RunTimeMetadata Build()
        {
            DbSetsDictionary dbSets = new DbSetsDictionary();

            foreach (DbSetInfo dbSetInfo in designTimeMetadata.DbSets)
            {
                dbSets.Add(dbSetInfo.dbSetName, dbSetInfo);
            }

            foreach (DbSetInfo dbSetInfo in dbSets.Values)
            {
                dbSetInfo.Initialize(dataHelper);
            }

            ILookup<Type, DbSetInfo> dbSetsByTypeLookUp = dbSets.Values.ToLookup(v => v.GetEntityType());
            MethodMap svcMethods = new MethodMap();
            OperationalMethods operMethods = new OperationalMethods();

            foreach (Config.ServiceTypeDescriptor descriptor in dataManagerContainer.Descriptors)
            {
                ProcessMethodDescriptions(descriptor.ImplementationType, svcMethods, operMethods, dbSets, dbSetsByTypeLookUp);
            }

            ProcessMethodDescriptions(domainServiceType, svcMethods, operMethods, dbSets, dbSetsByTypeLookUp);

            operMethods.MakeReadOnly();
            svcMethods.MakeReadOnly();

            AssociationsDictionary associations = new AssociationsDictionary();

            foreach (Association assoc in designTimeMetadata.Associations)
            {
                ProcessAssociation(assoc, dbSets, associations);
            }

            return new RunTimeMetadata(dbSets, dbSetsByTypeLookUp, associations, svcMethods, operMethods, designTimeMetadata.TypeScriptImports.ToArray());
        }

        private static readonly Dictionary<Type, MethodType> _attributeMap = new Dictionary<Type, MethodType>()
        {
            { typeof(QueryAttribute), MethodType.Query },
            { typeof(InvokeAttribute), MethodType.Invoke },
            { typeof(InsertAttribute), MethodType.Insert },
            { typeof(UpdateAttribute), MethodType.Update },
            { typeof(DeleteAttribute), MethodType.Delete },
            { typeof(ValidateAttribute), MethodType.Validate },
            { typeof(RefreshAttribute), MethodType.Refresh }
        };

        private static MethodType _GetMethodType(MethodInfo methodInfo)
        {
            return _attributeMap.FirstOrDefault(kv => methodInfo.IsDefined(kv.Key, false)).Value;
        }

        /// <summary>
        ///     Gets CRUD methods from DataManager which implements IDataManager<TModel> interface
        /// </summary>
        /// <param name="fromType"></param>
        /// <param name="modelType"></param>
        /// <returns></returns>
        private static IDictionary<MethodType, MethodInfoData> _GetDataManagerCRUDMethods(Type fromType, Type modelType)
        {
            // removes duplicates of the method (there are could be synch and async methods)
            IDictionary<MethodType, MethodInfoData> methodTypes = new Dictionary<MethodType, MethodInfoData>();

            void AddMethodInfoData(MethodType methodType, MethodInfo methodInfo)
            {
                if (!methodTypes.ContainsKey(methodType) && methodInfo.GetParameters().FirstOrDefault()?.ParameterType == modelType)
                {
                    methodTypes.Add(methodType, new MethodInfoData
                    {
                        OwnerType = fromType,
                        MethodInfo = methodInfo,
                        MethodType = methodType,
                        IsInDataManager = true
                    });
                }
            };

            void AddMethod(MethodInfo method)
            {
                switch (method.Name)
                {
                    case "Insert":
                    case "InsertAsync":
                        AddMethodInfoData(MethodType.Insert, method);
                        break;
                    case "Update":
                    case "UpdateAsync":
                        AddMethodInfoData(MethodType.Update, method);
                        break;
                    case "Delete":
                    case "DeleteAsync":
                        AddMethodInfoData(MethodType.Delete, method);
                        break;
                }
            };

            MethodInfo[] methods = fromType.GetMethods(BindingFlags.Public | BindingFlags.Instance | BindingFlags.DeclaredOnly);

            foreach (MethodInfo method in methods)
            {
                AddMethod(method);
            }

            return methodTypes;
        }

        /// <summary>
        /// Gets all operational methods from supplied type (DataService or DataManager)
        /// </summary>
        /// <param name="fromType"></param>
        /// <returns></returns>
        private static IEnumerable<MethodInfoData> _GetAllMethods(Type fromType)
        {
            MethodInfo[] methodInfos = fromType.GetMethods(BindingFlags.Instance | BindingFlags.DeclaredOnly | BindingFlags.Public);
            Type[] interfTypes = fromType.GetInterfaces();
            Type dataManagerInterface = interfTypes.Where(i =>
                        i.IsGenericType && i.GetGenericTypeDefinition() == typeof(IDataManager<>) &&
                        i.GetGenericArguments().Count() == 1).FirstOrDefault();

            bool isDataManager = dataManagerInterface != null;

            IEnumerable<MethodInfoData> allList = methodInfos.Select(m => new MethodInfoData
            {
                OwnerType = fromType,
                MethodInfo = m,
                MethodType = _GetMethodType(m),
                IsInDataManager = isDataManager
            }).Where(m => m.MethodType != MethodType.None);

            IEnumerable<MethodInfoData> UnionMethods(IEnumerable<MethodInfoData> list, IDictionary<MethodType, MethodInfoData> crudMethods)
            {
                foreach (KeyValuePair<MethodType, MethodInfoData> kv in crudMethods)
                {
                    yield return kv.Value;
                }

                foreach (MethodInfoData item in list)
                {
                    if (!crudMethods.ContainsKey(item.MethodType))
                    {
                        yield return item;
                    }
                }
            };

            IEnumerable<MethodInfoData> result;


            if (isDataManager)
            {
                Type modelType = dataManagerInterface.GetGenericArguments().First();
                IDictionary<MethodType, MethodInfoData> crudMethods = _GetDataManagerCRUDMethods(fromType, modelType);
                result = UnionMethods(allList, crudMethods).ToArray();
            }
            else
            {
                result = allList.ToArray();
            }

            foreach (MethodInfoData data in result)
            {
                switch (data.MethodType)
                {
                    case MethodType.Query:
                        data.EntityType = data.MethodInfo.ReturnType.GetTaskResultType().GetGenericArguments().First();
                        break;
                    case MethodType.Invoke:
                        data.EntityType = null;
                        break;
                    case MethodType.Refresh:
                        data.EntityType = data.MethodInfo.ReturnType.GetTaskResultType();
                        break;
                    case MethodType.Insert:
                    case MethodType.Update:
                    case MethodType.Delete:
                    case MethodType.Validate:
                        data.EntityType = data.MethodInfo.GetParameters().First().ParameterType;
                        break;
                    default:
                        throw new InvalidOperationException($"Unknown Method Type: {data.MethodType}");
                }
            }

            return result;
        }

        private void ProcessMethodDescriptions(Type fromType, MethodMap svcMethods, OperationalMethods operMethods, DbSetsDictionary dbSets, ILookup<Type, DbSetInfo> dbSetsByTypeLookUp)
        {
            IEnumerable<MethodInfoData> allList = _GetAllMethods(fromType);

            InitSvcMethods(allList.GetSvcMethods(valueConverter), svcMethods, dbSets, dbSetsByTypeLookUp);

            IEnumerable<MethodInfoData> otherMethods = allList.GetOthersOnly();

            InitOperMethods(otherMethods, operMethods, dbSetsByTypeLookUp);
        }

        private void ProcessAssociation(Association assoc, DbSetsDictionary dbSets, AssociationsDictionary associations)
        {
            if (string.IsNullOrWhiteSpace(assoc.name))
            {
                throw new DomainServiceException(ErrorStrings.ERR_ASSOC_EMPTY_NAME);
            }
            if (!dbSets.ContainsKey(assoc.parentDbSetName))
            {
                throw new DomainServiceException(string.Format(ErrorStrings.ERR_ASSOC_INVALID_PARENT, assoc.name,
                    assoc.parentDbSetName));
            }
            if (!dbSets.ContainsKey(assoc.childDbSetName))
            {
                throw new DomainServiceException(string.Format(ErrorStrings.ERR_ASSOC_INVALID_CHILD, assoc.name,
                    assoc.childDbSetName));
            }

            DbSetInfo childDb = dbSets[assoc.childDbSetName];
            DbSetInfo parentDb = dbSets[assoc.parentDbSetName];
            Dictionary<string, Field> parentDbFields = parentDb.GetFieldByNames();
            Dictionary<string, Field> childDbFields = childDb.GetFieldByNames();

            //check navigation field
            //dont allow to define  it explicitly, the association adds the field by itself (implicitly)
            if (!string.IsNullOrEmpty(assoc.childToParentName) && childDbFields.ContainsKey(assoc.childToParentName))
            {
                throw new DomainServiceException(string.Format(ErrorStrings.ERR_ASSOC_INVALID_NAV_FIELD, assoc.name,
                    assoc.childToParentName));
            }

            //check navigation field
            //dont allow to define  it explicitly, the association adds the field by itself (implicitly)
            if (!string.IsNullOrEmpty(assoc.parentToChildrenName) &&
                parentDbFields.ContainsKey(assoc.parentToChildrenName))
            {
                throw new DomainServiceException(string.Format(ErrorStrings.ERR_ASSOC_INVALID_NAV_FIELD, assoc.name,
                    assoc.parentToChildrenName));
            }

            if (!string.IsNullOrEmpty(assoc.parentToChildrenName) && !string.IsNullOrEmpty(assoc.childToParentName) &&
                assoc.childToParentName == assoc.parentToChildrenName)
            {
                throw new DomainServiceException(string.Format(ErrorStrings.ERR_ASSOC_INVALID_NAV_FIELD, assoc.name,
                    assoc.parentToChildrenName));
            }

            foreach (FieldRel frel in assoc.fieldRels)
            {
                if (!parentDbFields.ContainsKey(frel.parentField))
                {
                    throw new DomainServiceException(string.Format(ErrorStrings.ERR_ASSOC_INVALID_PARENT_FIELD,
                        assoc.name, frel.parentField));
                }
                if (!childDbFields.ContainsKey(frel.childField))
                {
                    throw new DomainServiceException(string.Format(ErrorStrings.ERR_ASSOC_INVALID_CHILD_FIELD,
                        assoc.name, frel.childField));
                }
            }

            //indexed by Name
            associations.Add(assoc.name, assoc);

            if (!string.IsNullOrEmpty(assoc.childToParentName))
            {
                StringBuilder sb = new StringBuilder(120);
                string dependentOn =
                    assoc.fieldRels.Aggregate(sb, (a, b) => a.Append((a.Length == 0 ? "" : ",") + b.childField),
                        a => a).ToString();

                //add navigation field to dbSet's field collection
                Field fld = new Field
                {
                    fieldName = assoc.childToParentName,
                    fieldType = FieldType.Navigation,
                    dataType = DataType.None,
                    dependentOn = dependentOn
                };

                fld.SetTypeScriptDataType(TypeScriptHelper.GetEntityInterfaceName(parentDb.dbSetName));
                childDb.fieldInfos.Add(fld);
            }

            if (!string.IsNullOrEmpty(assoc.parentToChildrenName))
            {
                StringBuilder sb = new StringBuilder(120);
                Field fld = new Field
                {
                    fieldName = assoc.parentToChildrenName,
                    fieldType = FieldType.Navigation,
                    dataType = DataType.None
                };

                fld.SetTypeScriptDataType($"{TypeScriptHelper.GetEntityInterfaceName(childDb.dbSetName)}[]");
                //add navigation field to dbSet's field collection
                parentDb.fieldInfos.Add(fld);
            }
        }

        private void InitSvcMethods(MethodsList methods, MethodMap svcMethods, DbSetsDictionary dbSets, ILookup<Type, DbSetInfo> dbSetsByTypeLookUp)
        {
            methods.ForEach(md =>
            {
                if (md.isQuery)
                {
                    //First check QueryAtrribute if it contains info for Entity Type or DbSet Name
                    QueryAttribute queryAttribute = (QueryAttribute)md.GetMethodData().MethodInfo.GetCustomAttributes(typeof(QueryAttribute), false).FirstOrDefault();

                    string dbSetName = queryAttribute.DbSetName;
                    if (!string.IsNullOrWhiteSpace(dbSetName))
                    {
                        if (!dbSets.ContainsKey(dbSetName))
                        {
                            throw new DomainServiceException(string.Format("Can not determine the DbSet for a query method: {0} by DbSetName {1}", md.methodName, dbSetName));
                        }

                        svcMethods.Add(dbSetName, md);
                    }
                    else
                    {
                        System.Type entityType = queryAttribute.EntityType ?? md.GetMethodData().EntityType;

                        IEnumerable<DbSetInfo> entityTypeDbSets = dbSetsByTypeLookUp[entityType];
                        if (!entityTypeDbSets.Any())
                        {
                            throw new DomainServiceException(string.Format("Can not determine the DbSet for a query method: {0}", md.methodName));
                        }

                        foreach (DbSetInfo dbSetInfo in entityTypeDbSets)
                        {
                            svcMethods.Add(dbSetInfo.dbSetName, md);
                        }
                    }
                }
                else
                {
                    svcMethods.Add("", md);
                }
            });
        }

        private void InitOperMethods(IEnumerable<MethodInfoData> methods, OperationalMethods operMethods, ILookup<Type, DbSetInfo> dbSetsByTypeLookUp)
        {
            MethodInfoData[] otherMethods = methods.ToArray();

            Array.ForEach(otherMethods, md =>
            {
                if (md.EntityType != null)
                {
                    IEnumerable<DbSetInfo> dbSets = dbSetsByTypeLookUp[md.EntityType];

                    foreach (DbSetInfo dbSetInfo in dbSets)
                    {
                        operMethods.Add(dbSetInfo.dbSetName, md);
                    }
                }
                else
                {
                    operMethods.Add("", md);
                }
            });
        }
    }
}