using RIAPP.DataService.Core.Types;
using System;
using System.Globalization;

namespace RIAPP.DataService.Utils
{
    public static class DateTimeHelper
    {
        public static int GetTimezoneOffset()
        {
            DateTime uval = DATEZERO.ToUniversalTime();
            TimeSpan tspn = uval - DATEZERO;
            return (int)tspn.TotalMinutes;
        }

        public static DateTime ParseDateTime(string val, DateConversion dateConversion)
        {
            return DateTime.ParseExact(val, "yyyy-MM-ddTHH:mm:ss.fffZ", CultureInfo.InvariantCulture, DateTimeStyles.RoundtripKind);
        }

        public static string DateToString(DateTime dt, DateConversion dateConversion)
        {
            return dt.ToString("yyyy-MM-ddTHH:mm:ss.fffZ", CultureInfo.InvariantCulture);
        }

        public static string TimeToString(TimeSpan time, DateConversion dateConversion)
        {
            return (DateTimeHelper.DATEZERO + time).ToString("yyyy-MM-ddTHH:mm:ss.fffZ", CultureInfo.InvariantCulture);
        }

        public static string DateOffsetToString(DateTimeOffset dtoff, DateConversion dateConversion)
        {
            return DateToString(dtoff.DateTime, dateConversion);
        }


        public static readonly DateTime DATEZERO = new DateTime(1900, 1, 1);
    }
}