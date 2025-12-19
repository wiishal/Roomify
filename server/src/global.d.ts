import { AuthUser } from "./types/Responce";
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

declare module "ws" {
  interface WebSocket {
    user?:AuthUserWS
  }
}



export {};
