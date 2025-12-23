using System;
using api.Infrastructure.Model;
using api.Interfaces.Repositories;

namespace api.Infrastructure.Repository;

public class ChatRoomRepository : BaseRepository<ChatRoom>, IChatRoomRepository
{
  public ChatRoomRepository(ClarenceDbContext context) : base(context) { }
    
  public override IQueryable<ChatRoom> GetQueryable(bool includeRelated = false)
  {
      return includeRelated
          ? _context.ChatRooms
              .Include(c => c.Initiator)
              .Include(c => c.Messages)
              .AsQueryable()
          : _context.ChatRooms
              .AsQueryable();
  }

  public override async Task<IEnumerable<ChatRoom>> GetAllAsync(bool includeRelated = false)
  {
      return includeRelated 
          ? await _context.ChatRooms
            .AsNoTracking()
            .Include(c => c.Initiator)
            .Include(c => c.Messages)
            .ToListAsync() 
          : await _context.ChatRooms
            .AsNoTracking()
            .ToListAsync();
  }

  public override async Task<ChatRoom?> GetByIdAsync(int id, bool includeRelated = false)
  {
      return includeRelated
          ? await _context.ChatRooms
              .AsNoTracking()
              .Include(c => c.Messages)
              .Include(c => c.Initiator)
              .Where(c => c.Id == id)
              .FirstOrDefaultAsync()
          : await _context.ChatRooms
              .AsNoTracking()
              .Where(c => c.Id == id)
              .FirstOrDefaultAsync();
  }
}
