using System;
using api.Dto;
using api.Helpers;
using api.Infrastructure.Model;

namespace api.Infrastructure.Interfaces;

public interface ICategoryRepository
{
  Category? GetCategory(int categoryId);
  PagedList<Category> GetAllCategory(Pagination pagination, CategoryFilterRequestDto filter);
  void CreateCategory(CategoryCreateRequestDto category);
  void UpdateCategory(CategoryUpdateRequestDto category, int categoryId);
  void DeleteCategory(int categoryId);
}
