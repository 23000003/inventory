import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/utils/cn";
import type { Message } from "@/types/chat";
import { useGetRoomMessages } from "@/hooks/chat/useChatQueries";
import { useEffect, useState } from "react";
import type { PaginationType } from "@/types/pagination";
import { motion } from "framer-motion";
import { dayIdentifier, formatTime } from "@/utils/date-formatter";

type Props = {
  name: string;
  roomId: string;
  messages: Message[];
  scrollRef: React.RefObject<HTMLDivElement | null>;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const ChatBubble = ({ roomId, messages, setMessages, name, scrollRef }: Props) => {
  
  const [newDataLoading, setNewDataLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationType>({
    page: 1,
    pageSize: 5
  })

  const { data, isPending } = useGetRoomMessages(roomId, pagination);

  useEffect(() => {
    if (data && data.messages.length > 0) {
      setMessages((prev) => [...data.messages, ...prev]);
    }
    setNewDataLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    setPagination({
      page: 1,
      pageSize: 5
    });
    setMessages([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId])

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
        <>
        {/* Date divider */}
        {!isTheSameDay(i) && (
          <motion.div 
            className="flex items-center justify-center mb-4" 
            key={`divider-${i}`}
            whileInView="visible"
            viewport={{ once: false }}
            onViewportEnter={() => {
              if (i === 0 && !newDataLoading && messages.length < data!.totalMessages) {
                setNewDataLoading(true);
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
              {newDataLoading ? "Loading..." : dayIdentifier(new Date(message.createdDate))}
            </span>
          </motion.div>
        ) }
        <div
          key={i}
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
        </>
      ))}
      <div ref={scrollRef} />
    </div>
  );
};

export default ChatBubble;