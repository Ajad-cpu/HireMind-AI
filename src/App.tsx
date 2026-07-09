import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import ErrorBoundary from '@/components/layout/ErrorBoundary';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';

// Lazy-loaded pages for code splitting
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const SavedJobsPage = lazy(() => import('@/pages/SavedJobsPage'));
const ApplicationsPage = lazy(() => import('@/pages/ApplicationsPage'));
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage'));
const EmployerDashboardPage = lazy(() => import('@/pages/EmployerDashboardPage'));
const EmployerJobsPage = lazy(() => import('@/pages/EmployerJobsPage'));
const EmployerApplicantsPage = lazy(() => import('@/pages/EmployerApplicantsPage'));
const EmployerRankingPage = lazy(() => import('@/pages/EmployerRankingPage'));
const CandidateAtsFeedbackPage = lazy(() => import('@/pages/CandidateAtsFeedbackPage'));
const MessagingPage = lazy(() => import('@/pages/MessagingPage'));
const JobsPage = lazy(() => import('@/pages/JobsPage'));
const JobDetailPage = lazy(() => import('@/pages/JobDetailPage'));

// Loading fallback
const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/saved-jobs" element={<SavedJobsPage />} />
                    <Route path="/applications" element={<ApplicationsPage />} />
                    <Route path="/notifications" element={<NotificationsPage />} />
                    <Route path="/employer/dashboard" element={<EmployerDashboardPage />} />
                    <Route path="/employer/jobs" element={<EmployerJobsPage />} />
                    <Route path="/employer/applicants" element={<EmployerApplicantsPage />} />
                    <Route path="/employer/ranking" element={<EmployerRankingPage />} />
                    <Route path="/messages" element={<MessagingPage />} />
                    <Route path="/jobs" element={<JobsPage />} />
                    <Route path="/jobs/:id" element={<JobDetailPage />} />
                    <Route path="/candidate/ats-feedback" element={<CandidateAtsFeedbackPage />} />
                  </Routes>
                </Suspense>
              </ErrorBoundary>
            </main>
          </div>
        </Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { borderRadius: '8px', background: '#333', color: '#fff' },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;