import { Outlet } from "react-router-dom";
import Serverbar from "../bars/Serverbar";

export default function Layout() {
  return (
    <div className="w-screen h-screen flex flex-row">
      <div className="w-30">
        <Serverbar />
      </div>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
