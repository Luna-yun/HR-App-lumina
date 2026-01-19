import { motion } from "framer-motion";
import { 
  Users, 
  Calendar, 
  FileText, 
  Building2, 
  Bell,
  CheckCircle,
  AlertCircle,
  Loader2,
  Clock
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminData } from "@/hooks/useAdminData";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { toast } from "sonner";

export default function AdminDashboard() {
  const { userProfile } = useAuth();
  const {
    departments,
    pendingLeaveRequests,
    todayAttendance,
    notices,
    stats,
    isLoading,
    approveLeaveRequest,
    rejectLeaveRequest,
  } = useAdminData();

  const handleApprove = async (id: string) => {
    const { error } = await approveLeaveRequest(id);
    if (error) {
      toast.error("Failed to approve request");
    } else {
      toast.success("Leave request approved");
    }
  };

  const handleReject = async (id: string) => {
    const { error } = await rejectLeaveRequest(id);
    if (error) {
      toast.error("Failed to reject request");
    } else {
      toast.success("Leave request rejected");
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Welcome back, {userProfile?.fullName?.split(' ')[0] || 'Admin'}
        </h1>
        <p className="text-muted-foreground mt-1">Here's your organization overview.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <StatCard icon={Users} label="Total Employees" value={stats.totalEmployees} change={`${stats.activeEmployees} active`} trend="up" color="primary" delay={0} />
        <StatCard icon={CheckCircle} label="Present Today" value={stats.presentToday} change={stats.totalEmployees > 0 ? `${Math.round((stats.presentToday / stats.totalEmployees) * 100)}%` : '0%'} trend="up" color="emerald" delay={0.05} />
        <StatCard icon={Calendar} label="On Leave" value={stats.onLeave} trend="neutral" color="amber" delay={0.1} />
        <StatCard icon={FileText} label="Pending Requests" value={stats.pendingLeaveCount} change={stats.pendingLeaveCount > 0 ? "Needs attention" : ""} trend="neutral" color="rose" delay={0.15} />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pending Leave Requests */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-elevated p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold">Pending Leave Requests</h2>
                {stats.pendingLeaveCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600">{stats.pendingLeaveCount}</span>
                )}
              </div>
            </div>
            {pendingLeaveRequests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-emerald-500/50" />
                <p>All caught up! No pending requests.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingLeaveRequests.slice(0, 5).map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 rounded-lg border border-border bg-card">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-semibold text-sm">
                          {request.employee?.profile?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '?'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{request.employee?.profile?.full_name || 'Unknown'}</p>
                        <p className="text-sm text-muted-foreground">
                          {request.leave_type?.name} • {format(new Date(request.start_date), 'MMM d')} - {format(new Date(request.end_date), 'MMM d')} ({request.days_count} days)
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => handleApprove(request.id)}>Approve</Button>
                      <Button size="sm" variant="outline" className="text-rose-600 border-rose-200 hover:bg-rose-50" onClick={() => handleReject(request.id)}>Decline</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Today's Attendance */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="card-elevated p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Today's Attendance</h2>
              {stats.missingCheckouts > 0 && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {stats.missingCheckouts} missing checkout
                </span>
              )}
            </div>
            {todayAttendance.length === 0 ? (
              <p className="text-center py-6 text-muted-foreground">No attendance records today</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 text-sm font-medium text-muted-foreground">Employee</th>
                      <th className="text-left py-2 text-sm font-medium text-muted-foreground">Check In</th>
                      <th className="text-left py-2 text-sm font-medium text-muted-foreground">Check Out</th>
                      <th className="text-left py-2 text-sm font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todayAttendance.slice(0, 8).map((record) => (
                      <tr key={record.id} className="border-b border-border/50">
                        <td className="py-3 text-sm font-medium">{record.employee?.profile?.full_name || 'Unknown'}</td>
                        <td className="py-3 text-sm text-muted-foreground">{record.check_in ? format(new Date(record.check_in), 'h:mm a') : '-'}</td>
                        <td className="py-3 text-sm text-muted-foreground">{record.check_out ? format(new Date(record.check_out), 'h:mm a') : '-'}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            record.status === 'present' ? 'bg-emerald-500/10 text-emerald-600' :
                            record.status === 'late' ? 'bg-amber-500/10 text-amber-600' :
                            'bg-muted text-muted-foreground'
                          }`}>{record.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Departments */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card-elevated p-6">
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="w-5 h-5 text-primary" />
              <h2 className="font-semibold">Departments</h2>
            </div>
            {departments.length === 0 ? (
              <p className="text-muted-foreground text-sm">No departments created</p>
            ) : (
              <div className="space-y-2">
                {departments.map((dept) => (
                  <div key={dept.id} className="flex justify-between p-3 rounded-lg hover:bg-muted/30">
                    <span className="text-sm font-medium">{dept.name}</span>
                    <span className="text-sm text-muted-foreground">{dept.employee_count} employees</span>
                  </div>
                ))}
                {stats.employeesWithoutDepartment > 0 && (
                  <div className="flex justify-between p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
                    <span className="text-sm font-medium text-amber-700">Unassigned</span>
                    <span className="text-sm text-amber-600">{stats.employeesWithoutDepartment} employees</span>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Notices */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="card-elevated p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-5 h-5 text-primary" />
              <h2 className="font-semibold">Recent Notices</h2>
            </div>
            {notices.length === 0 ? (
              <p className="text-muted-foreground text-sm">No notices</p>
            ) : (
              <div className="space-y-3">
                {notices.slice(0, 3).map((notice) => (
                  <div key={notice.id} className={`p-3 rounded-lg border ${notice.is_published ? 'bg-primary/5 border-primary/10' : 'bg-muted/30 border-border'}`}>
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-sm">{notice.title}</p>
                      {!notice.is_published && <span className="px-1.5 py-0.5 rounded text-[10px] bg-muted text-muted-foreground">Draft</span>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{notice.content}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
