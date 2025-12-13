import { Channel, Server } from "@prisma/client";
import { BaseResponse } from "./Responce";

export interface createServerInputs {
  serverName: string;
  userid: number;
  serverDes: string;
}
export interface CreateServerResponse extends BaseResponse {
  server?: Server;
}
export interface GetServersResponse extends BaseResponse {
  servers?: Server[];
}
export interface GetServerInfoResponse extends BaseResponse {
  server?: Server | null;
}
export interface CreateChannelResponse extends BaseResponse {
  channel?: Channel;
}
export interface GetChannelsResponse extends BaseResponse {
  channels?: Record<string, Channel[]>;
}
export enum JoinStatus {
  pending = 'pending',
  accepted = 'accepted',
  rejected = 'rejected'
}