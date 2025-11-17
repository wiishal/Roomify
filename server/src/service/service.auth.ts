import dotenv from "dotenv";

dotenv.config();

import { prisma } from "../lib/prisma.js";
import { LoginInUserResponse } from "../types/auth.types.js";


export async function SignInUser(userdetails: {
  username: string;
  password: string;
  email: string;
}): Promise<LoginInUserResponse> {
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
    console.error("error while Signin user: ", error);
    return {
      success: false,
      message: "unexpected error occured while login user",
    };
  }
}
