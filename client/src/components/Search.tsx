import { useCallback, useEffect, useState } from "react";
import { getAllServers, sendJoinRequest } from "../services/services.server";
import { Server } from "../type/type";


export default function Search() {
  const [servers, setServers] = useState<Server[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const fetchServers = useCallback(async () => {
    setIsLoading(true);
    setError(null); 
    try {
      const response = await getAllServers();

      if (!response.success) {
        setError(response.message || "Failed to fetch servers due to an unknown error.");
        return;
      }
      
      if (!response.servers) {
        setError("Server list is currently unavailable.");
        setServers([]);
        return;
      }

      setServers(response.servers);
    } catch (e) {
      console.error("Error fetching servers:", e);
      setError("A network error occurred while trying to fetch servers.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServers();
  }, [fetchServers]);


  const sendJoinReq = async (s: Server) => {
    try {
      const reqInfo = { serverId: s.id };
      const res = await sendJoinRequest(reqInfo);

      if (!res.success) {
        alert(`Failed to join ${s.name}: ${res.message}`);
        return;
      }

      alert(`Success: ${res.message}`);

      
    } catch (e) {
      console.error("Error sending join request:", e);
      alert(`An error occurred while trying to join ${s.name}.`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Loading servers...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center p-6 bg-gray-50">
      <header className="mb-8 w-full max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          🚀 Available Servers
        </h1>
        <p className="text-gray-500 mt-2">Explore and join a community that interests you.</p>
      </header>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative w-full max-w-2xl mb-6" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline ml-2">{error}</span>
        </div>
      )}

      <div className="w-full max-w-2xl bg-white shadow-xl rounded-lg border border-gray-100 p-4 space-y-3">
        {servers.length === 0 && !error ? (
          <div className="text-center p-8 text-gray-500">
            <p className="text-lg font-medium">No servers found.</p>
            <p className="text-sm">Please check back later or try refreshing.</p>
            <button 
              onClick={fetchServers}
              className="mt-4 px-4 py-2 text-sm font-medium rounded-md text-blue-600 border border-blue-600 hover:bg-blue-50 transition duration-150"
            >
              Refresh List
            </button>
          </div>
        ) : (
          servers.map((s) => (
            <div 
              key={s.id} 
              className="flex justify-between items-center p-4 bg-white hover:bg-gray-50 transition duration-150 rounded-md border border-gray-200"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3 text-indigo-700 font-bold text-sm">
                  {s.name.charAt(0)}
                </div>
                <p className="text-lg font-semibold text-gray-800 truncate">{s.name}</p>
              </div>

              <button 
                className="px-4 py-2 text-sm font-medium rounded-full bg-blue-600 text-white hover:bg-blue-700 transition duration-150 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" 
                onClick={() => sendJoinReq(s)}
              >
                Join Server
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}