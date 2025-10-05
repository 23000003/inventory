using api.Dto;
using api.Infrastructure.Model;
using AutoMapper;

namespace api.MappingProfiles
{
    public class ProductProfile : Profile
    {
        public ProductProfile()
        {
            CreateMap<ProductCreateRequestDto, Product>()
                .ForMember(dest => dest.Image, opt => opt.Ignore());
        }
    }
}
