import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [student, setStudent] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedStudent = localStorage.getItem('student');
    
    if (storedToken && storedStudent) {
      setToken(storedToken);
      setStudent(JSON.parse(storedStudent));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API}/auth/login`, { email, password });
      const { token: newToken, student: studentData } = response.data;
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('student', JSON.stringify(studentData));
      
      setToken(newToken);
      setStudent(studentData);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.detail || 'Login failed' 
      };
    }
  };

  const register = async (email, mobile, password, full_name) => {
    try {
      const response = await axios.post(`${API}/auth/register`, { 
        email, 
        mobile, 
        password, 
        full_name 
      });
      const { token: newToken, student: studentData } = response.data;
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('student', JSON.stringify(studentData));
      
      setToken(newToken);
      setStudent(studentData);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.detail || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('student');
    setToken(null);
    setStudent(null);
    setIsAuthenticated(false);
  };

  const getAuthHeaders = () => {
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  const value = {
    isAuthenticated,
    student,
    token,
    loading,
    login,
    register,
    logout,
    getAuthHeaders
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};