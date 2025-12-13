import { useState } from "react";
import CreateChannel from "./CreateChannel";
import { Link, useParams } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { useChannel } from "../hooks/useChannel";
import CreateCategory from "./CreateCategory";

export default function RenderChannels({
  adminId,
  serverid,
  isCreateCategoryOpen,
  setIsCreateCategoryOpen,
}: {
  isCreateCategoryOpen: boolean;
  serverid: number;
  adminId: number;
  setIsCreateCategoryOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [isCreateChannelCardOpen, setIsCreateChannelCardOpen] =
    useState<boolean>(false);
  const user = useUser();
  const { channels, setChannels,refetchChannel } = useChannel(serverid);
  const param = useParams();
  const channelid = Number(param.channelid);
  const [selectedCategory, setSelectedCategory] = useState("");

  console.log("channels", channels);
  return (
    <div>
      {isCreateCategoryOpen && (
        <div className="fixed inset-0 z-10 bg-black bg-opacity-50 flex justify-center items-center">
          <CreateCategory
            setIsCreateCategoryOpen={setIsCreateCategoryOpen}
            setChannels={setChannels}
          />
        </div>
      )}
      {isCreateChannelCardOpen && (
        <div className="fixed inset-0 z-10 bg-black bg-opacity-50 flex justify-center items-center">
          <CreateChannel
            serverid={serverid}
            category={selectedCategory}
            setIsCreateChannelCardOpen={setIsCreateChannelCardOpen}
            refetchChannel={refetchChannel}
          />
        </div>
      )}
      {Object.entries(channels).map(([category, channel]) => (
        <div key={category}>
          <div className=" flex justify-between text-sm font-bold text-neutral-500">
            <p>{category}</p>
            {adminId === user?.id && (
              <button
                onClick={() => {
                  setSelectedCategory(category);
                  setIsCreateChannelCardOpen(true);
                }}
              >
                +
              </button>
            )}
          </div>
          {channel.map((channel) => (
            <div key={channel.id} className="font-bold text-sm px-2 py-1">
              <Link to={`/room/${channel.serverid}/${channel.id}`}>
                <div
                  className={`flex ${
                    channel.id == channelid ? "text-blue-600" : "text-black"
                  }`}
                >
                  <p>#{channel.name}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
