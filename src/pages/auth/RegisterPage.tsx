import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { User, Mail, Lock, Stethoscope, Globe, Phone, Upload, Heart, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card } from '../../components/ui/Card';

const MEDICAL_SPECIALTIES = [
  { value: 'cardiology', label: 'Cardiology' },
  { value: 'dermatology', label: 'Dermatology' },
  { value: 'endocrinology', label: 'Endocrinology' },
  { value: 'gastroenterology', label: 'Gastroenterology' },
  { value: 'neurology', label: 'Neurology' },
  { value: 'oncology', label: 'Oncology' },
  { value: 'pediatrics', label: 'Pediatrics' },
  { value: 'psychiatry', label: 'Psychiatry' },
  { value: 'radiology', label: 'Radiology' },
  { value: 'surgery', label: 'Surgery' },
  { value: 'urology', label: 'Urology' },
  { value: 'other', label: 'Other' },
];

const COUNTRIES = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
  { value: 'in', label: 'India' },
  { value: 'br', label: 'Brazil' },
  { value: 'other', label: 'Other' },
];

export const RegisterPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState<'doctor' | 'patient'>((searchParams.get('role') as 'doctor' | 'patient') || 'patient');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    specialty: '',
    country: '',
  });
  const [documents, setDocuments] = useState<File[]>([]);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'documents' | 'profile') => {
    const files = e.target.files;
    if (!files) return;

    if (type === 'documents') {
      setDocuments(prev => [...prev, ...Array.from(files)]);
    } else if (type === 'profile' && files[0]) {
      setProfileImage(files[0]);
    }
  };

  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (role === 'doctor') {
      if (!formData.specialty) newErrors.specialty = 'Medical specialty is required';
      if (!formData.country) newErrors.country = 'Country is required';
      if (documents.length === 0) newErrors.documents = 'Please upload at least one verification document';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const userData = {
      ...formData,
      documents: documents.map(doc => ({
        id: Date.now().toString() + Math.random(),
        name: doc.name,
        type: doc.type,
        url: URL.createObjectURL(doc),
        uploadedAt: new Date().toISOString(),
      })),
      profileImage: profileImage ? URL.createObjectURL(profileImage) : undefined,
    };

    const success = await register(userData, role);
    if (success) {
      setShowSuccess(true);
      setTimeout(() => {
        switch (role) {
          case 'doctor':
            navigate('/doctor/dashboard');
            break;
          case 'patient':
            navigate('/patient/dashboard');
            break;
        }
      }, 2000);
    } else {
      setErrors({ email: 'An account with this email already exists' });
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md w-full text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
          <p className="text-gray-600 mb-4">
            {role === 'doctor' 
              ? 'Your account has been created. Your profile is pending verification and will be reviewed by our team.'
              : 'Welcome to Medicalvance! You can now access your dashboard.'
            }
          </p>
          <p className="text-sm text-gray-500">Redirecting to your dashboard...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-6">
            <Heart className="h-10 w-10 text-blue-600 mr-2" />
            <span className="text-2xl font-bold text-gray-900">Medicalvance</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h2>
          <p className="text-gray-600">Join our community of medical professionals and patients</p>
        </div>

        {/* Role Selection */}
        <Card className="mb-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">I am a:</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('patient')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  role === 'patient'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <User className="h-8 w-8 mx-auto mb-2" />
                <div className="font-medium">Patient</div>
                <div className="text-sm text-gray-500">Looking for medical care</div>
              </button>
              <button
                type="button"
                onClick={() => setRole('doctor')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  role === 'doctor'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Stethoscope className="h-8 w-8 mx-auto mb-2" />
                <div className="font-medium">Doctor</div>
                <div className="text-sm text-gray-500">Medical professional</div>
              </button>
            </div>
          </div>
        </Card>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  name="firstName"
                  icon={User}
                  value={formData.firstName}
                  onChange={handleInputChange}
                  error={errors.firstName}
                  placeholder="Enter your first name"
                />
                <Input
                  label="Last Name"
                  name="lastName"
                  icon={User}
                  value={formData.lastName}
                  onChange={handleInputChange}
                  error={errors.lastName}
                  placeholder="Enter your last name"
                />
              </div>
              <Input
                label="Email Address"
                name="email"
                type="email"
                icon={Mail}
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                placeholder="Enter your email address"
              />
              <Input
                label="Phone Number"
                name="phone"
                type="tel"
                icon={Phone}
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number (optional)"
              />
            </div>

            {/* Password */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Security</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Password"
                  name="password"
                  type="password"
                  icon={Lock}
                  value={formData.password}
                  onChange={handleInputChange}
                  error={errors.password}
                  placeholder="Create a password"
                />
                <Input
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  icon={Lock}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  error={errors.confirmPassword}
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            {/* Doctor-specific fields */}
            {role === 'doctor' && (
              <>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      label="Medical Specialty"
                      name="specialty"
                      value={formData.specialty}
                      onChange={handleInputChange}
                      options={MEDICAL_SPECIALTIES}
                      error={errors.specialty}
                      placeholder="Select your specialty"
                    />
                    <Select
                      label="Country of Practice"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      options={COUNTRIES}
                      error={errors.country}
                      placeholder="Select your country"
                    />
                  </div>
                </div>

                {/* Profile Image */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Photo</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Upload your profile photo</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'profile')}
                      className="hidden"
                      id="profile-upload"
                    />
                    <label htmlFor="profile-upload">
                      <Button type="button" variant="outline" size="sm" as="span">
                        Choose File
                      </Button>
                    </label>
                    {profileImage && (
                      <p className="text-sm text-green-600 mt-2">
                        Selected: {profileImage.name}
                      </p>
                    )}
                  </div>
                </div>

                {/* Document Upload */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Verification Documents</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Please upload your medical license, ID, or other verification documents
                  </p>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Upload verification documents</p>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={(e) => handleFileUpload(e, 'documents')}
                      className="hidden"
                      id="documents-upload"
                    />
                    <label htmlFor="documents-upload">
                      <Button type="button" variant="outline" size="sm" as="span">
                        Choose Files
                      </Button>
                    </label>
                  </div>
                  {errors.documents && (
                    <p className="text-sm text-red-600 mt-1">{errors.documents}</p>
                  )}
                  {documents.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <span className="text-sm text-gray-700">{doc.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDocument(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={isLoading}
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};