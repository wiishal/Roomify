import axios, { isAxiosError } from "axios";
import { BaseResponse } from "../type/Response.type";
import { Server } from "../type/type";
const url = import.meta.env.VITE_API_URL;

interface fetchServerInfoResponce extends BaseResponse {
  server?: Server;
}
interface getServersResponse extends BaseResponse {
  servers?: Server[];
}
interface createServerResponse extends BaseResponse {
  server?: Server;
}

export async function getServers(): Promise<getServersResponse> {
  try {
    const res = await axios.get(`${url}/api/v1/server`);
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

export async function fetchServerInfo(
  roomid: string
): Promise<fetchServerInfoResponce> {
  try {
    const res = await axios.get(`${url}/api/v1/server/serverinfo/${roomid}`);
    return {
      success: true,
      server: res.data.server,
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
    const res = await axios.post(`${url}/api/v1/server/create`, { server });
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
