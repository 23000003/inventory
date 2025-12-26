import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/utils/cn";
import type { Message } from "@/types/chat";
import { GET_ALL_CHAT_ROOMS_KEY, useGetRoomMessages } from "@/hooks/chat/useChatQueries";
import { Fragment, useEffect, useState } from "react";
import type { PaginationType } from "@/types/pagination";
import { motion } from "framer-motion";
import { dayIdentifier, formatTime } from "@/utils/date-formatter";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  name: string;
  roomId: string;
  isOpen: boolean;
  messages: Message[];
  scrollRef: React.RefObject<HTMLDivElement | null>;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const ChatBubble = ({ roomId, messages, setMessages, name, scrollRef }: Props) => {
  
  const queryClient = useQueryClient();

  const [newDataLoading, setNewDataLoading] = useState({
    loading: false,
    index: -1
  });
  const [pagination, setPagination] = useState<PaginationType>({
    page: 1,
    pageSize: 5
  });

  const { data, isPending } = useGetRoomMessages(roomId, pagination);

  useEffect(() => {
    setPagination({ page: 1, pageSize: 5 });
    setMessages([]);
    queryClient.invalidateQueries({ queryKey: [GET_ALL_CHAT_ROOMS_KEY] });
  }, [roomId, setMessages, queryClient]);

  useEffect(() => {
    console.log("Fetched messages:", data);
    if (!data || !data.messages?.length) {
      setNewDataLoading({ loading: false, index: -1 });
      return;
    }
    console.log("Adding messages:", data.messages);
    // setMessages(data.messages);
    setMessages(prevMessages => [...data.messages!, ...prevMessages]);
    setNewDataLoading({ loading: false, index: -1 });
  }, [data, setMessages]);


  if(isPending) {
    return (
      <p className="text-center text-sm text-muted-foreground mt-10">
        Loading messages...
      </p>
    );
  }

  if(!messages || messages.length === 0) {
    return (
      <p className="text-center text-sm text-muted-foreground mt-10">
        No messages yet. Start the conversation!
      </p>
    );
  }

  const isTheSameDay = (index: number) => {
    if (index === 0) return false;
    
    const currentMessageDate = new Date(messages[index].createdDate).toDateString();
    const previousMessageDate = new Date(messages[index - 1].createdDate).toDateString();

    return currentMessageDate === previousMessageDate;
  }

  return (
    <div className="p-4">
      {messages.map((message, i) => (
        <Fragment key={i}>
          {/* Date divider */}
          {!isTheSameDay(i) && (
            <motion.div 
              className="flex items-center justify-center mb-4" 
              whileInView="visible"
              viewport={{ once: false }}
              onViewportEnter={() => {
                if (
                  i === 0 && 
                  !newDataLoading.loading &&
                  messages.length < data!.totalMessages &&
                  newDataLoading.index !== i
                ) {
                  setNewDataLoading({ loading: true, index: i });
                  setTimeout(() => {
                    setPagination((prev) => ({
                      ...prev,
                      page: prev.page + 1
                    }));
                  }, 3000);
                }
              }}
            >
              <span className="text-[11px] text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                {newDataLoading.loading && newDataLoading.index === i 
                  ? "Loading..." 
                  : dayIdentifier(new Date(message.createdDate))
                }
              </span>
            </motion.div>
          ) }
          <div
            className={cn(
              "flex items-end gap-2 mb-3",
              message.isInventorySender ? "flex-row-reverse" : "flex-row"
            )}
          >
            {!message.isInventorySender && (
              <Avatar className="h-8 w-8 shadow-sm">
                <AvatarImage src="" />
                <AvatarFallback className="bg-[#4079ff] text-white text-xs">
                  {name[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}
            <div
              className={cn(
                "max-w-[75%] px-4 py-2.5 rounded-2xl shadow-sm",
                message.isInventorySender
                  ? "bg-chat-bubble-sent text-chat-bubble-sent-foreground rounded-br-md"
                  : "bg-chat-bubble-received text-chat-bubble-received-foreground rounded-bl-md"
              )}
            >
              <p className="text-sm leading-relaxed">{message.message}</p>
              <p
                className={cn(
                  "text-[10px] mt-1",
                  message.isInventorySender ? "text-chat-bubble-sent-foreground/70" : "text-muted-foreground"
                )}
              >
                {formatTime(message.createdDate)}
              </p>
            </div>
          </div>
        </Fragment>
      ))}
      <div ref={scrollRef} />
    </div>
  );
};

export default ChatBubble;