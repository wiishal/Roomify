import { JwtPayload } from "jsonwebtoken";
import "ws";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

declare module "ws" {
  interface WebSocket {
    userId?: number;
  }
}
