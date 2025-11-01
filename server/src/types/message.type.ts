enum MsgType {
  auth = "auth",
  // join_request = "join_request",
  send_msg_to_channel = "send_msg_to_channel",
  direct_msg = "direct_msg",
}
interface Msg {
  type: MsgType;
  send_to_server_id?: number;
  send_to_channel_id?:number,
  auth_token?: string;
  message_content?: string;
  direct_msg_user_id?: number;
}

interface saveMessageParams {
  serverId: number;
  channelId: number;
  userId: number;
  content: string;
}
interface broadcastMessageParam extends saveMessageParams {}

interface saveMessageResponse {
  success: boolean;
  message?: string;
  error?: string;
}