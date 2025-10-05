using api.Dto;
using api.Helpers;
using api.Infrastructure.Model;
using Microsoft.AspNetCore.Mvc;

namespace api.Interfaces.Services
{
    public interface IProductService
    {
        Task<ApiResponse<IEnumerable<Product>>> GetAllProducts(
            Pagination pagination, 
            ProductFilterRequestDto filter
        );
        Task<ApiResponse<Product>> GetProductById(int id);
        Task<ApiResponse<bool>> CreateProduct(ProductCreateRequestDto productDto);
        Task<ApiResponse<bool>> CreateProductRange(List<ProductCreateRequestDto> productDto);
        Task<ApiResponse<bool>> UpdateProduct(ProductRequestUpdateDto productDto, int id);
        Task<ApiResponse<bool>> UpdateProductQuantity([FromBody] List<ProductRequestQuantityUpdateDto> productDto);
        Task<ApiResponse<bool>> DeleteProduct(int id);
    }
}
