using System;
using api.Dto;
using api.Helpers;
using api.Infrastructure.Model;
using api.Interfaces.Repositories;
using api.Interfaces.Services;
using AutoMapper;

namespace api.Services;

public class ChatRoomService : IChatRoomService
{
  private readonly IChatRoomRepository _chatRoomRepository;
  private readonly IChatMessagesRepository _chatMessagesRepository;

  public ChatRoomService(
    IChatRoomRepository chatRoomRepository, 
    IChatMessagesRepository chatMessagesRepository
  )
  {
    _chatRoomRepository = chatRoomRepository;
    _chatMessagesRepository = chatMessagesRepository;
  }

  public async Task<ApiResponse<IEnumerable<ChatRoomDto>>> GetAllChatRooms(Pagination pagination)
  {
    try
    {
      var chatRooms = await _chatRoomRepository.GetQueryable(false)
        .OrderByDescending(c =>
          c.Messages.Max(m => (DateTime?)m.CreatedDate)
        )
        .Select(c => new ChatRoomDto
        {
          RoomId = c.RoomId,
          InitiatorId = c.InitiatorId,
          Initiator = new User
          {
            Id = c.Initiator.Id,
            Username = c.Initiator.Username
          },
          UnreadMessages = c.Messages.Count(m => !m.IsRead && !m.IsInventorySender)
        })
        .Skip((pagination.PageNumber - 1) * pagination.PageSize)
        .Take(pagination.PageSize)
        .ToListAsync();

      return ApiResponse<IEnumerable<ChatRoomDto>>.SuccessResponse(chatRooms);
    }
    catch
    {
      throw;
    }
  }

  public async Task<ApiResponse<ChatRoomDto>> GetChatRoomById(string id, Pagination pagination)
  {
    try
    {
      var query = _chatRoomRepository.GetQueryable();

      if (!await query.AnyAsync(c => c.RoomId == id))
      {
        return ApiResponse<ChatRoomDto>.NotFound("Chat room not found.");
      }

      var chatRoom = await ChatRoomQueryBuilder(pagination)
        .Where(c => c.RoomId == id)
        .FirstOrDefaultAsync();

      chatRoom!.Messages = chatRoom.Messages
        .OrderBy(m => m.CreatedDate)
        .ToList();

      return ApiResponse<ChatRoomDto>.SuccessResponse(chatRoom!);
    }
    catch
    {
      throw;
    }
  }
  public async Task<ApiResponse<ChatRoomDto>> GetChatRoomByInitiatorId(int initiatorId, Pagination pagination)
  {
    try
    {
      var chatroom = await _chatRoomRepository.GetQueryable(false)
        .AnyAsync(c => c.InitiatorId == initiatorId);

      if (!chatroom)
        return ApiResponse<ChatRoomDto>.SuccessResponse(null!);

      var chatRoom = await ChatRoomQueryBuilder(pagination)
        .Where(c => c.InitiatorId == initiatorId)
        .FirstOrDefaultAsync();

      chatRoom!.Messages = chatRoom.Messages
        .OrderBy(m => m.CreatedDate)
        .ToList();

      return ApiResponse<ChatRoomDto>.SuccessResponse(chatRoom!);
    }
    catch
    {
      throw;
    }
  }

  private IOrderedQueryable<ChatRoomDto> ChatRoomQueryBuilder(Pagination pagination)
  {
    var query = _chatRoomRepository.GetQueryable(true);

    var orderedQuery = query
      .Select(c => new ChatRoomDto
      {
        RoomId = c.RoomId,
        InitiatorId = c.InitiatorId,
        Initiator = new User
        {
          Id = c.Initiator.Id,
          Username = c.Initiator.Username
        },
        TotalMessages = c.Messages.Count,
        Messages = c.Messages
          .OrderByDescending(m => m.CreatedDate)
          .Skip((pagination.PageNumber - 1) * pagination.PageSize)
          .Take(pagination.PageSize)
          .Select(m => new ChatMessageDto
          {
            Id = m.Id,
            RoomId = m.ChatRoom!.RoomId,
            Message = m.Message,
            IsRead = m.IsRead,
            CreatedDate = m.CreatedDate,
            IsInventorySender = m.IsInventorySender
          })
          .ToList(),
        UnreadMessages = c.Messages
          .Count(m => !m.IsRead && !m.IsInventorySender)
      })
      .OrderByDescending(c => c.Messages.Max(m => m.CreatedDate));

    return orderedQuery;
  }
}
