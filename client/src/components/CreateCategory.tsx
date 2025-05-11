import { Dispatch, SetStateAction, useState } from "react";
import { Channel } from "../type/type";

export default function CreateCategory({
  Close,
  setChannels,
}: {
  Close: () => any;
  setChannels: Dispatch<SetStateAction<Record<string, Channel[]>>>;
}) {
  const [category, setCategory] = useState<string>("");
  return (
    <div className="border bg-slate-100 p-3 rounded-sm">
      <div className="flex justify-between p-3">
        <h1 className="text-xl">Create category</h1>
        <button onClick={Close} className="text-white bg-red-500 px-3  rounded">
          x
        </button>
      </div>
      <div className="flex flex-col m-3 gap-3">
        <input
          className="p-3 border border-neutral-300"
          type="text"
          placeholder="Enter Text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <button
          className="w-fit  text-white bg-blue-600 px-4 py-2 rounded"
          onClick={() => {
            setChannels((prev) => ({ ...prev, [category]: [] }));
            setCategory("");
          }}
        >
          Done
        </button>
      </div>
    </div>
  );
}
