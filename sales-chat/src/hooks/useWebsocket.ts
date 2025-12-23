import type { Message } from "@/types/chat";
import { TokenStorage } from "@/utils/token-storage";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";

type InvalidateMethod = {
  name: "invalidate";
};

type ReceiveMethod<T> = {
  name: "receive";
  fn: (data: T) => void;
};


type Props<T> =
  | { url: string; method: InvalidateMethod; listen: boolean }
  | { url: string; method: ReceiveMethod<T>; listen: boolean }

  
const useWebsocket = <T>(props: Props<T>) => {
  const socketRef = useRef<WebSocket | null>(null);
  const queryClient = useQueryClient();

  const BASE_URL = "ws://localhost:5249/api/v1";
  const token = TokenStorage.getAccessToken();

  useEffect(() => {
    if (!token || !props.listen) return;

    const rt_url = `${BASE_URL}${props.url}`;
    const ws = new WebSocket(rt_url);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log(`Connected to ${props.method.name}`);
    };

    ws.onmessage = (event) => {
      console.log("Message received:", event.data);

      const parsed = typeof event.data === "string" 
        ? JSON.parse(event.data) 
        : event.data;

      if (props.method.name === "invalidate") {
        queryClient.invalidateQueries({
          queryKey: [parsed],
        });
      } else if (props.method.name === "receive") {
        props.method.fn(parsed);
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    ws.onclose = (event) => {
      console.log(`WebSocket disconnected. Code: ${event.code}, Reason: ${event.reason}`);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close(1000, "Component unmounted");
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, queryClient, props.listen]);

  const sendMessage = useCallback((message: Message) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      try {
        const send = {
          message: message.message,
          roomId: message.roomId,
          isInventorySender: message.isInventorySender, // false for sales
        }
        socketRef.current.send(JSON.stringify(send));
      } catch (err) {
        console.error("Error sending message:", err);
      }
    } else {
      console.error("WebSocket is not connected. Current state:", socketRef.current?.readyState);
    }
  }, []);

  return { sendMessage };
};

export default useWebsocket;
