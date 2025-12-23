using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using api.Dto;
using api.Helpers;
using api.Interfaces.Services;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/chat")]
    [Produces("application/json")]
    public class ChatController : BaseController
    {
        
        private readonly IChatMessagesService _chatMessageService;
        private readonly IChatRoomService _chatRoomService;
        private readonly ILogger<ChatController> _logger;

        public ChatController(
            IChatMessagesService chatMessageService,
            IChatRoomService chatRoomService,
            ILogger<ChatController> logger
        )
        {
            _logger = logger;
            _chatRoomService = chatRoomService;
            _chatMessageService = chatMessageService;
        }

        [HttpGet]
        [Authorize(Roles = "Inventory")]
        public async Task<IActionResult> GetAllChatRooms([FromQuery] Pagination pagination)
        {
            try
            {
                var res = await _chatRoomService.GetAllChatRooms(pagination);

                return !res.Success ? GetActionResultError(res) : Ok(res);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500);
            }
        }

        [HttpGet("room/{chatRoomId}")]
        [Authorize(Roles = "Inventory")]
        public async Task<IActionResult> GetChatRoomById([FromRoute] string chatRoomId, [FromQuery] Pagination pagination)
        {
            try
            {
                var res = await _chatRoomService.GetChatRoomById(chatRoomId, pagination);
                return !res.Success ? GetActionResultError(res) : Ok(res);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500);
            }
        }

        [HttpGet("user-room/{initiator:int}")]
        [Authorize(Roles = "Inventory,Sales")]
        public async Task<IActionResult> GetChatRoomByInitiatorId([FromRoute] int initiator, [FromQuery] Pagination pagination)
        {
            try
            {
                var res = await _chatRoomService.GetChatRoomByInitiatorId(initiator, pagination);
                return !res.Success ? GetActionResultError(res) : Ok(res);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500);
            }
        }

        #region Websocket
        [HttpGet("listen-to-chat-room")]
        [AllowAnonymous]
        public async Task Chat(
            [FromQuery] string roomId,
            [FromQuery] int userId,
            [FromServices] WebSocketHelperManager manager)
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
                            var sendTask = _chatMessageService.SendMessage(chatDto, userId);
                            var broadcastTask = manager.BroadcastToRoomAsync(roomId, chatDto);

                            await Task.WhenAll(sendTask, broadcastTask);
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
        #endregion
    }
}
