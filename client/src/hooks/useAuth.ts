import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    console.error("can't get useAuthcontext : Auth ctx provider!1");
    throw new Error("use Auth must be inside AuthProvider")
  }
  return ctx;
};
