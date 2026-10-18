using System.Text.Json;
using API.RequestHelper;
using Microsoft.Net.Http.Headers;

namespace API.Extensions
{
    public static class HttpExtension
    {
        public static void addPaginationHeader(this HttpResponse response, PaginationMetadata metadata)
        {
            var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

            response.Headers.Append("Pagination", JsonSerializer.Serialize(metadata, options));
            response.Headers.Append(HeaderNames.AccessControlExposeHeaders, "Pagination");
        }
    }
}