using System;

namespace api.Infrastructure.Model;

public class ChatMessages : EntityBase
{
  public bool IsInventorySender { get; set; }
  public string Message { get; set; } = default!;
  public string ChatId { get; set;} = default!;
  public ChatRoom ChatRoom{ get; set; } = default!;
}
