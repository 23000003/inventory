using System;
using api.Dto;
using api.Helpers;

namespace api.Interfaces.Services;

public interface IChatMessagesService
{
  Task SendMessage(ChatMessageDto chatDto, int initiatorId);
  Task<ApiResponse<bool>> MarkMessagesAsRead(string chatRoomId, bool isInventory);
}
