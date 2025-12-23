using api.Dto;
using api.Infrastructure.Model;
using AutoMapper;

namespace api.MappingProfiles
{
    public class ChatProfile : Profile
    {
        public ChatProfile()
        {
            CreateMap<ChatRoom, ChatRoomDto>()
                .ForMember(dest => dest.Messages,
                        opt => opt.MapFrom(src => src.Messages));

            CreateMap<ChatMessages, ChatMessageDto>();
        }
    }
}
