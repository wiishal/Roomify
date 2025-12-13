import type { Channel, JoinRequest, JoinStatus } from "@prisma/client";
import { prisma } from "../lib/prisma";
import {
  CreateChannelResponse,
  createServerInputs,
  CreateServerResponse,
  GetChannelsResponse,
  GetServerInfoResponse,
  GetServersResponse,
} from "../types/server.types";
import { defaultChannels } from "../utils/serverConfig";
import { BaseResponse } from "../types/Responce";
import { saveMessageParams, saveMessageResponse } from "../types/message.type";

export async function createJoinRequest(userId: number, serverId: number) {
  try {
    const serverAdminId = await prisma.server.findUnique({
      where: { id: serverId },
      select: { adminid: true },
    });
    if (!serverAdminId) {
      return { success: false, error: "Error while storing join request" };
    }
    const joinRequest = await prisma.joinRequest.create({
      data: {
        userId: userId,
        serverId: serverId,
        adminId: serverAdminId.adminid,
      },
    });
    return {
      success: true,
      message: "Join request registered!",
    };
  } catch (error) {
    console.log("Error while storing join request: ", error);
    return { success: false, error: "Error while storing join request" };
  }
}

export async function getAllServers(userId: number) {
  try {
    const servers = await prisma.server.findMany({
      where: {
        members: {
          none: { id: userId },
        },
      },
    });

    return {
      success: true,
      message: "Fetched servers not joined by user",
      servers,
    };
  } catch (error) {
    console.log("Error while getting servers: ", error);
    return { success: false, error: "Failed while getting servers" };
  }
}

export async function GetServers(userId: number): Promise<GetServersResponse> {
  try {
    const servers = await prisma.server.findMany({
      where: { members: { some: { id: userId } } },
    });
    return {
      success: true,
      message: "fetched servers successfully",
      servers: servers,
    };
  } catch (error) {
    console.log("error while getting serves : ", error);
    return { success: false, error: "failed during getting servers" };
  }
}

export async function CreateServer({
  serverName,
  userid,
  serverDes,
}: createServerInputs): Promise<CreateServerResponse> {
  if (!serverName) {
    return { success: false, message: "null server name" };
  }

  try {
    const createdServer = await prisma.server.create({
      data: {
        name: serverName,
        adminid: userid,
        profile: "",
        description: serverDes,
        upvote: 0,
        members: {
          connect: { id: userid },
        },
      },
    });

    return { success: true, message: "server created", server: createdServer };
  } catch (error) {
    console.log("error while creating server :", error);
    return { success: false, error: "failed during creating server" };
  }
}

export async function CreateDefaultChannels(
  serverid: number
): Promise<BaseResponse> {
  if (!serverid) {
    return { success: false, message: "server id require" };
  }
  try {
    await prisma.channel.createMany({
      data: defaultChannels.map((channelName) => ({
        name: channelName,
        serverid: serverid,
      })),
    });

    return { success: true, message: "channel created" };
  } catch (error) {
    console.log("erro while creating default channel :", error);
    return {
      success: false,
      error: "failed during creating default channel",
    };
  }
}

export async function GetChannels(
  serverId: number
): Promise<GetChannelsResponse> {
  try {
    const channels = await prisma.channel.findMany({
      where: { serverid: serverId },
    });

    let sortedServers: Record<string, Channel[]> = {};

    channels.forEach((c) => {
      if (!sortedServers[c.category]) {
        sortedServers[c.category] = [];
      }
      sortedServers[c.category].push(c);
    });

    return {
      success: true,
      message: "channels fetched successfully",
      channels: sortedServers,
    };
  } catch (error) {
    console.log("error while getting channels : ", error);
    return { success: false, error: "Error fetching channels" };
  }
}

export async function GetServerInfo(
  serverId: number
): Promise<GetServerInfoResponse> {
  try {
    const server = await prisma.server.findUnique({
      where: { id: serverId },
    });

    return {
      success: true,
      message: "channels fetched successfully",
      server: server,
    };
  } catch (error) {
    console.log("error while getting channels : ", error);
    return { success: false, error: "Error fetching channels" };
  }
}

export async function CreateChannel(channelInfo: {
  name: string;
  serverid: number;
  category: string;
}): Promise<CreateChannelResponse> {
  try {
    const channel = await prisma.channel.create({
      data: {
        name: channelInfo.name,
        serverid: channelInfo.serverid,
        category: channelInfo.category,
      },
    });

    return {
      success: true,
      message: "Channel created successfully",
      channel: channel,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to create channel",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
export async function getJoinRequestEntry(userId: number) {
  try {
    const joinRequests = await prisma.joinRequest.findMany({
      where: { adminId: userId },
    });
    return {
      success: true,
      message: "fetch join request successfully",
      joinRequests: joinRequests,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to create channel",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
export async function updateJoinRequestEntry(
  joinRequest: JoinRequest,
  status: JoinStatus
) {
  try {
    const joinRequests = await prisma.joinRequest.update({
      where: { id: joinRequest.id },
      data: { status: status },
    });
    return {
      success: true,
      message: "join request update successfully",
      joinRequests: joinRequests,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to update join request",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
export async function addMemberToServer(serverId: number, userId: number) {
  try {
    const res = await prisma.server.update({
      where: { id: serverId },
      data: {
        members: {
          connect: { id: userId } 
        }
      }
    });

    return {
      success: true,
      message: "User added to server members",
      server: res
    };

  } catch (error) {
    console.log("Error adding member:", error);
    return {
      success: false,
      message: "Failed to add member",
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

export async function checkMember(
  serverId: number,
  userid: number
): Promise<boolean> {
  try {
    const ismember = await prisma.server.findFirst({
      where: {
        id: serverId,
        members: { some: { id: userid } },
      },
    });

    if (ismember) {
      return true;
    }
    return false;
  } catch (error) {
    console.log("error occured while checking member: service.message.ts");
    return false;
  }
}

export async function checkAdmin(
  serverId: number,
  userid: number
): Promise<boolean> {
  try {
    const ismember = await prisma.server.findFirst({
      where: {
        adminid: userid,
        id: serverId,
      },
    });

    if (ismember) {
      return true;
    }
    return false;
  } catch (error) {
    console.log(
      "error occured while checking server admin: service.message.ts"
    );
    return false;
  }
}
export async function saveMessage(
  message: saveMessageParams
): Promise<saveMessageResponse> {
  try {
    const savedMessage = await prisma.message.create({
      data: {
        userId: message.userId,
        channelId: message.channelId,
        serverId: message.serverId,
        content: message.content,
      },
    });

    return { success: true, message: "message saved!" };
  } catch (error) {
    return { success: false, error: "message not saved!" };
  }
}