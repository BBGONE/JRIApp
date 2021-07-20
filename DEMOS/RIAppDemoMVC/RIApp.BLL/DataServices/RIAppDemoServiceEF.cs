using RIAPP.DataService.Annotations;
using RIAPP.DataService.Core;
using RIAPP.DataService.Core.Exceptions;
using RIAPP.DataService.Core.Metadata;
using RIAPP.DataService.Core.Query;
using RIAPP.DataService.Core.Security;
using RIAPP.DataService.Core.Types;
using RIAPP.DataService.EF2;
using RIAppDemo.BLL.Models;
using RIAppDemo.DAL.EF;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ResourceHelper = RIAppDemo.BLL.Utils.ResourceHelper;
using SortOrder = RIAPP.DataService.Core.Types.SortOrder;

namespace RIAppDemo.BLL.DataServices
{
    [Authorize]
    public class RIAppDemoServiceEF : EFDomainService<ADWDbContext>
    {
        internal const string USERS_ROLE = "Users";
        internal const string ADMINS_ROLE = "Admins";

        public RIAppDemoServiceEF(IServiceContainer serviceContainer, ADWDbContext db)
            : base(serviceContainer, db)
        {

        }

        protected override DesignTimeMetadata GetDesignTimeMetadata(bool isDraft)
        {
            if (isDraft)
            {
                return base.GetDesignTimeMetadata(true);
            }
            else
            {
                return DesignTimeMetadata.FromXML(ResourceHelper.GetResourceString("RIAppDemo.BLL.Metadata.MainDemo2.xml"));
            }
        }

        /// <summary>
        ///     here can be tracked changes to the entities
        ///     for example: product entity changes is tracked and can be seen here
        /// </summary>
        /// <param name="dbSetName"></param>
        /// <param name="changeType"></param>
        /// <param name="diffgram"></param>
        protected override void OnTrackChange(string dbSetName, ChangeType changeType, string diffgram)
        {
            //you can set a breakpoint here and to examine diffgram
            string user = User.Identity.Name;
        }

        /// <summary>
        ///  Error logging could be implemented here
        /// </summary>
        /// <param name="ex"></param>
        protected override void OnError(Exception ex)
        {
            string msg = "";
            if (ex != null)
            {
                msg = ex.GetFullMessage();
            }
        }

        protected override void Dispose(bool isDisposing)
        {
            base.Dispose(isDisposing);
        }

        #region ProductModel

        [AllowAnonymous]
        [Query]
        public QueryResult<ProductModel> ReadProductModel()
        {
            int? totalCount = null;
            IEnumerable<ProductModel> res = this.PerformQuery(DB.ProductModels.AsNoTracking(), ref totalCount).AsEnumerable();
            return new QueryResult<ProductModel>(res, totalCount);
        }

        #endregion

        #region ProductCategory
        /// <summary>
        /// An example how to return query result of another type as entity
        /// Query attribute can contain information about the EntityType or DbSetName or both
        /// </summary>
        /// <returns>Query result</returns>
        [AllowAnonymous]
        [Query(DbSetName = "ProductCategory", EntityType = typeof(ProductCategory))]
        public QueryResult<object> ReadProductCategory()
        {
            int? totalCount = null;
            // we return anonymous type from query instead of real entities
            // the framework does not care about the real type of the returned entities as long as they contain all the fields
            var res = this.PerformQuery(DB.ProductCategories.AsNoTracking(), ref totalCount).Select(p =>
            new
            {
                ProductCategoryID = p.ProductCategoryID,
                ParentProductCategoryID = p.ParentProductCategoryID,
                Name = p.Name,
                rowguid = p.rowguid,
                ModifiedDate = p.ModifiedDate
            });
            return new QueryResult<object>(res, totalCount);
        }

        #endregion

        [Query]
        public QueryResult<SalesInfo> ReadSalesInfo()
        {
            QueryRequest queryInfo = this.GetCurrentQueryInfo();
            string startsWithVal = queryInfo.filterInfo.filterItems[0].values.First().TrimEnd('%');
            IQueryable<SalesInfo> res = DB.Customers.AsNoTracking().Where(c => c.SalesPerson.StartsWith(startsWithVal))
                    .Select(s => s.SalesPerson)
                    .Distinct()
                    .OrderBy(s => s)
                    .Select(s => new SalesInfo { SalesPerson = s });
            IQueryable<SalesInfo> resPage = res.Skip(queryInfo.pageIndex * queryInfo.pageSize).Take(queryInfo.pageSize);
            return new QueryResult<SalesInfo>(resPage, res.Count());
        }

        [Query]
        public QueryResult<AddressInfo> ReadAddressInfo()
        {
            int? totalCount = null;
            IQueryable<AddressInfo> res = this.PerformQuery(DB.Addresses.AsNoTracking(), ref totalCount)
                    .Select(a =>
                            new AddressInfo
                            {
                                AddressID = a.AddressID,
                                AddressLine1 = a.AddressLine1,
                                City = a.City,
                                CountryRegion = a.CountryRegion
                            });
            return new QueryResult<AddressInfo>(res, totalCount);
        }

        /// <summary>
        ///     if you return Task
        ///     <SomeType>
        ///         result from the Invoke method then it will be asynchronous
        ///         if instead you return SomeType type then the method will be executed synchronously
        ///         here i use the asynchronous variant for demo purposes only!
        /// </summary>
        /// <param name="param1"></param>
        /// <param name="param2"></param>
        /// <returns></returns>
        [AllowAnonymous]
        [Invoke]
        public Task<string> TestInvoke(byte[] param1, string param2)
        {
            string userIPaddress = "Not Available";

            return Task.Run(() =>
            {
                StringBuilder sb = new StringBuilder();

                Array.ForEach(param1, item =>
                {
                    if (sb.Length > 0)
                    {
                        sb.Append(", ");
                    }

                    sb.Append(item);
                });

                /*
                int rand = (new Random(DateTime.Now.Millisecond)).Next(0, 999);
                if ((rand % 3) == 0)
                    throw new Exception("Error generated randomly for testing purposes. Don't worry! Try again.");
                */

                return string.Format("TestInvoke method invoked with<br/><br/><b>param1:</b> {0}<br/> <b>param2:</b> {1} User IP: {2}",
                        sb, param2, userIPaddress);
            });
        }


        [Invoke]
        // [Deny(RolesString = "Users")]
        public byte[] TestComplexInvoke(AddressInfo info, KeyVal[] keys)
        {
            string vals = string.Join(",", keys?.Select(k => k.val).ToArray());
            // System.Diagnostics.Debug.WriteLine(info);
            // System.Diagnostics.Debug.WriteLine(vals);
            byte[] result = BitConverter.GetBytes(DateTime.Now.Ticks);
            // System.Diagnostics.Debug.WriteLine(string.Join(",", result));
            return result;
        }

        /// <summary>
        /// Can be used to load all classifiers in bulk (in one roundtrip)
        /// </summary>
        /// <returns></returns>
        [Invoke]
        public async Task<DEMOCLS> GetClassifiers()
        {
            DEMOCLS res = new DEMOCLS
            {
                prodCategory = await DB.ProductCategories.OrderBy(l => l.Name).Select(d => new KeyVal { key = d.ProductCategoryID, val = d.Name }).ToListAsync(),
                prodDescription = await DB.ProductDescriptions.OrderBy(l => l.Description).Select(d => new KeyVal { key = d.ProductDescriptionID, val = d.Description }).ToListAsync(),
                prodModel = await DB.ProductModels.OrderBy(l => l.Name).Select(d => new KeyVal { key = d.ProductModelID, val = d.Name }).ToListAsync()
            };

            (res.prodModel as List<KeyVal>).Insert(0, new KeyVal() { key = -1, val = "Not Set (Empty)" });

            return res;
        }


        #region CustomerJSON
        /// <summary>
        /// Contrived example of an entity which has JSON data in one of its fields
        /// just to show how to work with these entities on the client side
        /// </summary>
        /// <returns></returns>
        [Query]
        public async Task<QueryResult<CustomerJSON>> ReadCustomerJSON()
        {
            IQueryable<Customer> customers = DB.Customers.AsNoTracking().Where(c => c.CustomerAddresses.Any());
            QueryRequest queryInfo = this.GetCurrentQueryInfo();
            //calculate totalCount only when we fetch first page (to speed up query)
            int? totalCount = queryInfo.pageIndex == 0 ? (int?)null : -1;

            IQueryable<Customer> custQuery = this.PerformQuery(customers, ref totalCount);
            List<Customer> custList = await custQuery.ToListAsync();

            var custAddresses = (from cust in custQuery
                                 from custAddr in cust.CustomerAddresses
                                 join addr in DB.Addresses on custAddr.AddressID equals addr.AddressID
                                 select new
                                 {
                                     CustomerID = custAddr.CustomerID,
                                     ID = addr.AddressID,
                                     Line1 = addr.AddressLine1,
                                     Line2 = addr.AddressLine2,
                                     City = addr.City,
                                     Region = addr.CountryRegion
                                 }).ToLookup((addr) => addr.CustomerID);

            //i create JSON Data myself because there's no entity in db
            //which has json data in its fields
            IEnumerable<CustomerJSON> res = custList.Select(c => new CustomerJSON()
            {
                CustomerID = c.CustomerID,
                rowguid = c.rowguid,
                Data = Serializer.Serialize(new
                {
                    Title = c.Title,
                    CompanyName = c.CompanyName,
                    SalesPerson = c.SalesPerson,
                    ModifiedDate = c.ModifiedDate,
                    Level1 = new
                    {
                        FirstName = c.ComplexProp.FirstName,
                        MiddleName = c.ComplexProp.MiddleName,
                        LastName = c.ComplexProp.LastName,
                        //another level to make it more complex
                        Level2 = new
                        {
                            EmailAddress = c.ComplexProp.EmailAddress,
                            Phone = c.ComplexProp.Phone

                        }
                    },
                    Addresses = custAddresses[c.CustomerID].Select(ca => new { ca.Line1, ca.Line2, ca.City, ca.Region })
                })
            });

            return new QueryResult<CustomerJSON>(res, totalCount == -1 ? null : totalCount);
        }

        [Authorize(Roles = new[] { ADMINS_ROLE })]
        [Insert]
        public void InsertCustomerJSON(CustomerJSON customer)
        {
            //make insert here
        }

        [Authorize(Roles = new[] { ADMINS_ROLE })]
        [Update]
        public void UpdateCustomerJSON(CustomerJSON customer)
        {
            //make update here
        }

        [Authorize(Roles = new[] { ADMINS_ROLE })]
        [Delete]
        public void DeleteCustomerJSON(CustomerJSON customer)
        {
            Customer entity = DB.Customers.Where(c => c.CustomerID == customer.CustomerID).Single();
            DB.Customers.Remove(entity);
        }

        #endregion

        #region Customer

        [Query]
        public async Task<QueryResult<Customer>> ReadCustomer(bool? includeNav)
        {
            IQueryable<Customer> customers = DB.Customers;
            QueryRequest queryInfo = this.GetCurrentQueryInfo();
            // AddressCount does not exists in Database (we calculate it), so it is needed to sort it manually
            SortItem addressCountSortItem = queryInfo.sortInfo.sortItems.FirstOrDefault(sortItem => sortItem.fieldName == "AddressCount");

            if (addressCountSortItem != null)
            {
                queryInfo.sortInfo.sortItems.Remove(addressCountSortItem);
                if (addressCountSortItem.sortOrder == SortOrder.ASC)
                {
                    customers = customers.OrderBy(c => c.CustomerAddresses.Count());
                }
                else
                {
                    customers = customers.OrderByDescending(c => c.CustomerAddresses.Count());
                }
            }

            // perform query
            PerformQueryResult<Customer> customersResult = this.PerformQuery(customers, (countQuery) => countQuery.CountAsync());
            int? totalCount = await customersResult.CountAsync();
            List<Customer> customersList = await customersResult.Data.ToListAsync();

            QueryResult<Customer> queryRes = new QueryResult<Customer>(customersList, totalCount);

            if (includeNav == true)
            {
                int[] customerIDs = customersList.Select(c => c.CustomerID).ToArray();
                List<CustomerAddress> customerAddress = await DB.CustomerAddresses.Where(ca => customerIDs.Contains(ca.CustomerID)).ToListAsync();
                int[] addressIDs = customerAddress.Select(ca => ca.AddressID).ToArray();

                SubResult subResult1 = new SubResult
                {
                    dbSetName = this.GetSetInfosByEntityType(typeof(CustomerAddress)).Single().dbSetName,
                    Result = customerAddress
                };

                SubResult subResult2 = new SubResult
                {
                    dbSetName = this.GetSetInfosByEntityType(typeof(Address)).Single().dbSetName,
                    Result = await DB.Addresses.AsNoTracking().Where(adr => addressIDs.Contains(adr.AddressID)).ToListAsync()
                };

                // since we have preloaded customer addresses then update server side calculated field: AddressCount 
                // (which i have introduced for testing purposes as a server calculated field)
                customersList.ForEach(customer =>
                {
                    customer.AddressCount = customer.CustomerAddresses.Count();
                });

                // return two subresults with the query results
                queryRes.subResults.Add(subResult1);
                queryRes.subResults.Add(subResult2);
            }

            return queryRes;
        }

        [Authorize(Roles = new[] { ADMINS_ROLE })]
        [Insert]
        public void InsertCustomer(Customer customer)
        {
            customer.PasswordHash = Guid.NewGuid().ToString();
            customer.PasswordSalt = new string(Guid.NewGuid().ToString().ToCharArray().Take(10).ToArray());
            customer.ModifiedDate = DateTime.Now;
            customer.rowguid = Guid.NewGuid();
            DB.Customers.Add(customer);
        }

        [Authorize(Roles = new[] { ADMINS_ROLE })]
        [Update]
        public void UpdateCustomer(Customer customer)
        {
            customer.ModifiedDate = DateTime.Now;
            Customer orig = this.GetOriginal<Customer>();
            DB.Customers.Attach(customer);
            DB.Entry(customer).OriginalValues.SetValues(orig);
        }

        [Authorize(Roles = new[] { ADMINS_ROLE })]
        [Delete]
        public void DeleteCustomer(Customer customer)
        {
            DB.Customers.Attach(customer);
            DB.Customers.Remove(customer);
        }

        [Refresh]
        public async Task<Customer> RefreshCustomer(RefreshRequest refreshInfo)
        {
            IQueryable<Customer> query = this.GetRefreshedEntityQuery(DB.Customers, refreshInfo);
            return await query.SingleAsync();
        }

        #endregion

        #region Address

        [Query]
        public QueryResult<Address> ReadAddress()
        {
            int? totalCount = null;
            IEnumerable<Address> res = this.PerformQuery(DB.Addresses.AsNoTracking(), ref totalCount).AsEnumerable();
            return new QueryResult<Address>(res, totalCount);
        }

        [Query]
        public QueryResult<Address> ReadAddressByIds(int[] addressIDs)
        {
            int? totalCount = null;
            IQueryable<Address> res = DB.Addresses.AsNoTracking().Where(ca => addressIDs.Contains(ca.AddressID));
            return new QueryResult<Address>(res, totalCount);
        }

        [Validate]
        public IEnumerable<ValidationErrorInfo> ValidateAddress(Address address, string[] modifiedField)
        {
            return Enumerable.Empty<ValidationErrorInfo>();
        }

        [Authorize(Roles = new[] { ADMINS_ROLE })]
        [Insert]
        public void InsertAddress(Address address)
        {
            address.ModifiedDate = DateTime.Now;
            address.rowguid = Guid.NewGuid();
            DB.Addresses.Add(address);
        }

        [Authorize(Roles = new[] { ADMINS_ROLE })]
        [Update]
        public void UpdateAddress(Address address)
        {
            Address orig = this.GetOriginal<Address>();
            DB.Addresses.Attach(address);
            DB.Entry(address).OriginalValues.SetValues(orig);
        }

        [Authorize(Roles = new[] { ADMINS_ROLE })]
        [Delete]
        public void DeleteAddress(Address address)
        {
            DB.Addresses.Attach(address);
            DB.Addresses.Remove(address);
        }

        #endregion

        #region SalesOrderHeader

        [Query]
        public QueryResult<SalesOrderHeader> ReadSalesOrderHeader()
        {
            int? totalCount = null;
            IQueryable<SalesOrderHeader> res = this.PerformQuery(DB.SalesOrderHeaders.AsNoTracking(), ref totalCount);
            return new QueryResult<SalesOrderHeader>(res, totalCount);
        }

        [Authorize(Roles = new[] { ADMINS_ROLE })]
        [Insert]
        public void InsertSalesOrderHeader(SalesOrderHeader salesorderheader)
        {
            salesorderheader.SalesOrderNumber = DateTime.Now.Ticks.ToString();
            salesorderheader.ModifiedDate = DateTime.Now;
            salesorderheader.rowguid = Guid.NewGuid();
            salesorderheader.RevisionNumber = 1;
            DB.SalesOrderHeaders.Add(salesorderheader);
        }

        [Authorize(Roles = new[] { ADMINS_ROLE })]
        [Update]
        public void UpdateSalesOrderHeader(SalesOrderHeader salesorderheader)
        {
            SalesOrderHeader orig = this.GetOriginal<SalesOrderHeader>();
            DB.SalesOrderHeaders.Attach(salesorderheader);
            DB.Entry(salesorderheader).OriginalValues.SetValues(orig);
        }

        [Authorize(Roles = new[] { ADMINS_ROLE })]
        [Delete]
        public void DeleteSalesOrderHeader(SalesOrderHeader salesorderheader)
        {
            DB.SalesOrderHeaders.Attach(salesorderheader);
            DB.SalesOrderHeaders.Remove(salesorderheader);
        }

        #endregion

        #region SalesOrderDetail

        [Query]
        public QueryResult<SalesOrderDetail> ReadSalesOrderDetail()
        {
            int? totalCount = null;
            IQueryable<SalesOrderDetail> res = this.PerformQuery(DB.SalesOrderDetails.AsNoTracking(), ref totalCount);
            return new QueryResult<SalesOrderDetail>(res, totalCount);
        }

        [Authorize(Roles = new[] { ADMINS_ROLE })]
        [Insert]
        public void InsertSalesOrderDetail(SalesOrderDetail salesorderdetail)
        {
            salesorderdetail.ModifiedDate = DateTime.Now;
            salesorderdetail.rowguid = Guid.NewGuid();
            DB.SalesOrderDetails.Add(salesorderdetail);
        }

        [Authorize(Roles = new[] { ADMINS_ROLE })]
        [Update]
        public void UpdateSalesOrderDetail(SalesOrderDetail salesorderdetail)
        {
            SalesOrderDetail orig = this.GetOriginal<SalesOrderDetail>();
            DB.SalesOrderDetails.Attach(salesorderdetail);
            DB.Entry(salesorderdetail).OriginalValues.SetValues(orig);
        }

        [Authorize(Roles = new[] { ADMINS_ROLE })]
        [Delete]
        public void DeleteSalesOrderDetail(SalesOrderDetail salesorderdetail)
        {
            DB.SalesOrderDetails.Attach(salesorderdetail);
            DB.SalesOrderDetails.Remove(salesorderdetail);
        }

        #endregion
    }
}