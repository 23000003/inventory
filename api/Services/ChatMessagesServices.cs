using System;
using api.Dto;
using api.Helpers;
using api.Infrastructure.Model;
using api.Interfaces.Repositories;
using api.Interfaces.Services;
using AutoMapper;

namespace api.Services;

public class ChatMessagesServices : IChatMessagesService
{
  private readonly IChatMessagesRepository _chatMessagesRepository;
  private readonly IChatRoomRepository _chatRoomRepository;
  private readonly WebSocketHelperManager _websocketManager;

  public ChatMessagesServices(
    IChatMessagesRepository chatMessagesRepository,
    IChatRoomRepository chatRoomRepository,
    WebSocketHelperManager websocketManager
  )
  {
    _chatMessagesRepository = chatMessagesRepository;
    _chatRoomRepository = chatRoomRepository;
    _websocketManager = websocketManager;
  }

  public async Task<ApiResponse<bool>> MarkMessagesAsRead(string chatRoomId, bool isInventory)
  {
    try
    {
      var chatRoom = await _chatRoomRepository.GetQueryable()
        .FirstOrDefaultAsync(c => c.RoomId == chatRoomId);

      if (chatRoom == null)
        return ApiResponse<bool>.NotFound("Chat room not found");

      await _chatMessagesRepository.MarkMessagesAsRead(chatRoom!.Id, isInventory);

      return ApiResponse<bool>.SuccessResponse(true);
    }
    catch
    {
      throw;
    }
  }

  public async Task SendMessage(ChatMessageDto chatDto, int initiatorId)
  {
    try
    {
      var chatRoom = await _chatRoomRepository.GetQueryable()
        .FirstOrDefaultAsync(c => c.RoomId == chatDto.RoomId);

      await _chatMessagesRepository.ExecuteInTransactionAsync(async () =>
      {
        int chatRoomId;
        var createdBy = chatDto.IsInventorySender ? "Inventory" : "User";

        if (chatRoom == null)
        {
          var newRoom = new ChatRoom
          {
            RoomId = chatDto.RoomId,
            InitiatorId = initiatorId,
            CreatedBy = createdBy
          };
          
          await _chatRoomRepository.AddAsync(newRoom);
          await _chatRoomRepository.SaveChangesAsync();
          
          chatRoomId = newRoom.Id;
        }
        else
          chatRoomId = chatRoom.Id;

        var newMessage = new ChatMessages
        {
          RoomId = chatRoomId,
          IsInventorySender = chatDto.IsInventorySender,
          Message = chatDto.Message,
          CreatedBy = createdBy,
          IsRead = chatDto.IsRead
        };

        await _chatMessagesRepository.AddAsync(newMessage);
      });

      Console.WriteLine($"Message: {chatDto.Message}, IsRead: {chatDto.IsRead}");

      // if(chatDto.IsRead == false)
      //   await _websocketManager.BroadcastAsync(QueryClientKeys.GET_ALL_CHAT_ROOMS);
      // else
      // {
      //   var hasUnreadMessages = await _chatMessagesRepository.GetQueryable()
      //     .AnyAsync(m => 
      //       m.RoomId == chatRoom!.Id && 
      //       !m.IsRead && 
      //       m.IsInventorySender != chatDto.IsInventorySender
      //     );

      //   Console.WriteLine($"Has Unread Messages: {hasUnreadMessages}");

      //   if (hasUnreadMessages)
      //   {
      //     var result = await _chatMessagesRepository.MarkMessagesAsRead(chatRoom!.Id, chatDto.IsInventorySender);
      //     Console.WriteLine($"Mark Messages As Read Result: {result}");
      //     if(result)
      //       await _websocketManager.BroadcastAsync(QueryClientKeys.GET_ALL_CHAT_ROOMS);
      //   }
      // }
      await _chatMessagesRepository.MarkMessagesAsRead(chatRoom!.Id, chatDto.IsInventorySender);
      await _websocketManager.BroadcastAsync(QueryClientKeys.GET_ALL_CHAT_ROOMS);
    }
    catch
    {
      throw;
    }
  }

}
