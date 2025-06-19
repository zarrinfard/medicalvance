import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import apiService from '../services/api.js';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('medicalvance_token');
    if (token) {
      loadCurrentUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadCurrentUser = async () => {
    try {
      const response = await apiService.getCurrentUser();
      setUser(response.user);
    } catch (error) {
      console.error('Failed to load user:', error);
      // Clear invalid token
      apiService.logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await apiService.login(email, password);
      setUser(response.user);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (userData: any, role: 'doctor' | 'patient'): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Create FormData for file uploads
      const formData = new FormData();
      
      // Add basic fields
      formData.append('firstName', userData.firstName);
      formData.append('lastName', userData.lastName);
      formData.append('email', userData.email);
      formData.append('password', userData.password);
      formData.append('role', role);
      
      if (userData.phone) formData.append('phone', userData.phone);
      
      // Add role-specific fields
      if (role === 'doctor') {
        formData.append('specialty', userData.specialty);
        formData.append('country', userData.country);
        
        // Add documents
        if (userData.documents) {
          userData.documents.forEach((doc: File) => {
            formData.append('documents', doc);
          });
        }
        
        // Add profile image
        if (userData.profileImage) {
          formData.append('profileImage', userData.profileImage);
        }
      } else if (role === 'patient') {
        if (userData.dateOfBirth) formData.append('dateOfBirth', userData.dateOfBirth);
        if (userData.gender) formData.append('gender', userData.gender);
      }
      
      const response = await apiService.register(formData);
      setUser(response.user);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      const response = await apiService.updateProfile(updates);
      setUser(response.user);
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    updateProfile,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};