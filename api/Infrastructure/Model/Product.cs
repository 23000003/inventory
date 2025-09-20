using System;

namespace api.Infrastructure.Model;

public class Product
{
  public int Id { get; set; }
  public string Name { get; set; } = default!;
  public string Description { get; set;} = default!;
  public float Price { get; set; }
  public int Quantity { get; set; }
  public string Image { get; set; } = default!;
  public string CreatedBy { get; set; } = default!;
  public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

  public int CategoryId { get; set; }
  public Category Category { get; set; } = default!;
}
