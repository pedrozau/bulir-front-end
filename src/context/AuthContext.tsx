// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import {jwtDecode}  from 'jwt-decode';
import { useNavigate } from 'react-router-dom';



interface AuthContextType {
  isAuthenticated: boolean;
  userRole: string | null; // 'client' | 'provider' | null
  user: any 
  login: (token: string, role: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const isTokenExpired = (decodedToken.exp * 1000) < Date.now();

        if (isTokenExpired) {
          logout();
        } else {
          setIsAuthenticated(true);
          setUser(decodedToken);
        }
      } catch (error) {
        logout();
      }
    }
  }, []);

  const login = (token: string, role: string) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserRole(null);
    navigate('/login')
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole,user, login, logout ,}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
