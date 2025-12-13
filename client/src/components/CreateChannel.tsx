import { Dispatch, SetStateAction, useState } from "react";
import { createChannel } from "../services/services.server";

export default function CreateChannel({
  serverid,
  category,
  setIsCreateChannelCardOpen,
  refetchChannel,
}: {
  serverid: number;
  category: string;
  setIsCreateChannelCardOpen: Dispatch<SetStateAction<boolean>>;
  refetchChannel: (serverid: string | number) => Promise<void>;
}) {
  const [channel, setChannel] = useState<string>("");

  async function CreateChannel() {
    if (channel === "" && !serverid && !category) {
      alert("Empty input");
      return;
    }
    const channelInfo = {
      name: channel,
      serverid: serverid,
      category: category,
    };
    const res = await createChannel(channelInfo);
    if (!res.success) {
      alert(res.message || "failed during creating channel");
      return;
    }
    if (!res.channel) {
      alert("channel did not received");
      return;
    }
    alert(`channel ${res.channel.name} created`);
    refetchChannel(serverid);
    setIsCreateChannelCardOpen(false);
  }
  return (
    <div className="border bg-slate-100 p-3 rounded-sm">
      <div className="flex justify-between p-3">
        <h1 className="text-xl">Create Channel</h1>
        <button
          className="text-white bg-red-500 px-3  rounded"
          onClick={() => setIsCreateChannelCardOpen(false)}
        >
          x
        </button>
      </div>

      <div className="flex flex-col m-3 gap-3">
        <p>{category}</p>
        <input
          onChange={(e) => setChannel(e.target.value)}
          className="p-3 border border-neutral-300"
          type="text"
          value={channel}
          placeholder="Enter Text"
        />
        <button
          onClick={CreateChannel}
          className="w-fit  text-white bg-blue-600 px-4 py-2 rounded"
        >
          Done
        </button>
      </div>
    </div>
  );
}
