import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute, PublicOnlyRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import AdminDashboard from "./pages/admin/Dashboard";
import EmployeeDashboard from "./pages/employee/Dashboard";
import NotFound from "./pages/NotFound";
import { USER_ROLES } from "./lib/constants";

// Feature pages
import EmployeeManagement from "./pages/features/EmployeeManagement";
import LeaveAttendance from "./pages/features/LeaveAttendance";
import PerformanceReviews from "./pages/features/PerformanceReviews";
import DocumentManagement from "./pages/features/DocumentManagement";
import TimeTracking from "./pages/features/TimeTracking";
import ASEANLabourPolicies from "./pages/features/ASEANLabourPolicies";
import HRAdministration from "./pages/features/HRAdministration";
import WorkflowAutomation from "./pages/features/WorkflowAutomation";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/pricing" element={<Pricing />} />
            
            {/* Feature pages */}
            <Route path="/features/employee-management" element={<EmployeeManagement />} />
            <Route path="/features/leave-attendance" element={<LeaveAttendance />} />
            <Route path="/features/performance-reviews" element={<PerformanceReviews />} />
            <Route path="/features/document-management" element={<DocumentManagement />} />
            <Route path="/features/time-tracking" element={<TimeTracking />} />
            <Route path="/features/asean-labour-policies" element={<ASEANLabourPolicies />} />
            <Route path="/features/hr-administration" element={<HRAdministration />} />
            <Route path="/features/workflow-automation" element={<WorkflowAutomation />} />
            
            <Route 
              path="/login" 
              element={
                <PublicOnlyRoute>
                  <Login />
                </PublicOnlyRoute>
              } 
            />
            <Route 
              path="/signup" 
              element={
                <PublicOnlyRoute>
                  <SignUp />
                </PublicOnlyRoute>
              } 
            />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/employee/dashboard" 
              element={
                <ProtectedRoute allowedRoles={[USER_ROLES.EMPLOYEE]}>
                  <EmployeeDashboard />
                </ProtectedRoute>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
