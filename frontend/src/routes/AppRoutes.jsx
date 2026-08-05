// frontend/src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../layouts/MainLayout';

// Public Pages
import LandingPage from '../pages/LandingPage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import AdminLoginPage from '../pages/AdminLoginPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import NotFoundPage from '../pages/NotFoundPage';

// User Pages
import UserDashboardPage from '../pages/UserDashboardPage';
import ProfilePage from '../pages/ProfilePage';
import AssessmentPage from '../pages/AssessmentPage';
import PredictionResultPage from '../pages/PredictionResultPage';
import RecommendationsPage from '../pages/RecommendationsPage';
import HistoryPage from '../pages/HistoryPage';
import DoctorConsultationPage from '../pages/DoctorConsultationPage';
import EducationResourcesPage from '../pages/EducationResourcesPage';
import UnderConstructionPage from '../pages/UnderConstructionPage';

// Doctor & Admin Pages
import DoctorDashboardPage from '../pages/DoctorDashboardPage';
import AdminDashboardPage from '../pages/AdminDashboardPage';

// Auth Guard: Requires Login
function AuthGuard({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Role Guard: Requires specific account roles
function RoleGuard({ children, allowedRoles }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!allowedRoles.includes(user.role)) {
    // Redirect role-appropriate panels
    if (user.role === 'admin') return <Navigate to="/admin-dashboard" replace />;
    if (user.role === 'doctor') return <Navigate to="/doctor-dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages wrapped in MainLayout */}
      <Route path="/" element={<MainLayout><LandingPage /></MainLayout>} />
      <Route path="/about" element={<MainLayout><AboutPage /></MainLayout>} />
      <Route path="/contact" element={<MainLayout><ContactPage /></MainLayout>} />
      <Route path="/login" element={<MainLayout><LoginPage /></MainLayout>} />
      <Route path="/register" element={<MainLayout><RegisterPage /></MainLayout>} />
      <Route path="/admin-login" element={<MainLayout><AdminLoginPage /></MainLayout>} />
      <Route path="/forgot-password" element={<MainLayout><ForgotPasswordPage /></MainLayout>} />
      <Route path="/reset-password" element={<MainLayout><ResetPasswordPage /></MainLayout>} />

      {/* User Protected Routes */}
      <Route path="/dashboard" element={
        <AuthGuard>
          <RoleGuard allowedRoles={['user']}>
            <MainLayout><UserDashboardPage /></MainLayout>
          </RoleGuard>
        </AuthGuard>
      } />
      <Route path="/profile" element={
        <AuthGuard>
          <RoleGuard allowedRoles={['user', 'doctor', 'admin']}>
            <MainLayout><ProfilePage /></MainLayout>
          </RoleGuard>
        </AuthGuard>
      } />
      <Route path="/assessment" element={
        <AuthGuard>
          <RoleGuard allowedRoles={['user']}>
            <MainLayout><AssessmentPage /></MainLayout>
          </RoleGuard>
        </AuthGuard>
      } />
      <Route path="/prediction" element={
        <AuthGuard>
          <RoleGuard allowedRoles={['user']}>
            <MainLayout><PredictionResultPage /></MainLayout>
          </RoleGuard>
        </AuthGuard>
      } />
      <Route path="/recommendations" element={
        <AuthGuard>
          <RoleGuard allowedRoles={['user']}>
            <MainLayout><RecommendationsPage /></MainLayout>
          </RoleGuard>
        </AuthGuard>
      } />
      <Route path="/history" element={
        <AuthGuard>
          <RoleGuard allowedRoles={['user']}>
            <MainLayout><HistoryPage /></MainLayout>
          </RoleGuard>
        </AuthGuard>
      } />
      
      {/* User view doctor consultation page */}
      <Route path="/doctor" element={
        <AuthGuard>
          <RoleGuard allowedRoles={['user']}>
            <MainLayout><DoctorConsultationPage /></MainLayout>
          </RoleGuard>
        </AuthGuard>
      } />

      {/* Shared Protected Pages */}
      <Route path="/education" element={<MainLayout><EducationResourcesPage /></MainLayout>} />

      {/* Doctor Dashboards */}
      <Route path="/doctor-dashboard" element={
        <AuthGuard>
          <RoleGuard allowedRoles={['doctor']}>
            <MainLayout><DoctorDashboardPage /></MainLayout>
          </RoleGuard>
        </AuthGuard>
      } />

      {/* Admin Dashboards */}
      <Route path="/admin-dashboard" element={
        <AuthGuard>
          <RoleGuard allowedRoles={['admin']}>
            <MainLayout><AdminDashboardPage /></MainLayout>
          </RoleGuard>
        </AuthGuard>
      } />

      {/* 404 Page */}
      <Route path="*" element={<MainLayout><NotFoundPage /></MainLayout>} />
    </Routes>
  );
}
