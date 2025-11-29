using System;

namespace api.Infrastructure.Model;

public class ChatRoom : EntityBase
{
  public string Name { get; set; } = default!;
  public ICollection<ChatMessages> Messages{ get; set; } = default!;
}
