using System;
using api.Infrastructure.Model;
using Microsoft.AspNetCore.Mvc;

namespace api.Dto;

public class ChatMessageDto
{
  public int Id { get; set; }
  public string RoomId { get; set; } = default!;
  public bool IsInventorySender { get; set; }
  public string Message { get; set; } = string.Empty;
  public bool IsRead { get; set; } = false;
  public DateTime CreatedDate { get; set;  } = DateTime.UtcNow;
}

public class ChatRoomDto
{
  public int Id { get; set; }
  public string RoomId { get; set; } = default!;
  public int InitiatorId { get; set; }
  public User Initiator { get; set; } = new(); // SALES user only
  public List<ChatMessageDto> Messages { get; set; } = new();
  public int TotalMessages { get; set; }
  public double UnreadMessages { get; set; }
}