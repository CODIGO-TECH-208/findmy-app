import React, { createContext, useContext, useState, ReactNode } from "react";
import { User, mockUsers } from "@/data/mockData";
import { useDbStore } from "@/stores/dbStore";

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
  const addUser = useDbStore((s) => s.addUser);
  const setCurrentUserId = useDbStore((s) => s.setCurrentUserId);

  const login = async (phone: string, password: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (phone && password) {
      // Check if admin login
      if (phone === "0241000000" && password === "admin123") {
        const adminUser = mockUsers.find(u => u.role === "admin");
        if (adminUser) {
          setUser(adminUser);
          setCurrentUserId(adminUser.id);
          return true;
        }
      }
      // Find user by phone in the db store
      const dbUsers = useDbStore.getState().users;
      const found = dbUsers.find(u => u.phone === phone && u.role !== "admin");
      if (found) {
        setUser(found);
        setCurrentUserId(found.id);
        return true;
      }
      // Fallback to first mock user for demo
      const fallback = dbUsers.find(u => u.role !== "admin") || mockUsers[0];
      setUser(fallback);
      setCurrentUserId(fallback.id);
      return true;
    }
    return false;
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (data.phone && data.password && data.name) {
      const newUser = addUser({
        name: data.name,
        phone: data.phone,
        memberSince: new Date().toISOString().split("T")[0],
        isVerified: false,
        role: "user",
      });
      setUser(newUser);
      setCurrentUserId(newUser.id);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setCurrentUserId(null);
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
