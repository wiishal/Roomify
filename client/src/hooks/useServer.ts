import { useCallback, useEffect, useState } from "react";
import { Server } from "../type/type";
import { getServers } from "../services/services.server";

export default function useServer() {
  const [server, setServer] = useState<Server[] | []>([]);
  const [isLoading, setLoading] = useState(true);

  const fetchServers = useCallback(async () => {
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
    } catch {
      setLoading(false);
      alert("expected error accured");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchServers();
  }, [fetchServers]);

  return { server, isLoading, refetch: fetchServers };
}
