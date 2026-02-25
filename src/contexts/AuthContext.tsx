import React, { createContext, useContext, useState, ReactNode } from "react";
import { User } from "@/data/mockData";
import { useDatabaseStore } from "@/stores/databaseStore";

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

  const login = async (phone: string, password: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (phone && password) {
      const db = useDatabaseStore.getState();
      // Check if admin login
      if (phone === "0241000000" && password === "admin123") {
        const adminUser = db.users.find(u => u.role === "admin");
        if (adminUser) {
          setUser(adminUser);
          return true;
        }
      }
      // Check if user exists by phone
      const existingUser = db.users.find(u => u.phone === phone && u.role !== "admin");
      if (existingUser) {
        setUser(existingUser);
        return true;
      }
      // Fallback to first regular user
      const fallbackUser = db.users.find(u => u.role !== "admin");
      if (fallbackUser) {
        setUser(fallbackUser);
        return true;
      }
    }
    return false;
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (data.phone && data.password && data.name) {
      const db = useDatabaseStore.getState();
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: data.name,
        phone: data.phone,
        memberSince: new Date().toISOString().split("T")[0],
        isVerified: false,
        role: "user",
      };
      db.addUser(newUser);
      setUser(newUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
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
