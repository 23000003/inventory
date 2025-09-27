using System;

namespace api.Infrastructure.Model;

public class Product : EntityBase
{
  public string Name { get; set; } = default!;
  public string Description { get; set;} = default!;
  public float Price { get; set; }
  public int Quantity { get; set; }
  public string Image { get; set; } = default!;

  public int CategoryId { get; set; }
  public Category Category { get; set; } = default!;
}
