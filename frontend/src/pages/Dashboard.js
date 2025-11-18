import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Progress } from '../components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { FileText, Upload, CheckCircle, Clock, Bell } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = () => {
  const { student, getAuthHeaders } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get(`${API}/dashboard/stats`, getAuthHeaders());
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats', error);
    } finally {
      setLoading(false);
    }
  };

  const quickLinks = [
    { 
      title: 'Personal Details', 
      description: 'Fill your personal information',
      icon: FileText,
      link: '/forms/personal',
      color: 'from-blue-500 to-blue-600'
    },
    { 
      title: 'Upload Documents', 
      description: 'Upload required documents',
      icon: Upload,
      link: '/documents',
      color: 'from-green-500 to-green-600'
    },
    { 
      title: 'Admission Journey', 
      description: 'Track your progress',
      icon: CheckCircle,
      link: '/journey',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Welcome, {student?.full_name}!</h1>
        <p className="text-gray-600">Track your admission progress and complete your application</p>
      </div>

      {/* Progress Card */}
      <Card data-testid="progress-card" className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Admission Progress</CardTitle>
          <CardDescription className="text-blue-700">
            {stats?.completed_steps} of {stats?.total_steps} steps completed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={stats?.progress || 0} className="h-3 mb-2" />
          <p className="text-sm font-medium text-blue-900">{stats?.progress}% Complete</p>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <Link key={index} to={link.link}>
                <Card data-testid={`quick-link-${index}`} className="card-hover cursor-pointer h-full border-gray-200 hover:border-blue-300">
                  <CardContent className="pt-6">
                    <div className={`w-12 h-12 bg-gradient-to-br ${link.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{link.title}</h3>
                    <p className="text-sm text-gray-600">{link.description}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Announcements */}
      <div>
        <div className="flex items-center mb-4">
          <Bell className="w-5 h-5 text-gray-700 mr-2" />
          <h2 className="text-xl font-bold text-gray-900">Announcements</h2>
        </div>
        <div className="space-y-3">
          {stats?.announcements?.map((announcement) => (
            <Card key={announcement.id} data-testid={`announcement-${announcement.id}`} className="border-gray-200">
              <CardContent className="pt-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{announcement.title}</h3>
                    <p className="text-sm text-gray-600">{announcement.message}</p>
                  </div>
                  <Clock className="w-4 h-4 text-gray-400 mt-1 ml-4" />
                </div>
                <p className="text-xs text-gray-500 mt-2">{announcement.date}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;