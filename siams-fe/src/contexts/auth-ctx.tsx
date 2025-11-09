import { authService } from "@/services/api/auth-service";
import type { OrganizationUserData, UserData } from "@/services/api/dtos/auth/user-data";
import type { AxiosError } from "axios";
import React, { createContext, useCallback, useEffect, useState } from "react"

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthContextType {
  user: UserData | null;
  activeOrg: OrganizationUserData | null;
  isAuthenticated: boolean;
  loading: boolean;
  setOrg: (org: OrganizationUserData | null) => void
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
  activeOrg?: OrganizationUserData | null;
}

// Helper to check if stored session is valid
const isValidSession = (session: StoredSession | null): boolean => {
  if (!session) return false;
  // Check if token expires in the next 5 minutes
  return session.expiresAt > Date.now() + 5 * 60 * 1000;
};

export const AuthProvider = (props: Props) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [activeOrg, setActiveOrg] = useState<OrganizationUserData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const cleanSession = useCallback(() => {
    console.log("cleaned session")
    localStorage.removeItem("session");
    setUser(null);
    setActiveOrg(null);
    setIsAuthenticated(false);
  }, [])

  // Helper to persist session
  const persistSession = useCallback((userData: UserData, token: string, refreshToken?: string, org?: OrganizationUserData | null) => {
    const session: StoredSession = {
      user: userData,
      token,
      refreshToken,
      activeOrg: org ?? activeOrg,
      // Default to 24h from now if no explicit expiry
      expiresAt: Date.now() + 24 * 60 * 60 * 1000
    };
    localStorage.setItem("session", JSON.stringify(session));
    console.log(session)
    setUser(userData);
    setActiveOrg(session.activeOrg ?? null);
    setIsAuthenticated(true);
  }, [activeOrg]);

  // Allow user to select or change active organization
  const setOrg = (org: OrganizationUserData | null) => {
    setActiveOrg(org);
    const storedSession = localStorage.getItem("session");
    if (storedSession) {
      const session: StoredSession = JSON.parse(storedSession);
      session.activeOrg = org;
      localStorage.setItem("session", JSON.stringify(session));
    }
  };

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
        setActiveOrg(session.activeOrg ?? null);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to restore session:", error);
        cleanSession();
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
      persistSession(user, token, refreshToken, user.organizations?.at(0));
      return { success: true };
    } catch (error) {
      const err = error as AxiosError;
      return { success: false, error: err.response?.data || err.message };
    } finally {
      setLoading(false);
    }
  };

  const signup: AuthContextType["signup"] = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      const { user, token, refreshToken } = await authService.signup({ name, email, password });
      persistSession(user, token, refreshToken, user.organizations?.at(0));
      return { success: true };
    } catch (error) {
      const err = error as AxiosError;
      return { success: false, error: err.response?.data || err.message };
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
      cleanSession();
      return false;
    }
  };

  const logout: AuthContextType["logout"] = () => {
    cleanSession();
  };

  const value: AuthContextType = {
    user,
    activeOrg,
    isAuthenticated,
    loading,
    setOrg,
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

