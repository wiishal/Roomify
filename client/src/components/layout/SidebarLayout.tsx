import { Outlet } from "react-router-dom";
import Channelbar from "../bars/Channelbar";

export default function SidebarLayout() {
  return (
    <div className="h-full w-full flex flex-row">
      <div className="w-1/4 border">
        <Channelbar />
      </div>

      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
