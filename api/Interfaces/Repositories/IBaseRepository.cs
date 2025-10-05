namespace api.Interfaces.Repositories
{
    public interface IBaseRepository<T> where T : class
    {
        IQueryable<T> GetQueryable(bool includeRelated = false);
        Task<IEnumerable<T>> GetAllAsync(bool includeRelated = false);
        Task<T?> GetByIdAsync(int id, bool includeRelated = false);
        Task AddAsync(T entity);
        Task AddRangeAsync(IEnumerable<T> entities);
        Task UpdateAsync(T entity);
        Task UpdateRangeAsync(IEnumerable<T> entities);
        Task<bool> DeleteAsync(int id);
        Task ExecuteInTransactionAsync(Func<Task> operation);
    }
}
