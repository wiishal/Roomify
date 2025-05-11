import { useEffect, useState } from "react";
import { fetchChannels } from "../services/services.server";
import { Channel, Server } from "../type/type";

export function useChannel(serverid: string | undefined) {
  const [channels, setChannels] = useState<Record<string, Channel[]>>({});
  const [serverInfo, setServerinfo] = useState<Server | null>(null);

  useEffect(() => {
    if (!serverid) return;
    fetch(serverid);
  }, [serverid]);

  async function fetch(serverid: string) {
    const token = localStorage.getItem("token");
    const res = await fetchChannels(serverid, token);
    if (!res.success) {
      alert(res.message || "failed to get server");
      return;
    }
    if (!res.channels) {
      alert(res.message || "unable to get server channels");
      return;
    }
    if (!res.serverInfo) {
      alert(res.message || "unable to get serverinfo");
      return;
    }
    setChannels(res.channels);
    setServerinfo(res.serverInfo);
    console.log(res.channels, ": from sidebar");
  }

  return { channels, serverInfo, setChannels, refetchChannel: fetch };
}
