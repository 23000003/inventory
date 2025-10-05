using api.Dto;
using api.Helpers;
using api.Infrastructure.Model;
using api.Interfaces.Repositories;
using api.Interfaces.Services;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace api.Services
{
    public class ProductService : IProductService
    {

        private readonly IProductRepository _repository;
        private readonly ILogger<ProductService> _logger;
        private readonly IMapper _mapper;
        private readonly ICloudinaryService _cloudinaryService;

        public ProductService(
            IProductRepository repository, 
            ILogger<ProductService> logger, 
            IMapper mapper,
            ICloudinaryService cloudinaryService
        )
        {
            _logger = logger;
            _mapper = mapper;
            _repository = repository;
            _cloudinaryService = cloudinaryService;
        }

        #region Get Product
        public async Task<ApiResponse<IEnumerable<Product>>> GetAllProducts(
            Pagination pagination,
            ProductFilterRequestDto filter
        )
        {
            try
            {
                var query = _repository.GetQueryable(true);

                if (!string.IsNullOrEmpty(filter.PriceRange))
                {
                    var priceRange = filter.PriceRange.Split('-');

                    if (priceRange.Length == 2 &&
                        float.TryParse(priceRange[0], out float minPrice) &&
                        float.TryParse(priceRange[1], out float maxPrice))
                    {
                        query = query.Where(p => p.Price >= minPrice && p.Price <= maxPrice);
                    }
                }

                if (!string.IsNullOrEmpty(filter.Category))
                {
                    query = query.Where(p => p.Category.Name == filter.Category);
                }

                if (!string.IsNullOrEmpty(filter.Search))
                {
                    query = query.Where(p => p.Name.Contains(filter.Search));
                }

                var orderedQuery = filter.SortBy switch
                {
                    "name-a-z" => query.OrderBy(p => p.Name),
                    "name-z-a" => query.OrderByDescending(p => p.Name),
                    "lowest-stock" => query.OrderBy(p => p.Quantity),
                    "highest-stock" => query.OrderByDescending(p => p.Quantity),
                    "price-low-to-high" => query.OrderBy(p => p.Price),
                    "price-high-to-low" => query.OrderByDescending(p => p.Price),
                    "recently-added" => query.OrderByDescending(p => p.CreatedDate),
                    "oldest-added" => query.OrderBy(p => p.CreatedDate),
                    _ => query.OrderByDescending(p => p.CreatedDate),
                };

                var pagedList = await PaginatedList<Product>.ToPagedListAsync(
                    orderedQuery,
                    pagination.PageNumber,
                    pagination.PageSize
                );

                return ApiResponse<IEnumerable<Product>>.SuccessResponse(
                    pagedList,
                    "Fetched products successfully",
                    pagedList.PaginationDetails
                );
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<ApiResponse<Product>> GetProductById(int id)
        {
            try
            {
                var product = await _repository.GetByIdAsync(id, true);

                if(product == null)
                {
                    return ApiResponse<Product>.NotFound(
                        ErrorResource.RESOURCE_NOT_FOUND_WITH_ID("Product", id.ToString())
                    );
                }

                return ApiResponse<Product>.SuccessResponse(product);
            }
            catch(Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        #endregion

        #region Create Product
        public async Task<ApiResponse<bool>> CreateProduct(ProductCreateRequestDto productDto)
        {
            try
            {
                var query = _repository.GetQueryable()
                    .Where(x => 
                        x.Name == productDto.Name && 
                        x.Description == productDto.Description
                    )
                    .FirstOrDefault();

                if (query != null)
                {
                    return ApiResponse<bool>.BadRequest(
                        ErrorResource.DATA_ALREADY_EXISTS("Product", productDto.Name)
                    );
                }

                var newProduct = _mapper.Map<Product>(productDto);

                var imageUrl = await _cloudinaryService.UploadImageAsync(productDto.Image);

                if(imageUrl == null)
                {
                    return ApiResponse<bool>.BadRequest("Error uploading image in cloudinary");
                }

                newProduct.Image = imageUrl;

                await _repository.AddAsync(newProduct);
                return ApiResponse<bool>.SuccessResponse(true);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<ApiResponse<bool>> CreateProductRange(List<ProductCreateRequestDto> productDtos)
        {
            try
            {
                var products = _mapper.Map<IEnumerable<Product>>(productDtos);

                var existingProducts = new List<Product>();

                var query = _repository.GetQueryable();

                foreach (var product in products)
                {
                    var exists = query.Where(x =>
                        x.Name == product.Name &&
                        x.Description == product.Description
                    ).Any();

                    if (exists)
                    {
                        existingProducts.Add(product);
                        continue;
                    }

                    var getImageFile = productDtos.Where(x =>
                        x.Name == product.Name &&
                        x.Description == product.Description
                    ).FirstOrDefault();

                    var imageUrl = await _cloudinaryService.UploadImageAsync(getImageFile.Image);

                    if (imageUrl == null)
                    {
                        return ApiResponse<bool>.BadRequest("Error uploading image in cloudinary");
                    }

                    product.Image = imageUrl;
                }

                if (existingProducts.Count > 0)
                {
                    var errors = existingProducts.Select(p => 
                        ErrorResource.DATA_ALREADY_EXISTS("Product", p.Name)
                    ).ToList();

                    return ApiResponse<bool>.BadRequest("Duplicate products found.", errors);
                }

                await _repository.ExecuteInTransactionAsync(async () =>
                {
                    await _repository.AddRangeAsync(products);
                });

                return ApiResponse<bool>.SuccessResponse(true);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }


        #endregion

        #region Update Product
        public async Task<ApiResponse<bool>> UpdateProduct(ProductRequestUpdateDto productDto, int id)
        {
            try
            {
                var oldProduct = await _repository.GetByIdAsync(id);

                if(oldProduct == null)
                    return ApiResponse<bool>.NotFound(
                        ErrorResource.RESOURCE_NOT_FOUND_WITH_ID("Product", id.ToString())
                    );

                oldProduct.Name = productDto.Name ?? oldProduct.Name;
                oldProduct.Description = productDto.Description ?? oldProduct.Description;
                oldProduct.Price = productDto.Price ?? oldProduct.Price;
                oldProduct.Quantity = productDto.Quantity ?? oldProduct.Quantity;

                if(productDto.Image != null)
                {
                    var imageUrl = await _cloudinaryService.UploadImageAsync(productDto.Image);

                    if (imageUrl == null)
                    {
                        return ApiResponse<bool>.BadRequest("Error uploading image in cloudinary");
                    }

                    oldProduct.Image = imageUrl;
                }

                await _repository.UpdateAsync(oldProduct);

                return ApiResponse<bool>.SuccessResponse(true);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<ApiResponse<bool>> UpdateProductQuantity([FromBody] List<ProductRequestQuantityUpdateDto> productDto)
        {
            try
            {
                var notFoundProducts = new List<ProductRequestQuantityUpdateDto>();
                var oldProducts = new List<Product>();

                foreach (var product in productDto)
                {
                    var oldProduct = await _repository.GetByIdAsync(product.Id);
                
                    if(oldProduct == null)
                    {
                        notFoundProducts.Add(product);
                        continue;
                    }

                    oldProduct.Quantity += product.Quantity;

                    oldProducts.Add(oldProduct);
                }

                if (notFoundProducts.Count > 0)
                {
                    var errors = notFoundProducts.Select(p =>
                        ErrorResource.DATA_ALREADY_EXISTS("Product", p.Name)
                    ).ToList();

                    return ApiResponse<bool>.BadRequest("Duplicate products found.", errors);
                }

                await _repository.ExecuteInTransactionAsync(async () =>
                {
                    await _repository.UpdateRangeAsync(oldProducts);
                });

                return ApiResponse<bool>.SuccessResponse(true);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        #endregion

        #region Delete Product
        public async Task<ApiResponse<bool>> DeleteProduct(int id)
        {
            try
            {
                var oldProduct = await _repository.GetByIdAsync(id);

                if (oldProduct == null)
                    return ApiResponse<bool>.NotFound(
                        ErrorResource.RESOURCE_NOT_FOUND_WITH_ID("Product", id.ToString())
                    );

                await _repository.DeleteAsync(id);

                return ApiResponse<bool>.SuccessResponse(true);
            }
            catch(Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        #endregion

    }
}
