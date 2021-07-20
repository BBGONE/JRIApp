using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace RIAppDemo.DAL.EF
{
    /// <summary>
    ///     Complex type property, for testing complex types
    /// </summary>
    [ComplexType]
    public class CustomerLvl1
    {
        public CustomerLvl1()
        {
            ComplexProp = new CustomerLvl2(this);
        }

        [Required]
        [StringLength(50)]
        [Column("FirstName")]
        public string FirstName { get; set; }


        [StringLength(50)]
        [Column("MiddleName")]
        public string MiddleName { get; set; }

        [Required]
        [StringLength(50)]
        [Column("LastName")]
        public string LastName { get; set; }

        [StringLength(50)]
        [Column("EmailAddress")]
        public string EmailAddress { get; set; }

        [StringLength(25)]
        [Column("Phone")]
        public string Phone { get; set; }

        [NotMapped]
        public CustomerLvl2 ComplexProp { get; }
    }

    /// <summary>
    ///     Nested Complex type property, for testing complex types
    /// </summary>
    public class CustomerLvl2
    {
        private readonly CustomerLvl1 _owner;

        public CustomerLvl2(CustomerLvl1 owner)
        {
            _owner = owner;
        }

        [StringLength(50)]
        public string EmailAddress
        {
            get => _owner.EmailAddress;
            set => _owner.EmailAddress = value;
        }


        [StringLength(25)]
        public string Phone
        {
            get => _owner.Phone;
            set => _owner.Phone = value;
        }
    }

    [Table("SalesLT.Customer")]
    public class Customer
    {
        [SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Customer()
        {
            CustomerAddresses = new HashSet<CustomerAddress>();
            SalesOrderHeaders = new HashSet<SalesOrderHeader>();
            ComplexProp = new CustomerLvl1();
        }

        public int CustomerID { get; set; }

        public bool NameStyle { get; set; }

        [StringLength(8)]
        public string Title { get; set; }

        /*
        [Required]
        [StringLength(50)]
        public string FirstName { get; set; }

        [StringLength(50)]
        public string MiddleName { get; set; }

        [Required]
        [StringLength(50)]
        public string LastName { get; set; }
        */

        [StringLength(10)]
        public string Suffix { get; set; }

        [StringLength(128)]
        public string CompanyName { get; set; }

        [StringLength(256)]
        public string SalesPerson { get; set; }

        /*
        [StringLength(50)]
        public string EmailAddress { get; set; }

        [StringLength(25)]
        public string Phone { get; set; }
        */

        /// <summary>
        ///     This field is for testing complex type fields
        /// </summary>
        public CustomerLvl1 ComplexProp { get; set; }

        [Required]
        [StringLength(128)]
        public string PasswordHash { get; set; }

        [Required]
        [StringLength(10)]
        public string PasswordSalt { get; set; }

        public Guid rowguid { get; set; }

        public DateTime ModifiedDate { get; set; }

        [SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<CustomerAddress> CustomerAddresses { get; set; }

        [SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<SalesOrderHeader> SalesOrderHeaders { get; set; }

        /// <summary>
        ///     This field is for testing server side calculated fields
        /// </summary>
        [NotMapped]
        public int? AddressCount { get; set; }
    }
}