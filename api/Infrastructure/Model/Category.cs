using System;

namespace api.Infrastructure.Model;

public class Category : EntityBase
{
  public string Name { get; set; } = null!;
  public string Description { get; set; } = null!;
  public int NumberOfProducts { get; set; }

  public ICollection<Product> Products = default!;
}
