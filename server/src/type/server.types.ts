import { Server } from "@prisma/client";

export interface createServerInputs {
  serverName: string;
  userid: number;
  serverDes: string;
}
export interface CreateServer extends BaseResponce {
  server?: Server;
}
