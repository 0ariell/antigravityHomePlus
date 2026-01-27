import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './app/stores';
import { ProtectedRoute } from './components/auth';
import { DashboardLayout } from './components/layout';
import { LoginPage, RegisterPage } from './pages/auth';
import { DashboardPage } from './pages/dashboard';
import { ServicesPage, ServiceDetailPage } from './pages/services';
import { MyJobsPage } from './pages/jobs';
import { ChatPage } from './pages/chat';
import { MyServicesPage } from './pages/my-services';
// MyRequestsPage removed - functionality moved to MyJobsPage
import { SettingsPage } from './pages/settings';
import { HelpPage } from './pages/help';
import { ProfilePage } from './pages/profile/ProfilePage';
import { LandingPage } from './pages/landing';

function App() {
  const { loadUser, isAuthenticated } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />}
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage />}
        />

        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:id" element={<ServiceDetailPage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/my-jobs" element={<MyJobsPage />} />
          <Route path="/bookings" element={<Navigate to="/my-jobs" />} />
          <Route path="/my-requests" element={<Navigate to="/my-jobs" />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/my-services" element={<MyServicesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/help" element={<HelpPage />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

