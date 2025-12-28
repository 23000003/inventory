import ChatService from "@/services/chat.service";
import type { PaginationType } from "@/types/pagination";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const GET_ALL_CHAT_ROOMS_KEY = "chat-rooms";
export const GET_ALL_ROOM_MESSAGES = "room-messages";

export const useGetAllChatRooms = (pagination: PaginationType) => {
  const { data, isPending } = useQuery({
    queryKey: [GET_ALL_CHAT_ROOMS_KEY],
    queryFn: () => ChatService.getAll(pagination),
    select: (data) => data.data
  });

  return {
    chatRooms: data?.data,
    paginationDetails: data?.pagination,
    isPending,
  }
};

export const useGetRoomMessages = (roomId: string, pagi: PaginationType) => {
  return useQuery({
    queryKey: [GET_ALL_ROOM_MESSAGES, roomId, pagi.page, pagi.pageSize],
    queryFn: async () => {
      // await new Promise(resolve => setTimeout(resolve, 1000));
      return await ChatService.getRoomMessages(roomId, pagi);
    },
    gcTime: 0,
    staleTime: 0,
    refetchOnMount: "always", 
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
    select: (data) => data.data.data
  });
}
