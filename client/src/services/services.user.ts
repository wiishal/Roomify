import axios from "axios";
import { BaseResponse, loginResponse } from "../type/Server.type";
import axiosInstance from "./lib/axiosInstance";

const url = import.meta.env.VITE_API_URL;

export async function login(userdetails: {
  username: string;
  password: string;
}): Promise<loginResponse> {
  try {
    const res = await axiosInstance.post(`/api/v1/auth/login`, {
      userdetails,
    });

    return {
      success: true,
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        status: error.response.status,
        message: error.response.data.message || "Failed to log in",
        success: false,
      };
    }
    console.error("error while login ", error);

    return {
      status: 500,
      message: "Network or server error occurred",
      success: false,
    };
  }
}

export async function signIn(userdetails: {
  username: string;
  password: string;
  email: string;
}): Promise<loginResponse> {
  try {
    const res = await axiosInstance.post(`/api/v1/auth/signin`, {
      userdetails,
    });

    return {
      success: true,
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        status: error.response.status,
        message: error.response.data.message || "failed during sign in",
        success: false,
      };
    }
    console.error("error while sign ", error);

    return {
      status: 500,
      message: "Network or server error occurred",
      success: false,
    };
  }
}

export async function verifyToken( ): Promise<BaseResponse> {
  
  try {
    const res = await axiosInstance.get(`/api/v1/auth/verify`);
    console.log(res)
    return {
      success: true,
      message: "verified",
      status: 200,
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        status: error.response.status,
        message: error.response.data.message,
      };
    }
    console.error("error while verifying user: ", error);
    return {
      success: false,
      message: "Network or server error occurred",
      status: 500,
    };
  }
}
