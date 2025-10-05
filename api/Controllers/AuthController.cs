using api.Helpers;
using api.Infrastructure.Model;
using api.Interfaces.Services;
using Asp.Versioning;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static api.Helpers.ErrorResource;

namespace api.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/auth")]
    [Produces("application/json")]
    public class AuthController : BaseController
    {
        private readonly List<User> _users = new List<User>()
        {
            new User { Id = 1, Username = "Kenny123", Password = "password123", Role = Roles.Inventory },
            new User { Id = 2, Username = "Yosep", Password = "password123", Role = Roles.Sales },
            new User { Id = 3, Username = "Clarence", Password = "password123", Role = Roles.Sales }
        };
        private readonly ITokenService _tokenService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(ITokenService tokenService, ILogger<AuthController> logger)
        {
            _tokenService = tokenService;
            _logger = logger;
        }


        [HttpPost("login")]
        public IActionResult Login([FromBody] Login user)
        {
            try
            {
                var matchedUser = _users.FirstOrDefault(
                    u => u.Username == user.Username && 
                    u.Password == user.Password
                );

                if (matchedUser != null)
                {
                    var token = _tokenService.GenerateToken(matchedUser);
                    var successResponse = ApiResponse<string>.SuccessResponse(token, "Login successful");
                    return Ok(successResponse);
                }

                var errorResponse = ApiResponse<string>.NotFound("User");

                return GetActionResultError(errorResponse);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500);
            }
        }

    }
}
