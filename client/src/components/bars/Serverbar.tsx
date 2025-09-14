import { Link } from "react-router-dom";
import { useState } from "react";
import useServer from "../../hooks/useServer";
import CreateServer from "../CreateServer";
import { Server } from "../../type/type";

export default function Serverbar() {
  const { server } = useServer();
  console.log(server);
  const [isCreateServer, SetIsCreateServer] = useState<boolean>(false);
  return (
    <div className="flex flex-col h-full w-full p-2 font-mono">
      <div className="p-2">
        <Link to={`/`}>
          <h1 className="font-semibold text-sm">Roomify</h1>
        </Link>
      </div>
      {isCreateServer && (
        <div className="fixed inset-0 z-10 bg-black bg-opacity-50 flex justify-center items-center">
          <CreateServer onClose={() => SetIsCreateServer(false)} />
        </div>
      )}
      {server && server.length > 0 ? (
        <div className="flex-1  overflow-auto flex flex-col gap-2 my-2 ">
          {server.map((s: Server) => (
            <Link key={s.id} to={`/room/${s.id}/`}>
              <div
                className={`flex justify-center rounded-md items-center border py-1 shadow-lg`}
              >
                <p className="font-semibold text-sm capitalize w-fit text-black py-2">
                  {s.name.charAt(0)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div><p className="font-semibold">Loading...</p></div>
      )}

      <button
        className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => SetIsCreateServer((prev) => !prev)}
      >
        +
      </button>
    </div>
  );
}
