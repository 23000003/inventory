using api.Dto;
using api.Interfaces.Services;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
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
                _logger.LogError(ex, ex.Message);
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
                _logger.LogError(ex, ex.Message);
                return StatusCode(500);
            }
        }

        [HttpGet("user-room/{initiator:int}")]
        [Authorize(Roles = "Sales")]
        public async Task<IActionResult> GetChatRoomByInitiatorId([FromRoute] int initiator, [FromQuery] Pagination pagination)
        {
            try
            {
                var res = await _chatRoomService.GetChatRoomByInitiatorId(initiator, pagination);
                return !res.Success ? GetActionResultError(res) : Ok(res);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
                return StatusCode(500);
            }
        }

        [HttpPatch("mark-as-read/{roomId}")]
        [Authorize(Roles = "Sales")]
        public async Task<IActionResult> MarkMessagesAsRead([FromRoute] string roomId)
        {
            try
            {
                var res = await _chatMessageService.MarkMessagesAsRead(roomId, false);
                return !res.Success ? GetActionResultError(res) : Ok(res);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
                return StatusCode(500);
            }
        }
    }
}
