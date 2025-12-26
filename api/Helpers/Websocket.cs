using System;
using System.Net.WebSockets;
using System.Text;
using System.Collections.Concurrent;
using api.Dto;
using System.Text.Json;

namespace api.Helpers;

public class WebSocketHelperManager
{
  private readonly ConcurrentDictionary<string, WebSocket> _sockets = new();
  private readonly ConcurrentDictionary<string, ConcurrentDictionary<string, WebSocket>> _roomSockets = new();

  public void AddSocket(WebSocket socket, string id, string? userId = null)
  {
    if (userId != null)
    {
      var room = _roomSockets.GetOrAdd(id, _ => new ConcurrentDictionary<string, WebSocket>());
      room[userId] = socket;
    }
    else
    {
      _sockets[id] = socket;
    }
  }

  public async Task RemoveSocket(string id, string? roomId = null, string? userId = null)
  {
    if (!String.IsNullOrEmpty(id) && _sockets.TryRemove(id, out var socket))
    {
      await CloseIfOpenAsync(socket);
      return;
    }

    if (
      roomId != null && userId != null &&
      _roomSockets.TryGetValue(roomId, out var roomSockets) &&
      roomSockets.TryRemove(userId, out var roomSocket))
    {
      await CloseIfOpenAsync(roomSocket);

      if (roomSockets.IsEmpty)
        _roomSockets.TryRemove(roomId, out _);
    }
  }


  public async Task BroadcastAsync(string message)
  {
    var buffer = Encoding.UTF8.GetBytes(message);
    var tasks = _sockets.Values
      .Where(s => s.State == WebSocketState.Open)
      .Select(s => s.SendAsync(new ArraySegment<byte>(buffer), WebSocketMessageType.Text, true, CancellationToken.None));

    await Task.WhenAll(tasks);
  }

  public async Task BroadcastToRoomAsync(string roomId, ChatMessageDto chatDto)
  {
    if (!_roomSockets.TryGetValue(roomId, out var room))
      return;

    var options = new JsonSerializerOptions
    {
      PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    if(room.Count > 1)
      chatDto.IsRead = true;

    var message = JsonSerializer.Serialize(chatDto, options);
    var buffer = Encoding.UTF8.GetBytes(message);

    Console.WriteLine($"Broadcasting message to room ID: {roomId}, Message: {message}, Socket Count: {room.Count}");

    var tasks = room.Values
      .Where(s => s.State == WebSocketState.Open)
      .Select(s => s.SendAsync(new ArraySegment<byte>(buffer), WebSocketMessageType.Text, true, CancellationToken.None));

    await Task.WhenAll(tasks);
  }

  private static async Task CloseIfOpenAsync(WebSocket socket)
  {
    if (socket.State == WebSocketState.Open)
    {
      await socket.CloseAsync(
          WebSocketCloseStatus.NormalClosure,
          "Closed by server",
          CancellationToken.None);
    }
  }
}
