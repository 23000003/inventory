using System.ComponentModel.DataAnnotations;

namespace api.Infrastructure.Model
{
    public static class Roles
    {
        public const string Inventory = "Inventory";
        public const string Sales = "Sales";
    }

    public class Login
    {
        [Required]
        public string Username { get; set; } = null!;
        [Required]
        public string Password { get; set; } = null!;
    }

    public class User
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public string Username { get; set; } = null!;
        [Required]
        public string Password { get; set; } = null!;
        [Required]
        public string Role { get; set; } = null!;
    }
}
