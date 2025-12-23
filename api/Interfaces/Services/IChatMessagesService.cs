using System;
using api.Dto;

namespace api.Interfaces.Services;

public interface IChatMessagesService
{
  Task SendMessage(ChatMessageDto chatDto, int initiatorId);
}
