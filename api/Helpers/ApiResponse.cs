using api.Dto;
using Newtonsoft.Json;
using static api.Helpers.ErrorResource;

namespace api.Helpers
{
    public class ApiResponse<T>
    {
        public bool Success { get; init; }
        public T? Data { get; init; }
        public string Message { get; init; } = string.Empty;

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public ErrorType? ErrorType { get; init; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public List<string>? ValidationErrors { get; init; }

        public PaginationDetails? Pagination { get; init; }

        public static ApiResponse<T> SuccessResponse(T data, string message = "Success",
            PaginationDetails? pagi = null)
        {
            return new ApiResponse<T>
            {
                Success = true,
                Data = data,
                Message = message,
                Pagination = pagi
            };
        }

        public static ApiResponse<T> ErrorResponse(string message, ErrorType errorType,
            List<string>? validationErrors = null)
        {
            return new ApiResponse<T>
            {
                Success = false,
                Message = message,
                ErrorType = errorType,
                ValidationErrors = validationErrors
            };
        }

        public static ApiResponse<T> NotFound(string resourceName)
        {
            return new ApiResponse<T>
            {
                Success = false,
                Message = $"{resourceName} not found",
                ErrorType = ErrorResource.ErrorType.NotFound
            };
        }

        public static ApiResponse<T> Unauthorized()
        {
            return new ApiResponse<T>
            {
                Success = false,
                Message = "Unauthorized",
                ErrorType = ErrorResource.ErrorType.Unauthorized
            };
        }

        public static ApiResponse<T> BadRequest(string? message, List<string>? validationErrors = null)
        {
            return new ApiResponse<T>
            {
                Success = false,
                Message = message ?? "Bad Request.",
                ErrorType = ErrorResource.ErrorType.BadRequest,
                ValidationErrors = validationErrors
            };
        }
    }
}
