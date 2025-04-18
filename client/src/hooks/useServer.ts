import { useEffect, useState } from "react";
import { Server } from "../type/type";
import { getServer } from "../services/services.server";

export default function useServer() {
  const [server, setServer] = useState<Server[] | []>([]);
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    async function get() {
      try {
        const res = await getServer();
        if (!res) {
          setLoading(false);
          alert("failed during fetching server");
        }
        setServer(res.server);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        alert("expected error accured");
      } finally {
        setLoading(false);
      }
    }
    get();
  }, []);

  return { server, isLoading };
}
