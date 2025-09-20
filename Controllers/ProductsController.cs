using api.Dto;
using api.Exceptions;
using api.Helpers;
using api.Infrastructure.Interfaces;
using api.Infrastructure.Model;
using Humanizer;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/products")]
    [ApiController]
    [Produces("application/json")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductRepository _repository;
        private readonly ILogger<ProductsController> _logger;
        public ProductsController(
            IProductRepository repository,
            ILogger<ProductsController> logger
        )
        {
            _logger = logger;
            _repository = repository;
        }

        #region GetRequest
        [HttpGet]
        public ApiResponse<IEnumerable<Product>> GetAllProducts(
            [FromQuery] Pagination pagination,
            [FromQuery] ProductFilterRequestDto filter
        )
        {
            try
            {
                var data = _repository.GetAllProducts(pagination, filter);

                return new ApiResponse<IEnumerable<Product>>
                {
                    Data = data,
                    Success = true,
                    Pagination = data.PaginationDetails
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception: {ErrorMessage}", ex.Message);
                throw new Exception(ex.Message);
            }
        }

        [HttpGet("{productId:int}")]
        public IActionResult GetProduct([FromRoute] int productId)
        {
            var data = _repository.GetProduct(productId);
            if (data == null)
            {
                return NotFound("Product not found");
            }
            return Ok(data);
        }
        #endregion

        #region PostRequest
        [HttpPost("create-product")]
        public ApiResponse<Product> CreateProduct([FromBody] ProductCreateRequestDto dto)
        {
            try
            {
                _repository.CreateProduct(dto);
                return new ApiResponse<Product>
                {
                    Data = null,
                    Message = "Product created successfully",
                    Success = true,
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception: {ErrorMessage}", ex.Message);
                throw new Exception(ex.Message);
            }
        }
        #endregion

        #region PatchRequest
        [HttpPatch("update-product/{productId:int}")]
        public ApiResponse<Product> UpdateProduct(
            [FromBody] ProductRequestUpdateDto dto,
            [FromRoute] int productId
        )
        {
            try
            {
                if (
                string.IsNullOrWhiteSpace(dto.Name) &&
                string.IsNullOrWhiteSpace(dto.Description) &&
                string.IsNullOrWhiteSpace(dto.Image) &&
                !dto.Price.HasValue &&
                !dto.Quantity.HasValue &&
                !dto.CategoryId.HasValue
            )
                {
                    throw new BadRequestException("At least one field should have a value.");
                }

                _repository.UpdateProduct(dto, productId);

                return new ApiResponse<Product>
                {
                    Data = null,
                    Success = true,
                    Message = "Product updated successfully."
                };
            }
            catch (NotFoundException ex)
            {
                _logger.LogError(ex, "Exception: {ErrorMessage}", ex.Message);
                throw new NotFoundException(ex.Message);
            }
            catch (BadRequestException ex)
            {
                _logger.LogError(ex, "Exception: {ErrorMessage}", ex.Message);
                throw new BadRequestException(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception: {ErrorMessage}", ex.Message);
                throw new Exception(ex.Message);
            }
        }
        #endregion

        #region DeleteRequest
        [HttpDelete("delete-product/{productId:int}")]
        public ApiResponse<Product> DeleteProduct([FromRoute] int productId)
        {
            try
            {
                _repository.DeleteProduct(productId);

                return new ApiResponse<Product>
                {
                    Data = null,
                    Message = "Product deleted successfully.",
                    Success = true,
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
                throw new Exception(ex.Message);
            }
        }
        #endregion
    }
}
