import { motion } from "framer-motion";
import { 
  Users, 
  Calendar, 
  Clock, 
  FileText, 
  Building2, 
  Bell,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  User
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { useAuth } from "@/contexts/AuthContext";

// Mock data for demonstration
const mockStats = {
  totalEmployees: 156,
  presentToday: 142,
  onLeave: 8,
  pendingLeave: 3,
  departments: 8,
  newNotices: 2,
};

const mockRecentActivity = [
  { id: 1, type: "leave", user: "Sarah Chen", action: "requested leave for Dec 20-22", time: "2 hours ago" },
  { id: 2, type: "attendance", user: "John Smith", action: "clocked in late", time: "3 hours ago" },
  { id: 3, type: "notice", user: "HR Team", action: "posted holiday schedule", time: "5 hours ago" },
  { id: 4, type: "leave", user: "Mike Johnson", action: "leave request approved", time: "Yesterday" },
];

const mockDepartments = [
  { name: "Engineering", count: 45, color: "primary" },
  { name: "Marketing", count: 23, color: "accent" },
  { name: "Finance", count: 18, color: "emerald" },
  { name: "Operations", count: 32, color: "amber" },
  { name: "HR", count: 12, color: "rose" },
];

const mockPendingLeave = [
  { id: 1, name: "Sarah Chen", type: "Annual Leave", dates: "Dec 20-22", days: 3 },
  { id: 2, name: "David Park", type: "Sick Leave", dates: "Dec 18", days: 1 },
  { id: 3, name: "Lisa Wong", type: "Personal Leave", dates: "Dec 23", days: 1 },
];

export default function AdminDashboard() {
  const { userProfile } = useAuth();

  return (
    <DashboardLayout role="admin">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Good morning, {userProfile?.fullName?.split(' ')[0] || 'Admin'}
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening with your organization today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <StatCard
          icon={Users}
          label="Total Employees"
          value={mockStats.totalEmployees}
          change="+4 this month"
          trend="up"
          color="primary"
          delay={0}
        />
        <StatCard
          icon={CheckCircle}
          label="Present Today"
          value={mockStats.presentToday}
          change={`${Math.round((mockStats.presentToday / mockStats.totalEmployees) * 100)}%`}
          trend="up"
          color="emerald"
          delay={0.05}
        />
        <StatCard
          icon={Calendar}
          label="On Leave"
          value={mockStats.onLeave}
          trend="neutral"
          color="amber"
          delay={0.1}
        />
        <StatCard
          icon={FileText}
          label="Pending Requests"
          value={mockStats.pendingLeave}
          change="Needs attention"
          trend="neutral"
          color="rose"
          delay={0.15}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Activity & Leave Requests */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="card-elevated p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
              <span className="text-sm text-primary font-medium cursor-pointer hover:text-primary/80 transition-colors">
                View all
              </span>
            </div>
            <div className="space-y-4">
              {mockRecentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.25 + index * 0.05 }}
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-primary font-semibold text-xs">
                      {activity.user.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">
                      <span className="font-medium">{activity.user}</span>{' '}
                      <span className="text-muted-foreground">{activity.action}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Pending Leave Requests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="card-elevated p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-foreground">Pending Leave Requests</h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600">
                  {mockPendingLeave.length}
                </span>
              </div>
              <span className="text-sm text-primary font-medium cursor-pointer hover:text-primary/80 transition-colors">
                View all
              </span>
            </div>
            <div className="space-y-3">
              {mockPendingLeave.map((request, index) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.35 + index * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-semibold text-sm">
                        {request.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{request.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {request.type} • {request.dates} ({request.days} day{request.days > 1 ? 's' : ''})
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 rounded-lg text-sm font-medium bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors">
                      Approve
                    </button>
                    <button className="px-3 py-1.5 rounded-lg text-sm font-medium bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 transition-colors">
                      Decline
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column - Departments & Notices */}
        <div className="space-y-6">
          {/* Department Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="card-elevated p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Departments</h2>
                <p className="text-sm text-muted-foreground">{mockStats.departments} total</p>
              </div>
            </div>
            <div className="space-y-3">
              {mockDepartments.map((dept, index) => (
                <motion.div
                  key={dept.name}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <span className="text-sm font-medium text-foreground">{dept.name}</span>
                  <span className="text-sm text-muted-foreground">{dept.count} employees</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Notices */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="card-elevated p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Bell className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Notices</h2>
                <p className="text-sm text-muted-foreground">{mockStats.newNotices} new</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                <p className="font-medium text-foreground text-sm">Holiday Schedule 2024</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Updated holiday calendar for the upcoming year...
                </p>
                <p className="text-xs text-primary mt-2 font-medium">Posted today</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30 border border-border">
                <p className="font-medium text-foreground text-sm">Office Maintenance</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Building maintenance scheduled for Dec 25...
                </p>
                <p className="text-xs text-muted-foreground mt-2">Posted 2 days ago</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
