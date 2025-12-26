import { MessageCircleMore, MessageSquare, Send } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/utils/cn";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import type { Message, RoomUsers } from "@/types/chat";
import { useGetAllChatRooms } from "@/hooks/chat/useChatQueries";
import { useEffect, useRef, useState } from "react";
import useWebsocket from "@/hooks/useWebsocket";
import { useUserStore } from "@/stores/useUserStore";
import ChatBubble from "./chat-bubble";

const ChatRoom = () => {

  const scrollBottomRef = useRef<HTMLDivElement | null>(null);

  const [selectedRoom, setSelectedRoom] = useState<RoomUsers | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");

  const { user } = useUserStore();
  const { data: chatRooms } = useGetAllChatRooms(true);

  const { sendMessage } = useWebsocket<Message>({
    url: `/chat/listen-to-chat-room?roomId=${selectedRoom?.roomId}&userId=${user?.id}`,
    method: { 
      name: "receive", 
      fn: (data: Message) => {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    },
    listen: !!selectedRoom && isOpen,
  })

  console.log("Is Open:", isOpen);

  useEffect(() => {
    // if(scrollBottomRef.current) {
    //   scrollBottomRef.current.scrollIntoView();
    // }
  }, [messages]);

  return (
    <section className="fixed bottom-5 right-5 z-50">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button className="group relative bg-primary text-primary-foreground cursor-pointer rounded-full p-4 shadow-lg hover:shadow-xl hover:ring-3 hover:ring-border hover:ring-offset-1 hover:ring-offset-chat-header hover:opacity-90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
            <MessageCircleMore className="w-6 h-6" />
            {/* Total unread badge */}
            {chatRooms?.reduce((sum, room) => sum + room.unreadMessages, 0) || 0 > 0 
              ? <span className="absolute -top-1 -left-1 min-w-[20px] h-[20px] bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                  {chatRooms?.reduce((sum, room) => sum + room.unreadMessages, 0)}
                </span> 
              : null
            }
          </button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[440px] p-0 rounded-2xl shadow-2xl overflow-hidden border"
          side="top"
          align="end"
          sideOffset={16}
        >
          <div className="flex h-[480px]">
            {/* User Switcher Sidebar */}
            <UserSwitcher 
              users={chatRooms || []} 
              activeId={selectedRoom ? selectedRoom.initiatorId : -1} 
              setSelectedRoom={setSelectedRoom} 
            />
            
            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
              {/* Header */}
              {selectedRoom && (
                <div className="bg-chat-header px-4 py-3 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-[#4079ff] text-primary-foreground">
                            {selectedRoom.initiator.username[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground text-sm">
                          {selectedRoom.initiator.username}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Messages Area */}
              <ScrollArea className="flex-1 bg-red overflow-y-auto">
                {selectedRoom ? (
                  <ChatBubble
                    isOpen={isOpen}
                    messages={messages}
                    setMessages={setMessages}
                    scrollRef={scrollBottomRef}
                    roomId={selectedRoom.roomId} 
                    name={selectedRoom.initiator.username}
                  />
                ) : (
                  <PreRoomState />
                )}
              </ScrollArea>

              {/* Input Area */}
              {selectedRoom ? (
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
                          isInventorySender: true,
                          roomId: selectedRoom.roomId,
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
              ) : null}
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
        Select a conversation from the left to start chatting
      </p>
    </div>
  </div>
);


type Props = {
  users: RoomUsers[];
  activeId: number;
  setSelectedRoom: React.Dispatch<React.SetStateAction<RoomUsers | null>>;
}

const UserSwitcher = ({ users, activeId, setSelectedRoom }: Props) => (
  <div className="w-16 bg-chat-header border-r border-border flex flex-col items-center py-3 gap-2">
    <span className="text-[10px] font-medium text-muted-foreground mb-1">Chats</span>
    {users.map((user, i) => (
      <button
        key={i}
        onClick={() => setSelectedRoom(user)}
        className={cn(
          "relative p-0.5 rounded-full transition-all duration-200 cursor-pointer hover:opacity-80",
          activeId === user.initiatorId 
            ? "ring-2 ring-primary ring-offset-2 ring-offset-chat-header" 
            : "hover:ring-2 hover:ring-border hover:ring-offset-1 hover:ring-offset-chat-header"
        )}
      >
        <Avatar className="h-9 w-9">
          <AvatarImage src={``} />
          <AvatarFallback className="bg-[#4079ff] text-white text-xs font-bold">
            {user.initiator.username[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {/* Unread badge */}
        {user.unreadMessages > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-destructive text-destructive-foreground text-[10px] text-white font-bold rounded-full flex items-center justify-center px-1">
            {user.unreadMessages}
          </span>
        )}
      </button>
    ))}
  </div>
);