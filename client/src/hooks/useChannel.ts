import { useCallback, useEffect, useState } from "react";
import { fetchChannels } from "../services/services.server";
import { Channel } from "../type/type";

export function useChannel(serverid: number | string | undefined) {
  const [channels, setChannels] = useState<Record<string, Channel[]>>({});

  const loadChannels = useCallback(
    async (serverid: number | string) => {
      console.log("refetch triggere on channels", serverid);
      const res = await fetchChannels(serverid);
      if (!res.success) {
        alert(res.message || "failed to get server");
        return;
      }
      if (!res.channels) {
        alert(res.message || "unable to get server channels");
        return;
      }
      setChannels({ ...res.channels });
      console.log(res.channels, ": from useChannels");
    },
    [serverid]
  );
  useEffect(() => {
    if (!serverid) return;
    loadChannels(serverid);
  }, [loadChannels]);

  return { channels, setChannels, refetchChannel: loadChannels };
}
