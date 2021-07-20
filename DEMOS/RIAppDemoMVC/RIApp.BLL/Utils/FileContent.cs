using System.IO;
using System.Threading.Tasks;

namespace RIAppDemo.BLL.Utils
{
    public class FileContent : IDataContent
    {
        private readonly string _filePath;

        public FileContent(string filePath)
        {
            _filePath = filePath;
        }

        public string FilePath => _filePath;

        public async Task CopyToAsync(Stream stream, int bufferSize = 131072)
        {
            using (FileStream fileStream = File.OpenRead(FilePath))
            {
                await fileStream.CopyToAsync(stream);
            }
        }

        public void CleanUp()
        {
            if (File.Exists(FilePath))
            {
                File.Delete(FilePath);
            }
        }
    }
}
