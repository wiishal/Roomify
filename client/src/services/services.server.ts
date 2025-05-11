import axios, { isAxiosError } from "axios";
import { BaseResponse } from "../type/Response.type";
import { Channel, Server } from "../type/type";
const url = import.meta.env.VITE_API_URL;
const token: string = localStorage.getItem("token") || "";

interface fetchChannelResponce extends BaseResponse {
  channels?: Record<string, Channel[]>;
  serverInfo?: Server;
}
interface getServersResponse extends BaseResponse {
  servers?: Server[];
}
interface createServerResponse extends BaseResponse {
  server?: Server;
}

export async function getServers(token: string): Promise<getServersResponse> {
  try {
    const res = await axios.get(`${url}/api/v1/server`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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

export async function fetchChannels(
  serverid: string,
  token: string | null
): Promise<fetchChannelResponce> {
  try {
    const res = await axios.get(`${url}/api/v1/server/channels/${serverid}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return {
      success: true,
      channels: res.data.channels,
      serverInfo: res.data.serverInfo,
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
}): Promise<createServerResponse> {
  if (!server)
    return {
      success: false,
      message: "missing server inputs",
      status: 401,
    };

  try {
    const res = await axios.post(
      `${url}/api/v1/server/create`,
      { server },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
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

interface CreateChannelResponse extends BaseResponse {
  channel?: Channel;
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
    const res = await axios.post(
      `${url}/api/v1/server/createChannel`,
      { channelInfo },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
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
