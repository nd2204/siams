import { authService } from "@/services/api/auth-service";
import type { UserDTO } from "@/services/api/dtos/auth/user-dto";
import type { AxiosError } from "axios";
import React, { createContext, useEffect, useState } from "react"

interface AuthContextType {
  user: UserDTO | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean, error?: any }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean, error?: any }>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface Props {
  children: React.ReactNode
}

export const AuthProvider = (props: Props) => {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    // Try to restore session
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    setLoading(false);
  }, []);

  const login: AuthContextType["login"] = async (email: string, password: string) => {
    try {
      const { user } = await authService.signin({ email, password });
      setUser(user);
      setIsAuthenticated(true);
      return { success: true }
    } catch (error) {
      const err = error as AxiosError
      return {
        success: false,
        error: err.response?.data || err.message
      }
    }
  }

  const signup: AuthContextType["signup"] = async (name: string, email: string, password: string) => {
    try {
      const res = await authService.signup({ name, email, password });
      setUser(res.user);
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: (error as AxiosError).response?.data || 'Login failed'
      }
    }
  }

  const logout: AuthContextType["logout"] = () => {
    localStorage.removeItem('token')
    setUser(null);
    setIsAuthenticated(false)
  }

  const value: AuthContextType = {
    user,
    isAuthenticated,
    loading,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value} >
      {props.children}
    </ AuthContext.Provider>
  )
}

