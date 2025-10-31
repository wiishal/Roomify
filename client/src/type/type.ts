export interface Channel {
  id: number;
  name: String;
  createdAt: string;
  serverid: number;
  category: string;
}

export interface Server {
  id: number;
  profile: string;
  description: string;
  name: string;
  createdAt: string;
  upvote: number;
  adminid: number;
}

export interface Message {
  id: number;
  content: string;
  senderId: number;
  timestamp: string;
}
export interface MessageContextType {
  Messages: Record<number, Record<number, Message[]>>;
  addMesssage: (serverId: number, chanelId: number, message: Message) => void;
}
