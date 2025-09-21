import React, { createContext, useContext, useEffect, useState } from "react"

const AuthContext = createContext({});

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used withing AuthContext')
  }
  return ctx;
}

export const AuthProvider = (children: React.ReactNode) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      validateToken(token);
    } else {
      setIsLoading(false);
    }
  }, [])

  const login = async (credentials) => {
    try {
      const response = await AuthApi.login(credentials);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      setUser(user);
      setIsAuthenticated(true);

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null);
    setIsAuthenticated(false)
  }

  const value = {
    user, isAuthenticated, isLoading, login, logout
  };

  return (
    <AuthContext.Provider value= { value } >
    { children }
    </AuthContext.Provider>
  )
}


const validateToken = (token: string) => {
  try {
    const response;
  } catch {

  }
}
