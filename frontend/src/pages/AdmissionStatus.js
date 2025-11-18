import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/card';
import { CheckCircle, Circle, Clock, Sparkles } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdmissionStatus = () => {
  const { getAuthHeaders } = useAuth();
  const [journey, setJourney] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJourney();
  }, []);

  const fetchJourney = async () => {
    try {
      const response = await axios.get(`${API}/admission/journey`, getAuthHeaders());
      setJourney(response.data);
    } catch (error) {
      console.error('Failed to fetch journey', error);
    } finally {
      setLoading(false);
    }
  };

  const getStepNumber = (index) => {
    return (index + 1).toString().padStart(2, '0');
  };

  const getStepIcon = (status, index) => {
    if (status === 'Completed') {
      return (
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 bg-green-500 rounded-full animate-pulse opacity-20"></div>
          <div className="relative w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
            <CheckCircle className="w-7 h-7 text-white" />
          </div>
        </div>
      );
    } else if (status === 'In Progress') {
      return (
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20"></div>
          <div className="relative w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
            <Clock className="w-7 h-7 text-white animate-spin-slow" />
          </div>
        </div>
      );
    }
    return (
      <div className="relative w-16 h-16 flex items-center justify-center">
        <div className="w-14 h-14 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center shadow-md">
          <span className="text-gray-600 font-bold text-lg">{getStepNumber(index)}</span>
        </div>
      </div>
    );
  };

  const getProgressPercentage = () => {
    if (!journey?.steps) return 0;
    const completed = journey.steps.filter(step => step.status === 'Completed').length;
    return Math.round((completed / journey.steps.length) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-600" />
        </div>
      </div>
    );
  }

  const progressPercentage = getProgressPercentage();

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-xl animate-float">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">Your Admission Journey</h1>
        <p className="text-lg text-gray-600">Track your progress in real-time</p>
      </div>

      {/* Progress Overview Card */}
      <Card className="mb-10 overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Overall Progress</h2>
              <p className="text-gray-600">You're doing great!</p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {progressPercentage}%
              </div>
              <p className="text-sm text-gray-600 mt-1">Completed</p>
            </div>
          </div>
          
          {/* Animated Progress Bar */}
          <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPercentage}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-shimmer"></div>
            </div>
          </div>
        </div>
      </Card>

      {/* Journey Timeline */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-200 via-purple-200 to-gray-200 hidden md:block"></div>
        
        <div className="space-y-6">
          {journey?.steps?.map((step, index) => {
            const isCompleted = step.status === 'Completed';
            const isInProgress = step.status === 'In Progress';
            const isPending = step.status === 'Pending';
            
            return (
              <div 
                key={index} 
                data-testid={`status-step-${index}`}
                className={`relative transition-all duration-500 transform hover:scale-102 ${
                  isCompleted ? 'animate-fade-in-up' : ''
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Card className={`ml-0 md:ml-24 border-2 transition-all duration-300 ${
                  isCompleted ? 'border-green-300 bg-gradient-to-r from-green-50 to-white shadow-lg' :
                  isInProgress ? 'border-blue-300 bg-gradient-to-r from-blue-50 to-white shadow-lg' :
                  'border-gray-200 bg-white hover:border-gray-300'
                }`}>
                  <div className="p-6">
                    <div className="flex items-start gap-6">
                      {/* Icon - Hidden on mobile, shown on desktop */}
                      <div className="absolute -left-8 top-6 hidden md:block">
                        {getStepIcon(step.status, index)}
                      </div>
                      
                      {/* Icon - Shown on mobile */}
                      <div className="md:hidden flex-shrink-0">
                        {getStepIcon(step.status, index)}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {step.step_name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {isCompleted && 'Completed successfully'}
                              {isInProgress && 'Currently in progress'}
                              {isPending && 'Awaiting completion'}
                            </p>
                          </div>
                          
                          {/* Status Badge */}
                          <div className={`px-4 py-2 rounded-full text-xs font-semibold ${
                            isCompleted ? 'bg-green-500 text-white' :
                            isInProgress ? 'bg-blue-500 text-white animate-pulse' :
                            'bg-gray-300 text-gray-700'
                          }`}>
                            {step.status}
                          </div>
                        </div>
                        
                        {/* Progress indicator for In Progress */}
                        {isInProgress && (
                          <div className="mt-4">
                            <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                              <div className="h-full w-2/3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-progress"></div>
                            </div>
                          </div>
                        )}
                        
                        {/* Completion checkmark animation */}
                        {isCompleted && (
                          <div className="mt-4 flex items-center gap-2 text-green-700">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">Step completed</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* Motivational Footer */}
      {progressPercentage < 100 && (
        <Card className="mt-10 border-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl">
          <div className="p-6 text-center">
            <Sparkles className="w-8 h-8 mx-auto mb-3 animate-bounce" />
            <h3 className="text-xl font-bold mb-2">Keep Going!</h3>
            <p className="text-blue-100">
              You're {progressPercentage}% done. Complete the remaining steps to secure your admission.
            </p>
          </div>
        </Card>
      )}

      {progressPercentage === 100 && (
        <Card className="mt-10 border-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-xl">
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Congratulations! 🎉</h3>
            <p className="text-green-100 text-lg">
              You've completed all steps. Your admission is being processed.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AdmissionStatus;