import { TokenStorage } from "@/utils/token-storage";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

type InvalidateMethod = {
  name: "invalidate";
};

type ReceiveMethod<T> = {
  name: "receive";
  fn: (data: T) => void;
};


type Props<T> =
  | { url: string; method: InvalidateMethod }
  | { url: string; method: ReceiveMethod<T> };

  
const useWebsocket = <T>(props: Props<T>) => {
  const socketRef = useRef<WebSocket | null>(null);
  const queryClient = useQueryClient();

  const BASE_URL = "ws://localhost:5249/api/v1";
  const token = TokenStorage.getAccessToken();

  useEffect(() => {
    if (!token) return;

    const rt_url = `${BASE_URL}${props.url}?access_token=${token}`;
    const ws = new WebSocket(rt_url);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log(`Connected to ${props.method.name}`);
    };

    ws.onmessage = (event) => {
      console.log("Message received:", event.data);

      let parsed: T;

      try {
        parsed = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
      } catch {
        // if it's a simple string, fallback
        parsed = event.data as T;
      }

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
  }, [token, queryClient]);
};

export default useWebsocket;
