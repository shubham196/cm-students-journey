import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { CheckCircle, Clock, Circle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const StudentDetails = () => {
  const { getAuthHeaders } = useAuth();
  const navigate = useNavigate();
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

  const getStatusIcon = (status) => {
    if (status === 'Completed') {
      return <CheckCircle className="w-6 h-6 text-green-600" />;
    } else if (status === 'In Progress') {
      return <Clock className="w-6 h-6 text-blue-600" />;
    }
    return <Circle className="w-6 h-6 text-gray-400" />;
  };

  const getStatusColor = (status) => {
    if (status === 'Completed') return 'bg-green-100 text-green-800 border-green-200';
    if (status === 'In Progress') return 'bg-blue-100 text-blue-800 border-blue-200';
    return 'bg-gray-100 text-gray-600 border-gray-200';
  };

  const getActionForStep = (stepName) => {
    const actions = {
      'Personal Details': () => navigate('/forms/personal'),
      'Address Details': () => navigate('/forms/address'),
      'Academic Details': () => navigate('/forms/academic'),
      'Document Upload': () => navigate('/documents'),
    };
    return actions[stepName];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Student Details</h1>
        <p className="text-gray-600">Complete your application step by step</p>
      </div>

      <div className="space-y-4">
        {journey?.steps?.map((step, index) => {
          const action = getActionForStep(step.step_name);
          const isActionable = step.status !== 'Completed' && action;
          
          return (
            <Card 
              key={index} 
              data-testid={`journey-step-${index}`}
              className="border-gray-200 hover:shadow-md transition-shadow"
            >
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(step.status)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{step.step_name}</h3>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(step.status)}`}>
                        {step.status}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">
                      {step.status === 'Completed' ? 'This step has been completed successfully.' :
                       step.status === 'In Progress' ? 'This step is currently in progress.' :
                       'This step is pending and needs to be completed.'}
                    </p>
                    
                    {isActionable && (
                      <Button 
                        onClick={action}
                        data-testid={`action-btn-${index}`}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                      >
                        Complete Now
                      </Button>
                    )}
                  </div>
                </div>
                
                {index < journey.steps.length - 1 && (
                  <div className="ml-3 mt-4 mb-0 border-l-2 border-gray-200 h-6"></div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default StudentDetails;