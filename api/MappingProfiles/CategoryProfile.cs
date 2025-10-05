using api.Dto;
using api.Infrastructure.Model;
using AutoMapper;

namespace api.MappingProfiles
{
    public class CategoryProfile : Profile
    {
        public CategoryProfile()
        {
            CreateMap<CategoryCreateRequestDto, Category>();
        }

    }
}
