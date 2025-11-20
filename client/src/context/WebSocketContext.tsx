import React, {
  createContext,
  ReactNode,
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
    const socket = new WebSocket(import.meta.env.WS_URL);
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

