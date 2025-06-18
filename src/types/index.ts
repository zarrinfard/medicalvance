export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'doctor' | 'patient' | 'admin';
  phone?: string;
  createdAt: string;
  isVerified?: boolean;
  profileImage?: string;
}

export interface Doctor extends User {
  role: 'doctor';
  specialty: string;
  country: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  documents: UploadedDocument[];
  licenseNumber?: string;
  yearsOfExperience?: number;
  about?: string;
}

export interface Patient extends User {
  role: 'patient';
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  emergencyContact?: string;
}

export interface Admin extends User {
  role: 'admin';
  permissions: string[];
}

export interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: any, role: 'doctor' | 'patient') => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  isLoading: boolean;
}