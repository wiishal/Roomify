import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

import { prisma } from "../lib/prisma";
import { CheckCreadentialResponse, LoginInUserResponse, SignInUserResponse } from "../types/auth.types";

export async function SignInUser(userdetails: {
  username: string;
  password: string;
  email: string;
}): Promise<SignInUserResponse> {
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
    return { success: true, message: "user created!", user: user };
  } catch (error) {
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
}): Promise<LoginInUserResponse> {
  try {
    const CurrentUser = await prisma.user.findUnique({
      where: {
        username: userdetails.username,
      },
    });
    if (!CurrentUser) {
      return { success: false, message: "no user found" };
    }
    if (CurrentUser.password !== userdetails.password) {
      return { success: false, message: "wrong password" };
    }
    return { success: true, message: "user found!", user: CurrentUser };
  } catch (error) {
    return {
      success: false,
      message: "unexpected error occured while login user",
    };
  }
}


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
    const token = jwt.sign({ username: username, id: id }, secret);
    return token;
  } catch (error) {
    console.error("error while signing token: ", error);
    return false;
  }
}

