using api.Dto;
using api.Helpers;
using api.Infrastructure.Model;

namespace api.Interfaces.Services
{
    public interface ICategoryService
    {
        Task<ApiResponse<IEnumerable<Category>>> GetAllCategory(Pagination pagination);
        Task<ApiResponse<bool>> CreateCategory(CategoryCreateRequestDto categoryDto);
        Task<ApiResponse<bool>> UpdateCategory(CategoryUpdateRequestDto categoryDto, int id);
        Task<ApiResponse<bool>> DeleteCategory(int id);
    }
}
