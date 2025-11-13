import React, { createContext, useContext, useState, useEffect } from "react";
import { getToken, clearToken, setToken as saveToken } from "@/lib/api";

interface AuthContextType {
  isAuthenticated: boolean;
  email: string | null;
  token: string | null;
  login: (token: string, email: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = getToken();
    const storedEmail = localStorage.getItem("jif_email");
    
    if (storedToken) {
      setIsAuthenticated(true);
      setTokenState(storedToken);
      setEmail(storedEmail);
    }
    
    setLoading(false);
  }, []);

  const login = (newToken: string, userEmail: string) => {
    saveToken(newToken);
    localStorage.setItem("jif_email", userEmail);
    setTokenState(newToken);
    setEmail(userEmail);
    setIsAuthenticated(true);
  };

  const logout = () => {
    clearToken();
    localStorage.removeItem("jif_email");
    setTokenState(null);
    setEmail(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, email, token, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
