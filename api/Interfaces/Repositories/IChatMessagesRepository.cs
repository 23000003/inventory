using System;
using api.Infrastructure.Model;

namespace api.Interfaces.Repositories;

public interface IChatMessagesRepository : IBaseRepository<ChatMessages>
{
  Task<bool> MarkMessagesAsRead(int chatRoomId, bool isInventory);
}
