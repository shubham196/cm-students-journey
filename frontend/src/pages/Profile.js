import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { User, Mail, Phone, LogOut } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Profile = () => {
  const { student, logout, getAuthHeaders } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${API}/student/profile`, getAuthHeaders());
      setProfile(response.data);
    } catch (error) {
      console.error('Failed to fetch profile', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
        <p className="text-gray-600">Your account information</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">{profile?.full_name}</CardTitle>
              <p className="text-sm text-gray-600 mt-1">Student</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Email</Label>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-gray-500" />
              <span className="text-gray-900">{profile?.email}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Mobile</Label>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="w-5 h-5 text-gray-500" />
              <span className="text-gray-900">{profile?.mobile}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Student ID</Label>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <User className="w-5 h-5 text-gray-500" />
              <span className="text-gray-900 font-mono text-sm">{profile?.id}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Logout</h3>
              <p className="text-sm text-gray-600">Sign out of your account</p>
            </div>
            <Button
              onClick={handleLogout}
              data-testid="profile-logout-btn"
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;