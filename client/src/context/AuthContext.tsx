import React, { createContext, ReactNode, useEffect, useState } from "react";
import { verifyToken } from "../services/services.user";

export interface AuthContextTypes {
  isLogged: boolean;
  setIsLogged: React.Dispatch<React.SetStateAction<boolean>>
}
export const AuthContext = createContext<AuthContextTypes | null>(null);

export const AuthContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLogged, setIsLogged] = useState<boolean>(false);
  useEffect(() => {
    verifyToken()
      .then((res) => setIsLogged(res.success))
      .catch(() => setIsLogged(false));
  }, [isLogged]);

  
  return (
    <AuthContext.Provider value={{ isLogged, setIsLogged }}>
      {children}
    </AuthContext.Provider>
  );
};
