import { prisma } from "../lib/prisma";
import { WebSocket as WsType } from "ws";
import { CookieOptions } from "express";

export const defaultChannels = ["rules", "join"];
export const rooms = new Map<number, Set<number>>(); // serverId -> userIds
export const online_users = new Map<number, WsType>();
export const access_tokenCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: false, // for development(true in prod)
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export async function loadRooms() {
  const servers = await prisma.server.findMany({
    include: { members: { select: { id: true } } },
  });

  servers.forEach((server) => {
    const memberIds = new Set(server.members.map((m) => m.id));
    rooms.set(server.id, memberIds);
  });

  console.log("Rooms cache loaded:", rooms.size, "servers");
}
