import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
const secret = process.env.JWT_SECRET;

export function tokenVerification(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "unauthorized" });
    return;
  }
  try {
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }
    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
    console.log("decoded token", decoded);
    req.user = decoded; //  attaching user info
    next();
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
    console.log("middleware error: error while verfying token :", error);
  }
}
