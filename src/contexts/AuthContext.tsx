import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Doctor, Patient, Admin, AuthContextType, UploadedDocument } from '../types';

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
    const storedUser = localStorage.getItem('medicalvance_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const users = JSON.parse(localStorage.getItem('medicalvance_users') || '[]');
    const foundUser = users.find((u: User) => u.email === email);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('medicalvance_user', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (userData: any, role: 'doctor' | 'patient'): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const users = JSON.parse(localStorage.getItem('medicalvance_users') || '[]');
    
    // Check if email already exists
    if (users.find((u: User) => u.email === userData.email)) {
      setIsLoading(false);
      return false;
    }
    
    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role,
      phone: userData.phone,
      createdAt: new Date().toISOString(),
      ...(role === 'doctor' && {
        specialty: userData.specialty,
        country: userData.country,
        verificationStatus: 'pending' as const,
        documents: userData.documents || [],
        profileImage: userData.profileImage,
      }),
      ...(role === 'patient' && {
        dateOfBirth: userData.dateOfBirth,
        gender: userData.gender,
      }),
    };
    
    users.push(newUser);
    localStorage.setItem('medicalvance_users', JSON.stringify(users));
    
    setUser(newUser);
    localStorage.setItem('medicalvance_user', JSON.stringify(newUser));
    
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('medicalvance_user');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('medicalvance_user', JSON.stringify(updatedUser));
    
    // Update in users array
    const users = JSON.parse(localStorage.getItem('medicalvance_users') || '[]');
    const userIndex = users.findIndex((u: User) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem('medicalvance_users', JSON.stringify(users));
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

// Initialize demo data
const initializeDemoData = () => {
  const existingUsers = localStorage.getItem('medicalvance_users');
  if (!existingUsers) {
    const demoUsers: User[] = [
      {
        id: 'admin-1',
        email: 'admin@medicalvance.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        createdAt: new Date().toISOString(),
        permissions: ['manage_users', 'verify_doctors', 'view_analytics'],
      } as Admin,
      {
        id: 'doctor-1',
        email: 'dr.smith@example.com',
        firstName: 'John',
        lastName: 'Smith',
        role: 'doctor',
        specialty: 'Cardiology',
        country: 'United States',
        verificationStatus: 'verified',
        documents: [],
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        phone: '+1-555-0123',
      } as Doctor,
      {
        id: 'doctor-2',
        email: 'dr.patel@example.com',
        firstName: 'Priya',
        lastName: 'Patel',
        role: 'doctor',
        specialty: 'Neurology',
        country: 'United Kingdom',
        verificationStatus: 'pending',
        documents: [
          {
            id: 'doc-1',
            name: 'medical_license.pdf',
            type: 'application/pdf',
            url: '#',
            uploadedAt: new Date().toISOString(),
          },
        ],
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        phone: '+44-20-7946-0958',
      } as Doctor,
      {
        id: 'patient-1',
        email: 'patient@example.com',
        firstName: 'Jane',
        lastName: 'Doe',
        role: 'patient',
        dateOfBirth: '1985-03-15',
        gender: 'female',
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        phone: '+1-555-0456',
      } as Patient,
    ];
    
    localStorage.setItem('medicalvance_users', JSON.stringify(demoUsers));
  }
};

// Initialize demo data when the module loads
initializeDemoData();