using RIAPP.DataService.Core.Exceptions;
using RIAPP.DataService.Core.Metadata;
using RIAPP.DataService.Core.Types;
using RIAPP.DataService.Resources;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace RIAPP.DataService.Core.Security
{
    public static class SecurityHelper
    {
        public static MethodInfo GetMethodInfo(this Type type, string name)
        {
            MethodInfo meth = null;
            if (!string.IsNullOrEmpty(name))
            {
                meth = type.GetMethod(name);
            }

            return meth;
        }

        public static MethodAuthorization GetMethodAuthorization(this MethodInfoData method)
        {
            var attr = method.MethodInfo.GetCustomAttributes(false).ToArray();

            var methodAuthorization = new MethodAuthorization
            {
                MethodName = method.MethodInfo.Name,
                AuthorizeData = Enumerable.Empty<IAuthorizeData>(),
                IsOverride = false,
                IsAllowAnonymous = attr.Where(a => a is IAllowAnonymous).Any()
            };

            if (methodAuthorization.IsAllowAnonymous)
            {
                return methodAuthorization;
            }

            var denies = attr.Where(a => a is IDenyAuthorizeData).Cast<IAuthorizeData>().ToArray();
            var overrides = attr.Where(a => a is IOverrideAuthorizeData).Cast<IAuthorizeData>().ToArray();

            if (overrides.Any())
            {
                methodAuthorization.IsOverride = true;
                methodAuthorization.AuthorizeData = Enumerable.Union(denies, overrides);
                return methodAuthorization;
            }

            var permits = attr.Where(a => a is IAuthorizeData && !(a is IDenyAuthorizeData) && !(a is IOverrideAuthorizeData)).Cast<IAuthorizeData>().ToArray();

            methodAuthorization.AuthorizeData = Enumerable.Union(denies, permits);

            return methodAuthorization;
        }

        public static DataManagerAuthorization GetDataManagerAuthorization(this Type managerType)
        {
            var attr = managerType.GetCustomAttributes(false).ToArray();

            var managerAuthorization = new DataManagerAuthorization
            {
                ManagerType = managerType,
                AuthorizeData = Enumerable.Empty<IAuthorizeData>(),
                MethodsAuthorization = new MethodAuthorization[0],
                IsOverride = false,
                IsAllowAnonymous = attr.Where(a => a is IAllowAnonymous).Any()
            };

            if (managerAuthorization.IsAllowAnonymous)
            {
                return managerAuthorization;
            }

            var denies = attr.Where(a => a is IDenyAuthorizeData).Cast<IAuthorizeData>().ToArray();
            var overrides = attr.Where(a => a is IOverrideAuthorizeData).Cast<IAuthorizeData>().ToArray();

            if (overrides.Any())
            {
                managerAuthorization.IsOverride = true;
                managerAuthorization.AuthorizeData = Enumerable.Union(denies, overrides);
                return managerAuthorization;
            }

            var permits = attr.Where(a => a is IAuthorizeData && !(a is IDenyAuthorizeData) && !(a is IOverrideAuthorizeData)).Cast<IAuthorizeData>().ToArray();

            managerAuthorization.AuthorizeData = Enumerable.Union(denies, permits);

            return managerAuthorization;
        }

        public static IEnumerable<IAuthorizeData> GetTypeAuthorization(this Type instanceType)
        {
            var attr = instanceType.GetCustomAttributes(false).ToArray();

            var denies = attr.Where(a => a is IDenyAuthorizeData).Cast<IAuthorizeData>().ToArray();
            var overrides = attr.Where(a => a is IOverrideAuthorizeData).Cast<IAuthorizeData>().ToArray();

            if (overrides.Any())
            {
                return Enumerable.Union(denies, overrides);
            }

            var permits = attr.Where(a => a is IAuthorizeData && !(a is IDenyAuthorizeData) && !(a is IOverrideAuthorizeData)).Cast<IAuthorizeData>().ToArray();
            return Enumerable.Union(denies, permits);
        }

        private static IEnumerable<DataManagerAuthorization> _GetDataManagersAuthorization(IEnumerable<MethodInfoData> methods)
        {
            var selectedMethods = methods.Where(m => m.IsInDataManager).ToArray();

            if (!selectedMethods.Any())
            {
                return Enumerable.Empty<DataManagerAuthorization>();
            }

            Dictionary<Type, DataManagerAuthorization> authorizationDict = new Dictionary<Type, DataManagerAuthorization>();
            Dictionary<Type, Dictionary<string, MethodAuthorization>> ownerMethodAuthorizationDict = new Dictionary<Type, Dictionary<string, MethodAuthorization>>();

            foreach (var method in selectedMethods)
            {
                if (!authorizationDict.TryGetValue(method.OwnerType, out var ownerAuthorization))
                {
                    ownerAuthorization = method.OwnerType.GetDataManagerAuthorization();
                    authorizationDict.Add(method.OwnerType, ownerAuthorization);
                }

                if (!ownerMethodAuthorizationDict.TryGetValue(method.OwnerType, out var methodAuthorizationDict))
                {
                    methodAuthorizationDict = new Dictionary<string, MethodAuthorization>();
                    ownerMethodAuthorizationDict.Add(method.OwnerType, methodAuthorizationDict);
                }

                if (!methodAuthorizationDict.TryGetValue(method.MethodInfo.Name, out var methodAuthorization))
                {
                    methodAuthorization = method.GetMethodAuthorization();
                    methodAuthorizationDict.Add(method.MethodInfo.Name, methodAuthorization);
                }
            }

            foreach (Type ownerType in authorizationDict.Keys)
            {
                authorizationDict[ownerType].MethodsAuthorization = ownerMethodAuthorizationDict[ownerType].Values.ToArray();
            }

            return authorizationDict.Values.ToArray();
        }

        private static IEnumerable<MethodAuthorization> _GetMethodsAuthorization(IEnumerable<MethodInfoData> methods)
        {
            var selectedMethods = methods.Where(m => !m.IsInDataManager).ToArray();
            if (!selectedMethods.Any())
            {
                return Enumerable.Empty<MethodAuthorization>();
            }

            Dictionary<string, MethodAuthorization> methodAuthorizationDict = new Dictionary<string, MethodAuthorization>();

            foreach (var method in selectedMethods)
            {
                if (!methodAuthorizationDict.TryGetValue(method.MethodInfo.Name, out var methodAuthorization))
                {
                    methodAuthorization = method.GetMethodAuthorization();
                    methodAuthorizationDict.Add(method.MethodInfo.Name, methodAuthorization);
                }
            }

            return methodAuthorizationDict.Values.ToArray();
        }

        public static AuthorizationTree GetAuthorizationTree(this IEnumerable<IAuthorizeData> serviceAuthorization, IEnumerable<MethodInfoData> methods)
        {
            return new AuthorizationTree
            {
                DataServiceAuthorization = serviceAuthorization,
                DataManagersAuthorization = _GetDataManagersAuthorization(methods),
                MethodsAuthorization = _GetMethodsAuthorization(methods)
            };
        }

        public static MethodInfoData GetCRUDMethodInfo(this RowInfo rowInfo, RunTimeMetadata metadata, string dbSetName)
        {
            MethodInfoData method = null;
            switch (rowInfo.changeType)
            {
                case ChangeType.Added:
                    method = metadata.GetOperationMethodInfo(dbSetName, MethodType.Insert);
                    break;
                case ChangeType.Deleted:
                    method = metadata.GetOperationMethodInfo(dbSetName, MethodType.Delete);
                    break;
                case ChangeType.Updated:
                    method = metadata.GetOperationMethodInfo(dbSetName, MethodType.Update);
                    break;
                default:
                    throw new DomainServiceException(string.Format(ErrorStrings.ERR_REC_CHANGETYPE_INVALID, dbSetName,
                        rowInfo.changeType));
            }
            return method;
        }

        public static async Task<bool> CanAccessOperation(this IAuthorizer authorizer, RunTimeMetadata metadata, string dbSetName, MethodType methodType)
        {
            MethodInfoData method = metadata.GetOperationMethodInfo(dbSetName, methodType);
            return method != null && await authorizer.CanAccessMethod(method);
        }

        public static async Task<DbSetPermit> GetDbSetPermissions(this IAuthorizer authorizer, RunTimeMetadata metadata, string dbSetName)
        {
            return new DbSetPermit()
            {
                dbSetName = dbSetName,
                canAddRow = await authorizer.CanAccessOperation(metadata, dbSetName, MethodType.Insert),
                canEditRow = await authorizer.CanAccessOperation(metadata, dbSetName, MethodType.Update),
                canDeleteRow = await authorizer.CanAccessOperation(metadata, dbSetName, MethodType.Delete),
                canRefreshRow = await authorizer.CanAccessOperation(metadata, dbSetName, MethodType.Refresh)
            };
        }
    }
}