using System;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace RIAppDemo.BLL.Utils
{
    /// <summary>
    ///     поток для записи двоичных данных
    ///     в поля varbinary SQL SERVER
    /// </summary>
    public class BlobStream : Stream
    {
        private readonly int m_BufferLen;
        private readonly SqlCommand m_cmdDataLength;
        private readonly SqlCommand m_cmdEmptyColumn;
        private readonly SqlCommand m_cmdReadText;
        private readonly SqlCommand m_cmdUpdateText;
        private readonly string m_ColName;
        private long m_DataLength;
        private long m_Position;
        private readonly string m_TableName;
        private readonly string m_Where;

        public BlobStream(SqlConnection Connection, string TableName, string ColName, string Where)
        {
            m_BufferLen = 1024 * 64; //64KB
            this.Connection = Connection;
            m_TableName = TableName;
            m_ColName = ColName;
            m_Where = Where;
            string cmd_txt = string.Format("SELECT DATALENGTH({0}) AS [LENGTH] FROM {1} {2}",
                m_ColName, m_TableName, m_Where);
            m_cmdDataLength = new SqlCommand(cmd_txt, this.Connection);

            cmd_txt = string.Format("UPDATE {0} SET {1}=0x {2}",
                m_TableName, m_ColName, m_Where);

            m_cmdEmptyColumn = new SqlCommand(cmd_txt, this.Connection);

            cmd_txt = string.Format("UPDATE {0} SET {1} .WRITE (@data, @offset, @length) {2}",
                m_TableName, m_ColName, m_Where);

            m_cmdUpdateText = new SqlCommand(cmd_txt, this.Connection);
            m_cmdUpdateText.Parameters.Add("@data", SqlDbType.VarBinary, int.MaxValue);
            m_cmdUpdateText.Parameters.Add("@offset", SqlDbType.BigInt);
            m_cmdUpdateText.Parameters.Add("@length", SqlDbType.BigInt);

            cmd_txt = string.Format("SELECT SUBSTRING({1},@offset+1,@length) AS [CHUNK] FROM {0} WITH (HOLDLOCK) {2}",
                m_TableName, m_ColName, m_Where);

            m_cmdReadText = new SqlCommand(cmd_txt, this.Connection);
            m_cmdReadText.Parameters.Add("@offset", SqlDbType.BigInt);
            m_cmdReadText.Parameters.Add("@length", SqlDbType.BigInt);
        }

        public override bool CanRead => true;

        public override bool CanWrite => true;

        public override bool CanSeek => true;

        public override long Length =>
                //	this.m_DataLength=this.GetLength();
                m_DataLength;

        public override long Position
        {
            get => m_Position;
            set => m_Position = value;
        }

        public SqlConnection Connection { get; }

        public bool IsOpen { get; private set; }

        protected virtual async Task<int> _Read(bool isAsync, byte[] buffer, int offset, int count, CancellationToken cancellationToken)
        {
            if (!IsOpen)
            {
                throw new Exception("StreamIsClosed");
            }
            if (buffer == null)
            {
                throw new ArgumentNullException("buffer", "ArgumentNull_Buffer");
            }
            if (offset < 0)
            {
                throw new ArgumentOutOfRangeException("offset", "ArgumentOutOfRange_NeedNonNegNum");
            }
            if (count < 0)
            {
                throw new ArgumentOutOfRangeException("count", "ArgumentOutOfRange_NeedNonNegNum");
            }
            if (buffer.Length - offset < count)
            {
                throw new ArgumentException("Argument_InvalidOffLen");
            }

            int read = 0;
            if (m_DataLength == 0)
            {
                read = 0;
            }
            else if (count > m_DataLength - m_Position)
            {
                read = (int)(m_DataLength - m_Position);
            }
            else
            {
                read = count;
            }

            long pos = m_Position;
            int chunk = 0;
            int cnt = 0;
            while (read > 0)
            {
                if (read > m_BufferLen)
                {
                    chunk = m_BufferLen;
                }
                else
                {
                    chunk = read;
                }

                m_cmdReadText.Parameters["@offset"].Value = pos;
                m_cmdReadText.Parameters["@length"].Value = chunk;

                object obj = null;
                if (isAsync)
                {
                    obj = await m_cmdReadText.ExecuteScalarAsync(cancellationToken);
                }
                else
                {
                    obj = m_cmdReadText.ExecuteScalar();
                }

                if (obj == null)
                {
                    m_Position = pos;
                    return cnt;
                }
                byte[] res = (byte[])obj;
                Buffer.BlockCopy(res, 0, buffer, offset, res.Length);
                offset += res.Length;
                read -= chunk;
                pos += chunk;
                cnt += res.Length;
                m_Position = pos;
            }

            return cnt;
        }

        public override int Read(byte[] buffer, int offset, int count)
        {
            Task<int> res = _Read(false, buffer, offset, count, CancellationToken.None);
            return res.Result;
        }

        public override Task<int> ReadAsync(byte[] buffer, int offset, int count, CancellationToken cancellationToken)
        {
            return _Read(true, buffer, offset, count, cancellationToken);
        }

        protected virtual async Task _Write(bool isAsync, byte[] buffer, int offset, int count, CancellationToken cancellationToken)
        {
            if (count == 0)
            {
                return;
            }
            if (!IsOpen)
            {
                throw new Exception("StreamIsClosed");
            }
            if (buffer == null)
            {
                throw new ArgumentNullException("buffer", "ArgumentNull_Buffer");
            }
            if (offset < 0)
            {
                throw new ArgumentOutOfRangeException("offset", "ArgumentOutOfRange_NeedNonNegNum");
            }
            if (count < 0)
            {
                throw new ArgumentOutOfRangeException("count", "ArgumentOutOfRange_NeedNonNegNum");
            }
            if (buffer.Length - offset < count)
            {
                throw new ArgumentException("Argument_InvalidOffLen");
            }

            byte[] buff = null;
            long append = count;
            long pos = m_Position;
            while (append > 0)
            {
                int chunk = 0;
                if (append > m_BufferLen)
                {
                    chunk = m_BufferLen;
                    if (buff == null || buff.Length != chunk)
                    {
                        buff = new byte[chunk];
                    }
                }
                else
                {
                    chunk = (int)append;
                    buff = new byte[chunk];
                }
                int delete = 0;
                if (m_DataLength == 0)
                {
                    delete = 0;
                }
                else if (m_Position < m_DataLength)
                {
                    long to_right = m_DataLength - m_Position;
                    if (to_right > chunk)
                    {
                        delete = chunk;
                    }
                    else
                    {
                        delete = (int)to_right;
                    }
                }
                else
                {
                    delete = 0;
                }

                Buffer.BlockCopy(buffer, offset, buff, 0, chunk);
                m_cmdUpdateText.Parameters["@offset"].Value = pos;
                m_cmdUpdateText.Parameters["@length"].Value = delete;
                m_cmdUpdateText.Parameters["@data"].Value = buff;
                if (isAsync)
                {
                    await m_cmdUpdateText.ExecuteNonQueryAsync(cancellationToken);
                }
                else
                {
                    m_cmdUpdateText.ExecuteNonQuery();
                }

                pos += chunk;
                offset += chunk;
                append -= chunk;
                m_DataLength = m_DataLength + chunk - delete;
                m_Position = pos;
            }
        }

        public override void Write(byte[] buffer, int offset, int count)
        {
            Task res = _Write(false, buffer, offset, count, CancellationToken.None);
            res.Wait();
        }

        public override async Task WriteAsync(byte[] buffer, int offset, int count, CancellationToken cancellationToken)
        {
            await _Write(false, buffer, offset, count, cancellationToken);
        }

        public virtual void Insert(byte[] buffer, int offset, int count)
        {
            if (count == 0)
            {
                return;
            }

            if (!IsOpen)
            {
                throw new Exception("StreamIsClosed");
            }
            if (buffer == null)
            {
                throw new ArgumentNullException("buffer", "ArgumentNull_Buffer");
            }
            if (offset < 0)
            {
                throw new ArgumentOutOfRangeException("offset", "ArgumentOutOfRange_NeedNonNegNum");
            }
            if (count < 0)
            {
                throw new ArgumentOutOfRangeException("count", "ArgumentOutOfRange_NeedNonNegNum");
            }
            if (buffer.Length - offset < count)
            {
                throw new ArgumentException("Argument_InvalidOffLen");
            }

            byte[] buff = null;
            long append = count;
            long pos = m_Position;
            while (append > 0)
            {
                int chunk = 0;
                if (append > m_BufferLen)
                {
                    chunk = m_BufferLen;
                    if (buff == null || buff.Length != chunk)
                    {
                        buff = new byte[chunk];
                    }
                }
                else
                {
                    chunk = (int)append;
                    buff = new byte[chunk];
                }
                int delete = 0;
                Buffer.BlockCopy(buffer, offset, buff, 0, chunk);
                m_cmdUpdateText.Parameters["@offset"].Value = pos;
                m_cmdUpdateText.Parameters["@length"].Value = delete;
                m_cmdUpdateText.Parameters["@data"].Value = buff;
                m_cmdUpdateText.ExecuteNonQuery();
                pos += chunk;
                offset += chunk;
                append -= chunk;
                m_DataLength = m_DataLength + chunk - delete;
                m_Position = pos;
            }
        }

        public override long Seek(long offset, SeekOrigin loc)
        {
            if (!IsOpen)
            {
                throw new Exception("StreamIsClosed");
            }
            if (offset > 0x7fffffff)
            {
                throw new ArgumentOutOfRangeException("offset", "ArgumentOutOfRange_StreamLength");
            }
            switch (loc)
            {
                case SeekOrigin.Begin:
                    {
                        if (offset < 0)
                        {
                            throw new IOException("IO.IO_SeekBeforeBegin");
                        }
                        m_Position = offset;
                        break;
                    }
                case SeekOrigin.Current:
                    {
                        if (offset + m_Position < 0)
                        {
                            throw new IOException("IO.IO_SeekBeforeBegin");
                        }
                        m_Position += offset;
                        break;
                    }
                case SeekOrigin.End:
                    {
                        if (m_DataLength + offset < 0)
                        {
                            throw new IOException("IO.IO_SeekBeforeBegin");
                        }
                        m_Position = m_DataLength + offset;
                        break;
                    }
                default:
                    {
                        throw new ArgumentException("Argument_InvalidSeekOrigin");
                    }
            }
            return m_Position;
        }

        public override void Flush()
        {
        }

        public override void SetLength(long value)
        {
            if (!IsOpen)
            {
                throw new Exception("StreamIsClosed");
            }
            long offset = value;
            if (m_DataLength < value)
            {
                long append = value - m_DataLength;
                offset = m_DataLength;
                byte[] buff = null;
                while (append > 0)
                {
                    long chunk = 0;
                    if (append > m_BufferLen)
                    {
                        chunk = m_BufferLen;
                        if (buff == null || buff.Length != chunk)
                        {
                            buff = new byte[chunk];
                        }
                    }
                    else
                    {
                        chunk = append;
                        buff = new byte[chunk];
                    }
                    m_cmdUpdateText.Parameters["@offset"].Value = offset;
                    m_cmdUpdateText.Parameters["@length"].Value = 0;
                    m_cmdUpdateText.Parameters["@data"].Value = buff;
                    m_cmdUpdateText.ExecuteNonQuery();
                    offset += chunk;
                    append -= chunk;
                }
                m_DataLength = GetLength();
            }
            else
            {
                m_cmdUpdateText.Parameters["@offset"].Value = offset;
                m_cmdUpdateText.Parameters["@length"].Value = DBNull.Value;
                m_cmdUpdateText.Parameters["@data"].Value = DBNull.Value;
                m_cmdUpdateText.ExecuteNonQuery();
                m_DataLength = GetLength();
                if (m_Position > m_DataLength)
                {
                    m_Position = m_DataLength;
                }
            }
        }

        private long GetLength()
        {
            object res = m_cmdDataLength.ExecuteScalar();
            if (res == null || res is DBNull)
            {
                return 0;
            }

            return (long)Convert.ChangeType(res, typeof(long));
        }

        public void InitColumn()
        {
            m_cmdEmptyColumn.ExecuteNonQuery();
            m_Position = 0;
            m_DataLength = 0;
        }

        public async Task InitColumnAsync()
        {
            await m_cmdEmptyColumn.ExecuteNonQueryAsync();
            m_Position = 0;
            m_DataLength = 0;
        }

        public void Open()
        {
            m_Position = 0;
            m_DataLength = GetLength();
            IsOpen = true;
        }

        public override void Close()
        {
            IsOpen = false;
            base.Close();
        }
    }
}