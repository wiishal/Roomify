import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
const secret = process.env.JWT_SECRET;
import { AuthUser } from "../types/Responce";
import { cache } from "../utils/redis";
export async function tokenVerification(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies.access_token;
  if (!token) {
    res.status(401).json({ message: "unauthorized" });
    return;
  }
  try {
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }
    const userCache = await cache.get(token)
    let decoded :AuthUser;
    if(!userCache){
      decoded = jwt.verify(token, secret) as AuthUser
      await cache.set(token,JSON.stringify(decoded))
    }else{
      decoded = JSON.parse(userCache)
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
    console.log("middleware error: error while verfying token :", error);
  }
}
