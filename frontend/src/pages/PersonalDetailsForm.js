import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const PersonalDetailsForm = () => {
  const { getAuthHeaders } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    dob: '',
    gender: '',
    father_name: '',
    mother_name: '',
    blood_group: '',
    nationality: 'Indian'
  });

  useEffect(() => {
    fetchExistingData();
  }, []);

  const fetchExistingData = async () => {
    try {
      const response = await axios.get(`${API}/forms/personal`, getAuthHeaders());
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
      await axios.post(`${API}/forms/personal`, formData, getAuthHeaders());
      toast.success('Personal details saved successfully!');
      navigate('/forms/address');
    } catch (error) {
      toast.error('Failed to save details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Personal Details</h1>
        <p className="text-gray-600">Please fill in your personal information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  data-testid="full-name-input"
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  required
                  className="h-11"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth *</Label>
                <Input
                  id="dob"
                  data-testid="dob-input"
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({...formData, dob: e.target.value})}
                  required
                  className="h-11"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})} required>
                  <SelectTrigger data-testid="gender-select" className="h-11">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="blood_group">Blood Group</Label>
                <Select value={formData.blood_group} onValueChange={(value) => setFormData({...formData, blood_group: value})}>
                  <SelectTrigger data-testid="blood-group-select" className="h-11">
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="father_name">Father's Name *</Label>
                <Input
                  id="father_name"
                  data-testid="father-name-input"
                  value={formData.father_name}
                  onChange={(e) => setFormData({...formData, father_name: e.target.value})}
                  required
                  className="h-11"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mother_name">Mother's Name *</Label>
                <Input
                  id="mother_name"
                  data-testid="mother-name-input"
                  value={formData.mother_name}
                  onChange={(e) => setFormData({...formData, mother_name: e.target.value})}
                  required
                  className="h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality *</Label>
              <Input
                id="nationality"
                data-testid="nationality-input"
                value={formData.nationality}
                onChange={(e) => setFormData({...formData, nationality: e.target.value})}
                required
                className="h-11"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
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
                data-testid="save-personal-details-btn"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white h-11 px-6"
              >
                {loading ? 'Saving...' : 'Save & Continue'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalDetailsForm;