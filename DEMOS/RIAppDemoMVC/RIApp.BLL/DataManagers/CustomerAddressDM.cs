using RIAPP.DataService.Annotations;
using RIAPP.DataService.Core.Security;
using RIAPP.DataService.Core.Types;
using RIAppDemo.DAL.EF;
using System;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;

namespace RIAppDemo.BLL.DataServices.DataManagers
{
    public class CustomerAddressDM : AdWDataManager<CustomerAddress>
    {
        /// <summary>
        /// Refresh Customer's custom ServerCalculated field 'AddressCount' on insert or delete
        /// </summary>
        /// <param name="changeSet"></param>
        /// <param name="refreshResult"></param>
        /// <returns></returns>
        public override async Task AfterChangeSetCommited(ChangeSetRequest changeSet, SubResultList refreshResult)
        {
            DbSetInfo custAddrDbSet = this.GetSetInfosByEntityType(typeof(CustomerAddress)).Single();
            DbSetInfo customerDbSet = this.GetSetInfosByEntityType(typeof(Customer)).Single();

            RIAPP.DataService.Core.Types.DbSet dbCustAddr = changeSet.dbSets.FirstOrDefault(d => d.dbSetName == custAddrDbSet.dbSetName);
            if (dbCustAddr != null)
            {
                int[] custIDs = dbCustAddr.rows.Where(r => r.changeType == ChangeType.Deleted || r.changeType == ChangeType.Added).Select(r => r.values.First(v => v.fieldName == "CustomerID").val).Select(id => int.Parse(id)).ToArray();

                System.Collections.Generic.List<Customer> customersList = await DB.Customers.AsNoTracking().Where(c => custIDs.Contains(c.CustomerID)).ToListAsync();
                System.Collections.Generic.List<int> customerAddress = await DB.CustomerAddresses.AsNoTracking().Where(ca => custIDs.Contains(ca.CustomerID)).Select(ca => ca.CustomerID).ToListAsync();

                customersList.ForEach(customer =>
                {
                    customer.AddressCount = customerAddress.Count(id => id == customer.CustomerID);
                });

                SubResult subResult = new SubResult
                {
                    dbSetName = customerDbSet.dbSetName,
                    Result = customersList
                };
                refreshResult.Add(subResult);
            }
        }

        [Query]
        public async Task<QueryResult<CustomerAddress>> ReadCustomerAddress()
        {
            PerformQueryResult<CustomerAddress> res = PerformQuery(null);
            return new QueryResult<CustomerAddress>(await res.Data.ToListAsync(), totalCount: null);
        }

        [Query]
        public async Task<QueryResult<CustomerAddress>> ReadAddressForCustomers(int[] custIDs)
        {
            int? totalCount = null;
            System.Collections.Generic.List<CustomerAddress> res = await DB.CustomerAddresses.Where(ca => custIDs.Contains(ca.CustomerID)).ToListAsync();
            return new QueryResult<CustomerAddress>(res, totalCount);
        }

        [Authorize(Roles = new[] { ADMINS_ROLE })]
        public void Insert(CustomerAddress customeraddress)
        {
            customeraddress.ModifiedDate = DateTime.Now;
            customeraddress.rowguid = Guid.NewGuid();
            DB.CustomerAddresses.Add(customeraddress);
        }

        [Authorize(Roles = new[] { ADMINS_ROLE })]
        public void Update(CustomerAddress customeraddress)
        {
            customeraddress.ModifiedDate = DateTime.Now;
            CustomerAddress orig = GetOriginal();
            DB.CustomerAddresses.Attach(customeraddress);
            DB.Entry(customeraddress).OriginalValues.SetValues(orig);
        }

        [Authorize(Roles = new[] { ADMINS_ROLE })]
        public void Delete(CustomerAddress customeraddress)
        {
            DB.CustomerAddresses.Attach(customeraddress);
            DB.CustomerAddresses.Remove(customeraddress);
        }
    }
}