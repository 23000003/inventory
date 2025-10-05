using api.Dto;
using api.Exceptions;
using api.Helpers;
using api.Infrastructure.Model;
using api.Interfaces.Repositories;
using System;

namespace api.Infrastructure.Repository;

public class CategoryRepository : BaseRepository<Category>, ICategoryRepository
{

    public CategoryRepository(ClarenceDbContext context) : base(context) { }
    
    public override IQueryable<Category> GetQueryable(bool includeRelated = false)
    {
        return includeRelated
            ? _context.Category
                .Include(c => c.Products)
                .AsNoTracking()
                .AsQueryable()
            : _context.Category
                .AsNoTracking()
                .AsQueryable();
    }

    public override async Task<IEnumerable<Category>> GetAllAsync(bool includeRelated = false)
    {
        return includeRelated 
            ? await _context.Category
                .ToListAsync() 
            : await _context.Category
                .Include(c => c.Products)
                .ToListAsync();
    }

    public override async Task<Category?> GetByIdAsync(int id, bool includeRelated = false)
    {
        return includeRelated
            ? await _context.Category
                .Include(c => c.Products)
                .Where(c => c.Id == id)
                .FirstOrDefaultAsync()
            : await _context.Category
                .Where(c => c.Id == id)
                .FirstOrDefaultAsync();
    }

}
