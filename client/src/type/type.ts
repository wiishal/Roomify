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
  channeld:number,
  senderUsername:string,
  senderId: number;
  timestamp: string;
}

export enum MsgType {
  auth = "auth",
  sendMsgToChannel = "sendMsgToChannel",
  directMsg = "directMsg",
  roomMessage='roomMessage'
}

export interface Msg {
  type: MsgType;
  send_to_server_id?: number;
  send_to_channel_id?:number,
  auth_token?: string;
  message_content?: string;
  direct_msg_user_id?: number;
}
