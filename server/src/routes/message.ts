const secret = process.env.JWT_SECRET;
import jwt from "jsonwebtoken";
import { WebSocket as WsType } from "ws";
import { check_member, save_message } from "../service/service.message.js";
import { rooms } from "../utils/serverConfig.js";

const online_users = new Map<number, WsType>();

const msgHandler: Record<MsgType, (ws: WsType, msg: Msg) => void> = {
  auth: handleAuth,
  send_msg_to_channel: handle_send_msg_to_channel,
  direct_msg: (ws: WsType, msg: Msg) => {},
};

function handleAuth(ws: WsType, msg: Msg) {
  if (!msg.auth_token) {
    ws.send(JSON.stringify({ type: "auth_failed", msg: "token not recieved" }));
    return;
  }
  
  try {
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }
    const token = msg.auth_token;
    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
    console.log("auth decoded", decoded); //

    ws.userId = decoded.id;
    online_users.set(decoded.id, ws);
    console.log(`${ws.userId} connected`); ///

    ws.send(JSON.stringify({ type: "auth_success", msg: "user identfied" }));
  } catch (error) {
    ws.send(JSON.stringify({ type: "auth_failed", msg: "token not verified" }));
  }
}

async function handle_send_msg_to_channel(ws: WsType, msg: Msg) {
  const current_user = ws.userId;

  if (!current_user) {
    ws.send(JSON.stringify({ type: "auth_falied", msg: "user not validate" }));
    return;
  }

  if (!msg.send_to_server_id || !msg.send_to_channel_id) {
    ws.send(JSON.stringify({ type: "error", msg: "missing msg info" }));
    return;
  }
  // checking member
  const isMember = await check_member(msg.send_to_server_id, current_user);

  if (!isMember) {
    ws.send(
      JSON.stringify({ type: "error", msg: "not a member of current server" })
    );
    return;
  }

  //saving message
  const message = {
    serverId: msg.send_to_server_id,
    channelId: msg.send_to_channel_id,
    userId: current_user,
    content: msg.message_content || "",
  };

  const saveMessage = await save_message(message);
  if (!saveMessage.success) {
    ws.send(JSON.stringify({ type: "error", msg: "failed to sent message!" }));
    return;
  }
  broadcast_to_room(message);
}

function broadcast_to_room(message: broadcastMessageParam) {
  const onlineMembersOfRoom = rooms.get(message.serverId);
  if (!onlineMembersOfRoom) return;

  onlineMembersOfRoom.forEach((member) => {
    const users_ws = online_users.get(member);

    if (users_ws) {
      users_ws.send(
        JSON.stringify({
          type: "room_message",   
          senderId:message.userId,
          serverId: message.serverId,
          channelId: message.channelId,
          msg: message.content,
        })
      );
    }
  });


}

export function cleanupOnClose(ws: WsType) {
  const user = ws.userId;
  if (!user) return;
  online_users.delete(user);
  console.log(`${user} left the server`);
}

export default msgHandler;
