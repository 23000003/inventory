using AutoMapper;

namespace api.Helpers
{
    // <summary>
    // AutoMapper converter to map PagedList<TSource> to PagedList<TDestination>
    // its like PagedList<OriginalModel> to PagedList<DtoModel> typeshittt
    // </summary>
    public class PagedListConverter<TSource, TDestination> : ITypeConverter<PagedList<TSource>, PagedList<TDestination>>
    {
        public PagedList<TDestination> Convert(PagedList<TSource> source, PagedList<TDestination> destination, ResolutionContext context)
        {
            return new PagedList<TDestination>(
                context.Mapper.Map<List<TDestination>>(source),
                source.PaginationDetails.TotalCount,
                source.PaginationDetails.PageNumber,
                source.PaginationDetails.PageSize
            );
        }
    }
}
