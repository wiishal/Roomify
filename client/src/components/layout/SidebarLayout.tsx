import { Outlet, useParams } from "react-router-dom";
import Siderbar from "../Channelbar";
import { useEffect, useState } from "react";
import { fetchServerInfo } from "../../services/services.server";
import { Channel, Server } from "../../type/type";

export default function SidebarLayout() {
  const params = useParams();
  const [server, setServer] = useState<Server | null>(null);
  const [isError, setIsError] = useState<string | null>(null);
  console.log("params of sidebar layout", params);
  useEffect(() => {
    async function fetch(roomid: string) {
      const res = await fetchServerInfo(roomid);
      if (!res) {
        setIsError("error while getting channels");
        return;
      }
      setServer(res.server);
    }
    if (params.roomid) {
      fetch(params.roomid);
    } else {
      setIsError("cant get channels");
    }
  }, [params.roomid]);
  return (
    <div className="h-full w-full flex flex-row">
      <div className="w-1/4 border">
        <Siderbar server={server}  />
      </div>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
