import { JSX, useState } from "react";
import { Link, useParams } from "react-router-dom";
import RenderChannels from "../RenderChannels";
import { useUser } from "../../hooks/useUser";
import { useServerInfo } from "../../hooks/useServerInfo";

export default function Channelbar(): JSX.Element {
  const user = useUser();
  const params = useParams();
  const { serverInfo,loading } = useServerInfo(params.roomid);
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] =
    useState<boolean>(false);

  return (
    <div className="w-full h-full shadow-md p-2 font-mono">
      <div className="flex justify-between border font-semibold p-2">
        <Link to={`/room/${serverInfo?.id}/`}>
          <p>{serverInfo?.name || "loading.."}</p>
        </Link>

        {serverInfo?.adminid === user?.id && (
          <button onClick={() => setIsCreateCategoryOpen(true)}>+</button>
        )}
      </div>
      {loading && <div><p className="font-semibold">Loading...</p></div>}
      {serverInfo ? (
        <div className="p-2">
          <RenderChannels
            isCreateCategoryOpen={isCreateCategoryOpen}
            serverid={serverInfo?.id}
            adminId={serverInfo?.adminid}
          />  
        </div>
      ) : (
        <div>no channels</div>
      )}
    </div>
  );
}
