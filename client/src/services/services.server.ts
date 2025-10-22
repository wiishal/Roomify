import axios, { isAxiosError } from "axios";
import {
  CreateChannelResponse,
  CreateServerResponse,
  FetchChannelResponce,
  GetServerInfo,
  GetServersResponse,
} from "../type/Server.type";
import axiosInstance from "./lib/axiosInstance";

export async function getServers(): Promise<GetServersResponse> {
  try {
    const res = await axiosInstance.get("/api/v1/server");
    console.log(res.data.servers);
    return {
      success: true,
      servers: res.data.servers,
      message: res.data.message,
      status: 200,
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        status: error.response.status,
        message: error.response.data.message || "failed during getting server",
      };
    }

    console.error("error during fetching server: ", error);
    return {
      success: false,
      message: "internal or connection error occured",
      status: 404,
    };
  }
}
export async function getServerInfo(serverid: string): Promise<GetServerInfo> {
  try {
    const res = await axiosInstance.get(
      `/api/v1/server/serverInfo/${serverid}`
    );
    return {
      success: true,
      serverInfo: res.data.serverInfo,
      message: res.data.message,
    };
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      return {
        success: false,
        status: error.response.status,
        message: error.response.data.message || "failed during getting server",
      };
    }
    return {
      success: false,
      message: "internal or connection error occured",
      status: 404,
    };
  }
}
export async function fetchChannels(
  serverid: number | string
): Promise<FetchChannelResponce> {
  try {
    const res = await axiosInstance.get(`/api/v1/server/channels/${serverid}`);
    return {
      success: true,
      channels: res.data.channels,
      message: res.data.message || "fetched server successfully",
    };
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      return {
        success: false,
        status: error.response.status,
        message: error.response.data.message || "failed during getting server",
      };
    }
    return {
      success: false,
      message: "internal or connection error occured",
      status: 404,
    };
  }
}

export async function createServer(server: {
  name: string;
}): Promise<CreateServerResponse> {
  if (!server)
    return {
      success: false,
      message: "missing server inputs",
      status: 401,
    };

  try {
    const res = await axiosInstance.post(`/api/v1/server/create`, { server });
    return {
      success: true,
      message: res.data.message || "server created successfully",
      status: 200,
      server: res.data.server,
    };
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      return {
        success: false,
        status: error.response.status,
        message: error.response.data.message || "failed during creating server",
      };
    }
    return {
      success: false,
      message: "internal server error",
      status: 404,
    };
  }
}

export async function createChannel(channelInfo: {
  name: string;
  serverid: number;
  category: string;
}): Promise<CreateChannelResponse> {
  if (!channelInfo)
    return {
      success: false,
      message: "missing server inputs",
      status: 401,
    };

  try {
    const res = await axiosInstance.post(`/api/v1/server/createChannel`, {
      channelInfo,
    });
    return {
      success: true,
      message: res.data.message || "channel created successfully",
      status: 200,
      channel: res.data.channel,
    };
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      return {
        success: false,
        status: error.response.status,
        message:
          error.response.data.message || "failed during creating channel",
      };
    }
    return {
      success: false,
      message: "internal server error",
      status: 404,
    };
  }
}
