using api.Dto;
using api.Exceptions;
using api.Helpers;
using api.Infrastructure.Model;
using api.Interfaces.Repositories;
using api.Interfaces.Services;
using System;

namespace api.Infrastructure.Repository;

public class ProductRepository : BaseRepository<Product>, IProductRepository
{

    public ProductRepository(ClarenceDbContext context) : base(context)
    {
    }

    public override IQueryable<Product> GetQueryable(bool includeRelated = false)
    {
        return includeRelated
            ? _context.Products
                .Include(c => c.Category)
                .AsNoTracking()
                .AsQueryable()
            : _context.Products
                .AsNoTracking()
                .AsQueryable();
    }

    public override async Task<IEnumerable<Product>> GetAllAsync(bool includeRelated = false)
    {
        throw new NotImplementedException();
    }

    public override async Task<Product?> GetByIdAsync(int id, bool includeRelated = false)
    {
        return includeRelated
             ? await _context.Products
                 .Include(c => c.Category)
                 .Where(c => c.Id == id)
                 .FirstOrDefaultAsync()
             : await _context.Products
                 .Where(c => c.Id == id)
                 .FirstOrDefaultAsync();
    }

}
