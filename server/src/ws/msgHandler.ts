const secret = process.env.JWT_SECRET;
import jwt from "jsonwebtoken";
import { WebSocket as WsType } from "ws";
import { online_users, rooms } from "../utils/serverConfig";
import { Msg, MsgType } from "../types/message.type";
import { pub } from "../utils/redis";

export const msgHandler: Record<MsgType, (ws: WsType, msg: Msg) => void> = {
  auth: handleAuth,
  sendMsgToChannel: handleSendMsgToChannel,
  directMsg: (ws: WsType, msg: Msg) => {},
};

function handleAuth(ws: WsType, msg: Msg) {
  console.log('in auth handler')
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
    ws.userId = decoded.id;
    ws.username = decoded.username
    online_users.set(decoded.id, ws);
    console.log(`${ws.userId} connected`);

    ws.send(JSON.stringify({ type: "auth_success", msg: "user identfied" }));
  } catch (error) {
    ws.send(JSON.stringify({ type: "auth_failed", msg: "token not verified" }));
  }
}

async function handleSendMsgToChannel(ws: WsType, msg: Msg) {
  const current_user = ws.userId;
  if (!current_user) {
    ws.send(JSON.stringify({ type: "auth_falied", msg: "user not validate" }));
    return;
  }

  if (!msg.send_to_server_id || !msg.send_to_channel_id) {
    ws.send(JSON.stringify({ type: "error", msg: "missing msg info" }));
    return;
  }
  const isServerMember = rooms.get(msg.send_to_server_id)?.has(current_user)

  if (!isServerMember) {
    ws.send(
      JSON.stringify({ type: "error", msg: "not a member of current server" })
    );
    return;
  }

  const message = {
    serverId: msg.send_to_server_id,
    channelId: msg.send_to_channel_id,
    userId: current_user,
    content: msg.message_content || "",
    senderUsername:ws.username
  };
  
  // const saveMsg = await saveMessage(message);
  // if (!saveMsg.success) {
    //   ws.send(JSON.stringify({ type: "error", msg: "failed to send message!" }));
    //   return;
    // }
    pub.publish('messageBroker',JSON.stringify(message))
}
