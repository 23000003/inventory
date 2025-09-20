using System;

namespace api.Infrastructure.Model;

public class Product
{
  public int Id { get; set; }
  public required string Name { get; set; }
  public required string Description { get; set;}
  public float Price { get; set; }
  public int Quantity { get; set; }
  public required string Image { get; set; }  
  public required string CreatedBy { get; set; }
  public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

  public int CategoryId { get; set; }
  public Category Category { get; set; } = default!;
}
