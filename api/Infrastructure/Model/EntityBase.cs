using System;
using System.ComponentModel.DataAnnotations;

namespace api.Infrastructure.Model;

public class EntityBase
{
    [Key]
    public int Id { get; set;}
    public string CreatedBy { get; set; } = null!;
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
}
