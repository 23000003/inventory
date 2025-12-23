import { api } from "@/config/axios";
import type { PaginatedApiResponse } from "@/types/api-response";
import type { RoomUsers } from "@/types/chat";
import type { PaginationType } from "@/types/pagination";

const BASE_URL = "/chat";

const ChatService = {
  getRoomByUserId: async (userId: number, pagi: PaginationType) =>
    api.get<PaginatedApiResponse<RoomUsers>>(`${BASE_URL}/user-room/${userId}?page-size=${pagi.pageSize}&page-number=${pagi.page}`),

};

export default ChatService;