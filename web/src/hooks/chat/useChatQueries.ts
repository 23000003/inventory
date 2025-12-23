import ChatService from "@/services/chat.service";
import type { PaginationType } from "@/types/pagination";
import { useQuery } from "@tanstack/react-query";

export const GET_ALL_CHAT_ROOMS_KEY = "chatRooms";
export const GET_ALL_ROOM_MESSAGES = "roomMessages";

export const useGetAllChatRooms = () => {
  return useQuery({
    queryKey: [GET_ALL_CHAT_ROOMS_KEY],
    queryFn: () => ChatService.getAll(""),
    select: (data) => data.data.data,
  });
};

export const useGetRoomMessages = (roomId: string, pagi: PaginationType) => {
  return useQuery({
    queryKey: [GET_ALL_ROOM_MESSAGES, roomId, pagi.page, pagi.pageSize],
    queryFn: () => ChatService.getRoomMessages(roomId, pagi),
    select: (data) => data.data.data
  });
}
