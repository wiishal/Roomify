import { useState } from "react";
import { createServer } from "../services/services.server";
import useServer from "../hooks/useServer";

type Props = {
  onClose: () => void;
};

export default function CreateServer({ onClose }: Props) {
  const [server, setServer] = useState<{ name: string; description: string }>({
    name: "",
    description: "",
  });
  const { refetch } = useServer();

  async function create() {
    if (server.name == "" || server.description == "") {
      alert("fill the inputs");
      return;
    }
    try {
      const res = await createServer(server);
      if (!res.success) {
        alert(res.message || "failed to create server");
        return;
      }
      if (!res.server) {
        alert(res.message || "something failed while creating server");
      }
      alert(res.message);
      refetch();
    } catch {
      alert("internal server error");
    }
  }
  return (
    <div className="bg-white p-4 rounded shadow-lg">
      <h2 className="text-xl mb-4">Create a New Server</h2>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col">
          <label htmlFor="">Name</label>
          <input
            value={server.name}
            onChange={(e) =>
              setServer((prev) => ({ ...prev, name: e.target.value }))
            }
            className="p-2 border border-neutral-300"
            placeholder="type something..."
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="">description</label>
          <input
            value={server.description}
            onChange={(e) =>
              setServer((prev) => ({ ...prev, description: e.target.value }))
            }
            className="p-2 border border-neutral-300"
            placeholder="type something..."
          />
        </div>
      </div>
      <div className="flex flex-row gap-3">
        <button
          onClick={create}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          create
        </button>
        <button
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
