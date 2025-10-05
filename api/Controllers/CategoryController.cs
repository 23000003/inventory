using api.Dto;
using api.Exceptions;
using api.Helpers;
using api.Infrastructure.Model;
using api.Interfaces.Services;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace api.Controllers
{
    [Authorize]
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/category")]
    [Produces("application/json")]
    public class CategoryController : BaseController
    {
        private readonly ICategoryService _service;
        private readonly ILogger<CategoryController> _logger;

        public CategoryController(
            ILogger<CategoryController> logger,
            ICategoryService service
        )
        {
            _logger = logger;
            _service = service;
        }

        #region GetRequest
        [HttpGet]
        [Authorize(Roles = "Inventory, Sales")]
        public async Task<IActionResult> GetAllCategories(
            [FromQuery] Pagination pagination,
            [FromQuery] CategoryFilterRequestDto filter
        )
        {
            try
            {
                var res = await _service.GetAllCategory(pagination);
                
                return !res.Success ? GetActionResultError(res) : Ok(res);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500);
            }
        }

        //[HttpGet("{categoryId:int}")]
        //public ApiResponse<Category> GetCategory([FromRoute] int categoryId)
        //{
        //    try
        //    {
        //        var data = _repository.GetCategory(categoryId);
        //        return new ApiResponse<Category>
        //        {
        //            Success = true,
        //            Data = data
        //        };
        //    }
        //    catch (NotFoundException ex)
        //    {
        //        _logger.LogError(ex, "Exception: {ErrorMessage}", ex.Message);
        //        throw new NotFoundException(ex.Message);
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "Exception: {ErrorMessage}", ex.Message);
        //        throw new NotFoundException(ex.Message);
        //    }
        //}
        #endregion

        #region CreateRequest
        [HttpPost("create-category")]
        [Authorize(Roles = "Inventory")]
        public async Task<IActionResult> CreateCategory([FromBody] CategoryCreateRequestDto req)
        {
            try
            {
                var res = await _service.CreateCategory(req);
                return !res.Success ? GetActionResultError(res) : Ok(res);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500);
            }
        }
        #endregion

        #region UpdateRequest
        [HttpPatch("update-category/{categoryId:int}")]
        [Authorize(Roles = "Inventory")]
        public async Task<IActionResult> UpdateCategory(
            [FromBody] CategoryUpdateRequestDto req,
            [FromRoute] int categoryId
        )
        {
            try
            {
                var res = await _service.UpdateCategory(req, categoryId);

                return !res.Success ?
                    GetActionResultError(res) : 
                    Ok(res);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500);
            }
        }
        #endregion

        #region DeleteRequest
        [HttpDelete("delete-category/{categoryId:int}")]
        [Authorize(Roles = "Inventory")]
        public async Task<IActionResult> DeleteCategory([FromRoute] int categoryId)
        {
            try
            {
                var res = await _service.DeleteCategory(categoryId);

                return !res.Success ?
                    GetActionResultError(res) :
                    Ok(res);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500);
            }
        }
        #endregion
    }
}
