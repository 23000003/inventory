import { TokenStorage } from "@/utils/token-storage";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

const useQuantityListener = () => {
  const socketRef = useRef<WebSocket | null>(null);
  const queryClient = useQueryClient();

  const URL = "ws://localhost:5249/api/v1";
  const token = TokenStorage.getAccessToken();

  useEffect(() => {
    if (!token) return;

    const url = `${URL}/products/listen-product-quantity?access_token=${token}`;
    const ws = new WebSocket(url);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("Connected to product quantity WebSocket");
    };

    ws.onmessage = (event) => {
      console.log("Message received:", event.data);
      const data: string = event.data;
      queryClient.invalidateQueries({ queryKey: [data] });
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    ws.onclose = (event) => {
      console.log(
        `WebSocket disconnected. Code: ${event.code}, Reason: ${event.reason}`
      );
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close(1000, "Component unmounted");
      }
    };
  }, [token, queryClient]);
};

export default useQuantityListener;
