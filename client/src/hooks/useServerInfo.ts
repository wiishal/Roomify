import { useCallback, useEffect, useState } from "react";
import { Server } from "../type/type";
import { getServerInfo } from "../services/services.server";

export function useServerInfo(serverid: string | undefined) {
  const [serverInfo, setServerInfo] = useState<null | Server>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSeverInfo = useCallback(async (serverid: string) => {
    {
      setLoading(true);
      setServerInfo(null);
      const res = await getServerInfo(serverid);
      if (!res.success) {
        alert(res.message || "failed during getting server");
        return;
      }
      if (!res.serverInfo) {
        alert("cannot get serverinfo");
        return;
      }
      setServerInfo(res.serverInfo);
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    if (!serverid) {
      setServerInfo(null);
      return;
    }
    fetchSeverInfo(serverid);
  }, [serverid, fetchSeverInfo]);

  return { serverInfo, loading };
}
