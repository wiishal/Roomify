import { AuthUser } from "./types/Responce";
 declare global {
  namespace Express {
    interface Request {
      user?: AuthUser
    }
  }
}

 declare module "ws" {
  interface WebSocket {
    userId?: number;
    username?:string
  }
}

export {}
