import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { animate, stagger } from 'animejs';
import { useAuth } from '@/contexts/AuthContext';
import { employeeAPI, leaveAPI, attendanceAPI } from '@/services/api';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Users, UserPlus, Calendar, Clock, TrendingUp, TrendingDown, CheckCircle, XCircle,
  ArrowRight, ArrowUpRight, Building2, DollarSign, Bell, AlertCircle, Activity,
  Sparkles, BarChart3, PieChart, Zap, Target, Award, Briefcase, MessageSquare
} from 'lucide-react';
import type { AdminStats, LeaveRequest, PendingEmployee } from '@/types';

// Animated counter component
const AnimatedNumber = ({ value, suffix = '' }: { value: number | string, suffix?: string }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = typeof value === 'string' ? parseFloat(value) || 0 : value;

  useEffect(() => {
    const obj = { val: 0 };
    animate(obj, {
      val: numericValue,
      duration: 1500,
      easing: 'easeOutExpo',
      round: 1,
      update: () => {
        setDisplayValue(Math.round(obj.val));
      }
    });
  }, [numericValue]);

  return <>{displayValue}{suffix}</>;
};

// Sparkline mini chart component
const Sparkline = ({ data, color }: { data: number[], color: string }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((v - min) / range) * 80 - 10;
    return `${x},${y}`;
  }).join(' ');

  useEffect(() => {
    if (svgRef.current) {
      const polyline = svgRef.current.querySelector('polyline');
      if (polyline) {
        const length = polyline.getTotalLength();
        polyline.style.strokeDasharray = String(length);
        polyline.style.strokeDashoffset = String(length);
        animate(polyline, {
          strokeDashoffset: [length, 0],
          duration: 1500,
          easing: 'easeOutQuart'
        });
      }
    }
  }, []);

  return (
    <svg ref={svgRef} viewBox="0 0 100 100" className="w-full h-12" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="drop-shadow-sm"
      />
      <polygon
        points={`0,100 ${points} 100,100`}
        fill={`url(#gradient-${color})`}
      />
    </svg>
  );
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [pendingLeaves, setPendingLeaves] = useState<LeaveRequest[]>([]);
  const [pendingEmployees, setPendingEmployees] = useState<PendingEmployee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'year'>('month');
  
  const welcomeRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, leavesData, employeesData] = await Promise.all([
          employeeAPI.getStats().catch(() => null),
          leaveAPI.getPendingRequests().catch(() => []),
          employeeAPI.getPendingEmployees().catch(() => []),
        ]);
        setStats(statsData);
        setPendingLeaves(Array.isArray(leavesData) ? leavesData.slice(0, 5) : []);
        setPendingEmployees(Array.isArray(employeesData) ? employeesData : []);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Welcome section animation
  useEffect(() => {
    if (!isLoading && welcomeRef.current) {
      animate(welcomeRef.current.children, {
        opacity: [0, 1],
        translateY: [30, 0],
        delay: stagger(100),
        duration: 800,
        easing: 'easeOutExpo'
      });
    }
  }, [isLoading]);

  // Cards stagger animation
  useEffect(() => {
    if (!isLoading && cardsContainerRef.current) {
      animate(cardsContainerRef.current.querySelectorAll('.stat-card'), {
        opacity: [0, 1],
        translateY: [40, 0],
        scale: [0.95, 1],
        delay: stagger(80, { start: 200 }),
        duration: 600,
        easing: 'easeOutExpo'
      });
    }
  }, [isLoading]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good Morning', emoji: '☀️' };
    if (hour < 18) return { text: 'Good Afternoon', emoji: '🌤️' };
    return { text: 'Good Evening', emoji: '🌙' };
  };

  const greeting = getGreeting();

  const handleApproveLeave = async (requestId: string) => {
    try {
      await leaveAPI.approveRequest(requestId);
      setPendingLeaves(prev => prev.filter(l => l.id !== requestId));
    } catch (error) {
      console.error('Failed to approve leave:', error);
    }
  };

  const handleRejectLeave = async (requestId: string) => {
    try {
      await leaveAPI.rejectRequest(requestId);
      setPendingLeaves(prev => prev.filter(l => l.id !== requestId));
    } catch (error) {
      console.error('Failed to reject leave:', error);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-violet-600 mx-auto mb-4 flex items-center justify-center"
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  const statCards = [
    {
      title: 'Total Employees',
      value: stats?.total_employees || 0,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      iconColor: 'text-blue-500',
      trend: '+12%',
      trendUp: true,
      sparkData: [30, 40, 35, 50, 49, 60, 70, 91, 80],
      sparkColor: '#3b82f6'
    },
    {
      title: 'New Hires',
      value: stats?.new_hires_this_month || 0,
      icon: UserPlus,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-500/10',
      iconColor: 'text-emerald-500',
      trend: '+8%',
      trendUp: true,
      subtitle: 'This month',
      sparkData: [20, 25, 30, 28, 35, 40, 45, 50, 48],
      sparkColor: '#10b981'
    },
    {
      title: 'Pending Leaves',
      value: stats?.pending_leaves || pendingLeaves.length,
      icon: Calendar,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-500/10',
      iconColor: 'text-amber-500',
      link: '/admin/leaves',
      sparkData: [10, 15, 12, 18, 14, 20, 16, 22, 18],
      sparkColor: '#f59e0b'
    },
    {
      title: 'Attendance Rate',
      value: stats?.attendance_rate || 95,
      suffix: '%',
      icon: Clock,
      color: 'from-violet-500 to-purple-600',
      bgColor: 'bg-violet-500/10',
      iconColor: 'text-violet-500',
      trend: '+2%',
      trendUp: true,
      subtitle: 'Today',
      sparkData: [85, 88, 92, 90, 94, 93, 95, 94, 95],
      sparkColor: '#8b5cf6'
    },
  ];

  const quickActions = [
    { icon: Users, label: 'Employees', href: '/admin/employees', color: 'from-blue-500 to-blue-600', desc: 'Manage team' },
    { icon: Building2, label: 'Departments', href: '/admin/departments', color: 'from-green-500 to-emerald-600', desc: 'Structure' },
    { icon: Calendar, label: 'Leaves', href: '/admin/leaves', color: 'from-amber-500 to-orange-500', desc: 'Approvals' },
    { icon: Clock, label: 'Attendance', href: '/admin/attendance', color: 'from-violet-500 to-purple-600', desc: 'Time tracking' },
    { icon: DollarSign, label: 'Payroll', href: '/admin/payroll', color: 'from-emerald-500 to-teal-600', desc: 'Salaries' },
    { icon: MessageSquare, label: 'AI Chat', href: '/admin/ai-chat', color: 'from-pink-500 to-rose-600', desc: 'Ask anything' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 lg:space-y-8">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-violet-600 p-6 lg:p-8 text-white shadow-xl"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
          
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />

          <div ref={welcomeRef} className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-white/80 text-sm font-medium mb-1"
              >
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </motion.p>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-2xl lg:text-3xl font-bold flex items-center gap-3"
              >
                {greeting.text}, {user?.full_name?.split(' ')[0] || 'Admin'}! 
                <span className="text-3xl">{greeting.emoji}</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-white/70 mt-2"
              >
                Here's what's happening at <span className="font-semibold text-white">{user?.company_name}</span> today
              </motion.p>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3"
            >
              <Link to="/admin/employees">
                <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm shadow-lg">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Team
                </Button>
              </Link>
              <Link to="/admin/ai-chat">
                <Button className="bg-white text-primary hover:bg-white/90 shadow-lg">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Assistant
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div ref={cardsContainerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={index} 
                className="stat-card group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500 bg-card/80 backdrop-blur-sm"
              >
                <CardContent className="p-5 lg:p-6">
                  {/* Gradient accent */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`} />
                  
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-5 h-5 lg:w-6 lg:h-6 ${stat.iconColor}`} />
                    </div>
                    {stat.trend && (
                      <Badge 
                        variant="outline" 
                        className={`text-xs font-semibold ${stat.trendUp ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : 'text-red-600 bg-red-50 border-red-200'}`}
                      >
                        {stat.trendUp ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                        {stat.trend}
                      </Badge>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
                    <p className="text-3xl lg:text-4xl font-bold text-foreground mt-1">
                      <AnimatedNumber value={stat.value} suffix={stat.suffix || ''} />
                    </p>
                    {stat.subtitle && (
                      <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
                    )}
                  </div>
                  
                  {/* Sparkline */}
                  <div className="mt-4 -mx-2">
                    <Sparkline data={stat.sparkData} color={stat.sparkColor} />
                  </div>
                  
                  {stat.link && (
                    <Link 
                      to={stat.link} 
                      className="absolute inset-0 flex items-end justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span className="text-sm text-primary font-medium flex items-center gap-1">
                        View all <ArrowRight className="w-4 h-4" />
                      </span>
                    </Link>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
                <CardDescription>Jump to frequently used sections</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.div
                    key={action.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={action.href}
                      className="flex flex-col items-center gap-3 p-4 rounded-xl bg-secondary/50 hover:bg-secondary border border-transparent hover:border-border transition-all duration-300 group"
                    >
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${action.color} shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-center">
                        <span className="text-sm font-semibold text-foreground block">{action.label}</span>
                        <span className="text-xs text-muted-foreground">{action.desc}</span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Leave Requests */}
          <Card className="lg:col-span-2 border-0 shadow-lg bg-card/80 backdrop-blur-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b bg-secondary/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Calendar className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <CardTitle className="text-lg">Pending Leave Requests</CardTitle>
                  <CardDescription>Requires your approval</CardDescription>
                </div>
              </div>
              <Link to="/admin/leaves">
                <Button variant="ghost" size="sm" className="text-primary">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px]">
                {pendingLeaves.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                      <CheckCircle className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">All caught up!</h3>
                    <p className="text-muted-foreground text-sm">No pending leave requests at the moment</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {pendingLeaves.map((leave, index) => (
                      <motion.div
                        key={leave.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors group"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar className="h-11 w-11 ring-2 ring-primary/10">
                            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-violet-500/20 text-primary font-semibold">
                              {leave.employee_name?.charAt(0) || 'E'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-foreground">{leave.employee_name || 'Employee'}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{leave.start_date} → {leave.end_date}</span>
                            </div>
                            {leave.reason && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{leave.reason}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            onClick={() => handleApproveLeave(leave.id)}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRejectLeave(leave.id)}
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Pending Employee Approvals */}
            <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm overflow-hidden">
              <CardHeader className="pb-3 border-b bg-secondary/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-500/10">
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <CardTitle className="text-base">New Registrations</CardTitle>
                    <CardDescription className="text-xs">Pending approvals</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {pendingEmployees.length === 0 ? (
                  <div className="py-8 text-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="w-6 h-6 text-emerald-500" />
                    </div>
                    <p className="text-sm text-muted-foreground">No pending registrations</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {pendingEmployees.slice(0, 4).map((employee, index) => (
                      <motion.div
                        key={employee.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 hover:bg-secondary/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-orange-100 text-orange-600 text-sm font-semibold">
                              {employee.full_name?.charAt(0) || employee.email?.charAt(0) || '?'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{employee.full_name || 'New User'}</p>
                            <p className="text-xs text-muted-foreground truncate">{employee.email}</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="shrink-0 text-xs h-8">
                          Review
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Department Distribution */}
            <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm overflow-hidden">
              <CardHeader className="pb-3 border-b bg-secondary/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Building2 className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Departments</CardTitle>
                    <CardDescription className="text-xs">Team distribution</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                {(!stats?.departments || stats.departments.length === 0) ? (
                  <div className="py-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                      <Building2 className="w-6 h-6 text-blue-500" />
                    </div>
                    <p className="text-sm text-muted-foreground">No departments yet</p>
                    <Link to="/admin/departments">
                      <Button variant="outline" size="sm" className="mt-3">
                        Create Department
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {stats?.departments?.slice(0, 5).map((dept, index) => {
                      const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500', 'bg-rose-500'];
                      return (
                        <motion.div 
                          key={dept.name}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="space-y-2"
                        >
                          <div className="flex justify-between text-sm">
                            <span className="font-medium text-foreground">{dept.name}</span>
                            <span className="text-muted-foreground">{dept.count} members</span>
                          </div>
                          <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(dept.count / (stats?.total_employees || 1)) * 100}%` }}
                              transition={{ duration: 1, delay: index * 0.1, ease: 'easeOut' }}
                              className={`h-full ${colors[index % colors.length]} rounded-full`}
                            />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Assistant Card */}
            <Card className="border-0 shadow-lg overflow-hidden bg-gradient-to-br from-violet-500 to-purple-600 text-white">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">AI HR Assistant</h3>
                    <p className="text-white/80 text-sm mb-4">
                      Get instant answers about policies, procedures & more
                    </p>
                    <Link to="/admin/ai-chat">
                      <Button variant="secondary" size="sm" className="bg-white text-violet-600 hover:bg-white/90">
                        Start Chat <ArrowUpRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
