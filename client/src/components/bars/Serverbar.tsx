import { Link } from "react-router-dom";
import { useState } from "react";
import useServer from "../../hooks/useServer";
import CreateServer from "../CreateServer";
import { Server } from "../../type/type";

export default function Serverbar() {
  const { server } = useServer();
  const [isCreateServer, SetIsCreateServer] = useState<boolean>(false);

  return (
    <div
      className={`flex flex-col h-full w-[10%] items-center bg-white border-r border-gray-200 py-3 space-y-2`}
    >
      {isCreateServer && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <CreateServer onClose={() => SetIsCreateServer(false)} />
        </div>
      )}

      <div className="">
        <Link to={`/`} className="group">
          <div
            className="flex items- justify-center text-black font-extrabold"
            title="Home / Roomify"
          >
            Roomify
          </div>
        </Link>
      </div>

      <div className="w-8 h-px bg-gray-200"></div>

      <div className="flex-1 overflow-y-auto w-full px-2 space-y-2">
        <Link to={`/`}>
          <div
            className={`flex justify-center items-center w-12 h-12 mx-auto rounded-full bg-gray-100 border-2 border-transparent 
                        text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-200 hover:rounded-xl transition-all duration-300`}
            title="Direct Messages"
          >
            DM
          </div>
        </Link>

        {server && server.length > 0 && (
          <>
            {server.map((s: Server) => (
              <Link key={s.id} to={`/room/${s.id}/`}>
                <div
                  className={`flex justify-center items-center w-12 h-12 mx-auto rounded-full bg-gray-300 text-gray-800 font-semibold text-lg capitalize 
                              hover:bg-blue-600 hover:text-white hover:rounded-xl transition-all duration-300`}
                  title={s.name}
                >
                  {s.name.charAt(0)}
                </div>
              </Link>
            ))}
          </>
        )}
      </div>

      <button
        className={`w-12 h-12 my-2 bg-gray-300 text-gray-800 rounded-full text-2xl font-bold 
                    hover:bg-green-500 hover:text-white hover:rounded-xl transition-all duration-300 leading-none`}
        onClick={() => SetIsCreateServer(true)}
        title="Add Server"
      >
        +
      </button>
    </div>
  );
}
