import { createContext, useContext, useEffect, useState } from "react";

const TOKEN_KEY = "ev-station-token";

const AuthContext = createContext();

const decodeToken = (token) => {
  try {
    const payload = token.split(".")[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [user, setUser] = useState(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    return storedToken ? decodeToken(storedToken) : null;
  });

  useEffect(() => {
    if (!token) {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
      return;
    }

    localStorage.setItem(TOKEN_KEY, token);
    setUser(decodeToken(token));
  }, [token]);

  const login = (nextToken) => {
    setToken(nextToken);
  };

  const logout = () => {
    setToken("");
  };

  const value = {
    token,
    isAuthenticated: Boolean(token),
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
