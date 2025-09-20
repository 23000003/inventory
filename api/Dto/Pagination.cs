using Microsoft.AspNetCore.Mvc;

namespace api.Dto
{
    public class Pagination
    {
        public const int MaxPageSize = 100;
        private int _pageSize = 10;
        
        [ModelBinder(Name = "page-number")]
        public int PageNumber { get; set; } = 1;
        
        [ModelBinder(Name = "page-size")]
        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = value > MaxPageSize
         ? MaxPageSize : value;
        }
    }

    public class PaginationDetails
    {
        public int PageNumber { get; set; }
        public int TotalPages { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }
        public bool HasPrevious => PageNumber > 1;
        public bool HasNext => PageNumber < TotalPages;
    }
}
