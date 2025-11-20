import { useState } from "react";
import CreateChannel from "./CreateChannel";
import { Link } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { useChannel } from "../hooks/useChannel";
import CreateCategory from "./CreateCategory";

export default function RenderChannels({
  adminId,
  serverid,
  isCreateCategoryOpen,
}: {
  isCreateCategoryOpen: boolean;
  serverid: number;
  adminId: number;

}) {
  const [isCreateChannelCardOpen, setIsCreateChannelCardOpen] =
    useState<boolean>(false);
  const user = useUser();
  const { channels, setChannels } = useChannel(serverid);

  console.log("channels", channels);
  return (
    <div>
      {isCreateCategoryOpen && (
        <div className="fixed inset-0 z-10 bg-black bg-opacity-50 flex justify-center items-center">
          <CreateCategory
            CloseCreateCategory={setIsCreateChannelCardOpen}
            setChannels={setChannels}
          />
        </div>
      )}
      {Object.entries(channels).map(([category, channel]) => (
        <div key={category}>
          <div className="flex justify-between text-sm font-bold text-neutral-500">
            <p>{category}</p>
            {adminId === user?.id && (
              <button onClick={() => setIsCreateChannelCardOpen(true)}>
                +
              </button>
            )}
            {isCreateChannelCardOpen && (
              <div className="fixed inset-0 z-10 bg-black bg-opacity-50 flex justify-center items-center">
                <CreateChannel
                  serverid={serverid}
                  category={category}
                  setIsCreateChannelCardOpen={setIsCreateChannelCardOpen}
                />
              </div>
            )}
          </div>

          {channel.map((channel) => (
            <div key={channel.id} className="font-medium text-lg px-2 py-1">
              <Link to={`/room/${channel.serverid}/${channel.id}`}>
                #{channel.name}
              </Link>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
