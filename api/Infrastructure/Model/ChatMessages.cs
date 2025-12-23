using System;

namespace api.Infrastructure.Model;

public class ChatMessages : EntityBase
{
  public bool IsInventorySender { get; set; }
  public string Message { get; set; } = default!;
  public int RoomId { get; set;} = default!;
  public bool IsRead { get; set; } = false;
  public ChatRoom? ChatRoom { get; set; }
}
