import React, { createContext, useContext, useState } from "react";
import { getUser, clearAuth, isLoggedIn as checkAuth, saveAuth } from "@/api";

interface AuthContextType {
  user: any;
  loading: boolean;
  isLoggedIn: boolean;
  login: (token: string, user: any) => void;
  logout: () => void;
  updateUser: (data: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(getUser());
  const [loading, setLoading] = useState(false);

  const login = (token: string, userData: any) => {
    saveAuth(token, userData);
    setUser(userData);
  };

  const logout = () => {
    clearAuth();
    setUser(null);
    window.location.href = "/";
  };
const updateUser = (data: any) => {
  const updated = { ...user, ...data };
  // احفظ في localStorage
  localStorage.setItem('user', JSON.stringify(updated));
  setUser(updated);
};
  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isLoggedIn: checkAuth(),
      login,
      logout,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext must be used within AuthProvider");
  return context;
}