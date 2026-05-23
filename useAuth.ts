import { useState, useEffect } from "react";
import { authAPI } from "./api";

interface User {
  id: number;
  name: string;
  email: string;
  type: string;
  role: string;
}

// يحفظ بيانات المستخدم في localStorage
export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const u = localStorage.getItem("azza_user");
      return u ? JSON.parse(u) : null;
    } catch { return null; }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("azza_token");
  });

  const [loading, setLoading] = useState(false);

  // لما يفتح الصفحة من جديد، نتحقق من التوكن
  useEffect(() => {
    if (token && !user) {
      setLoading(true);
      authAPI.me()
        .then(u => {
          setUser(u);
          localStorage.setItem("azza_user", JSON.stringify(u));
        })
        .catch(() => logout())
        .finally(() => setLoading(false));
    }
  }, []);

  const login = (tokenValue: string, userData: User) => {
    localStorage.setItem("azza_token", tokenValue);
    localStorage.setItem("azza_user", JSON.stringify(userData));
    setToken(tokenValue);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("azza_token");
    localStorage.removeItem("azza_user");
    setToken(null);
    setUser(null);
  };

  return {
    user,
    token,
    loading,
    isLoggedIn: !!token,
    login,
    logout,
  };
}