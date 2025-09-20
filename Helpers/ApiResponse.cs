using api.Dto;

namespace api.Helpers
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public T? Data { get; set; }
        public PaginationDetails? Pagination { get; set; }
    }
}
