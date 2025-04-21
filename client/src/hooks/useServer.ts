import { useEffect, useState } from "react";
import { Server } from "../type/type";
import { getServers } from "../services/services.server";

export default function useServer() {
  const [server, setServer] = useState<Server[] | []>([]);
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    async function get() {
      try {
        const res = await getServers();
        if (!res.success) {
          alert(res.message || "failed during fetching server");
          return;
        }

        if (!res.servers) {
          alert(res.message || "server not found");
          return;
        }
        setServer(res.servers);
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
