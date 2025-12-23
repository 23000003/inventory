import { MessageCircleMore, MessageSquare, Send } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import type { Message } from "@/types/chat";
import { useEffect, useRef, useState } from "react";
import { useUserStore } from "@/stores/useUserStore";
import ChatBubble from "./chat-bubble";
import { useGetRoomMessagesByUserId } from "@/hooks/chat/useChatQueries";
import useWebsocket from "@/hooks/useWebsocket";
import { v4 as uuidv4 } from 'uuid';
import type { PaginationType } from "@/types/pagination";

const ChatRoom = () => {

  const roomIdUUID = uuidv4(); // Generate a unique room ID for the chat session if no room exist

  const scrollBottomRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [pagination, setPagination] = useState<PaginationType>({
    page: 1,
    pageSize: 5
  });

  const { user } = useUserStore();

  // This gets an existing room with messages by userId
  const { data: room, isPending } = useGetRoomMessagesByUserId(user!.id, pagination); 

  const { sendMessage } = useWebsocket<Message>({
    url: `/chat/listen-to-chat-room?roomId=${room?.data?.roomId || roomIdUUID}&userId=${user!.id}`,
    method: { 
      name: "receive", 
      fn: (data: Message) => {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    },
    listen: isPending ? false : true,
  })

  useEffect(() => {
    if(scrollBottomRef.current) {
      scrollBottomRef.current.scrollIntoView();
    }
  }, [messages]);

  return (
    <section className="fixed bottom-5 right-5 z-50">
      <Popover>
        <PopoverTrigger asChild>
          <button className="group relative bg-primary text-primary-foreground cursor-pointer rounded-full p-4 shadow-lg hover:shadow-xl hover:ring-3 hover:ring-border hover:ring-offset-1 hover:ring-offset-chat-header hover:opacity-90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
            <MessageCircleMore className="w-6 h-6" />
            {/* Total unread badge */}
            <span className="absolute -top-1 -left-1 min-w-[20px] h-[20px] bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center px-1">
              9
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[440px] p-0 rounded-2xl shadow-2xl overflow-hidden border"
          side="top"
          align="end"
          sideOffset={16}
        >
          <div className="flex h-[480px]">
            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <div className="bg-chat-header px-4 py-3 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-[#4079ff] text-primary-foreground">
                          I
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">
                        Inventory
                      </h4>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <ScrollArea className="flex-1 bg-red overflow-y-auto">
                {room?.data ? (
                  <ChatBubble
                    roomId={room.data.id} 
                    messages={messages}
                    setMessages={setMessages}
                    name={room.data.initiator.username}
                    scrollRef={scrollBottomRef}
                    setPagination={setPagination}
                    data={room.data ?? []}
                  />
                ) : (
                  <PreRoomState />
                )}
              </ScrollArea>

              {/* Input Area */}
              <div className="bg-white px-4 py-3 border-t border-border bottom-0">
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Type a message..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="bg-background border-border rounded-full pr-10 py-5 text-sm focus-visible:ring-primary"
                    />
                  </div>
                  <button 
                    onClick={() => {
                      sendMessage({
                        message: inputValue,
                        isInventorySender: false,
                        roomId: room?.data?.roomId || roomIdUUID,
                        id: -1,
                        createdDate: "",
                        isRead: false
                      });
                      setInputValue("");
                    }}
                    className="p-2.5 cursor-pointer bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg flex-shrink-0"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </section>
  );
};

export default ChatRoom;


const PreRoomState = () => (
  <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-background p-6 mt-14">
    <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
      <MessageSquare className="w-10 h-10 text-muted-foreground" />
    </div>
    <div className="text-center max-w-[200px]">
      <h4 className="font-semibold text-foreground text-base mb-1">Welcome to Chat</h4>
      <p className="text-xs text-muted-foreground leading-relaxed">
        Start a a conversation with inventory support.
      </p>
    </div>
  </div>
);
