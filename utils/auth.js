// utils/auth.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser, logout } from "./storage";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const u = await getCurrentUser();
      setUser(u);
    };
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
