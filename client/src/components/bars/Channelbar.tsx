import { JSX, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CreateCategory from "../CreateCategory";
import RenderChannels from "../RenderChannels";
import { useUser } from "../../hooks/useUser";
import { useChannel } from "../../hooks/useChannel";

export default function Channelbar(): JSX.Element {
  const user = useUser();
  const params = useParams();
  const { channels, serverInfo, setChannels } = useChannel(params.roomid);
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] =
    useState<boolean>(false);

  return (
    <div className="w-full h-full shadow-md p-2 font-mono">
      {isCreateCategoryOpen && (
        <div className="fixed inset-0 z-10 bg-black bg-opacity-50 flex justify-center items-center">
          <CreateCategory
            Close={() => setIsCreateCategoryOpen(false)}
            setChannels={setChannels}
          />
        </div>
      )}

      <div className="flex justify-between border font-semibold p-2">
        <Link to={`/room/${serverInfo?.id}/`}>
          <p>{serverInfo?.name}</p>
        </Link>

        {serverInfo?.adminid === user?.id && (
          <button onClick={() => setIsCreateCategoryOpen(true)}>+</button>
        )}
      </div>
      {channels && serverInfo && Object.entries(channels)[0].length > 0 ? (
        <div className="p-2">
          <RenderChannels
            serverid={serverInfo?.id}
            channels={channels}
            adminId={serverInfo?.adminid}
          />
        </div>
      ) : (
        <div>no channels</div>
      )}
    </div>
  );
}
