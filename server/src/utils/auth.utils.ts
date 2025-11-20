
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { CheckCreadentialResponse } from "../types/auth.types";

export async function CheckCreadential(userdetails: {
  username: string;
  password: string;
  email: string;
}): Promise<CheckCreadentialResponse> {
  try {
    const user = await prisma.user.findMany({
      where: {
        OR: [{ username: userdetails.username }, { email: userdetails.email }],
      },
    });

    if (user.length === 0) {
      return {
        success: true,
        isUserExist: false,
        isUsernameExisted: false,
        isEmailExisted: false,
      };
    }

    const username = user.some((user) => user.username == userdetails.username);
    const email = user.some((user) => user.email == userdetails.email);

    return {
      success: true,
      isUserExist: true,
      isUsernameExisted: username,
      isEmailExisted: email,
      message: "user found",
    };
  } catch (error) {
    return { success: false, message: "failed during checking creadential" };
  }
}

export async function signToken({
  username,
  id,
}: {
  username: string;
  id: number;
}) {
  try {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }
    const token = jwt.sign({ user: username, id: id }, secret);
    return token;
  } catch (error) {
    console.error("error while signing token: ", error);
    return false;
  }
}
