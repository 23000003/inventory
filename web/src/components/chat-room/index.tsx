import { MessageCircleMore, Send } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/utils/cn";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";

interface Message {
  id: number;
  content: string;
  timestamp: string;
  isSent: boolean;
  avatar?: string;
}

interface ChatUser {
  id: number;
  name: string;
  avatar: string;
  online: boolean;
  unread: number;
}

const mockUsers: ChatUser[] = [
  { id: 1, name: "Support Team", avatar: "support", online: true, unread: 0 },
  { id: 2, name: "John Doe", avatar: "john", online: true, unread: 3 },
  { id: 3, name: "Sarah Miller", avatar: "sarah", online: false, unread: 0 },
  { id: 4, name: "Alex Chen", avatar: "alex", online: true, unread: 1 },
  { id: 5, name: "Emma Wilson", avatar: "emma", online: false, unread: 5 },
];

const mockMessages: Message[] = [
  {
    id: 1,
    content: "Hey! How can I help you today?",
    timestamp: "10:30 AM",
    isSent: false,
  },
  {
    id: 2,
    content: "Hi! I have a question about your services.",
    timestamp: "10:31 AM",
    isSent: true,
  },
  {
    id: 3,
    content: "Of course! I'd be happy to help. What would you like to know?",
    timestamp: "10:32 AM",
    isSent: false,
  },
  {
    id: 4,
    content: "What are your business hours?",
    timestamp: "10:33 AM",
    isSent: true,
  },
  {
    id: 5,
    content: "We're available Monday to Friday, 9 AM to 6 PM EST. Feel free to reach out anytime during those hours!",
    timestamp: "10:34 AM",
    isSent: false,
  },
];

const ChatBubble = ({ message }: { message: Message }) => {
  return (
    <div
      className={cn(
        "flex items-end gap-2 mb-3",
        message.isSent ? "flex-row-reverse" : "flex-row"
      )}
    >
      {!message.isSent && (
        <Avatar className="h-8 w-8 ring-2 ring-background shadow-sm">
          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=support" />
          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
            SP
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "max-w-[75%] px-4 py-2.5 rounded-2xl shadow-sm",
          message.isSent
            ? "bg-chat-bubble-sent text-chat-bubble-sent-foreground rounded-br-md"
            : "bg-chat-bubble-received text-chat-bubble-received-foreground rounded-bl-md"
        )}
      >
        <p className="text-sm leading-relaxed">{message.content}</p>
        <p
          className={cn(
            "text-[10px] mt-1",
            message.isSent ? "text-chat-bubble-sent-foreground/70" : "text-muted-foreground"
          )}
        >
          {message.timestamp}
        </p>
      </div>
    </div>
  );
};


const UserSwitcher = ({ users, activeId, onSelect }: { users: ChatUser[]; activeId: number; onSelect: (id: number) => void }) => (
  <div className="w-16 bg-chat-header border-r border-border flex flex-col items-center py-3 gap-2">
    <span className="text-[10px] font-medium text-muted-foreground mb-1">Chats</span>
    {users.map((user) => (
      <button
        key={user.id}
        onClick={() => onSelect(user.id)}
        className={cn(
          "relative p-0.5 rounded-full transition-all duration-200",
          activeId === user.id 
            ? "ring-2 ring-primary ring-offset-2 ring-offset-chat-header" 
            : "hover:ring-2 hover:ring-border hover:ring-offset-1 hover:ring-offset-chat-header"
        )}
      >
        <Avatar className="h-9 w-9">
          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatar}`} />
          <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
            {user.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        {/* Unread badge */}
        {user.unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-destructive text-destructive-foreground text-[10px] text-white font-bold rounded-full flex items-center justify-center px-1">
            {user.unread > 9 ? '9+' : user.unread}
          </span>
        )}
      </button>
    ))}
  </div>
);

const ChatRoom = () => {
  const activeUserId = 1; 

  return (
    <section className="fixed bottom-5 right-5 z-50">
      <Popover>
        <PopoverTrigger asChild>
          <button className="group relative bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
            <MessageCircleMore className="w-6 h-6" />
            {/* Total unread badge */}
            <span className="absolute -top-1 -left-1 min-w-[20px] h-[20px] bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center px-1">
              9
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[440px] p-0 rounded-2xl shadow-2xl border-0 overflow-hidden"
          side="top"
          align="end"
          sideOffset={16}
        >
          <div className="flex h-[480px]">
            {/* User Switcher Sidebar */}
            <UserSwitcher 
              users={mockUsers} 
              activeId={activeUserId} 
              onSelect={() => {}} 
            />
            
            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <div className="bg-chat-header px-4 py-3 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                        <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=support" />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          SP
                        </AvatarFallback>
                      </Avatar>
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-chat-online rounded-full border-2 border-background" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">Support Team</h4>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <ScrollArea className="flex-1 bg-red overflow-y-auto">
                <div className="p-4">
                  {/* Date divider */}
                  <div className="flex items-center justify-center mb-4">
                    <span className="text-[11px] text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                      Today
                    </span>
                  </div>

                  {mockMessages.map((message) => (
                    <ChatBubble key={message.id} message={message} />
                  ))}
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="bg-white px-4 py-3 border-t border-border bottom-0">
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Type a message..."
                      className="bg-background border-border rounded-full pr-10 py-5 text-sm focus-visible:ring-primary"
                    />
                  </div>
                  <button className="p-2.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg flex-shrink-0">
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
