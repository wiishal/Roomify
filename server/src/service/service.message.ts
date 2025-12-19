import { BroadcastToRoomParams } from "../types/message.type";
import { online_users, rooms } from "../utils/serverConfig";
import { WebSocket as WsType } from "ws";

export function broadcastToRoom(message: BroadcastToRoomParams) {
  const memberList = rooms.get(message.serverId);
  online_users.forEach((ws, user) => {
    if (!memberList?.has(user)) return;

    if (ws && ws.readyState === ws.OPEN) {
      ws.send(
        JSON.stringify({
          type: "roomMessage",
          senderId: message.userId,
          serverId: message.serverId,
          senderUsername: message.senderUsername,
          channelId: message.channelId,
          content: message.content,
        })
      );
    }
  });
}

export function cleanupOnClose(ws: WsType) {
  const user = ws.user?.userId;
  if (!user) return;
  online_users.delete(user);
  console.log(`${user} left the server`);
}
