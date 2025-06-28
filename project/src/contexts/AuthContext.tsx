import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, register } from '../Api/api'; // adjust path as needed

interface User {
  user_id: string;
}

interface AuthContextType {
  user: User | null;
  login: (user_id: string, password: string) => Promise<boolean>;
  signup: (user_id: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (user_id: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await loginUser({  user_id, password });
      const token = response.data.token;
      const userData: User = { user_id };

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Login failed', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (user_id: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await register({  user_id, password });
      const token = response.data.token;
      const userData: User = { user_id };

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Signup failed', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
