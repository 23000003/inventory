using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace api.Dto
{
    public class ProductCreateRequestDto
    {
        [Required, MaxLength(50)]
        [ModelBinder(Name = "name")]
        public string Name { get; set; } = string.Empty;

        [Required, MaxLength(100)]
        [ModelBinder(Name = "description")]
        public string Description { get; set; } = string.Empty;

        [Range(0.001, 10000000)]
        [ModelBinder(Name = "price")]
        public float Price { get; set; }

        [Required]
        [ModelBinder(Name = "quantity")]
        public int Quantity { get; set; }

        [Required]
        [ModelBinder(Name = "image")]
        public IFormFile Image { get; set; } = default!;

        [Required]
        [ModelBinder(Name = "created_by")]
        public string CreatedBy { get; set; } = string.Empty;

        [Required]
        [ModelBinder(Name = "category_id")]
        public int CategoryId { get; set; }
    }

    public class ProductFilterRequestDto
    {
        [ModelBinder(Name = "price-range")]
        public string? PriceRange { get; set; }

        [ModelBinder(Name = "category")]
        public string? Category { get; set; }

        [ModelBinder(Name = "sort-by")]
        public string? SortBy { get; set; }

        [ModelBinder(Name = "search")]
        public string? Search { get; set; }
    }

    public class ProductRequestUpdateDto
    {
        [ModelBinder(Name = "name")]
        public string? Name { get; set; }

        [ModelBinder(Name = "description")]
        public string? Description { get; set; }

        [ModelBinder(Name = "price")]
        [Range(0.001, 10000000)] 
        public float? Price { get; set; }

        [ModelBinder(Name = "quantity")]
        public int? Quantity { get; set; }

        [ModelBinder(Name = "image")]
        public IFormFile? Image { get; set; }

        [ModelBinder(Name = "category_id")]
        public int? CategoryId { get; set; }
    }

    public class ProductRequestQuantityUpdateDto
    {
        [ModelBinder(Name = "id")]
        public int Id { get; set; }

        [ModelBinder(Name = "name")]
        public string Name { get; set; } = string.Empty;

        [ModelBinder(Name = "quantity")]
        public int Quantity { get; set; }
    }
}
