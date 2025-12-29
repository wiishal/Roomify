import React, { createContext, useState } from "react";
import { Message } from "../type/type";

export interface MessageContextType {
  messages: Record<number, Record<number, Message[]>>;
  addMessage: (serverId: number, chanelId: number, message: Message) => void;
}

export const MessageContext = createContext<MessageContextType | null>(null);

export const MessageContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [messages, setMessages] = useState<
    Record<number, Record<number, Message[]>> 
  >({});

  const addMessage = (
    serverId: number,
    chanelId: number,
    message: Message
  ) => {
    setMessages((prev) => ({
      ...prev,
      [serverId]: {
        ...prev[serverId],
        [chanelId]: [...(prev[serverId]?.[chanelId] || []), message],
      },
    }));
  };


  return (
    <MessageContext.Provider value={{ messages, addMessage }}>
      {children}
    </MessageContext.Provider>
  );
};
