using System;

namespace RIAPP.DataService.Core.Exceptions
{
    public static class ExceptionEx
    {
        public static string GetFullMessage(this Exception exception, bool includeStackTrace = false)
        {
            string result = exception.GetType().Name + ": " + exception.Message;
            while (exception.InnerException != null)
            {
                result = exception.InnerException.GetType().Name + ": " + exception.InnerException.Message + Environment.NewLine + result;
                exception = exception.InnerException;
            }
            if (includeStackTrace)
            {
                if (exception.InnerException != null)
                {
                    result = result + Environment.NewLine + exception.InnerException.StackTrace;
                }
                else
                {
                    result = result + Environment.NewLine + exception.StackTrace;
                }
            }

            return result;
        }

        public static string GetFriendlyMessage(this Exception exception)
        {
            string result = exception.Message;


            return result;
        }
    }
}
