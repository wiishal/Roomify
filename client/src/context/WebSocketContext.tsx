import React, {
  createContext,
  ReactNode,
  useEffect,
  useState,
  useRef,
} from "react";
import { useMessages } from "../hooks/useMessage";
import { MsgType } from "../type/type";
import { useAuth } from "../hooks/useAuth";

export const WebSocketContext = createContext<WebSocket | null>(null);

const MAXTRIES = 5;
const DELAY = 1000;

export const WebSocketProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { isLogged } = useAuth();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const retriesCountRef = useRef<number>(0);
  const retryDelayRef = useRef<number | null>(null);
  const { addMessage } = useMessages();

  const connect = () => {
    if (!isLogged) return;
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      return;
    }
    const ws = new WebSocket(import.meta.env.VITE_WS_URL);
    socketRef.current = ws;
    setSocket(ws);
    ws.onopen = () => {
      console.log("WebSocket connected");
      retriesCountRef.current = 0;
      ws.send(
        JSON.stringify({
          type: "auth",
          auth_token: localStorage.getItem("token"),
        })
      );
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === MsgType.roomMessage) {
        console.log(msg);
        addMessage(msg.serverId, msg.channelId, msg);
        console.log("message added : ", msg.serverId);
      }
    };

    ws.onerror = (err) => {
      console.error("WS error:", err);
      ws.close();
    };
    ws.onclose = () => {
      console.log("reconnecting...");
      if (!isLogged) return;

      if (retriesCountRef.current >= MAXTRIES) {
        console.log(`max tries reached!`);
        return;
      }
      const delay = DELAY * Math.pow(2, retriesCountRef.current);
      retriesCountRef.current++;
      retryDelayRef.current = window.setTimeout(connect, delay);
    };
  };

  useEffect(() => {
    connect();
    return () => {
      if (retryDelayRef.current != null) {
        clearTimeout(retryDelayRef.current);
      }
      socketRef.current?.close();
      socketRef.current = null;
      retriesCountRef.current = 0;
    };
  }, [isLogged]);

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};
