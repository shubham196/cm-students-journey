import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AcademicDetailsForm = () => {
  const { getAuthHeaders } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    tenth_board: '',
    tenth_year: '',
    tenth_percentage: '',
    twelfth_board: '',
    twelfth_year: '',
    twelfth_percentage: '',
    entrance_exam: '',
    entrance_score: ''
  });

  useEffect(() => {
    fetchExistingData();
  }, []);

  const fetchExistingData = async () => {
    try {
      const response = await axios.get(`${API}/forms/academic`, getAuthHeaders());
      if (response.data && Object.keys(response.data).length > 0) {
        setFormData(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const dataToSend = {
        ...formData,
        tenth_percentage: parseFloat(formData.tenth_percentage),
        twelfth_percentage: parseFloat(formData.twelfth_percentage),
        entrance_score: formData.entrance_score ? parseFloat(formData.entrance_score) : null
      };
      
      await axios.post(`${API}/forms/academic`, dataToSend, getAuthHeaders());
      toast.success('Academic details saved successfully!');
      navigate('/documents');
    } catch (error) {
      toast.error('Failed to save details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Academic Details</h1>
        <p className="text-gray-600">Please provide your educational information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>10th Standard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tenth_board">Board *</Label>
                <Input
                  id="tenth_board"
                  data-testid="tenth-board-input"
                  placeholder="e.g., CBSE"
                  value={formData.tenth_board}
                  onChange={(e) => setFormData({...formData, tenth_board: e.target.value})}
                  required
                  className="h-11"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tenth_year">Year of Passing *</Label>
                <Input
                  id="tenth_year"
                  data-testid="tenth-year-input"
                  placeholder="2020"
                  value={formData.tenth_year}
                  onChange={(e) => setFormData({...formData, tenth_year: e.target.value})}
                  required
                  className="h-11"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tenth_percentage">Percentage *</Label>
                <Input
                  id="tenth_percentage"
                  data-testid="tenth-percentage-input"
                  type="number"
                  step="0.01"
                  placeholder="85.5"
                  value={formData.tenth_percentage}
                  onChange={(e) => setFormData({...formData, tenth_percentage: e.target.value})}
                  required
                  className="h-11"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>12th Standard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="twelfth_board">Board *</Label>
                <Input
                  id="twelfth_board"
                  data-testid="twelfth-board-input"
                  placeholder="e.g., CBSE"
                  value={formData.twelfth_board}
                  onChange={(e) => setFormData({...formData, twelfth_board: e.target.value})}
                  required
                  className="h-11"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="twelfth_year">Year of Passing *</Label>
                <Input
                  id="twelfth_year"
                  data-testid="twelfth-year-input"
                  placeholder="2022"
                  value={formData.twelfth_year}
                  onChange={(e) => setFormData({...formData, twelfth_year: e.target.value})}
                  required
                  className="h-11"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="twelfth_percentage">Percentage *</Label>
                <Input
                  id="twelfth_percentage"
                  data-testid="twelfth-percentage-input"
                  type="number"
                  step="0.01"
                  placeholder="92.0"
                  value={formData.twelfth_percentage}
                  onChange={(e) => setFormData({...formData, twelfth_percentage: e.target.value})}
                  required
                  className="h-11"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Entrance Exam (Optional)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="entrance_exam">Exam Name</Label>
                <Input
                  id="entrance_exam"
                  data-testid="entrance-exam-input"
                  placeholder="e.g., JEE, NEET"
                  value={formData.entrance_exam}
                  onChange={(e) => setFormData({...formData, entrance_exam: e.target.value})}
                  className="h-11"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="entrance_score">Score</Label>
                <Input
                  id="entrance_score"
                  data-testid="entrance-score-input"
                  type="number"
                  step="0.01"
                  placeholder="150"
                  value={formData.entrance_score}
                  onChange={(e) => setFormData({...formData, entrance_score: e.target.value})}
                  className="h-11"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/journey')}
            className="h-11 px-6"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            data-testid="save-academic-details-btn"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white h-11 px-6"
          >
            {loading ? 'Saving...' : 'Save & Continue'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AcademicDetailsForm;