using api.Dto;
using api.Exceptions;
using api.Helpers;
using api.Infrastructure.Interfaces;
using api.Infrastructure.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/category")]
    [ApiController]
    [Produces("application/json")]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryRepository _repository;
        private readonly ILogger<CategoryController> _logger;

        public CategoryController(
            ICategoryRepository repository,
            ILogger<CategoryController> logger
        )
        {
            _logger = logger;
            _repository = repository;
        }

        #region GetRequest
        [HttpGet]
        public ApiResponse<IEnumerable<Category>> GetAllCategories(
            [FromQuery] Pagination pagination,
            [FromQuery] CategoryFilterRequestDto filter
        )
        {
            try
            {
                var data = _repository.GetAllCategory(pagination, filter);
                return new ApiResponse<IEnumerable<Category>>
                {
                    Success = true,
                    Data = data
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception: {ErrorMessage}", ex.Message);
                throw new Exception(ex.Message);
            }
        }

        [HttpGet("{categoryId:int}")]
        public ApiResponse<Category> GetCategory([FromRoute] int categoryId)
        {
            try
            {
                var data = _repository.GetCategory(categoryId);
                return new ApiResponse<Category>
                {
                    Success = true,
                    Data = data
                };
            }
            catch (NotFoundException ex)
            {
                _logger.LogError(ex, "Exception: {ErrorMessage}", ex.Message);
                throw new NotFoundException(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception: {ErrorMessage}", ex.Message);
                throw new NotFoundException(ex.Message);
            }
        }
        #endregion

        #region CreateRequest
        [HttpPost("create-category")]
        public ApiResponse<Category> CreateCategory([FromBody] CategoryCreateRequestDto dto)
        {
            try
            {
                _repository.CreateCategory(dto);

                return new ApiResponse<Category>
                {
                    Success = true,
                    Message = "Category successfully created.",
                    Data = null
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception: {ErrorMessage}", ex.Message);
                throw new NotFoundException(ex.Message);
            }
        }
        #endregion

        #region UpdateRequest
        [HttpPatch("update-category/{categoryId:int}")]
        public ApiResponse<Category> UpdateCategory(
            [FromBody] CategoryUpdateRequestDto dto,
            [FromRoute] int categoryId
        )
        {
            try
            {
                if (
                    string.IsNullOrWhiteSpace(dto.Name) &&
                    string.IsNullOrWhiteSpace(dto.Description) &&
                    !dto.NumberOfProducts.HasValue
                )
                {
                    throw new BadRequestException("At least one field must have value.");
                }

                _repository.UpdateCategory(dto, categoryId);

                return new ApiResponse<Category>
                {
                    Success = true,
                    Message = "Category successfully updated.",
                    Data = null
                };
            }
            catch(BadRequestException ex)
            {
                _logger.LogError(ex, "Exception: {ErrorMessage}", ex.Message);
                throw new NotFoundException(ex.Message);
            }
            catch (NotFoundException ex)
            {
                _logger.LogError(ex, "Exception: {ErrorMessage}", ex.Message);
                throw new NotFoundException(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception: {ErrorMessage}", ex.Message);
                throw new NotFoundException(ex.Message);
            }
        }
        #endregion

        #region DeleteRequest
        [HttpDelete("delete-category/{categoryId:int}")]
        public ApiResponse<Category> DeleteCategory([FromRoute] int categoryId)
        {
            try
            {
                _repository.DeleteCategory(categoryId);

                return new ApiResponse<Category>
                {
                    Success = true,
                    Data = null,
                    Message = "Category Successfully Deleted."
                };
            }
            catch (NotFoundException ex)
            {
                _logger.LogError(ex, "Exception: {ErrorMessage}", ex.Message);
                throw new NotFoundException(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception: {ErrorMessage}", ex.Message);
                throw new NotFoundException(ex.Message);
            }
        }
        #endregion
    }
}
