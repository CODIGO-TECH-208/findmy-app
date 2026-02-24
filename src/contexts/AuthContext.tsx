import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { User } from "@/data/mockData";
import { apiLogin, apiRegister, apiLogout } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
}

interface RegisterData {
  name: string;
  phone: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // attempt to hydrate user from token on mount
    // the API returns user on login/register; we keep it in localStorage
    const raw = localStorage.getItem('fm_user');
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {}
    }
  }, []);

  const login = async (emailOrPhone: string, password: string): Promise<boolean> => {
    try {
      const isPhone = /^[0-9+]{6,}$/.test(emailOrPhone);
      const payload = await apiLogin(isPhone ? { phone: emailOrPhone, password } : { email: emailOrPhone, password });
      if (payload?.user) {
        setUser(payload.user);
        localStorage.setItem('fm_user', JSON.stringify(payload.user));
        return true;
      }
    } catch (e) {
      return false;
    }
    return false;
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      const payload = await apiRegister({ name: data.name, email: (data as any).email || `${data.phone}@example.com`, password: data.password, phone: data.phone });
      if (payload?.user) {
        setUser(payload.user);
        localStorage.setItem('fm_user', JSON.stringify(payload.user));
        return true;
      }
    } catch (e) {
      return false;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fm_user');
    apiLogout();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
