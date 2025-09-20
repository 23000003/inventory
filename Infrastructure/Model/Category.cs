using System;

namespace api.Infrastructure.Model;

public class Category
{
  public int Id { get; set; }
  public required string Name { get; set; }
  public required string Description { get; set; }
  public int NumberOfProducts { get; set; }
  public required string CreatedBy { get; set; }
  public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

  public ICollection<Product> Products;
}
