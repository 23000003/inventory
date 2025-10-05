using AutoMapper;

namespace api.Helpers
{
    // <summary>
    // AutoMapper converter to map PagedList<TSource> to PagedList<TDestination>
    // its like PagedList<OriginalModel> to PagedList<DtoModel> typeshittt
    // </summary>
    public class PagedListConverter<TSource, TDestination> : ITypeConverter<PaginatedList<TSource>, PaginatedList<TDestination>>
    {
        public PaginatedList<TDestination> Convert(PaginatedList<TSource> source, PaginatedList<TDestination> destination, ResolutionContext context)
        {
            return new PaginatedList<TDestination>(
                context.Mapper.Map<List<TDestination>>(source),
                source.PaginationDetails.TotalCount,
                source.PaginationDetails.PageNumber,
                source.PaginationDetails.PageSize
            );
        }
    }
}
