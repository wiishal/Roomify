import { useCallback, useEffect, useState } from "react";
import { JoinRequest, JoinStatus } from "../type/Server.type";
import {
  getjoinrequests,
  sendJoinRequestResponse,
} from "../services/services.server";

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

export default function NotificationPage() {
  const [joinRequests, setJoinRequest] = useState<JoinRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fecthJoinRequests = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getjoinrequests();
      if (!res.success) {
        setError(res.message || "Failed to fetch join requests.");
        setJoinRequest([]);
        return;
      }
      setJoinRequest(res.joinRequest ?? []);
    } catch (e) {
      console.error("Error fetching join requests:", e);
      setError("A network error occurred while loading requests.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const replayJoinRequestResponse = async (
    j: JoinRequest,
    response: boolean
  ) => {
    try {
      
      const res = await sendJoinRequestResponse({
        JoinRequest: j,
        responseOfAdmin: response,
      });

      if (!res.success || res.joinRequestStatus === undefined) {
        alert(`Failed to process request: ${res.message || "Unknown error."}`);
        return;
      }

      const updatedStatus: JoinStatus = res.joinRequestStatus;
      setJoinRequest((prev) =>
        prev.map((req) =>
          req.id === j.id ? { ...req, status: updatedStatus } : req
        )
      );
      

    } catch (e) {
      console.error("Error sending response:", e);
      alert("An unexpected error occurred while sending the response.");
    }
  };

  useEffect(() => {
    fecthJoinRequests();
  }, [fecthJoinRequests]);


  const getStatusClasses = (status: JoinStatus) => {
    switch (status) {
      case JoinStatus.pending:
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case JoinStatus.accepted:
        return "bg-green-100 text-green-800 border-green-300";
      case JoinStatus.rejected:
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };
  

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-gray-50 min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500"></div>
        <p className="mt-4 text-gray-600">Loading notifications...</p>
      </div>
    );
  }
  
  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gray-50 min-h-full">
      <header className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          🔔 Notifications & Requests
        </h1>
      </header>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
          <strong className="font-bold">Fetch Error:</strong>
          <span className="block sm:inline ml-2">{error}</span>
        </div>
      )}

      {joinRequests.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-lg shadow-md border border-gray-100">
          <p className="text-xl font-semibold text-gray-500">
            All caught up! 🎉
          </p>
          <p className="mt-2 text-gray-400">
            There are no pending join requests at this time.
          </p>
          <button 
            onClick={fecthJoinRequests}
            className="mt-4 px-4 py-2 text-sm font-medium rounded-md text-purple-600 border border-purple-600 hover:bg-purple-50 transition duration-150"
          >
            Check Again
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {joinRequests.map((j) => (
            <div
              key={j.id}
              className="flex flex-col md:flex-row md:justify-between items-start md:items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition duration-200"
            >
              <div className="flex-1 space-y-1 md:space-y-0 md:flex md:items-center md:gap-4 w-full">
                <p className="font-medium text-gray-800">
                  <span className="text-purple-600 mr-1">Request:</span>
                  User {j.userId} wants to join Server {j.serverId}
                </p>
                
                <span 
                  className={`text-xs font-semibold px-3 py-1 rounded-full border ${getStatusClasses(j.status)}`}
                >
                  {capitalize(j.status)}
                </span>
              </div>

              {j.status === JoinStatus.pending && (
                <div className="flex gap-3 mt-3 md:mt-0">
                  <button
                    onClick={() => replayJoinRequestResponse(j, true)}
                    className="px-3 py-1.5 text-sm font-semibold rounded-lg bg-green-500 text-white hover:bg-green-600 transition duration-150 shadow-sm"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => replayJoinRequestResponse(j, false)}
                    className="px-3 py-1.5 text-sm font-semibold rounded-lg bg-red-500 text-white hover:bg-red-600 transition duration-150 shadow-sm"
                  >
                    Reject
                  </button>
                </div>
              )}
              
              {j.status !== JoinStatus.pending && (
                <p className="mt-3 md:mt-0 text-sm text-gray-500 italic">
                  Status: {capitalize(j.status)}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}