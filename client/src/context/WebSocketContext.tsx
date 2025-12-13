import React, {
  createContext,
  ReactNode,
  useEffect,
  useState,
  useRef,
} from "react";
import { useAuth } from "../hooks/useAuth";
import { useMessages } from "../hooks/useMessage";
import { MsgType } from "../type/type";

export const WebSocketContext = createContext<WebSocket | null>(null);

export const WebSocketProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { isLogged } = useAuth();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const { addMessage } = useMessages();

  useEffect(() => {
    if (!isLogged) return;

    const ws = new WebSocket(import.meta.env.VITE_WS_URL);
    socketRef.current = ws;
    setSocket(ws);

    ws.onopen = () => {
      console.log("WebSocket connected");
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
        console.log(msg)
        addMessage(msg.serverId, msg.channelId, msg);
        console.log('message added : ',msg.serverId)
      }

      // if (msg.type === "directMessage") {
      //   addDirectMessage(msg.senderId, msg.message);
      // }

      // any other message types
    };

    ws.onerror = (err) => console.error("WS error:", err);
    ws.onclose = () =>{
      
    }

    return () => {
      ws.close();
      console.log("WebSocket closed");
    };
  }, [isLogged]);

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};
