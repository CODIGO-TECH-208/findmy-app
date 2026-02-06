import React, { createContext, useContext, useState, ReactNode } from "react";
import { User, currentUser, mockUsers } from "@/data/mockData";

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
    // Mock login - in production, this would call an API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (phone && password) {
      // Check if admin login
      if (phone === "0241000000" && password === "admin123") {
        const adminUser = mockUsers.find(u => u.role === "admin");
        if (adminUser) {
          setUser(adminUser);
          return true;
        }
      }
      // Regular user login - use current user
      setUser(currentUser);
      return true;
    }
    return false;
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    // Mock registration
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (data.phone && data.password && data.name) {
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: data.name,
        phone: data.phone,
        memberSince: new Date().toISOString().split("T")[0],
        isVerified: false,
      };
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
