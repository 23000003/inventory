using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace api.Dto
{
    public class CategoryFilterRequestDto
    {
        [ModelBinder(Name = "number_of_products")]
        [JsonPropertyName("number_of_products")]
        public int? NumberOfProducts { get; set; }
        
        [ModelBinder(Name = "is_descending")]
        [JsonPropertyName("is_descending")]
        public bool IsDecending { get; set; } = false;
    }

    public class CategoryCreateRequestDto
    {
        [Required, MaxLength(50)]
        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [JsonPropertyName("created_by")]
        public string CreatedBy { get; set; } = string.Empty;
    }

    public class CategoryUpdateRequestDto
    {
        [JsonPropertyName("name")]
        public string? Name { get; set; }

        [JsonPropertyName("description")]
        public string? Description { get; set; }
        
        [JsonPropertyName("number_of_products")]
        public int? NumberOfProducts { get; set; }
    }
}
