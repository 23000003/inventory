
namespace api.Configurations
{
  public class JwtConfig
  {
    public string Secret { get; set; } = null!;
    public string Issuer { get; set; } = null!;
    public string Audience { get; set; } = null!;
    public string ExpiryInMinutes { get; set; } = null!;
  }
}