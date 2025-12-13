import { JSX, useState } from "react";
import { Link, useParams } from "react-router-dom";
import RenderChannels from "../RenderChannels";
import { useUser } from "../../hooks/useUser";
import { useServerInfo } from "../../hooks/useServerInfo";

export default function Channelbar(): JSX.Element {
  const user = useUser();
  const params = useParams();
  const { serverInfo, loading } = useServerInfo(params.roomid);
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] =
    useState<boolean>(false);

  const isAdmin = serverInfo?.adminid === user?.id;
  const serverId = params.roomid;

  return (
    <div className="h-full w-64 md:w-72 bg-white text-gray-800 flex flex-col flex-shrink-0 border-r border-gray-200 shadow-md">
      
      <div className="p-4 border-b border-gray-200 sticky top-0 bg-white">
        <div className="flex justify-between items-center">
          
          <Link to={`/room/${serverId}/`} className="flex-grow min-w-0">
            {loading ? (
              <div className="animate-pulse bg-gray-200 h-6 w-3/4 rounded"></div>
            ) : (
              <p className="text-xl font-extrabold text-blue-600 truncate hover:text-blue-700 transition duration-150">
                {serverInfo?.name || "Server Not Found"}
              </p>
            )}
          </Link>

          {isAdmin && (
            <button
              onClick={() => setIsCreateCategoryOpen(true)}
              className="ml-2 p-1.5 text-2xl font-bold text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded transition duration-150 leading-none"
              title="Create new category"
            >
              +
            </button>
          )}
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto custom-scrollbar p-2 space-y-2">
        
        {loading && (
          <div className="px-2 py-4">
            <p className="font-semibold text-sm text-gray-500">Loading Channels...</p>
          </div>
        )}

        {serverInfo ? (
          <div>
            <RenderChannels
              isCreateCategoryOpen={isCreateCategoryOpen}
              setIsCreateCategoryOpen={setIsCreateCategoryOpen}
              serverid={serverInfo.id}
              adminId={serverInfo.adminid}
            />  
          </div>
        ) : (
          !loading && (
            <div className="px-2 py-4 text-center">
              <p className="text-gray-400 text-sm">No channels available or server inaccessible.</p>
            </div>
          )
        )}
      </div>
      
      <div className="p-2 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-600 truncate">
            Logged in as: <span className="font-semibold">{user?.username || 'Guest'}</span>
          </p>
      </div>

    </div>
  );
}