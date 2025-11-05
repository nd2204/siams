import { authService } from "@/services/api/auth-service";
import type { UserData } from "@/services/api/dtos/auth/user-data";
import type { AxiosError } from "axios";
import React, { createContext, useCallback, useEffect, useState } from "react"

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean, error?: any }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean, error?: any }>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
}

interface Props {
  children: React.ReactNode
}

interface StoredSession {
  user: UserData;
  token: string;
  refreshToken?: string;
  expiresAt: number; // timestamp
}

// Helper to check if stored session is valid
const isValidSession = (session: StoredSession | null): boolean => {
  if (!session) return false;
  // Check if token expires in the next 5 minutes
  return session.expiresAt > Date.now() + 5 * 60 * 1000;
};

export const AuthProvider = (props: Props) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Helper to persist session
  const persistSession = useCallback((userData: UserData, token: string, refreshToken?: string) => {
    const session: StoredSession = {
      user: userData,
      token,
      refreshToken,
      // Default to 24h from now if no explicit expiry
      expiresAt: Date.now() + 24 * 60 * 60 * 1000
    };
    localStorage.setItem("session", JSON.stringify(session));
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Try to restore session
        const storedSession = localStorage.getItem("session");
        if (!storedSession) {
          setLoading(false);
          return;
        }

        const session: StoredSession = JSON.parse(storedSession);

        if (!isValidSession(session)) {
          throw new Error("Session expired");
        }

        setUser(session.user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to restore session:", error);
        localStorage.removeItem("session");
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login: AuthContextType["login"] = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { user, token, refreshToken } = await authService.signin({ email, password });
      console.log(user, token, refreshToken);
      persistSession(user, token, refreshToken);
      return { success: true };
    } catch (error) {
      const err = error as AxiosError;
      return {
        success: false,
        error: err.response?.data || err.message
      };
    } finally {
      setLoading(false);
    }
  };

  const signup: AuthContextType["signup"] = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      const { user, token, refreshToken } = await authService.signup({ name, email, password });
      persistSession(user, token, refreshToken);
      return { success: true };
    } catch (error) {
      const err = error as AxiosError;
      return {
        success: false,
        error: err.response?.data || err.message
      };
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const session = localStorage.getItem("session");
      if (!session) return false;

      const { refreshToken } = JSON.parse(session) as StoredSession;
      if (!refreshToken) return false;

      const { user, token, refreshToken: newRefreshToken } = await authService.refresh(refreshToken);
      persistSession(user, token, newRefreshToken);
      return true;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      return false;
    }
  };

  const logout: AuthContextType["logout"] = () => {
    localStorage.removeItem("session");
    setUser(null);
    setIsAuthenticated(false);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    loading,
    login,
    signup,
    logout,
    refreshToken
  };

  return (
    <AuthContext.Provider value={value} >
      {props.children}
    </ AuthContext.Provider>
  )
}

