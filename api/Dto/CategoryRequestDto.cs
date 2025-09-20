using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace api.Dto
{
    public class CategoryFilterRequestDto
    {
        [ModelBinder(Name = "number_of_products")]
        public int? NumberOfProducts { get; set; }
        
        [ModelBinder(Name = "is_descending")]
        public bool IsDecending { get; set; } = false;
    }

    public class CategoryCreateRequestDto
    {
        [Required, MaxLength(50)]
        [ModelBinder(Name = "name")]
        public string Name { get; set; } = string.Empty;

        [Required, MaxLength(100)]
        [ModelBinder(Name = "description")]
        public string Description { get; set; } = string.Empty;

        [Required] 
        [ModelBinder(Name = "number_of_products")]
        public int NumberOfProducts { get; set; }
        
        [Required]
        [ModelBinder(Name = "created_by")]
        public string CreatedBy { get; set; } = string.Empty;
    }

    public class CategoryUpdateRequestDto
    {
        [ModelBinder(Name = "name")]
        public string? Name { get; set; }

        [ModelBinder(Name = "description")]
        public string? Description { get; set; }
        
        [ModelBinder(Name = "number_of_products")]
        public int? NumberOfProducts { get; set; }
    }
}
