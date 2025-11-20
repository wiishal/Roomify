// AppRoutes.tsx
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./components/Home";
import Room from "./components/Room";
import Layout from "./components/layout/Layout";
import SidebarLayout from "./components/layout/SidebarLayout";
import ChannelCtx from "./components/ChannelCtx";
import Landingpage from "./components/Landingpage";
import { useAuth } from "./hooks/useAuth";
import { useEffect } from "react";

export default function AppRoutes() {
  const { isLogged, setIsLogged } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLogged === false) {
      navigate("/", { replace: true });
    }
  }, [isLogged,navigate]);

  if (isLogged === null) return <div>Loading...</div>;

  return !isLogged ? (
    <Routes>
      <Route path="*" element={<Landingpage setIsLogged={setIsLogged} />} />
    </Routes>
  ) : (
    <div className="h-screen w-screen flex flex-row-reverse">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/room/:roomid" element={<SidebarLayout />}>
            <Route index element={<Room />} />
            <Route path=":channel" element={<ChannelCtx />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}
