import { api } from "@/config/axios";
import type { PaginatedApiResponse } from "@/types/api-response";
import type { RoomUsers } from "@/types/chat";
import type { PaginationType } from "@/types/pagination";

const BASE_URL = "/chat";

const ChatService = {
  getAll: async (pagi: PaginationType) =>
    api.get<PaginatedApiResponse<RoomUsers[]>>(`${BASE_URL}?page-size=${pagi.pageSize}&page-number=${pagi.page}`),
  getRoomMessages: async (roomId: string, pagi: PaginationType) => {
    // console.log("Fetching messages for room:", roomId, "with pagination:", pagi);
    return api.get<PaginatedApiResponse<RoomUsers>>(`${BASE_URL}/room/${roomId}?page-size=${pagi.pageSize}&page-number=${pagi.page}`);
  }
    

};

export default ChatService;