import { Channel } from "@prisma/client";
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
