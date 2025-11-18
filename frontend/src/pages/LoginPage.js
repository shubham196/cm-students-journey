import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'sonner';
import { GraduationCap, Mail, Phone, Lock, User } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ 
    email: '', 
    mobile: '', 
    password: '', 
    full_name: '' 
  });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await login(loginData.email, loginData.password);
    
    if (result.success) {
      toast.success('Login successful!');
      navigate('/');
    } else {
      toast.error(result.message);
    }
    
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await register(
      registerData.email, 
      registerData.mobile, 
      registerData.password, 
      registerData.full_name
    );
    
    if (result.success) {
      toast.success('Registration successful!');
      navigate('/');
    } else {
      toast.error(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
          <div className="flex items-center justify-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Portal</h1>
            <p className="text-gray-600 text-sm">Track your admission journey</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login" data-testid="login-tab">Login</TabsTrigger>
              <TabsTrigger value="register" data-testid="register-tab">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-sm font-medium text-gray-700">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="login-email"
                      data-testid="login-email-input"
                      type="email"
                      placeholder="your.email@example.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                      className="pl-11 h-12"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-sm font-medium text-gray-700">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="login-password"
                      data-testid="login-password-input"
                      type="password"
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                      className="pl-11 h-12"
                      required
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  data-testid="login-submit-btn"
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl mt-6"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-name" className="text-sm font-medium text-gray-700">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="reg-name"
                      data-testid="register-name-input"
                      type="text"
                      placeholder="John Doe"
                      value={registerData.full_name}
                      onChange={(e) => setRegisterData({...registerData, full_name: e.target.value})}
                      className="pl-11 h-12"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reg-email" className="text-sm font-medium text-gray-700">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="reg-email"
                      data-testid="register-email-input"
                      type="email"
                      placeholder="your.email@example.com"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                      className="pl-11 h-12"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reg-mobile" className="text-sm font-medium text-gray-700">Mobile</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="reg-mobile"
                      data-testid="register-mobile-input"
                      type="tel"
                      placeholder="9876543210"
                      value={registerData.mobile}
                      onChange={(e) => setRegisterData({...registerData, mobile: e.target.value})}
                      className="pl-11 h-12"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reg-password" className="text-sm font-medium text-gray-700">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="reg-password"
                      data-testid="register-password-input"
                      type="password"
                      placeholder="••••••••"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                      className="pl-11 h-12"
                      required
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  data-testid="register-submit-btn"
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl mt-6"
                  disabled={loading}
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
        
        <p className="text-center text-gray-600 text-sm mt-6">
          Having issues? Contact support@studentportal.edu
        </p>
      </div>
    </div>
  );
};

export default LoginPage;