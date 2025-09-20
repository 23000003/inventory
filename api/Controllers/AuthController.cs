using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using api.Infrastructure.Model;
using api.Interfaces;

namespace api.Controllers
{
    [Route("api/auth")]
    [ApiController]
    [Produces("application/json")]
    public class AuthController : ControllerBase
    {
        private readonly List<User> _users = new List<User>()
        {
            new User { Username = "Kenny123", Password = "password123" },
            new User { Username = "Yosep", Password = "qwerty" },
            new User { Username = "Clarence", Password = "abc123" }
        };
        private readonly ITokenService _tokenService;

        public AuthController(ITokenService tokenService)
        {
            _tokenService = tokenService;
        }


        [HttpPost("login")]
        public IActionResult Login([FromBody] User user)
        {
            if(_users.Any(u => u.Username == user.Username && u.Password == user.Password))
            {
                var token = _tokenService.GenerateToken(user.Username);
                return Ok(new { token });
            }

            return NotFound("Invalid Credentials");
        }

    }
}
