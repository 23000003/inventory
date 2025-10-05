using api.Infrastructure.Model;
using api.Interfaces.Repositories;

namespace api.Infrastructure.Repository
{
    public abstract class BaseRepository<T> : IBaseRepository<T> where T : EntityBase
    {
        protected readonly ClarenceDbContext _context;

        public BaseRepository(ClarenceDbContext context) 
        { 
            _context = context;
        }

        public abstract Task<IEnumerable<T>> GetAllAsync(bool includeRelated = false);
        public abstract Task<T?> GetByIdAsync(int id, bool includeRelated = false);
        public abstract IQueryable<T> GetQueryable(bool includeRelated = false);

        public async Task AddAsync(T entity)
        {
            await _context.Set<T>().AddAsync(entity);
            await _context.SaveChangesAsync();
        }

        public async Task AddRangeAsync(IEnumerable<T> entities)
        {
            var addRangeAsync = entities.ToList();
            await _context.Set<T>().AddRangeAsync(addRangeAsync);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(T entity)
        {
            if (_context.Entry(entity).State == EntityState.Detached) 
                _context.Set<T>().Attach(entity);

            _context.Entry(entity).State = EntityState.Modified;
            
            await _context.SaveChangesAsync();
        }

        public async Task UpdateRangeAsync(IEnumerable<T> entities)
        {
            foreach(var entity in entities)
            {
                if (_context.Entry(entity).State == EntityState.Detached)
                    _context.Set<T>().Attach(entity);

                _context.Entry(entity).State = EntityState.Modified;
            }
            await _context.SaveChangesAsync();
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await GetByIdAsync(id);
            if (entity == null) return false;

            _context.Set<T>().Remove(entity);

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task ExecuteInTransactionAsync(Func<Task> operation)
        {
            await using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                await operation();
                await transaction.CommitAsync();
            }
            catch(Exception ex)
            {
                await transaction.RollbackAsync();
                throw new Exception(ex.Message);
            }
        }
    }
}
