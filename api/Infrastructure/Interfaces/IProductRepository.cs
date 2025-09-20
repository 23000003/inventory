using api.Dto;
using api.Helpers;
using api.Infrastructure.Model;
using System;

namespace api.Infrastructure.Interfaces;

public interface IProductRepository
{
  Product GetProduct(int productId);
  PagedList<Product> GetAllProducts(Pagination pagination, ProductFilterRequestDto filter);
  void CreateProduct(ProductCreateRequestDto product);
  void UpdateProduct(ProductRequestUpdateDto product, int productId);
  void DeleteProduct(int productId);
}
