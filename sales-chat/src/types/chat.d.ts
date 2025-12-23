import type { UserInfoType } from "@/types/user-info";

interface Message {
  id: number; // primary key, not used in sending/receiving, 
  isInventorySender: boolean;
  message: string;
  createdDate: string; // generated thru default value as now()
  roomId: string;
  isRead: boolean; // generated thru default value as false
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
