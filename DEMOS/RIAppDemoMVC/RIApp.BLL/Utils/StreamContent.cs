using System.IO;
using System.Threading.Tasks;

namespace RIAppDemo.BLL.Utils
{
    public class StreamContent : IDataContent
    {
        private readonly Stream _stream;

        public StreamContent(Stream stream)
        {
            _stream = stream;
        }

        public Task CopyToAsync(Stream stream, int bufferSize = 131072)
        {
            return _stream.CopyToAsync(stream);
        }

        public void CleanUp()
        {
            //noop
        }
    }
}
