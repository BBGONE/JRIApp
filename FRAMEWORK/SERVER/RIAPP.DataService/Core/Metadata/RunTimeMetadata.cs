using RIAPP.DataService.Core.Exceptions;
using RIAPP.DataService.Core.Types;
using RIAPP.DataService.Resources;
using System;
using System.Collections.Generic;
using System.Linq;

namespace RIAPP.DataService.Core.Metadata
{
    public class RunTimeMetadata
    {
        private readonly OperationalMethods _operMethods;
        private readonly MethodMap _svcMethods;

        public RunTimeMetadata(DbSetsDictionary dbSets,
            ILookup<Type, DbSetInfo> dbSetsByTypeLookUp,
            AssociationsDictionary associations,
            MethodMap svcMethods,
            OperationalMethods operMethods,
            string[] typeScriptImports)
        {
            DbSets = dbSets;
            this.dbSetsByTypeLookUp = dbSetsByTypeLookUp;
            Associations = associations;
            _svcMethods = svcMethods;
            _operMethods = operMethods;
            TypeScriptImports = typeScriptImports;
        }

        public string[] TypeScriptImports
        {
            get;
        }

        public ILookup<Type, DbSetInfo> dbSetsByTypeLookUp
        {
            get;
        }

        public MethodDescription GetQueryMethod(string dbSetName, string name)
        {
            MethodDescription method = _svcMethods.GetQueryMethod(dbSetName, name);
            if (method == null)
            {
                throw new DomainServiceException(string.Format(ErrorStrings.ERR_QUERY_NAME_INVALID, name));
            }
            return method;
        }

        public IEnumerable<MethodDescription> GetQueryMethods(string dbSetName)
        {
            return _svcMethods.GetQueryMethods(dbSetName);
        }

        public MethodDescription GetInvokeMethod(string name)
        {
            MethodDescription method = _svcMethods.GetInvokeMethod(name);
            if (method == null)
            {
                throw new DomainServiceException(string.Format(ErrorStrings.ERR_METH_NAME_INVALID, name));
            }
            return method;
        }

        public IEnumerable<MethodDescription> GetInvokeMethods()
        {
            return _svcMethods.GetInvokeMethods();
        }

        public MethodInfoData GetOperationMethodInfo(string dbSetName, MethodType methodType)
        {
            return _operMethods.GetMethod(dbSetName, methodType);
        }

        public DbSetsDictionary DbSets { get; }

        public AssociationsDictionary Associations { get; }

        public MethodsList MethodDescriptions => new MethodsList(_svcMethods.Values);

    }
}