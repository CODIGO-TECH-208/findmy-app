import React, { createContext, useContext, useState, ReactNode } from "react";
import { User, currentUser } from "@/data/mockData";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
}

interface RegisterData {
  name: string;
  email: string;
  studentId: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login - in production, this would call an API
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    if (email && password) {
      setUser(currentUser);
      return true;
    }
    return false;
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    // Mock registration
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    if (data.email && data.password && data.name && data.studentId) {
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: data.name,
        email: data.email,
        studentId: data.studentId,
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
