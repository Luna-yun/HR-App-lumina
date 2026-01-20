import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

// Landing Pages
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';

// Feature Pages
import ASEANLabourPolicies from '@/pages/features/ASEANLabourPolicies';
import DocumentManagement from '@/pages/features/DocumentManagement';
import EmployeeManagement from '@/pages/features/EmployeeManagement';
import HRAdministration from '@/pages/features/HRAdministration';
import LeaveAttendance from '@/pages/features/LeaveAttendance';
import PerformanceReviews from '@/pages/features/PerformanceReviews';
import TimeTracking from '@/pages/features/TimeTracking';
import WorkflowAutomation from '@/pages/features/WorkflowAutomation';
import Team from '@/pages/features/Team';
import Pricing from '@/pages/Pricing';

// Admin Dashboard Pages
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminEmployees from '@/pages/admin/AdminEmployees';
import AdminDepartments from '@/pages/admin/AdminDepartments';
import AdminLeaves from '@/pages/admin/AdminLeaves';
import AdminAttendance from '@/pages/admin/AdminAttendance';
import AdminPayroll from '@/pages/admin/AdminPayroll';
import AdminNotices from '@/pages/admin/AdminNotices';
import AdminRecruitment from '@/pages/admin/AdminRecruitment';
import AdminAnalytics from '@/pages/admin/AdminAnalytics';
import AdminAIChat from '@/pages/admin/AdminAIChat';
import AdminProfile from '@/pages/admin/AdminProfile';

// Employee Dashboard Pages
import EmployeeDashboard from '@/pages/employee/EmployeeDashboard';
import EmployeeProfile from '@/pages/employee/EmployeeProfile';
import EmployeeLeave from '@/pages/employee/EmployeeLeave';
import EmployeeAttendance from '@/pages/employee/EmployeeAttendance';
import EmployeeSalary from '@/pages/employee/EmployeeSalary';
import EmployeeNotices from '@/pages/employee/EmployeeNotices';

// 404 Page
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

// Protected Route Component
const ProtectedRoute: React.FC<{ 
  children: React.ReactNode; 
  allowedRoles?: ('Admin' | 'Employee')[];
}> = ({ children, allowedRoles }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard
    return <Navigate to={user.role === 'Admin' ? '/admin' : '/employee'} replace />;
  }

  return <>{children}</>;
};

// Public Route Component (redirect if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return <Navigate to={user.role === 'Admin' ? '/admin' : '/employee'} replace />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Landing Pages */}
      <Route path="/" element={<Index />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
      
      {/* Feature Pages */}
      <Route path="/features/asean-labour-policies" element={<ASEANLabourPolicies />} />
      <Route path="/features/document-management" element={<DocumentManagement />} />
      <Route path="/features/employee-management" element={<EmployeeManagement />} />
      <Route path="/features/hr-administration" element={<HRAdministration />} />
      <Route path="/features/leave-attendance" element={<LeaveAttendance />} />
      <Route path="/features/performance-reviews" element={<PerformanceReviews />} />
      <Route path="/features/time-tracking" element={<TimeTracking />} />
      <Route path="/features/workflow-automation" element={<WorkflowAutomation />} />
      <Route path="/features/team" element={<Team />} />

      {/* Admin Dashboard Routes */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['Admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/employees" element={<ProtectedRoute allowedRoles={['Admin']}><AdminEmployees /></ProtectedRoute>} />
      <Route path="/admin/departments" element={<ProtectedRoute allowedRoles={['Admin']}><AdminDepartments /></ProtectedRoute>} />
      <Route path="/admin/leaves" element={<ProtectedRoute allowedRoles={['Admin']}><AdminLeaves /></ProtectedRoute>} />
      <Route path="/admin/attendance" element={<ProtectedRoute allowedRoles={['Admin']}><AdminAttendance /></ProtectedRoute>} />
      <Route path="/admin/payroll" element={<ProtectedRoute allowedRoles={['Admin']}><AdminPayroll /></ProtectedRoute>} />
      <Route path="/admin/notices" element={<ProtectedRoute allowedRoles={['Admin']}><AdminNotices /></ProtectedRoute>} />
      <Route path="/admin/recruitment" element={<ProtectedRoute allowedRoles={['Admin']}><AdminRecruitment /></ProtectedRoute>} />
      <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles={['Admin']}><AdminAnalytics /></ProtectedRoute>} />
      <Route path="/admin/ai-chat" element={<ProtectedRoute allowedRoles={['Admin']}><AdminAIChat /></ProtectedRoute>} />
      <Route path="/admin/profile" element={<ProtectedRoute allowedRoles={['Admin']}><AdminProfile /></ProtectedRoute>} />

      {/* Employee Dashboard Routes */}
      <Route path="/employee" element={<ProtectedRoute allowedRoles={['Employee']}><EmployeeDashboard /></ProtectedRoute>} />
      <Route path="/employee/profile" element={<ProtectedRoute allowedRoles={['Employee']}><EmployeeProfile /></ProtectedRoute>} />
      <Route path="/employee/leave" element={<ProtectedRoute allowedRoles={['Employee']}><EmployeeLeave /></ProtectedRoute>} />
      <Route path="/employee/attendance" element={<ProtectedRoute allowedRoles={['Employee']}><EmployeeAttendance /></ProtectedRoute>} />
      <Route path="/employee/salary" element={<ProtectedRoute allowedRoles={['Employee']}><EmployeeSalary /></ProtectedRoute>} />
      <Route path="/employee/notices" element={<ProtectedRoute allowedRoles={['Employee']}><EmployeeNotices /></ProtectedRoute>} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
