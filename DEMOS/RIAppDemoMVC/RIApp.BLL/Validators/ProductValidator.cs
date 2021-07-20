using RIAPP.DataService.Core;
using RIAPP.DataService.Core.Types;
using RIAppDemo.DAL.EF;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RIAppDemo.BLL.Validators
{
    public class ProductValidator : BaseValidator<Product>
    {
        public override Task<IEnumerable<ValidationErrorInfo>> ValidateModelAsync(Product product,
            string[] modifiedField)
        {
            LinkedList<ValidationErrorInfo> errors = new LinkedList<ValidationErrorInfo>();
            if (Array.IndexOf(modifiedField, "Name") > -1 &&
                product.Name.StartsWith("Ugly", StringComparison.OrdinalIgnoreCase))
            {
                errors.AddLast(new ValidationErrorInfo { fieldName = "Name", message = "Ugly name" });
            }

            if (Array.IndexOf(modifiedField, "Weight") > -1 && product.Weight > 20000)
            {
                errors.AddLast(new ValidationErrorInfo
                {
                    fieldName = "Weight",
                    message = "Weight must be less than 20000"
                });
            }

            if (Array.IndexOf(modifiedField, "SellEndDate") > -1 && product.SellEndDate < product.SellStartDate)
            {
                errors.AddLast(new ValidationErrorInfo
                {
                    fieldName = "SellEndDate",
                    message = "SellEndDate must be after SellStartDate"
                });
            }

            if (Array.IndexOf(modifiedField, "SellStartDate") > -1 && product.SellStartDate > DateTime.Today)
            {
                errors.AddLast(new ValidationErrorInfo
                {
                    fieldName = "SellStartDate",
                    message = "SellStartDate must be prior today"
                });
            }

            if (ChangeType == ChangeType.Updated && Original.ModifiedDate >= product.ModifiedDate)
            {
                errors.AddLast(new ValidationErrorInfo
                {
                    fieldName = "ModifiedDate",
                    message = "ModifiedDate must be greater than the previous ModifiedDate"
                });
            }

            if (Array.IndexOf(modifiedField, "ProductNumber") > -1 && product.ProductNumber.StartsWith("00"))
            {
                errors.AddLast(new ValidationErrorInfo
                {
                    fieldName = "ProductNumber",
                    message = "ProductNumber must not start from 00"
                });
            }

            return Task.FromResult(errors.AsEnumerable());
        }
    }
}