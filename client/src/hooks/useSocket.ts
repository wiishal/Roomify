import { useContext } from "react";
import { WebSocketContext } from "../context/WebSocketContext";

export const useWebsocket = () => {
  const ctx = useContext(WebSocketContext);
  if (!ctx)
    console.error('cant get websocket ctx : websocket provider')
    // throw new Error("useWebSocket must be used within WebSocketProvider");
  return ctx;
};
