import React, { createContext, useState } from "react";
import { Message, MessageContextType } from "../type/type";


const MessageContext = createContext<MessageContextType | null>(null);

export const MessageContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [Messages, setMessages] = useState<
    Record<number, Record<number, Message[]>>
  >({});

  const addMesssage = (
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
    <MessageContext.Provider value={{ Messages, addMesssage }}>
      {children}
    </MessageContext.Provider>
  );
};

