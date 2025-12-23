using System;
using api.Dto;
using api.Helpers;
using api.Infrastructure.Model;

namespace api.Interfaces.Services;

public interface IChatRoomService
{
  Task<ApiResponse<IEnumerable<ChatRoomDto>>> GetAllChatRooms(Pagination pagination);
  Task<ApiResponse<ChatRoomDto>> GetChatRoomById(string id, Pagination pagination);
  Task<ApiResponse<ChatRoomDto>> GetChatRoomByInitiatorId(int initiatorId, Pagination pagination);
}
