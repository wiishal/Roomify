import { Outlet } from "react-router-dom";
import Channelbar from "../bars/Channelbar";

export default function SidebarLayout() {
  return (
    <div className="h-full w-full flex flex-row">
        <Channelbar />

      <div className="flex-1 min-h-0">
        <Outlet />
      </div>
    </div>
  );
}
