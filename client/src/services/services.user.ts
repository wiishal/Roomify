import axios from "axios";
const url = "http://localhost:4000";

export async function login(userdetails: {
  username: string;
  password: string;
}): Promise<any> {
  try {
    const res = await axios.post(`${url}/api/v1/auth/login`, {
      userdetails,
    });

    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        status: error.response.status,
        data: error.response.data,
      };
    }
    console.error("error while login ", error);
    return false;
  }
}

export async function verifyToken(token: string) {
  if (!token) {
    console.error("Token Not present!!");
    return false;
  }
  try {
    const res = await axios.post(`${url}/api/v1/auth/verify`, { token });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        status: error.response.status,
        data: error.response.data,
      };
    }
    console.error("error while verifying user: ", error);
    return false;
  }
}
