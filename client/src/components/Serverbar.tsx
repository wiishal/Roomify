import { Link } from "react-router-dom";
import useServer from "../hooks/useServer";
import { Server } from "../type/type";
import { useState } from "react";
import CreateServer from "./CreateServer";

export default function Serverbar() {
  const { server } = useServer();
  const [isCreateServer, SetIsCreateServer] = useState<boolean>(false);
  return (
    <div className="flex flex-col h-full w-full p-2 font-mono">
      <div className="p-2">
        <Link to={`/server`}>
          <h1 className="font-medium">Home</h1>
        </Link>
      </div>
      {isCreateServer && (
        <div className="fixed inset-0 z-10 bg-black bg-opacity-50 flex justify-center items-center">
          <CreateServer onClose={() => SetIsCreateServer(false)} />
        </div>
      )}
      {server.length > 0 ? (
        <div className="flex-1  overflow-auto flex flex-col gap-2 my-2 ">
          {server.map((s: Server) => (
            <Link key={s.roomid} to={`/room/${s.roomid}/`}>
              <div
                className={`flex justify-center rounded-md items-center border py-1 shadow-lg`}
              >
                <p className="font-semibold text-sm capitalize w-fit text-black py-2">
                  {s.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div>null</div>
      )}

      <button
        className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => SetIsCreateServer((prev) => !prev)}
      >
        Create Server
      </button>
    </div>
  );
}
