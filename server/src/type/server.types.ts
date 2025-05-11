import { Server } from "@prisma/client";

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
