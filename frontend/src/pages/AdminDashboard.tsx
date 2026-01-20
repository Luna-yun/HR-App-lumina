import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, UserCheck, Clock, Building2, CheckCircle2, AlertCircle } from 'lucide-react';
import { adminAPI } from '@/lib/api';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const [pendingEmployees, setPendingEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingEmployees();
  }, []);

  const fetchPendingEmployees = async () => {
    try {
      const response = await adminAPI.getPendingEmployees();
      setPendingEmployees(response.data);
    } catch (error) {
      toast.error('Failed to load pending employees');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (employeeId: string) => {
    setApprovingId(employeeId);
    try {
      await adminAPI.approveEmployee(employeeId);
      toast.success('Employee approved successfully');
      // Remove from pending list
      setPendingEmployees(pendingEmployees.filter(emp => emp.id !== employeeId));
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to approve employee';
      toast.error(message);
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your organization and employees</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">247</div>
              <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <Clock className="w-4 h-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingEmployees.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting your review</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Today</CardTitle>
              <UserCheck className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">189</div>
              <p className="text-xs text-muted-foreground mt-1">76% attendance rate</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Departments</CardTitle>
              <Building2 className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground mt-1">Across organization</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Employees Section */}
        <Card className="border-border/50 shadow-sm mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              Pending Employee Approvals
            </CardTitle>
            <CardDescription>
              Review and approve new employee registrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : pendingEmployees.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <p className="text-muted-foreground">No pending approvals</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingEmployees.map((employee) => (
                  <motion.div
                    key={employee.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{employee.email}</p>
                        <p className="text-sm text-muted-foreground">
                          Registered {new Date(employee.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleApprove(employee.id)}
                      disabled={approvingId === employee.id}
                      size="sm"
                    >
                      {approvingId === employee.id ? 'Approving...' : 'Approve'}
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates across your organization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'New employee joined', name: 'Sarah Johnson', time: '2 hours ago', type: 'success' },
                { action: 'Leave request submitted', name: 'Michael Chen', time: '4 hours ago', type: 'info' },
                { action: 'Attendance marked', name: 'Emily Davis', time: '5 hours ago', type: 'success' },
                { action: 'Profile updated', name: 'David Kim', time: 'Yesterday', type: 'info' },
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className={`w-2 h-2 rounded-full ${activity.type === 'success' ? 'bg-green-600' : 'bg-blue-600'}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.name}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
}
