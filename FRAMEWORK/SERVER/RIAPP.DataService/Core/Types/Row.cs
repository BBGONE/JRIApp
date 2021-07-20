namespace RIAPP.DataService.Core.Types
{

    public class Row
    {
        public Row()
        {
            v = new object[0];
            k = string.Empty;
        }

        public Row(object[] v, string k)
        {
            this.v = v;
            this.k = k;
        }

        /// <summary>
        ///     array of row values, each value in its string form
        ///     but for object fields the value is an array of values (that's why the property uses object[] type)
        /// </summary>

        public object[] v { get; set; }


        /// <summary>
        ///     Unique key in a DbSet - primary key values concantenated by ;
        ///     used on the client to uniquely identify Entities
        /// </summary>

        public string k { get; set; }
    }
}