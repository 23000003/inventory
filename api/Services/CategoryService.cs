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
        private readonly IProductRepository _productRepository;

        public CategoryService(
            ICategoryRepository repository, 
            IMapper mapper, 
            ILogger<CategoryService> logger,
            IProductRepository productRepository
        )
        {
            _repository = repository;
            _mapper = mapper;
            _logger = logger;
            _productRepository = productRepository;
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

                newCategory.Description = "dwa";
                newCategory.NumberOfProducts = 0;
                newCategory.CreatedDate = DateTime.UtcNow;

                await _repository.AddAsync(newCategory);
                await _repository.SaveChangesAsync();
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
                await _repository.SaveChangesAsync();

                return ApiResponse<bool>.SuccessResponse(true);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<ApiResponse<Category>> UpdateCategoryNumberOfProducts(int id, int num)
        {
            try
            {
                var category = await _repository.GetByIdAsync(id);

                if (category == null)
                    return ApiResponse<Category>.NotFound(
                        ErrorResource.RESOURCE_NOT_FOUND_WITH_ID("Category", id.ToString())
                    );

                category.NumberOfProducts += num;
                await _repository.UpdateAsync(category);

                return ApiResponse<Category>.SuccessResponse(category);
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
                var category = await _repository.GetByIdAsync(id, true);
                if (category == null)
                    return ApiResponse<bool>.NotFound(
                        ErrorResource.RESOURCE_NOT_FOUND_WITH_ID("Category", id.ToString())
                    );

                await _repository.ExecuteInTransactionAsync(async () =>
                {
                    var products = _productRepository.GetQueryable()
                        .Where(p => p.CategoryId == category.Id)
                        .ToList();

                    foreach (var product in products)
                    {
                        await _productRepository.DeleteAsync(product.Id);
                    }
                    await _repository.DeleteAsync(category.Id);
                });
                
                return ApiResponse<bool>.SuccessResponse(true);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
