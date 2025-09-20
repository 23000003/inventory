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

        [Range(0.001, 1000)]
        [ModelBinder(Name = "price")]
        public float Price { get; set; }

        [Required]
        [ModelBinder(Name = "quantity")]
        public int Quantity { get; set; }

        [Required]
        [ModelBinder(Name = "image")]
        public string Image { get; set; } = string.Empty;

        [Required]
        [ModelBinder(Name = "created_by")]
        public string CreatedBy { get; set; } = string.Empty;

        [Required]
        [ModelBinder(Name = "category_id")]
        public int CategoryId { get; set; }
    }

    public class ProductFilterRequestDto
    {
        [ModelBinder(Name = "price")]
        public string? Price { get; set; }

        [ModelBinder(Name = "quantity")]
        public string? Quantity { get; set; }

        [ModelBinder(Name = "is_descending")]
        public bool IsDecending { get; set; } = false;
    }

    public class ProductRequestUpdateDto
    {
        [ModelBinder(Name = "name")]
        public string? Name { get; set; }

        [ModelBinder(Name = "description")]
        public string? Description { get; set; }

        [ModelBinder(Name = "price")]
        [Range(0.001, 1000)] 
        public float? Price { get; set; }

        [ModelBinder(Name = "quantity")]
        public int? Quantity { get; set; }

        [ModelBinder(Name = "image")]
        public string? Image { get; set; }

        [ModelBinder(Name = "category_id")]
        public int? CategoryId { get; set; }
    }

}
