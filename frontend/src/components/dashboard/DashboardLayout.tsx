import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { 
  LogOut, 
  User, 
  Home,
  Users,
  Building2,
  FileText,
  Calendar,
  Bell,
  Settings,
  ChevronRight,
  type LucideIcon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/constants";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: UserRole;
}

interface NavItem {
  icon: LucideIcon;
  label: string;
  href: string;
  badge?: string;
}

const adminNavItems: NavItem[] = [
  { icon: Home, label: "Dashboard", href: "/admin/dashboard" },
  { icon: Users, label: "Employees", href: "/admin/employees" },
  { icon: Building2, label: "Departments", href: "/admin/departments" },
  { icon: Calendar, label: "Attendance", href: "/admin/attendance" },
  { icon: FileText, label: "Leave Requests", href: "/admin/leave", badge: "3" },
  { icon: Bell, label: "Notices", href: "/admin/notices" },
];

const employeeNavItems: NavItem[] = [
  { icon: Home, label: "Dashboard", href: "/employee/dashboard" },
  { icon: User, label: "My Profile", href: "/employee/profile" },
  { icon: Calendar, label: "Attendance", href: "/employee/attendance" },
  { icon: FileText, label: "Leave", href: "/employee/leave" },
  { icon: Bell, label: "Notices", href: "/employee/notices", badge: "2" },
];

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const { userProfile, signOut } = useAuth();
  const location = useLocation();
  
  const navItems = role === "admin" ? adminNavItems : employeeNavItems;
  const isAdmin = role === "admin";

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-card border-r border-border"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 h-16 px-6 border-b border-border">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">L</span>
            </div>
            <span className="text-lg font-display font-bold text-foreground">
              LuminaHR
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-semibold text-sm">
                {userProfile?.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {userProfile?.fullName || 'User'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {isAdmin ? 'Administrator' : 'Employee'}
              </p>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 lg:pl-64">
        {/* Top header */}
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between h-16 px-6">
            {/* Mobile logo */}
            <div className="flex items-center gap-3 lg:hidden">
              <Link to="/" className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">L</span>
                </div>
                <span className="text-lg font-display font-bold text-foreground">
                  LuminaHR
                </span>
              </Link>
            </div>

            {/* Role badge */}
            <div className="hidden lg:flex items-center gap-2">
              <span className={cn(
                "px-3 py-1 rounded-full text-xs font-semibold",
                isAdmin 
                  ? "bg-primary/10 text-primary" 
                  : "bg-accent/10 text-accent"
              )}>
                {isAdmin ? 'Admin Panel' : 'Employee Portal'}
              </span>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-foreground">
                  {userProfile?.fullName || 'User'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {userProfile?.companyName}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={signOut}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign out</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
