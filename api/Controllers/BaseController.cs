using api.Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static api.Helpers.ErrorResource;

namespace api.Controllers
{
    public class BaseController : ControllerBase
    {
        protected static IActionResult GetActionResultError<T>(ApiResponse<T> apiResponse)
        {
            return apiResponse.ErrorType switch
            {
                ErrorType.NotFound => new NotFoundObjectResult(apiResponse),
                ErrorType.BadRequest => new BadRequestObjectResult(apiResponse),
                _ => new BadRequestObjectResult(apiResponse)
            };
        }
    }
}
