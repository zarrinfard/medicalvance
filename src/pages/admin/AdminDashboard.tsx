import React, { useState, useEffect } from 'react';
import { Users, UserCheck, Clock, Search, Eye, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { Layout } from '../../components/layout/Layout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { User, Doctor, Patient } from '../../types';

export const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState<'all' | 'pending' | 'verified'>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, selectedTab]);

  const loadUsers = () => {
    const storedUsers = JSON.parse(localStorage.getItem('medicalvance_users') || '[]');
    setUsers(storedUsers);
  };

  const filterUsers = () => {
    let filtered = users.filter(user => {
      const matchesSearch = 
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      switch (selectedTab) {
        case 'pending':
          return user.role === 'doctor' && (user as Doctor).verificationStatus === 'pending';
        case 'verified':
          return user.role === 'doctor' && (user as Doctor).verificationStatus === 'verified';
        default:
          return true;
      }
    });

    setFilteredUsers(filtered);
  };

  const updateUserVerification = (userId: string, status: 'verified' | 'rejected') => {
    const updatedUsers = users.map(user => {
      if (user.id === userId && user.role === 'doctor') {
        return { ...user, verificationStatus: status } as Doctor;
      }
      return user;
    });

    setUsers(updatedUsers);
    localStorage.setItem('medicalvance_users', JSON.stringify(updatedUsers));
    setSelectedUser(null);
  };

  const resetUserPassword = (userId: string) => {
    // In a real app, this would generate a temporary password and send it via email
    alert(`Password reset email sent to user ${userId}`);
  };

  const getStats = () => {
    const totalUsers = users.length;
    const totalDoctors = users.filter(u => u.role === 'doctor').length;
    const totalPatients = users.filter(u => u.role === 'patient').length;
    const pendingVerifications = users.filter(u => 
      u.role === 'doctor' && (u as Doctor).verificationStatus === 'pending'
    ).length;

    return { totalUsers, totalDoctors, totalPatients, pendingVerifications };
  };

  const stats = getStats();

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'doctor':
        return 'bg-blue-100 text-blue-800';
      case 'patient':
        return 'bg-green-100 text-green-800';
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getVerificationBadge = (doctor: Doctor) => {
    switch (doctor.verificationStatus) {
      case 'verified':
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Verified</span>;
      case 'pending':
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">Pending</span>;
      case 'rejected':
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage users and verify medical professionals</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{stats.totalUsers}</div>
                <div className="text-sm text-gray-600">Total Users</div>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{stats.totalPatients}</div>
                <div className="text-sm text-gray-600">Patients</div>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <UserCheck className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{stats.totalDoctors}</div>
                <div className="text-sm text-gray-600">Doctors</div>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{stats.pendingVerifications}</div>
                <div className="text-sm text-gray-600">Pending Verifications</div>
              </div>
            </div>
          </Card>
        </div>

        {/* User Management */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-0">User Management</h3>
                
                {/* Tab Navigation */}
                <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setSelectedTab('all')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      selectedTab === 'all'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    All Users
                  </button>
                  <button
                    onClick={() => setSelectedTab('pending')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      selectedTab === 'pending'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Pending ({stats.pendingVerifications})
                  </button>
                  <button
                    onClick={() => setSelectedTab('verified')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      selectedTab === 'verified'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Verified
                  </button>
                </div>
              </div>

              {/* Search */}
              <div className="mb-6">
                <Input
                  icon={Search}
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Name</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Email</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Role</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-2">
                          <div className="font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            Joined {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-3 px-2 text-sm text-gray-600">{user.email}</td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          {user.role === 'doctor' ? getVerificationBadge(user as Doctor) : '-'}
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={Eye}
                              onClick={() => setSelectedUser(user)}
                            >
                              View
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={RotateCcw}
                              onClick={() => resetUserPassword(user.id)}
                            >
                              Reset Password
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredUsers.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No users found matching your criteria</p>
                </div>
              )}
            </Card>
          </div>

          {/* User Details Panel */}
          <div className="lg:col-span-1">
            {selectedUser ? (
              <Card>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">User Details</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedUser(null)}
                  >
                    ×
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </h4>
                    <p className="text-sm text-gray-600">{selectedUser.email}</p>
                    <p className="text-sm text-gray-600">{selectedUser.phone || 'No phone'}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(selectedUser.role)}`}>
                      {selectedUser.role}
                    </span>
                  </div>

                  {selectedUser.role === 'doctor' && (
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Specialty</p>
                        <p className="text-sm text-gray-600">{(selectedUser as Doctor).specialty}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Country</p>
                        <p className="text-sm text-gray-600">{(selectedUser as Doctor).country}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Verification Status</p>
                        {getVerificationBadge(selectedUser as Doctor)}
                      </div>

                      {(selectedUser as Doctor).documents && (selectedUser as Doctor).documents.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Documents</p>
                          <div className="space-y-2">
                            {(selectedUser as Doctor).documents.map((doc) => (
                              <div key={doc.id} className="text-xs bg-gray-50 p-2 rounded">
                                {doc.name}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {(selectedUser as Doctor).verificationStatus === 'pending' && (
                        <div className="pt-4 space-y-2">
                          <Button
                            fullWidth
                            variant="primary"
                            icon={CheckCircle}
                            onClick={() => updateUserVerification(selectedUser.id, 'verified')}
                          >
                            Approve Doctor
                          </Button>
                          <Button
                            fullWidth
                            variant="danger"
                            icon={XCircle}
                            onClick={() => updateUserVerification(selectedUser.id, 'rejected')}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            ) : (
              <Card>
                <div className="text-center py-8">
                  <Eye className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">Select a user to view details</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};