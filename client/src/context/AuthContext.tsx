import React, { createContext, ReactNode, useEffect, useState } from "react";
import { verifyToken } from "../services/services.user";

export interface AuthContextTypes {
  isLogged: boolean;
  login: (token: string) => void;
  logout: () => void;
}
export const AuthContext = createContext<AuthContextTypes | null>(null);

export const AuthContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLogged, setIsLogged] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLogged(false);
      return;
    }
    verifyToken(token)
      .then((res) => setIsLogged(res.success))
      .catch(() => setIsLogged(false));
  }, [isLogged]);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setIsLogged(true);
  };
  const logout = () => {
    localStorage.removeItem("token");
    setIsLogged(false);
  };
  return (
    <AuthContext.Provider value={{ isLogged, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
