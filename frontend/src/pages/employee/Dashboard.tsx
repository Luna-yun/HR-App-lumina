import { motion } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  FileText, 
  Bell,
  CheckCircle,
  DollarSign,
  TrendingUp,
  MapPin
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { useAuth } from "@/contexts/AuthContext";

// Mock data for demonstration
const mockEmployeeStats = {
  attendanceRate: "96%",
  leavesRemaining: 12,
  leavesTaken: 3,
  pendingRequests: 1,
};

const mockAttendanceHistory = [
  { date: "Today", status: "present", checkIn: "9:02 AM", checkOut: "-" },
  { date: "Yesterday", status: "present", checkIn: "8:55 AM", checkOut: "6:10 PM" },
  { date: "Dec 15", status: "present", checkIn: "9:00 AM", checkOut: "6:05 PM" },
  { date: "Dec 14", status: "leave", checkIn: "-", checkOut: "-" },
  { date: "Dec 13", status: "present", checkIn: "8:58 AM", checkOut: "6:00 PM" },
];

const mockSalaryInfo = {
  baseSalary: "$4,500",
  lastPaid: "Dec 1, 2024",
  nextPayDate: "Jan 1, 2025",
  ytdEarnings: "$54,000",
};

const mockNotices = [
  { id: 1, title: "Holiday Schedule 2024", preview: "Updated calendar for upcoming holidays...", date: "Today", isNew: true },
  { id: 2, title: "Office Maintenance Notice", preview: "Building maintenance on Dec 25...", date: "2 days ago", isNew: true },
  { id: 3, title: "Benefits Enrollment", preview: "Open enrollment period ending soon...", date: "1 week ago", isNew: false },
];

const mockLeaveBalance = [
  { type: "Annual Leave", total: 15, used: 3, remaining: 12 },
  { type: "Sick Leave", total: 10, used: 1, remaining: 9 },
  { type: "Personal Leave", total: 3, used: 0, remaining: 3 },
];

export default function EmployeeDashboard() {
  const { userProfile } = useAuth();

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "morning";
    if (hour < 17) return "afternoon";
    return "evening";
  };

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
          label="Attendance Rate"
          value={mockEmployeeStats.attendanceRate}
          change="This month"
          trend="up"
          color="primary"
          delay={0}
        />
        <StatCard
          icon={Calendar}
          label="Leaves Remaining"
          value={mockEmployeeStats.leavesRemaining}
          change={`${mockEmployeeStats.leavesTaken} used`}
          trend="neutral"
          color="emerald"
          delay={0.05}
        />
        <StatCard
          icon={Clock}
          label="Pending Requests"
          value={mockEmployeeStats.pendingRequests}
          trend="neutral"
          color="amber"
          delay={0.1}
        />
        <StatCard
          icon={DollarSign}
          label="Last Salary"
          value={mockSalaryInfo.baseSalary}
          change={`Paid ${mockSalaryInfo.lastPaid}`}
          trend="neutral"
          color="accent"
          delay={0.15}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Attendance & Leave */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="card-elevated p-6"
          >
            <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: Clock, label: "Clock In", color: "emerald" },
                { icon: Calendar, label: "Request Leave", color: "primary" },
                { icon: FileText, label: "View Payslip", color: "accent" },
                { icon: Bell, label: "Notifications", color: "amber" },
              ].map((action, index) => (
                <motion.button
                  key={action.label}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-card hover:bg-muted/30 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${action.color === 'emerald' ? 'emerald-500' : action.color === 'amber' ? 'amber-500' : action.color}/10`}>
                    <action.icon className={`w-5 h-5 text-${action.color === 'emerald' ? 'emerald-600' : action.color === 'amber' ? 'amber-600' : action.color}`} />
                  </div>
                  <span className="text-sm font-medium text-foreground">{action.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Attendance History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="card-elevated p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Attendance History</h2>
              <span className="text-sm text-primary font-medium cursor-pointer hover:text-primary/80 transition-colors">
                View all
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Check In</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Check Out</th>
                  </tr>
                </thead>
                <tbody>
                  {mockAttendanceHistory.map((record, index) => (
                    <motion.tr
                      key={record.date}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                      className="border-b border-border/50 last:border-0"
                    >
                      <td className="py-3 px-4 text-sm font-medium text-foreground">{record.date}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          record.status === 'present' 
                            ? 'bg-emerald-500/10 text-emerald-600' 
                            : 'bg-amber-500/10 text-amber-600'
                        }`}>
                          {record.status === 'present' && <CheckCircle className="w-3 h-3" />}
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{record.checkIn}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{record.checkOut}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Leave Balance & Notices */}
        <div className="space-y-6">
          {/* Leave Balance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="card-elevated p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Leave Balance</h2>
                <p className="text-sm text-muted-foreground">2024 entitlement</p>
              </div>
            </div>
            <div className="space-y-4">
              {mockLeaveBalance.map((leave, index) => (
                <motion.div
                  key={leave.type}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.35 + index * 0.05 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">{leave.type}</span>
                    <span className="text-sm text-muted-foreground">{leave.remaining}/{leave.total}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${(leave.remaining / leave.total) * 100}%` }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Salary Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="card-elevated p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Salary Overview</h2>
                <p className="text-sm text-muted-foreground">Read-only preview</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                <span className="text-sm text-muted-foreground">Base Salary</span>
                <span className="font-semibold text-foreground">{mockSalaryInfo.baseSalary}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                <span className="text-sm text-muted-foreground">YTD Earnings</span>
                <span className="font-semibold text-foreground">{mockSalaryInfo.ytdEarnings}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                <span className="text-sm text-muted-foreground">Next Pay Date</span>
                <span className="font-semibold text-foreground">{mockSalaryInfo.nextPayDate}</span>
              </div>
            </div>
          </motion.div>

          {/* Notices */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="card-elevated p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">Notices</h2>
                  <p className="text-sm text-muted-foreground">Company updates</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {mockNotices.map((notice, index) => (
                <motion.div
                  key={notice.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.45 + index * 0.05 }}
                  className={`p-4 rounded-lg border transition-colors cursor-pointer hover:bg-muted/20 ${
                    notice.isNew 
                      ? 'bg-primary/5 border-primary/10' 
                      : 'bg-card border-border'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-foreground text-sm">{notice.title}</p>
                    {notice.isNew && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-primary text-primary-foreground">
                        NEW
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{notice.preview}</p>
                  <p className="text-xs text-muted-foreground mt-2">{notice.date}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
