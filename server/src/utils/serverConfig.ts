import { prisma } from "../lib/prisma.js";


export const defaultChannels = ["rules", "join"];

export const rooms = new Map<number, Set<number>>(); // serverId -> userIds

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
