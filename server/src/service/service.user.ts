import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export async function signToken({
  username,
  userid,
}: {
  username: string;
  userid: number;
}) {
  try {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }
    const token = jwt.sign({ user: username, userid: userid }, secret);
    return token
  } catch (error) {
    console.error("error while signing token: ",error)
    return false
  }
}
