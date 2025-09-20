using api.Dto;
using api.Exceptions;
using api.Helpers;
using api.Infrastructure.Interfaces;
using api.Infrastructure.Model;
using Microsoft.EntityFrameworkCore;
using System;
using System.Security.Cryptography.X509Certificates;

namespace api.Infrastructure.Repository;

public class ProductRepository : IProductRepository
{
    private readonly ClarenceDbContext _db;

    public ProductRepository(ClarenceDbContext db)
    {
        this._db = db;
    }

    public Product GetProduct(int productId)
    {
        var data = _db.Products
          .Include(e => e.Category)
          .FirstOrDefault(x => x.Id == productId)
          ?? throw new NotFoundException("Product not found");

        return data;
    }

    public PagedList<Product> GetAllProducts(
        Pagination pagination,
        ProductFilterRequestDto filter
    )
    {
        var allProducts = _db.Products.Include(p => p.Category);

        // filter

        return PagedList<Product>.ToPagedList(
            allProducts.OrderByDescending(p => p.Id),
            pagination.PageNumber,
            pagination.PageSize
        );
    }

    public void CreateProduct(ProductCreateRequestDto product)
    {
        // will map it lator
        Product newProduct = new()
        {
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            Quantity = product.Quantity,
            Image = product.Image,
            CreatedBy = product.CreatedBy,
            CategoryId = product.CategoryId
        };

        _db.Add(newProduct);
        _db.SaveChanges();
    }

    public void UpdateProduct(ProductRequestUpdateDto product, int productId)
    {
        var currentProduct = GetProduct(productId);

        if (!string.IsNullOrWhiteSpace(product.Name)) currentProduct.Name = product.Name;
        if (!string.IsNullOrWhiteSpace(product.Image)) currentProduct.Image = product.Image;
        if (!string.IsNullOrWhiteSpace(product.Description)) currentProduct.Description = product.Description;

        if (product.Price.HasValue) currentProduct.Price = product.Price.Value;
        if (product.Quantity.HasValue) currentProduct.Quantity = product.Quantity.Value;
        if (product.CategoryId.HasValue) currentProduct.CategoryId = product.CategoryId.Value;

        _db.Update(currentProduct);
        _db.SaveChanges();
    }

    public void DeleteProduct(int productId)
    {
        var prod = GetProduct(productId);
        _db.Remove(prod);
        _db.SaveChanges();
    }
}
