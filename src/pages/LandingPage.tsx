import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, UserPlus, LogIn, Stethoscope, Users, Shield, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Stethoscope,
      title: 'Expert Medical Professionals',
      description: 'Connect with verified doctors and specialists worldwide',
    },
    {
      icon: Shield,
      title: 'Secure & Trusted',
      description: 'All medical professionals are thoroughly verified',
    },
    {
      icon: Users,
      title: 'Patient-Centered Care',
      description: 'Streamlined booking and consultation process',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">Medicalvance</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/login')}
                icon={LogIn}
              >
                Login
              </Button>
              <Button
                onClick={() => navigate('/register')}
                icon={UserPlus}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Connect with
              <span className="text-blue-600 block">Medical Experts</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Find, evaluate, and book appointments with qualified medical professionals 
              from around the world. Your health journey starts here.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                size="lg"
                onClick={() => navigate('/register?role=patient')}
                className="px-8 py-4 text-lg"
              >
                I'm a Patient
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/register?role=doctor')}
                className="px-8 py-4 text-lg"
                icon={Stethoscope}
              >
                I'm a Doctor
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">1000+</div>
                <div className="text-gray-600">Verified Doctors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
                <div className="text-gray-600">Medical Specialties</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">25</div>
                <div className="text-gray-600">Countries</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Medicalvance?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're committed to connecting you with the best medical care available
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-shadow duration-300">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <feature.icon className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Getting started is simple and secure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* For Patients */}
            <Card>
              <div className="flex items-center mb-6">
                <Users className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="text-2xl font-semibold text-gray-900">For Patients</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Create Your Profile</p>
                    <p className="text-gray-600 text-sm">Quick and easy registration process</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Find Specialists</p>
                    <p className="text-gray-600 text-sm">Search by specialty, location, or language</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Book Appointments</p>
                    <p className="text-gray-600 text-sm">Secure online booking system</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* For Doctors */}
            <Card>
              <div className="flex items-center mb-6">
                <Stethoscope className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="text-2xl font-semibold text-gray-900">For Doctors</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Professional Registration</p>
                    <p className="text-gray-600 text-sm">Submit credentials for verification</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Profile Verification</p>
                    <p className="text-gray-600 text-sm">Our team verifies all medical credentials</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Connect with Patients</p>
                    <p className="text-gray-600 text-sm">Expand your practice globally</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of patients and doctors already using Medicalvance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate('/register?role=patient')}
              className="px-8 py-4 text-lg"
            >
              Join as Patient
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/register?role=doctor')}
              className="px-8 py-4 text-lg border-white text-white hover:bg-white hover:text-blue-600"
            >
              Join as Doctor
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Heart className="h-8 w-8 text-blue-400 mr-2" />
            <span className="text-xl font-bold">Medicalvance</span>
          </div>
          <p className="text-gray-400 mb-4">
            Connecting patients with medical experts worldwide
          </p>
          <p className="text-sm text-gray-500">
            © 2024 Medicalvance. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};