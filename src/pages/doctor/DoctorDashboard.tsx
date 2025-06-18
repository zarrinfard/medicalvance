import React, { useState } from 'react';
import { User, Mail, Phone, Stethoscope, Globe, Clock, CheckCircle, AlertCircle, Upload } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Layout } from '../../components/layout/Layout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Doctor } from '../../types';

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

export const DoctorDashboard: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const doctor = user as Doctor;
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: doctor?.firstName || '',
    lastName: doctor?.lastName || '',
    email: doctor?.email || '',
    phone: doctor?.phone || '',
    specialty: doctor?.specialty || '',
    country: doctor?.country || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      firstName: doctor?.firstName || '',
      lastName: doctor?.lastName || '',
      email: doctor?.email || '',
      phone: doctor?.phone || '',
      specialty: doctor?.specialty || '',
      country: doctor?.country || '',
    });
    setIsEditing(false);
  };

  const getVerificationStatus = () => {
    switch (doctor?.verificationStatus) {
      case 'verified':
        return {
          icon: CheckCircle,
          color: 'text-green-600 bg-green-100',
          text: 'Verified',
          description: 'Your profile has been verified and is now public.',
        };
      case 'pending':
        return {
          icon: Clock,
          color: 'text-yellow-600 bg-yellow-100',
          text: 'Pending Verification',
          description: 'Your documents are being reviewed by our team.',
        };
      case 'rejected':
        return {
          icon: AlertCircle,
          color: 'text-red-600 bg-red-100',
          text: 'Verification Required',
          description: 'Please upload additional documents for verification.',
        };
      default:
        return {
          icon: AlertCircle,
          color: 'text-gray-600 bg-gray-100',
          text: 'Not Verified',
          description: 'Please complete your profile verification.',
        };
    }
  };

  const verificationStatus = getVerificationStatus();
  const StatusIcon = verificationStatus.icon;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your professional profile and settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Status Card */}
          <div className="lg:col-span-1">
            <Card>
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Stethoscope className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Dr. {doctor?.firstName} {doctor?.lastName}
                </h3>
                <p className="text-gray-600 mb-4">{doctor?.specialty}</p>
                
                {/* Verification Status */}
                <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${verificationStatus.color}`}>
                  <StatusIcon className="h-4 w-4 mr-2" />
                  {verificationStatus.text}
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  {verificationStatus.description}
                </p>
              </div>
            </Card>

            {/* Verification Documents */}
            <Card className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Verification Documents
              </h3>
              {doctor?.documents && doctor.documents.length > 0 ? (
                <div className="space-y-3">
                  {doctor.documents.map((doc, index) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">{doc.name}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(doc.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-3">
                    No documents uploaded yet
                  </p>
                  <Button variant="outline" size="sm">
                    Upload Documents
                  </Button>
                </div>
              )}
            </Card>
          </div>

          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                ) : (
                  <div className="space-x-3">
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="First Name"
                  name="firstName"
                  icon={User}
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
                <Input
                  label="Last Name"
                  name="lastName"
                  icon={User}
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  icon={Mail}
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
                <Input
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  icon={Phone}
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
                <Select
                  label="Medical Specialty"
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleInputChange}
                  options={MEDICAL_SPECIALTIES}
                  disabled={!isEditing}
                />
                <Select
                  label="Country of Practice"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  options={COUNTRIES}
                  disabled={!isEditing}
                />
              </div>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <Card className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">0</div>
                <div className="text-sm text-gray-600">Appointments</div>
              </Card>
              <Card className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">0</div>
                <div className="text-sm text-gray-600">Patients</div>
              </Card>
              <Card className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-2">5.0</div>
                <div className="text-sm text-gray-600">Rating</div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};