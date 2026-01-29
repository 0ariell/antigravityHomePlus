import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './app/stores';
import { ProtectedRoute } from './components/auth';
import { DashboardLayout } from './components/layout';
import { Loader2 } from 'lucide-react';

// Lazy Imports
const LoginPage = lazy(() => import('./pages/auth').then(module => ({ default: module.LoginPage })));
const RegisterPage = lazy(() => import('./pages/auth').then(module => ({ default: module.RegisterPage })));
const LandingPage = lazy(() => import('./pages/landing').then(module => ({ default: module.LandingPage })));

const DashboardPage = lazy(() => import('./pages/dashboard').then(module => ({ default: module.DashboardPage })));
const ProvidersPage = lazy(() => import('./pages/services').then(module => ({ default: module.ProvidersPage })));
const MyJobsPage = lazy(() => import('./pages/jobs').then(module => ({ default: module.MyJobsPage })));
const MyServicesPage = lazy(() => import('./pages/my-services').then(module => ({ default: module.MyServicesPage })));
const ChatPage = lazy(() => import('./pages/chat').then(module => ({ default: module.ChatPage })));
const SettingsPage = lazy(() => import('./pages/settings').then(module => ({ default: module.SettingsPage })));
const HelpPage = lazy(() => import('./pages/help').then(module => ({ default: module.HelpPage })));
const ProfilePage = lazy(() => import('./pages/profile/ProfilePage').then(module => ({ default: module.ProfilePage })));

// Request Flow Lazy Imports
const RequestWizard = lazy(() => import('./pages/requests').then(module => ({ default: module.RequestWizard })));
const MyRequestsPage = lazy(() => import('./pages/requests').then(module => ({ default: module.MyRequestsPage })));
const ProviderLeads = lazy(() => import('./pages/requests').then(module => ({ default: module.ProviderLeads })));
const LeadDetailPage = lazy(() => import('./pages/requests').then(module => ({ default: module.LeadDetailPage })));

function FullPageLoader() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center">
       <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-4" />
       <p className="text-gray-500 font-medium text-sm animate-pulse">Cargando aplicación...</p>
    </div>
  );
}

function App() {
  const { loadUser, isAuthenticated } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <BrowserRouter>
      <Suspense fallback={<FullPageLoader />}>
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
            <Route path="/professionals" element={<ProvidersPage />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/my-jobs" element={<MyJobsPage />} />
            <Route path="/bookings" element={<Navigate to="/my-jobs" />} />
            
            {/* Request Flow */}
            <Route path="/request-wizard" element={<RequestWizard />} />
            <Route path="/my-requests" element={<MyRequestsPage />} />
            <Route path="/leads" element={<ProviderLeads />} />
            <Route path="/leads/:id" element={<LeadDetailPage />} />
            
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/my-services" element={<MyServicesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/help" element={<HelpPage />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;

