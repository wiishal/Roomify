import { Outlet, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchServerInfo } from "../../services/services.server";
import { Server } from "../../type/type";
import Channelbar from "../bars/Channelbar";

export default function SidebarLayout() {
  const params = useParams();
  const [server, setServer] = useState<Server | null>(null);
  console.log("params of sidebar layout", params);

  useEffect(() => {
    async function fetch(roomid: string) {
      const res = await fetchServerInfo(roomid);
      if (!res.success) {
        alert(res.message || "failed to get server");
        return;
      }
      if (!res.server) {
        alert(res.message || "unable to get server");
        return;
      }
      setServer(res.server);
    }
    if (params.roomid) {
      fetch(params.roomid);
    }
  }, [params.roomid]);
  return (
    <div className="h-full w-full flex flex-row">
      
      <div className="w-1/4 border">
        <Channelbar server={server} />
      </div>

      <div className="flex-1">
        <Outlet />
      </div>

    </div>
  );
}
