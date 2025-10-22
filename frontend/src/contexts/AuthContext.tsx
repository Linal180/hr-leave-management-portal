import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import { STORAGE_KEYS, MESSAGES } from '../constants';
import apiService from '../services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER_DATA);

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          
          // Verify token is still valid by fetching profile
          try {
            const userProfile = await apiService.getProfile();
            setUser(userProfile);
          } catch (error) {
            // Token is invalid, clear storage
            logout();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await apiService.login({ email, password });
      
      setToken(response.token);
      setUser(response.user);
      
      // Store in localStorage
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || MESSAGES.ERROR.LOGIN_FAILED;
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  };

  const refreshUser = async (): Promise<void> => {
    if (!token) {
      console.log('No token available for refreshUser');
      return;
    }
    
    try {
      console.log('Refreshing user profile...');
      const userProfile = await apiService.getProfile();
      console.log('Updated user profile:', userProfile);
      setUser(userProfile);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userProfile));
    } catch (error) {
      console.error('Failed to refresh user profile:', error);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    refreshUser,
    isLoading,
    isAuthenticated: !!user && !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
