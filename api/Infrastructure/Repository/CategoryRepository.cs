using api.Dto;
using api.Exceptions;
using api.Helpers;
using api.Infrastructure.Interfaces;
using api.Infrastructure.Model;
using Microsoft.EntityFrameworkCore;
using System;

namespace api.Infrastructure.Repository;

public class CategoryRepository : ICategoryRepository
{
    private readonly ClarenceDbContext _db;

    public CategoryRepository(ClarenceDbContext db)
    {
        _db = db;
    }

    public Category GetCategory(int categoryId)
    {
        var data = _db.Category
            .FirstOrDefault(x => x.Id == categoryId)
            ?? throw new NotFoundException("Category Not Found");

        return data;
    }

    public PagedList<Category> GetAllCategory(
        Pagination pagination,
        CategoryFilterRequestDto filter
    )
    {
        IQueryable<Category> query = _db.Category.Include(p => p.Products);

        if(filter.NumberOfProducts.HasValue)
        {
            query = query.Where(e => e.NumberOfProducts == filter.NumberOfProducts);
        }

        return PagedList<Category>.ToPagedList(
            filter.IsDecending 
                ? query.OrderByDescending(c => c.Id) 
                : query.OrderBy(c => c.Id),
            pagination.PageNumber,
            pagination.PageSize
        );
    }

    public void CreateCategory(CategoryCreateRequestDto category)
    {
        // will map it lator
        Category newCategory = new()
        {
            Name = category.Name,
            Description = category.Description,
            NumberOfProducts = category.NumberOfProducts,
            CreatedBy = category.CreatedBy
        };

        _db.Add(newCategory);
        _db.SaveChanges();
    }

    public void UpdateCategory(CategoryUpdateRequestDto category, int categoryId)
    {
        var currentCategory = GetCategory(categoryId);

        if (!string.IsNullOrWhiteSpace(category.Name)) currentCategory.Name = category.Name;
        if (!string.IsNullOrWhiteSpace(category.Description)) currentCategory.Description = category.Description;

        if (category.NumberOfProducts.HasValue) currentCategory.NumberOfProducts = category.NumberOfProducts.Value;

        _db.Update(currentCategory);
        _db.SaveChanges();
    }

    public void DeleteCategory(int categoryId)
    {
        var categ = GetCategory(categoryId);
        _db.Remove(categ);
        _db.SaveChanges();
    }

}
