using RIAPP.DataService.Core;
using RIAPP.DataService.Core.Types;
using RIAppDemo.DAL.EF;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RIAppDemo.BLL.Validators
{
    public class CustomerValidator : BaseValidator<Customer>
    {
        public override Task<IEnumerable<ValidationErrorInfo>> ValidateModelAsync(Customer customer,
            string[] modifiedField)
        {
            LinkedList<ValidationErrorInfo> errors = new LinkedList<ValidationErrorInfo>();
            if (Array.IndexOf(modifiedField, "ComplexProp.ComplexProp.Phone") > -1 &&
                customer.ComplexProp.ComplexProp.Phone != null &&
                customer.ComplexProp.ComplexProp.Phone.StartsWith("000", StringComparison.OrdinalIgnoreCase))
            {
                errors.AddLast(new ValidationErrorInfo
                {
                    fieldName = "ComplexProp.ComplexProp.Phone",
                    message = "Phone number must not start with 000!"
                });
            }

            if (ChangeType == ChangeType.Updated && Original.ModifiedDate >= customer.ModifiedDate)
            {
                errors.AddLast(new ValidationErrorInfo
                {
                    fieldName = "ModifiedDate",
                    message = "ModifiedDate must be greater than the previous ModifiedDate"
                });
            }

            return Task.FromResult(errors.AsEnumerable());
        }
    }
}