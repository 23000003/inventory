using api.Dto;
using api.Helpers;
using api.Infrastructure.Model;
using api.Interfaces.Repositories;
using api.Interfaces.Services;
using AutoMapper;

namespace api.Services
{
    public class CategoryService : ICategoryService
    {

        private readonly ICategoryRepository _repository;
        private readonly IMapper _mapper;
        private readonly ILogger<CategoryService> _logger;

        public CategoryService(
            ICategoryRepository repository, 
            IMapper mapper, 
            ILogger<CategoryService> logger
        )
        {
            _repository = repository;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<ApiResponse<IEnumerable<Category>>> GetAllCategory(Pagination pagination)
        {
            try
            {
                var items = await _repository.GetAllAsync();

                return ApiResponse<IEnumerable<Category>>.SuccessResponse(
                    items, pagi: null
                );
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<ApiResponse<bool>> CreateCategory(CategoryCreateRequestDto categoryDto)
        {
            try
            {
                var newCategory = _mapper.Map<Category>(categoryDto);

                var query = _repository.GetQueryable()
                    .Where(c => c.Name == categoryDto.Name)
                    .FirstOrDefault();

                if (query != null)
                {
                    return ApiResponse<bool>.BadRequest(
                        ErrorResource.DATA_ALREADY_EXISTS("Category", categoryDto.Name)
                    );
                }

                await _repository.AddAsync(newCategory);
                return ApiResponse<bool>.SuccessResponse(true);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

        }

        public async Task<ApiResponse<bool>> UpdateCategory(CategoryUpdateRequestDto categoryDto, int id)
        {
            try
            {
                var old = await _repository.GetByIdAsync(id);

                if (old == null)
                    return ApiResponse<bool>.NotFound(
                        ErrorResource.RESOURCE_NOT_FOUND_WITH_ID("Category", id.ToString())
                    );

                old.Name = categoryDto.Name ?? old.Name;
                old.Description = categoryDto.Description ?? old.Description;
                old.NumberOfProducts = categoryDto.NumberOfProducts ?? old.NumberOfProducts;

                await _repository.UpdateAsync(old);

                return ApiResponse<bool>.SuccessResponse(true);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<ApiResponse<bool>> DeleteCategory(int id)
        {
            try
            {
                return await _repository.DeleteAsync(id) ?
                    ApiResponse<bool>.SuccessResponse(true) :
                    ApiResponse<bool>.NotFound(
                        ErrorResource.RESOURCE_NOT_FOUND_WITH_ID("Category", id.ToString())
                    );
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
