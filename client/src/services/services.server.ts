import axios, { isAxiosError } from "axios";
import {
  BaseResponse,
  CreateChannelResponse,
  CreateServerResponse,
  FetchChannelResponce,
  GetjoinrequestResponse,
  GetServerInfo,
  GetServersResponse,
  JoinRequest,
  JoinStatus,
  SendJoinRequestResponse,
} from "../type/Server.type";
import axiosInstance from "./lib/axiosInstance";

export async function sendJoinRequest(joinrequestInfo: {
  serverId: number;
}): Promise<SendJoinRequestResponse> {
  try {
    const res = await axiosInstance.post("/api/v1/server/joinrequest", {
      joinrequestInfo,
    });
    return {
      success: true,
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
// getjoinrequests

export async function getjoinrequests(): Promise<GetjoinrequestResponse> {
  try {
    const res = await axiosInstance.get("/api/v1/server/getjoinrequests");
    console.log(res.data.servers);
    return {
      success: true,
      joinRequest: res.data.joinRequest || [],
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
interface SendJoinRequestResponseParams {
  JoinRequest: JoinRequest;
  responseOfAdmin: boolean;
}
interface SendJoinRequestResResponse extends BaseResponse {
  joinRequestStatus?: JoinStatus;
}

export async function sendJoinRequestResponse(
  params: SendJoinRequestResponseParams
): Promise<SendJoinRequestResResponse> {
  try {
    const res = await axiosInstance.post("/api/v1/server/joinrquestresponce", {
      joinRequest: params.JoinRequest,
      responseOfAdmin: params.responseOfAdmin,
    });

    console.log(res, "server,service");
    return {
      success: true,
      joinRequestStatus: res.data.joinRequestStatus,
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

export async function getAllServers(): Promise<GetServersResponse> {
  try {
    const res = await axiosInstance.get("/api/v1/server/allservers");
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
        redirect:'/'
      };
    }
    
    return {
      success: false,
      message: "internal or connection error occured",
      status: 404,
      redirect:'/'
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
