using System;
using System.Configuration;
using System.Data.Common;
using System.Data.SqlClient;

namespace RIAppDemo.BLL
{
    public class DBConnectionFactory
    {
        public const string CONNECTION_STRING_DEFAULT = "DBConnectionStringADW";

        public DBConnectionFactory()
        {

        }

        private string GetConnectionString(string name)
        {
            ConnectionStringSettings connstrings = ConfigurationManager.ConnectionStrings[name];
            if (connstrings == null)
            {
                throw new ApplicationException(string.Format("Connection string {0} is not found in config file", name));
            }
            return connstrings.ConnectionString;
        }

        public string GetRIAppDemoConnectionString()
        {
            string connStr = GetConnectionString(CONNECTION_STRING_DEFAULT);
            SqlConnectionStringBuilder scsb = new SqlConnectionStringBuilder(connStr);
            return scsb.ToString();
        }

        public DbConnection GetRIAppDemoConnection()
        {
            string connStr = GetRIAppDemoConnectionString();
            DbConnection cn = SqlClientFactory.Instance.CreateConnection();
            cn.ConnectionString = connStr;
            return cn;
        }
    }
}