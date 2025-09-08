import { useEffect, useState } from "react";
import { fetchChannels } from "../services/services.server";
import { Channel } from "../type/type";

export function useChannel(serverid: number | string | undefined) {
  const [channels, setChannels] = useState<Record<string, Channel[]>>({});

  useEffect(() => {
    if (!serverid) return;
    fetch(serverid);
  }, [serverid]);

  async function fetch(serverid: number | string) {
    const res = await fetchChannels(serverid);
    if (!res.success) {
      alert(res.message || "failed to get server");
      return;
    }
    if (!res.channels) {
      alert(res.message || "unable to get server channels");
      return;
    }
    setChannels(res.channels);
    console.log(res.channels, ": from sidebar");
  }

  return { channels, setChannels, refetchChannel: fetch };
}
