import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import AdmissionStatus from './pages/AdmissionStatus';
import StudentDetails from './pages/StudentDetails';
import PersonalDetailsForm from './pages/PersonalDetailsForm';
import AddressDetailsForm from './pages/AddressDetailsForm';
import AcademicDetailsForm from './pages/AcademicDetailsForm';
import DocumentUpload from './pages/DocumentUpload';
import Profile from './pages/Profile';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from './components/ui/sonner';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="status" element={<AdmissionStatus />} />
            <Route path="details" element={<StudentDetails />} />
            <Route path="forms/personal" element={<PersonalDetailsForm />} />
            <Route path="forms/address" element={<AddressDetailsForm />} />
            <Route path="forms/academic" element={<AcademicDetailsForm />} />
            <Route path="documents" element={<DocumentUpload />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;