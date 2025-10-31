import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
} from "react";
import { useAuth } from "../hooks/useAuth";

export const WebSocketContext = createContext<WebSocket | null>(null);

export const WebSocketProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { isLogged } = useAuth();
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!isLogged) return;
    const socket = new WebSocket("ws://localhost:4000");
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("Connected to WebSocket server");
      socket.send(
        JSON.stringify({ type: "auth", token: localStorage.getItem("token") })
      );
    };

    socket.onmessage = (event) => {
      console.log(event);
    };

    return () => {
      socket.onclose = () => {};
    };
  }, [isLogged]);

  return (
    <WebSocketContext.Provider value={socketRef.current}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebsocket = () => {
  const ctx = useContext(WebSocketContext);
  if (!ctx)
    throw new Error("useWebSocket must be used within WebSocketProvider");
  return ctx;
};
