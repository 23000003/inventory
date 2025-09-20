using api.Dto;
using api.Infrastructure.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;

namespace api.Helpers
{
    public class PagedList<T> : List<T>
    {
        public PaginationDetails PaginationDetails { get; private set; }

        public PagedList(List<T> items, int count, int pageNumber, int pageSize)
        {
            PaginationDetails = new PaginationDetails
            {
                TotalCount = count,
                PageSize = pageSize,
                PageNumber = pageNumber,
                TotalPages = (int)Math.Ceiling(count / (double)pageSize),
            };
            AddRange(items);
        }
        public static PagedList<T> ToPagedList(IOrderedQueryable<T> source, int pageNumber, int pageSize)
        {
            var count = source.Count();
            var items = source.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
            return new PagedList<T>(items, count, pageNumber, pageSize);
        }

        public static async Task<PagedList<T>> ToPagedListAsync(IOrderedQueryable<T> source, int pageNumber, int pageSize)
        {
            var count = source.Provider is IAsyncQueryProvider
                ? await source.CountAsync()
                : source.Count();

            var items = await source.Skip((pageNumber - 1) * pageSize)
                                    .Take(pageSize)
                                    .ToListAsync();

            return new PagedList<T>(items, count, pageNumber, pageSize);
        }
    }
}
