import axios, { isAxiosError } from "axios";
const url = "http://localhost:4000";

export async function getServer() {
  try {
    const res = await axios.get(`${url}/api/v1/server`);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        status: error.response.status,
        data: error.response.data,
      };
    }

    console.error("error during fetching server: ", error);
    return false;
  }
}

export async function fetchServerInfo(roomid: string) {
  try {
    const res = await axios.get(`${url}/api/v1/server/serverinfo/${roomid}`);
    if (!res) {
      alert("error ");
    }
    return res.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      return {
        status: error.response.status,
        data: error.response.data,
      };
    }
  }
}

export async function createServer(server: { name: string }) {
  if (!server) return false;

  try {
    const res = await axios.post(`${url}/api/v1/server/create`, { server });
    return res.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      return {
        status: error.response.status,
        data: error.response.data,
      };
    }
  }
}
