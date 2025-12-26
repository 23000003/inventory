using System;
using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using api.Dto;
using api.Helpers;
using api.Interfaces.Services;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

[ApiController]
[ApiVersion("1.0")]
[AllowAnonymous]
[Route("api/v{version:apiVersion}")]
[Produces("application/json")]
public class SocketController : BaseController
{
  private readonly IChatMessagesService _chatMessageService;
  private readonly ILogger<SocketController> _logger;

  public SocketController(
      IChatMessagesService chatMessageService,
      IChatRoomService chatRoomService,
      ILogger<SocketController> logger
  )
  {
    _logger = logger;
    _chatMessageService = chatMessageService;
  }


  [HttpGet("chat/listen-to-chat-room")]
  [AllowAnonymous]
  public async Task Chat(
    [FromQuery] string roomId,
    [FromQuery] int userId,
    [FromServices] WebSocketHelperManager manager
  )
  {
    if (!HttpContext.WebSockets.IsWebSocketRequest)
    {
      HttpContext.Response.StatusCode = 400;
      return;
    }

    _logger.LogInformation("WebSocket connection requested for RoomId: {roomId}, UserId: {userId}", roomId, userId);

    using var socket = await HttpContext.WebSockets.AcceptWebSocketAsync();
    manager.AddSocket(socket, roomId, userId.ToString());

    var buffer = new byte[4096];

    try
    {
      while (socket.State == WebSocketState.Open)
      {
        var result = await socket.ReceiveAsync(buffer, CancellationToken.None);

        if (result.MessageType == WebSocketMessageType.Close)
          break;

        var jsonMessage = Encoding.UTF8.GetString(buffer, 0, result.Count);

        _logger.LogInformation("Received message: {jsonMessage}", jsonMessage);

        try
        {
          var options = new JsonSerializerOptions
          {
            PropertyNameCaseInsensitive = true
          };

          var chatDto = JsonSerializer.Deserialize<ChatMessageDto>(jsonMessage, options);
          chatDto!.RoomId = roomId;

          if (chatDto != null)
          {
            await manager.BroadcastToRoomAsync(roomId, chatDto);
            await _chatMessageService.SendMessage(chatDto, userId);
          }
        }
        catch (JsonException ex)
        {
          _logger.LogError(ex, "Failed to deserialize incoming message: {jsonMessage}", jsonMessage);
        }
      }
    }
    finally
    {
      _logger.LogInformation("WebSocket connection closed for RoomId: {roomId}, UserId: {userId}", roomId, userId);
      await manager.RemoveSocket("", roomId, userId.ToString());
    }
  }

  [HttpGet("invalidate-changes")]
  public async Task ListenToChanges([FromServices] WebSocketHelperManager manager)
  {
    Console.WriteLine("Listening to product quantity changes...");

    if (!HttpContext.WebSockets.IsWebSocketRequest)
    {
      HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
      return;
    }
    var id = Guid.NewGuid().ToString();

    using var webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();
    manager.AddSocket(webSocket, id);

    var buffer = new byte[128];

    try
    {
      while (webSocket.State == WebSocketState.Open)
      {
        var result = await webSocket.ReceiveAsync(buffer, CancellationToken.None);

        if (result.MessageType == WebSocketMessageType.Close)
          break;
      }
    }
    finally
    {
      await manager.RemoveSocket(id, null, null);
    }
  }
}
