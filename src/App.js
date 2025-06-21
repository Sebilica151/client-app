import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import LoginPage from './pages/LoginPage';
import AppLayout from './components/Layout/AppLayout';

import DashboardPage from './pages/DashboardPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import PatientsPage from './pages/PatientsPage';
import CalendarPage from './pages/CalendarPage';
import MedicalRecordsPage from './pages/MedicalRecordsPage';
import PrescriptionsPage from './pages/PrescriptionsPage';
import RegisterPage from './pages/RegisterPage';
import TestTailwindPage from './pages/TestTailwindPage';

function ProtectedRoutes() {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <AppLayout /> : <Navigate to="/" />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<LoginPage />} />
          <Route path="/" element={<ProtectedRoutes />}>
          <Route path="dashboard" element={<DashboardPage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="patients" element={<PatientsPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="medical-records" element={<MedicalRecordsPage />} />
            <Route path="prescriptions" element={<PrescriptionsPage />} />
          </Route>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/tailwind-test" element={<TestTailwindPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
