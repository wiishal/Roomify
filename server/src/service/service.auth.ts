import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

import { prisma } from "../lib/prisma";

interface signInResponse extends BaseResponce {
  isEmailExisted?: boolean;
  isUsernameExisted?: boolean;
}
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
    return token;
  } catch (error) {
    console.error("error while signing token: ", error);
    return false;
  }
}

export async function CheckCreadential(userdetails: {
  username: string;
  password: string;
  email: string;
}): Promise<signInResponse> {
  try {
    const user = await prisma.user.findMany({
      where: {
        OR: [{ username: userdetails.username }, { email: userdetails.email }],
      },
    });

    if (user.length === 0) {
      return {
        success: true,
        isUsernameExisted: false,
        isEmailExisted: false,
        message: " user doesn't exist",
      };
    }

    const username = user.some((user) => user.username == userdetails.username);
    const email = user.some((user) => user.email == userdetails.email);

    return {
      success: true,
      isUsernameExisted: username,
      isEmailExisted: email,
      message: "user found",
    };
  } catch (error) {
    return { success: false, message: "failed during checking creadential" };
  }
}
export async function SignInUser(userdetails: {
  username: string;
  password: string;
  email: string;
}): Promise<BaseResponce> {
  try {
    const user = await prisma.user.create({
      data: {
        username: userdetails.username,
        password: userdetails.password,
        email: userdetails.email,
        profile:
          "https://res.cloudinary.com/ddg85vpnk/image/upload/v1745951138/profile_luwb0s.jpg",
      },
    });
    if (!user) {
      return { success: false, message: "Error while creating user" };
    }
    return { success: true, message: "user created!" };
  } catch (error) {
    console.error("error while Signin user: ", error);
    return {
      success: false,
      message: "unexpected error occured while creating user",
    };
  }
}

export async function LoginInUser(userdetails: {
  username: string;
  password: string;
  email: string;
}): Promise<BaseResponce> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: userdetails.username,
      },
    });
    if (!user) {
      return { success: false, message: "no user found" };
    }
    if (user.password !== userdetails.password) {
      return { success: true, message: "user found!" };
    }
    return { success: false, message: "wrong password" };
  } catch (error) {
    console.error("error while Signin user: ", error);
    return {
      success: false,
      message: "unexpected error occured while creating user",
    };
  }
}
