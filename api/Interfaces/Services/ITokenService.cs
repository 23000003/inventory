using api.Infrastructure.Model;

namespace api.Interfaces.Services
{
    public interface ITokenService
    {
        string GenerateToken(User user);
    }
}
