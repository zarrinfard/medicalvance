import React, { useState } from 'react';
import { User, Mail, Phone, Calendar, Heart, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Layout } from '../../components/layout/Layout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Patient } from '../../types';

export const PatientDashboard: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const patient = user as Patient;
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: patient?.firstName || '',
    lastName: patient?.lastName || '',
    email: patient?.email || '',
    phone: patient?.phone || '',
    dateOfBirth: patient?.dateOfBirth || '',
    gender: patient?.gender || '',
    emergencyContact: patient?.emergencyContact || '',
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
      firstName: patient?.firstName || '',
      lastName: patient?.lastName || '',
      email: patient?.email || '',
      phone: patient?.phone || '',
      dateOfBirth: patient?.dateOfBirth || '',
      gender: patient?.gender || '',
      emergencyContact: patient?.emergencyContact || '',
    });
    setIsEditing(false);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Patient Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your health profile and appointments</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card>
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {patient?.firstName} {patient?.lastName}
                </h3>
                <p className="text-gray-600 mb-4">Patient</p>
                
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Member since {new Date(patient?.createdAt || '').toLocaleDateString()}</p>
                  <p className="inline-flex items-center text-green-600">
                    <Heart className="h-4 w-4 mr-1" />
                    Verified Account
                  </p>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button fullWidth variant="outline" icon={Search}>
                  Find Doctors
                </Button>
                <Button fullWidth variant="outline" icon={Calendar}>
                  View Appointments
                </Button>
                <Button fullWidth variant="outline" icon={Heart}>
                  Health Records
                </Button>
              </div>
            </Card>
          </div>

          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
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
                <Input
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="block w-full rounded-lg border-gray-300 shadow-sm px-3 py-2.5 focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <Input
                  label="Emergency Contact"
                  name="emergencyContact"
                  icon={Phone}
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Emergency contact phone number"
                />
              </div>
            </Card>

            {/* Upcoming Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Card className="text-center opacity-60">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-700 mb-2">Appointments</h4>
                <p className="text-sm text-gray-500">Schedule and manage your medical appointments</p>
                <p className="text-xs text-blue-600 mt-2">Coming Soon</p>
              </Card>
              <Card className="text-center opacity-60">
                <Heart className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-700 mb-2">Health Records</h4>
                <p className="text-sm text-gray-500">Keep track of your medical history</p>
                <p className="text-xs text-blue-600 mt-2">Coming Soon</p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};