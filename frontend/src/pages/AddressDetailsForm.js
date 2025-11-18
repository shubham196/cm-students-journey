import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AddressDetailsForm = () => {
  const { getAuthHeaders } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [sameAsPermanent, setSameAsPermanent] = useState(false);
  const [formData, setFormData] = useState({
    permanent_address: '',
    permanent_city: '',
    permanent_state: '',
    permanent_pincode: '',
    current_address: '',
    current_city: '',
    current_state: '',
    current_pincode: ''
  });

  useEffect(() => {
    fetchExistingData();
  }, []);

  useEffect(() => {
    if (sameAsPermanent) {
      setFormData(prev => ({
        ...prev,
        current_address: prev.permanent_address,
        current_city: prev.permanent_city,
        current_state: prev.permanent_state,
        current_pincode: prev.permanent_pincode
      }));
    }
  }, [sameAsPermanent]);

  const fetchExistingData = async () => {
    try {
      const response = await axios.get(`${API}/forms/address`, getAuthHeaders());
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
      await axios.post(`${API}/forms/address`, formData, getAuthHeaders());
      toast.success('Address details saved successfully!');
      navigate('/forms/academic');
    } catch (error) {
      toast.error('Failed to save details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Address Details</h1>
        <p className="text-gray-600">Please provide your address information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Permanent Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="permanent_address">Address *</Label>
              <Input
                id="permanent_address"
                data-testid="permanent-address-input"
                value={formData.permanent_address}
                onChange={(e) => setFormData({...formData, permanent_address: e.target.value})}
                required
                className="h-11"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="permanent_city">City *</Label>
                <Input
                  id="permanent_city"
                  data-testid="permanent-city-input"
                  value={formData.permanent_city}
                  onChange={(e) => setFormData({...formData, permanent_city: e.target.value})}
                  required
                  className="h-11"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="permanent_state">State *</Label>
                <Input
                  id="permanent_state"
                  data-testid="permanent-state-input"
                  value={formData.permanent_state}
                  onChange={(e) => setFormData({...formData, permanent_state: e.target.value})}
                  required
                  className="h-11"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="permanent_pincode">Pincode *</Label>
                <Input
                  id="permanent_pincode"
                  data-testid="permanent-pincode-input"
                  value={formData.permanent_pincode}
                  onChange={(e) => setFormData({...formData, permanent_pincode: e.target.value})}
                  required
                  className="h-11"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center space-x-2">
          <Checkbox 
            id="same-address" 
            data-testid="same-address-checkbox"
            checked={sameAsPermanent}
            onCheckedChange={setSameAsPermanent}
          />
          <Label htmlFor="same-address" className="text-sm font-medium cursor-pointer">
            Current address is same as permanent address
          </Label>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Current Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current_address">Address *</Label>
              <Input
                id="current_address"
                data-testid="current-address-input"
                value={formData.current_address}
                onChange={(e) => setFormData({...formData, current_address: e.target.value})}
                required
                disabled={sameAsPermanent}
                className="h-11"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="current_city">City *</Label>
                <Input
                  id="current_city"
                  data-testid="current-city-input"
                  value={formData.current_city}
                  onChange={(e) => setFormData({...formData, current_city: e.target.value})}
                  required
                  disabled={sameAsPermanent}
                  className="h-11"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="current_state">State *</Label>
                <Input
                  id="current_state"
                  data-testid="current-state-input"
                  value={formData.current_state}
                  onChange={(e) => setFormData({...formData, current_state: e.target.value})}
                  required
                  disabled={sameAsPermanent}
                  className="h-11"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="current_pincode">Pincode *</Label>
                <Input
                  id="current_pincode"
                  data-testid="current-pincode-input"
                  value={formData.current_pincode}
                  onChange={(e) => setFormData({...formData, current_pincode: e.target.value})}
                  required
                  disabled={sameAsPermanent}
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
            data-testid="save-address-details-btn"
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

export default AddressDetailsForm;