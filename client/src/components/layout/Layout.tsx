import { Outlet } from "react-router-dom";
import Serverbar from "../bars/Serverbar";
import StatusBar from "../bars/StatusBar";

export default function Layout() {
  return (
    <div className="w-full h-full flex flex-row min-h-0">
      
      <Serverbar />

      <div className="flex flex-col w-full min-h-0">
        
        <StatusBar />

        <div className="flex-1 min-h-0">
          <Outlet />
        </div>

      </div>
    </div>
  );
}
