import { motion } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  FileText, 
  Bell,
  CheckCircle,
  DollarSign,
  TrendingUp,
  MapPin,
  AlertCircle,
  Loader2
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { useAuth } from "@/contexts/AuthContext";
import { useEmployeeData } from "@/hooks/useEmployeeData";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { toast } from "sonner";

export default function EmployeeDashboard() {
  const { userProfile } = useAuth();
  const {
    employee,
    todayAttendance,
    attendanceStatus,
    leaveRequests,
    leaveBalances,
    leaveSummary,
    currentSalary,
    notices,
    isLoading,
    checkIn,
    checkOut,
  } = useEmployeeData();

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "morning";
    if (hour < 17) return "afternoon";
    return "evening";
  };

  const handleCheckIn = async () => {
    const { error } = await checkIn();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Checked in successfully!");
    }
  };

  const handleCheckOut = async () => {
    const { error } = await checkOut();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Checked out successfully!");
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout role="employee">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="employee">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Good {getTimeOfDay()}, {userProfile?.fullName?.split(' ')[0] || 'there'}
        </h1>
        <div className="flex items-center gap-2 mt-1">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            {userProfile?.companyName} • {userProfile?.country}
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <StatCard
          icon={TrendingUp}
          label="Leave Requests"
          value={leaveSummary.pending + leaveSummary.approved + leaveSummary.rejected}
          change={`${leaveSummary.pending} pending`}
          trend="neutral"
          color="primary"
          delay={0}
        />
        <StatCard
          icon={Calendar}
          label="Leaves Used"
          value={leaveBalances.reduce((acc, lb) => acc + lb.used_days, 0)}
          change={`${leaveBalances.reduce((acc, lb) => acc + lb.remaining_days, 0)} remaining`}
          trend="neutral"
          color="emerald"
          delay={0.05}
        />
        <StatCard
          icon={Clock}
          label="Pending Requests"
          value={leaveSummary.pending}
          trend="neutral"
          color="amber"
          delay={0.1}
        />
        <StatCard
          icon={DollarSign}
          label="Base Salary"
          value={currentSalary ? `$${Number(currentSalary.base_salary).toLocaleString()}` : 'Not set'}
          change={currentSalary ? `Per ${currentSalary.pay_period}` : ''}
          trend="neutral"
          color="accent"
          delay={0.15}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Attendance Widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="card-elevated p-6"
          >
            <h2 className="text-lg font-semibold text-foreground mb-4">Today's Attendance</h2>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {attendanceStatus === 'completed' && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Day Complete
                    </span>
                  )}
                  {attendanceStatus === 'checked-in' && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Working
                    </span>
                  )}
                  {attendanceStatus === 'not-checked-in' && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Not Checked In
                    </span>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {todayAttendance?.check_in && (
                    <span>Check in: {format(new Date(todayAttendance.check_in), 'h:mm a')}</span>
                  )}
                  {todayAttendance?.check_out && (
                    <span className="ml-4">Check out: {format(new Date(todayAttendance.check_out), 'h:mm a')}</span>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleCheckIn}
                  disabled={attendanceStatus !== 'not-checked-in'}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Check In
                </Button>
                <Button
                  onClick={handleCheckOut}
                  disabled={attendanceStatus !== 'checked-in'}
                  variant="outline"
                >
                  Check Out
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Leave Requests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="card-elevated p-6"
          >
            <h2 className="text-lg font-semibold text-foreground mb-4">Recent Leave Requests</h2>
            {leaveRequests.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">No leave requests yet</p>
            ) : (
              <div className="space-y-3">
                {leaveRequests.slice(0, 5).map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div>
                      <p className="font-medium text-foreground text-sm">{request.leave_type?.name || 'Leave'}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(request.start_date), 'MMM d')} - {format(new Date(request.end_date), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      request.status === 'approved' ? 'bg-emerald-500/10 text-emerald-600' :
                      request.status === 'rejected' ? 'bg-rose-500/10 text-rose-600' :
                      'bg-amber-500/10 text-amber-600'
                    }`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Leave Balance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="card-elevated p-6"
          >
            <h2 className="font-semibold text-foreground mb-4">Leave Balance</h2>
            {leaveBalances.length === 0 ? (
              <p className="text-muted-foreground text-sm">No leave balance set up yet</p>
            ) : (
              <div className="space-y-4">
                {leaveBalances.map((balance) => (
                  <div key={balance.id}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{balance.leave_type?.name}</span>
                      <span className="text-sm text-muted-foreground">{balance.remaining_days}/{balance.total_days}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${(balance.remaining_days / balance.total_days) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Notices */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="card-elevated p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-foreground">Notices</h2>
            </div>
            {notices.length === 0 ? (
              <p className="text-muted-foreground text-sm">No notices</p>
            ) : (
              <div className="space-y-3">
                {notices.map((notice) => (
                  <div key={notice.id} className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                    <p className="font-medium text-foreground text-sm">{notice.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notice.content}</p>
                    {notice.published_at && (
                      <p className="text-xs text-primary mt-2">{format(new Date(notice.published_at), 'MMM d, yyyy')}</p>
                    )}
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
