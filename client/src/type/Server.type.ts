import { Channel, Server } from "./type";

export interface BaseResponse {
  success: boolean;
  message?: string;
  status?: number;
}

export interface loginResponse extends BaseResponse {
  token?: string;
}

export interface FetchChannelResponce extends BaseResponse {
  channels?: Record<string, Channel[]>;
  serverInfo?: Server;
}
export interface GetServersResponse extends BaseResponse {
  servers?: Server[];
}
export interface CreateServerResponse extends BaseResponse {
  server?: Server;
}
export interface CreateChannelResponse extends BaseResponse {
  channel?: Channel;
}
export interface GetServerInfo extends BaseResponse {
  serverInfo?: Server;
}
