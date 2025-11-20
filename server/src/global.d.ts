
 declare global {
  namespace Express {
    interface Request {
      user?: import("jsonwebtoken").JwtPayload
    }
  }
}

 declare module "ws" {
  interface WebSocket {
    userId?: number;
  }
}

export {}
