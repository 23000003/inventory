import type React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/utils/cn"
import type { Message } from "@/types/chat"
import { GET_ALL_CHAT_ROOMS_KEY, useGetRoomMessages } from "@/hooks/chat/useChatQueries"
import { Fragment, useEffect, useRef, useState } from "react"
import type { PaginationType } from "@/types/pagination"
import { motion } from "framer-motion"
import { dayIdentifier, formatTime } from "@/utils/date-formatter"
import { useQueryClient } from "@tanstack/react-query"
import { ScrollArea } from "../ui/scroll-area"
import { Skeleton } from "../ui/skeleton"

type Props = {
  name: string
  roomId: string
  isOpen: boolean
  messages: Message[]
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
}

const ChatBubble = ({ roomId, messages, setMessages, name }: Props) => {
  const queryClient = useQueryClient()

  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const scrollBottomRef = useRef<HTMLDivElement | null>(null)
  const scrollSnapshotRef = useRef<{ scrollTop: number; scrollHeight: number } | null>(null)

  const [pagination, setPagination] = useState<PaginationType>({
    page: 1,
    pageSize: 10,
  })
  const [newDataLoading, setNewDataLoading] = useState({
    loading: false,
    index: -1,
  })

  const { data, isFetching } = useGetRoomMessages(roomId, pagination)

  useEffect(() => {
    setPagination({ page: 1, pageSize: 10 })
    setMessages([])

    queryClient.invalidateQueries({ queryKey: [GET_ALL_CHAT_ROOMS_KEY] })
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId])

  const loadOlderMessages = () => {
    const container = scrollContainerRef.current
    if (!container || newDataLoading.loading || !data) return

    scrollSnapshotRef.current = {
      scrollTop: container.scrollTop,
      scrollHeight: container.scrollHeight,
    }

    setNewDataLoading({ loading: true, index: 0 })

    setPagination((prev) => ({
      ...prev,
      page: prev.page + 1,
    }))
  }

  useEffect(() => {
    if (!data?.messages?.length) {
      setNewDataLoading({ loading: false, index: -1 })
      return
    }

    const container = scrollContainerRef.current
    if (!container) return

    setMessages((prev) => [...data.messages!, ...prev])

    if (scrollSnapshotRef.current) {
      requestAnimationFrame(() => {
        const { scrollTop, scrollHeight } = scrollSnapshotRef.current!
        const newScrollHeight = container.scrollHeight
        container.scrollTop = scrollTop + (newScrollHeight - scrollHeight)
        scrollSnapshotRef.current = null
        setNewDataLoading({ loading: false, index: -1 })
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])


  useEffect(() => {
    if (!messages.length) return
    if (pagination.page !== 1) return

    scrollBottomRef.current?.scrollIntoView({ behavior: "auto" })
  }, [messages, pagination.page])

  const isTheSameDay = (index: number) => {
    if (index === 0) return false
    const current = new Date(messages[index].createdDate).toDateString()
    const previous = new Date(messages[index - 1].createdDate).toDateString()
    return current === previous
  }

  console.log("Rendering ChatBubble with messages:", messages);

  return (
    <ScrollArea ref={scrollContainerRef} className="h-full overflow-y-auto px-4">
      {isFetching && messages.length === 0 &&
        <ChatBubbleLazy />
      }
      {(!isFetching || messages.length > 0) &&
        messages.map((message, i) => (
          <Fragment key={message.id}>
            {!isTheSameDay(i) && (
              <motion.div
                className="flex items-center justify-center my-4"
                viewport={{ once: true }}
                onViewportEnter={() => {
                  console.log("Viewport entered for message index:", i);
                  
                  if (
                    i === 0 &&
                    !newDataLoading.loading && 
                    messages.length < data!.totalMessages
                  ) {
                    loadOlderMessages()
                  }
                }}
              >
                <span className="text-[11px] text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                  {newDataLoading.loading && newDataLoading.index === i
                    ? "Loading..."
                    : dayIdentifier(new Date(message.createdDate))}
                </span>
              </motion.div>
            )}

            <div
              className={cn("flex items-end gap-2 mb-3", message.isInventorySender ? "flex-row-reverse" : "flex-row")}
            >
              {!message.isInventorySender && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-[#4079ff] text-white text-xs">{name[0].toUpperCase()}</AvatarFallback>
                </Avatar>
              )}

              <div
                className={cn(
                  "max-w-[75%] px-4 py-2.5 rounded-2xl shadow-sm",
                  message.isInventorySender
                    ? "bg-chat-bubble-sent rounded-br-md"
                    : "bg-chat-bubble-received rounded-bl-md",
                )}
              >
                <p className="text-sm">{message.message}</p>
                <p className="text-[10px] mt-1 text-muted-foreground">{formatTime(message.createdDate)}</p>
              </div>
            </div>
          </Fragment>
        ))}

      <div ref={scrollBottomRef} />
    </ScrollArea>
  )
}

export default ChatBubble


const ChatBubbleLazy = () => {
  return (
    <div className="mt-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "flex items-end mb-1",
            i % 2 === 1 ? "flex-row-reverse" : "flex-row items-center"
          )}
        >
          {i % 2 === 0 && (
            <Skeleton className="h-8 w-8 rounded-full" />
          )}

          <div
            className={cn(
              "max-w-[75%] px-2 py-3 rounded-2xl space-y-2",
              i % 2 === 1
                ? "bg-chat-bubble-sent rounded-br-md"
                : "bg-chat-bubble-received rounded-bl-md"
            )}
          >
            <Skeleton className="h-8 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  )
}
