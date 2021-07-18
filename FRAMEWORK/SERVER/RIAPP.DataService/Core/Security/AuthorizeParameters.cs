using System;
using System.Collections.Generic;

namespace RIAPP.DataService.Core.Security
{
    /// <summary>
    ///  Authorization for a DataService which contains Methods and DataManagers
    ///  it is the highest level
    /// </summary>
    public class AuthorizationTree
    {
        public IEnumerable<MethodAuthorization> MethodsAuthorization;
        public IEnumerable<DataManagerAuthorization> DataManagersAuthorization;
        public IEnumerable<IAuthorizeData> DataServiceAuthorization;
    }

    /// <summary>
    ///  Authorization for a DataManager which contains methods
    /// </summary>
    public class DataManagerAuthorization
    {
        /// <summary>
        /// If the current level overrides the authorization at a higher level
        /// </summary>
        public bool IsOverride;
        public bool IsAllowAnonymous;
        public IEnumerable<MethodAuthorization> MethodsAuthorization;
        public Type ManagerType;
        public IEnumerable<IAuthorizeData> AuthorizeData;
    }

    /// <summary>
    ///  The Lowest level - Authorization for a Method
    /// </summary>
    public class MethodAuthorization
    {
        /// <summary>
        /// If the current level overrides the authorization at a higher level
        /// </summary>
        public bool IsOverride;
        public bool IsAllowAnonymous;
        public string MethodName;
        public IEnumerable<IAuthorizeData> AuthorizeData;
    }
}
