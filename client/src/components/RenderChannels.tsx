import { useState } from "react";
import { Channel } from "../type/type";
import CreateChannel from "./CreateChannel";
import { Link } from "react-router-dom";
import { useUser } from "../hooks/useUser";

export default function RenderChannels({
  channels,
  adminId,
  serverid,
}: {
  serverid: number;
  channels: Record<string, Channel[]>;
  adminId: number | undefined;
}) {
  const [isCreateChannelCardOpen, setIsCreateChannelCardOpen] =
    useState<boolean>(false);
  const user = useUser();
  return (
    <div>
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
                  Close={() => setIsCreateChannelCardOpen(false)}
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
