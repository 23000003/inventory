import type { UserInfoType } from "@/types/user-info";

interface Message {
  id: number;
  isInventorySender: boolean;
  message: string;
  createdDate: string;
  roomId: string;
  isRead: boolean;
}

interface RoomUsers {
  id: number; 
  roomId: string;
  initiatorId: number;
  initiator: UserInfoType;
  unreadMessages: number;
  messages: Message[];
  totalMessages: number;
}
