import { useEffect, useState } from "react";
import { verifyToken } from "../services/services.user";

export function useAuth() {
  const [isLogged, setIsLogged] = useState<boolean | null>(null);
  console.log(isLogged);
  useEffect(() => {
    async function verify() {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLogged(false);
        return false;
      }
      try {
        const res = await verifyToken(token);
        if (!res.success) {
          setIsLogged(false);
          return;
        }
        setIsLogged(true);
        return;
      } catch (error) {
        alert("error while verify");
        console.log("verify error : ", error);
        setIsLogged(false);
      }
    }

    verify();
  }, []);

  return { isLogged, setIsLogged };
}
