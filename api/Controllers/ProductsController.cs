using api.Dto;
using api.Exceptions;
using api.Helpers;
using api.Infrastructure.Model;
using api.Interfaces.Repositories;
using api.Interfaces.Services;
using Asp.Versioning;
using Humanizer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel;

namespace api.Controllers
{
    [Authorize]
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/products")]
    [Produces("application/json")]
    public class ProductsController : BaseController
    {
        private readonly IProductService _service;
        private readonly ILogger<ProductsController> _logger;
        public ProductsController(
            IProductService service,
            ILogger<ProductsController> logger
        )
        {
            _logger = logger;
            _service = service;
        }

        #region Get Request
        [HttpGet]
        [Authorize(Roles = "Inventory,Sales")]
        public async Task<IActionResult> GetAllProducts(
            [FromQuery] Pagination pagination,
            [FromQuery] ProductFilterRequestDto filter
        )
        {
            try
            {
                var res = await _service.GetAllProducts(pagination, filter);

                return !res.Success ? GetActionResultError(res) : Ok(res);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500);
            }
        }

        [HttpGet("{productId:int}")]
        [Authorize(Roles = "Inventory,Sales")]
        public async Task<IActionResult> GetProduct([FromRoute] int productId)
        {
            try
            {
                var res = await _service.GetProductById(productId);

                return !res.Success ? GetActionResultError(res) : Ok(res);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500);
            }
            
        }
        #endregion

        #region Post Request
        [HttpPost("create-product")]
        [Authorize(Roles = "Inventory")]
        public async Task<IActionResult> CreateProduct([FromForm] ProductCreateRequestDto req)
        {
            try
            {
                var res = await _service.CreateProduct(req);

                return !res.Success ? GetActionResultError(res) : Ok(res);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500);
            }
        }

        [HttpPost("create-products-bulk")]
        [Authorize(Roles = "Inventory")]
        public async Task<IActionResult> CreateProductsBulk([FromForm] List<ProductCreateRequestDto> req)
        {
            try
            {
                var res = await _service.CreateProductRange(req);

                return !res.Success ? GetActionResultError(res) : Ok(res);
            }
            catch(Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500);
            }
        }
        #endregion

        #region Update Request
        [HttpPut("update-product/{productId:int}")]
        [Authorize(Roles = "Inventory")]
        public async Task<IActionResult> UpdateProduct(
            [FromBody] ProductRequestUpdateDto req,
            [FromRoute] int productId
        )
        {
            try
            {
                var res = await _service.UpdateProduct(req, productId);

                return !res.Success ? GetActionResultError(res) : Ok(res);
            }
            catch(Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500);
            }
        }

        [HttpPatch("update-quantity-bulk")]
        [Authorize(Roles = "Sales")]
        public async Task<IActionResult> UpdateProductQuantity([FromBody] List<ProductRequestQuantityUpdateDto> req)
        {
            try
            {
                var res = await _service.UpdateProductQuantity(req);

                return !res.Success ? GetActionResultError(res) : Ok(res);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500);
            }
        }
        #endregion

        #region Delete Request
        [Authorize(Roles = "Inventory")]
        [HttpDelete("delete-product/{productId:int}")]
        public async Task<IActionResult> DeleteProduct([FromRoute] int productId)
        {
            try
            {
                var res = await _service.DeleteProduct(productId);

                return !res.Success ? GetActionResultError(res) : Ok(res);
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
