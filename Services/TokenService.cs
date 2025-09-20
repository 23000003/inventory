using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using api.Interfaces;
using Microsoft.CodeAnalysis.Options;
using api.Configurations;
using Microsoft.Extensions.Options;

namespace api.Services
{
    public class TokenService : ITokenService
    {
        private readonly JwtConfig _jwtConfig;

        public TokenService(IOptions<JwtConfig> options)
        {
            _jwtConfig = options.Value;
        }

        public string GenerateToken(string username)
        {
            var issuer = _jwtConfig.Issuer;
            var audience = _jwtConfig.Audience;
            var key = _jwtConfig.Secret;
            var expiryTimestamp = DateTime.UtcNow.AddMinutes(6000);

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim("username", username)
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = expiryTimestamp,
                Issuer = issuer,
                Audience = audience,
                SigningCredentials = credentials
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            
            return tokenHandler.WriteToken(token);
        }
    }
}
