export enum MsgType {
  auth = "auth",
  sendMsgToChannel = "sendMsgToChannel",
  directMsg = "directMsg",
}
export interface Msg {
  type: MsgType;
  send_to_server_id?: number;
  send_to_channel_id?: number;
  auth_token?: string;
  message_content?: string;
  direct_msg_user_id?: number;
}

export interface saveMessageParams {
  serverId: number;
  channelId: number;
  userId: number;
  content: string;
}
export type broadcastMessageParam = saveMessageParams;

export interface BroadcastToRoomParams extends saveMessageParams {
  senderUsername: string;
}

export interface saveMessageResponse {
  success: boolean;
  message?: string;
  error?: string;
}
