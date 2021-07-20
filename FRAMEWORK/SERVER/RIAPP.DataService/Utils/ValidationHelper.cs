using RIAPP.DataService.Core;
using RIAPP.DataService.Core.Exceptions;
using RIAPP.DataService.Core.Types;
using RIAPP.DataService.Resources;
using System;
using System.Globalization;
using System.Text.RegularExpressions;

namespace RIAPP.DataService.Utils
{
    public class ValidationHelper<TService> : IValidationHelper<TService>
         where TService : BaseDomainService
    {
        private readonly IValueConverter<TService> valueConverter;

        public ValidationHelper(IValueConverter<TService> valueConverter)
        {
            this.valueConverter = valueConverter ?? throw new ArgumentNullException(nameof(valueConverter));
        }

        public void CheckString(Field fieldInfo, string val)
        {
            if (val == null)
            {
                return;
            }

            if (fieldInfo.maxLength > 0)
            {
                if (!string.IsNullOrEmpty(val))
                {
                    if (val.Length > fieldInfo.maxLength)
                    {
                        throw new ValidationException(string.Format(ErrorStrings.ERR_VAL_EXCEEDS_MAXLENGTH,
                            fieldInfo.fieldName, fieldInfo.maxLength));
                    }
                }
            }

            if (!string.IsNullOrEmpty(val) && !string.IsNullOrEmpty(fieldInfo.regex))
            {
                Regex rx = new Regex(fieldInfo.regex, RegexOptions.IgnoreCase);
                if (!rx.IsMatch(val))
                {
                    throw new ValidationException(string.Format(ErrorStrings.ERR_VAL_IS_NOT_VALID, fieldInfo.fieldName));
                }
            }
        }

        public void CheckRange(Field fieldInfo, string val)
        {
            if (val == null)
            {
                return;
            }

            if (!string.IsNullOrEmpty(fieldInfo.range))
            {
                string[] rangeParts = fieldInfo.range.Split(',');
                switch (fieldInfo.dataType)
                {
                    case DataType.Integer:
                    case DataType.Decimal:
                    case DataType.Float:
                        {
                            double dblval = double.Parse(val, CultureInfo.InvariantCulture);
                            if (!string.IsNullOrEmpty(rangeParts[0]))
                            {
                                double minDbl = double.Parse(rangeParts[0], CultureInfo.InvariantCulture);
                                if (dblval < minDbl)
                                {
                                    throw new ValidationException(string.Format(ErrorStrings.ERR_VAL_RANGE_NOT_VALID,
                                        fieldInfo.fieldName, fieldInfo.range));
                                }
                            }
                            if (!string.IsNullOrEmpty(rangeParts[1]))
                            {
                                double maxDbl = double.Parse(rangeParts[1], CultureInfo.InvariantCulture);
                                if (dblval > maxDbl)
                                {
                                    throw new ValidationException(string.Format(ErrorStrings.ERR_VAL_RANGE_NOT_VALID,
                                        fieldInfo.fieldName, fieldInfo.range));
                                }
                            }
                        }
                        break;
                    case DataType.Date:
                    case DataType.DateTime:
                        {
                            DateTime dtval = (DateTime)valueConverter.DeserializeValue(typeof(DateTime), DataType.DateTime,
                                        fieldInfo.dateConversion, val);
                            if (!string.IsNullOrEmpty(rangeParts[0]))
                            {
                                DateTime minDt = DateTime.ParseExact(rangeParts[0], "yyyy-MM-dd", CultureInfo.InvariantCulture);
                                if (dtval < minDt)
                                {
                                    throw new ValidationException(string.Format(ErrorStrings.ERR_VAL_RANGE_NOT_VALID,
                                        fieldInfo.fieldName, fieldInfo.range));
                                }
                            }
                            if (!string.IsNullOrEmpty(rangeParts[1]))
                            {
                                DateTime maxDt = DateTime.ParseExact(rangeParts[1], "yyyy-MM-dd", CultureInfo.InvariantCulture);
                                if (dtval > maxDt)
                                {
                                    throw new ValidationException(string.Format(ErrorStrings.ERR_VAL_RANGE_NOT_VALID,
                                        fieldInfo.fieldName, fieldInfo.range));
                                }
                            }
                        }
                        break;
                    default:
                        return;
                }
            }
        }

        public void CheckValue(Field fieldInfo, string val)
        {
            if (val == null && !fieldInfo.isNullable)
            {
                throw new ValidationException(string.Format(ErrorStrings.ERR_FIELD_IS_NOT_NULLABLE, fieldInfo.fieldName));
            }
            if (fieldInfo.dataType == DataType.String)
            {
                CheckString(fieldInfo, val);
            }
            CheckRange(fieldInfo, val);
        }
    }
}