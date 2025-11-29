using System;
using api.Infrastructure.Model;
using api.Interfaces.Repositories;

namespace api.Infrastructure.Repository;

public class ChatMessagesRepository : BaseRepository<ChatMessages>, IChatMessagesRepository
{
  public ChatMessagesRepository(ClarenceDbContext context) : base(context) { }
    
  public override IQueryable<ChatMessages> GetQueryable(bool includeRelated = false)
  {
      return includeRelated
          ? _context.ChatMessages
              .Include(c => c.ChatRoom)
              .AsNoTracking()
              .AsQueryable()
          : _context.ChatMessages
              .AsNoTracking()
              .AsQueryable();
  }

  public override async Task<IEnumerable<ChatMessages>> GetAllAsync(bool includeRelated = false)
  {
      return includeRelated 
          ? await _context.ChatMessages
              .ToListAsync() 
          : await _context.ChatMessages
              .Include(c => c.ChatRoom)
              .ToListAsync();
  }

  public override async Task<ChatMessages?> GetByIdAsync(int id, bool includeRelated = false)
  {
      return includeRelated
          ? await _context.ChatMessages
              .Include(c => c.ChatRoom)
              .Where(c => c.Id == id)
              .FirstOrDefaultAsync()
          : await _context.ChatMessages
              .Where(c => c.Id == id)
              .FirstOrDefaultAsync();
  }
}
