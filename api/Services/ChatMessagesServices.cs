using System;
using api.Dto;
using api.Infrastructure.Model;
using api.Interfaces.Repositories;
using api.Interfaces.Services;
using AutoMapper;

namespace api.Services;

public class ChatMessagesServices : IChatMessagesService
{
  private readonly IChatMessagesRepository _chatMessagesRepository;
  private readonly IChatRoomRepository _chatRoomRepository;

  public ChatMessagesServices(
    IChatMessagesRepository chatMessagesRepository,
    IChatRoomRepository chatRoomRepository
  )
  {
    _chatMessagesRepository = chatMessagesRepository;
    _chatRoomRepository = chatRoomRepository;
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
          CreatedBy = createdBy
        };

        await _chatMessagesRepository.AddAsync(newMessage);
      });
    }
    catch (Exception ex)
    {
      throw new Exception(ex.Message);
    }
  }

}
