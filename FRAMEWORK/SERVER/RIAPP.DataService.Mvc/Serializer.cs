using RIAPP.DataService.Utils;
using RIAPP.DataService.Utils.Extensions;
using System;
using System.IO;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace RIAPP.DataService.Mvc
{
    public class BytesConverter : JsonConverter<byte[]>
    {
        public override byte[] Read(
            ref Utf8JsonReader reader,
            Type typeToConvert,
            JsonSerializerOptions options)
        {
            return reader.GetString()?.ConvertToBinary();
        }

        public override void Write(
            Utf8JsonWriter writer,
            byte[] value, JsonSerializerOptions options)
        {
            if (value == null)
            {
                writer.WriteNullValue();
            }
            else
            {
                writer.WriteStartArray();
                foreach (byte val in value)
                {
                    writer.WriteNumberValue(val);
                }
                writer.WriteEndArray();
            }
        }
    }

    /// <summary>
    ///  serialize an object to JSON
    /// </summary>
    public class Serializer : ISerializer
    {
        private static readonly JsonSerializerOptions Options = new JsonSerializerOptions();

        static Serializer()
        {
            Options.Converters.Add(new BytesConverter());
        }

        public string Serialize(object obj)
        {
            return JsonSerializer.Serialize(obj, Options);
        }

        public Task SerializeAsync<T>(T obj, Stream stream)
        {
            return JsonSerializer.SerializeAsync<T>(stream, obj, Options);
        }

        public object DeSerialize(string input, Type targetType)
        {
            return JsonSerializer.Deserialize(input, targetType, Options);
        }
    }
}