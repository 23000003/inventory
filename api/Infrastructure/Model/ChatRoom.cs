using System;

namespace api.Infrastructure.Model;

public class ChatRoom : EntityBase
{
  public string RoomId { get; set; } = default!;
  public int InitiatorId { get; set; }
  public User Initiator { get; set; } = default!;
  public ICollection<ChatMessages> Messages{ get; set; } = default!;
}
