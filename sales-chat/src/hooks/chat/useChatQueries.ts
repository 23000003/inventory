import ChatService from "@/services/chat.service";
import type { PaginationType } from "@/types/pagination";
import { useQuery } from "@tanstack/react-query";

export const GET_ALL_ROOM_MESSAGES = "roomMessages";

export const useGetRoomMessagesByUserId = (userId: number, pagi: PaginationType) => {
  return useQuery({
    queryKey: [GET_ALL_ROOM_MESSAGES, userId, pagi.page, pagi.pageSize],
    queryFn: () => ChatService.getRoomByUserId(userId, pagi),
    select: (data) => data.data
  });
}
