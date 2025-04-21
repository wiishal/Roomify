import axios from "axios";
import { BaseResponce, loginResponce } from "../type/Response.type";

const url = import.meta.env.VITE_API_URL;
export async function login(userdetails: {
  username: string;
  password: string;
}): Promise<loginResponce> {
  try {
    const res = await axios.post(`${url}/api/v1/auth/login`, {
      userdetails,
    });

    return {
      ...res.data,
      success: true,
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        status: error.response.status,
        message: error.response.data.message || "Token verification failed",
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

export async function verifyToken(token: string): Promise<BaseResponce> {
  if (!token) {
    console.error("Token Not present!!");

    return {
      success: false,
      message: "Token Not present",
      status: 401,
    };
  }
  try {
    await axios.post(`${url}/api/v1/auth/verify`, { token });
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
