import { useParams } from "react-router-dom";
import { useServerInfo } from "../hooks/useServerInfo"; 


export default function Room() {
  const { roomid } = useParams<{ roomid: string }>();

  const { serverInfo, isloading } = useServerInfo(roomid); 
  
  if (isloading) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500">
        Loading server information...
      </div>
    );
  }

  if (!serverInfo) {
    return (
      <div className="w-full h-full flex items-center justify-center text-red-500">
        Server with ID {roomid} not found.
      </div>
    );
  }

  return (
    <div className="p-6 h-full flex flex-col bg-gray-50">
      
      <header className="mb-6 pb-3 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800">
          {serverInfo.name || "Untitled Server"}
        </h1>
        <p className="text-sm text-gray-500">
          Room ID: <span className="font-mono bg-gray-200 p-1 rounded text-xs">{roomid}</span>
        </p>
      </header>

      <section className="flex-grow">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">Description</h2>
        <p className="text-gray-600 leading-relaxed">
          {serverInfo.description || "No description provided."}
        </p>
      </section>

      <footer className="mt-6 pt-3 border-t border-gray-200 text-sm text-gray-500">
        <p>Created: {new Date(serverInfo.createdAt).toLocaleDateString()}</p>
        <p>Upvotes: {serverInfo.upvote}</p>
      </footer>
    </div>
  );
}