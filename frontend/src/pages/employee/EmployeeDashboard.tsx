import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { attendanceAPI, leaveAPI, noticeAPI } from '@/services/api';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Clock, Calendar, Bell, LogIn, LogOut,
  CheckCircle, XCircle, AlertCircle, ArrowRight, Sun, Moon, CloudSun, FileText
} from 'lucide-react';
import type { AttendanceStatus, LeaveSummary, Notice } from '@/types';

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus | null>(null);
  const [leaveSummary, setLeaveSummary] = useState<LeaveSummary | null>(null);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  
  const cardsRef = useRef<HTMLDivElement>(null);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statusData, leaveData, noticesData] = await Promise.all([
          attendanceAPI.getMyStatus(),
          leaveAPI.getMySummary(),
          noticeAPI.getNotices(5),
        ]);
        setAttendanceStatus(statusData);
        setLeaveSummary(leaveData);
        setNotices(noticesData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // GSAP animations
  useEffect(() => {
    if (!isLoading && cardsRef.current) {
      const cards = cardsRef.current.querySelectorAll('.dashboard-card');
      gsap.fromTo(cards,
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
        }
      );
    }
  }, [isLoading]);

  // Get greeting based on time
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return { text: 'Good Morning', icon: Sun, color: 'text-yellow-500' };
    if (hour < 18) return { text: 'Good Afternoon', icon: CloudSun, color: 'text-orange-500' };
    return { text: 'Good Evening', icon: Moon, color: 'text-indigo-500' };
  };

  const handleCheckIn = async () => {
    setActionLoading(true);
    try {
      await attendanceAPI.checkIn();
      const newStatus = await attendanceAPI.getMyStatus();
      setAttendanceStatus(newStatus);
    } catch (error) {
      console.error('Check-in failed:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    try {
      await attendanceAPI.checkOut();
      const newStatus = await attendanceAPI.getMyStatus();
      setAttendanceStatus(newStatus);
    } catch (error) {
      console.error('Check-out failed:', error);
    } finally {
      setActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  const getAttendanceStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'checked_in':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getAttendanceStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Day Completed';
      case 'checked_in':
        return 'Working';
      default:
        return 'Not Checked In';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header with Live Clock */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-6 lg:p-8"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <GreetingIcon className={`w-6 h-6 ${greeting.color}`} />
                <span className="text-white/80">{greeting.text}</span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white">
                {user?.full_name || 'Employee'}! 👋
              </h1>
              <p className="text-white/70 mt-1">
                {user?.department !== 'Unassigned' ? `${user?.job_title || 'Employee'} • ${user?.department}` : user?.company_name}
              </p>
            </div>
            
            {/* Live Clock */}
            <div className="text-left lg:text-right">
              <div className="text-4xl lg:text-5xl font-bold text-white font-mono">
                {format(currentTime, 'HH:mm:ss')}
              </div>
              <p className="text-white/70 mt-1">
                {format(currentTime, 'EEEE, MMMM d, yyyy')}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main Cards Grid */}
        <div ref={cardsRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Attendance Widget */}
          <Card className="dashboard-card lg:col-span-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  Attendance
                </CardTitle>
                <Badge
                  variant="outline"
                  className={getAttendanceStatusColor(attendanceStatus?.status || '')}
                >
                  {getAttendanceStatusText(attendanceStatus?.status || '')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Check-in/out times */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-secondary/50 rounded-xl">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <LogIn className="w-4 h-4" />
                      <span className="text-sm">Check In</span>
                    </div>
                    <p className="text-xl font-bold text-foreground">
                      {attendanceStatus?.check_in_time
                        ? format(new Date(attendanceStatus.check_in_time), 'HH:mm')
                        : '--:--'}
                    </p>
                  </div>
                  <div className="p-4 bg-secondary/50 rounded-xl">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Check Out</span>
                    </div>
                    <p className="text-xl font-bold text-foreground">
                      {attendanceStatus?.check_out_time
                        ? format(new Date(attendanceStatus.check_out_time), 'HH:mm')
                        : '--:--'}
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                {attendanceStatus?.can_check_in && (
                  <Button
                    className="w-full h-12"
                    onClick={handleCheckIn}
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    ) : (
                      <>
                        <LogIn className="w-5 h-5 mr-2" />
                        Check In
                      </>
                    )}
                  </Button>
                )}
                {attendanceStatus?.can_check_out && (
                  <Button
                    variant="destructive"
                    className="w-full h-12"
                    onClick={handleCheckOut}
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    ) : (
                      <>
                        <LogOut className="w-5 h-5 mr-2" />
                        Check Out
                      </>
                    )}
                  </Button>
                )}
                {attendanceStatus?.status === 'completed' && (
                  <div className="flex items-center justify-center gap-2 py-3 bg-green-500/10 rounded-xl text-green-500">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Day completed! Great work!</span>
                  </div>
                )}

                <Link to="/employee/attendance">
                  <Button variant="ghost" className="w-full" size="sm">
                    View History <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Leave Summary */}
          <Card className="dashboard-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-orange-500" />
                  Leave Balance
                </CardTitle>
                <Link to="/employee/leave">
                  <Button variant="ghost" size="sm">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-orange-500/10 rounded-xl">
                    <AlertCircle className="w-5 h-5 mx-auto text-orange-500 mb-1" />
                    <p className="text-2xl font-bold text-foreground">{leaveSummary?.pending || 0}</p>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                  <div className="text-center p-3 bg-green-500/10 rounded-xl">
                    <CheckCircle className="w-5 h-5 mx-auto text-green-500 mb-1" />
                    <p className="text-2xl font-bold text-foreground">{leaveSummary?.approved || 0}</p>
                    <p className="text-xs text-muted-foreground">Approved</p>
                  </div>
                  <div className="text-center p-3 bg-red-500/10 rounded-xl">
                    <XCircle className="w-5 h-5 mx-auto text-red-500 mb-1" />
                    <p className="text-2xl font-bold text-foreground">{leaveSummary?.rejected || 0}</p>
                    <p className="text-xs text-muted-foreground">Rejected</p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Leave Usage</span>
                    <span className="font-medium">{leaveSummary?.total || 0} requests</span>
                  </div>
                  <Progress value={(leaveSummary?.approved || 0) / 20 * 100} className="h-2" />
                </div>

                <Link to="/employee/leave">
                  <Button className="w-full">
                    <Calendar className="w-4 h-4 mr-2" />
                    Request Leave
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Quick Notices Preview */}
          <Card className="dashboard-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="w-5 h-5 text-rose-500" />
                  Latest Notices
                </CardTitle>
                <Link to="/employee/notices">
                  <Button variant="ghost" size="sm">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {notices.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground">No notices yet</p>
                  <p className="text-sm text-muted-foreground/70 mt-1">
                    Company announcements will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notices.slice(0, 3).map((notice, index) => (
                    <div
                      key={notice.id}
                      className="p-3 bg-secondary/50 rounded-xl hover:bg-secondary transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-rose-500/10 shrink-0">
                          <FileText className="w-4 h-4 text-rose-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground text-sm truncate">{notice.title}</h4>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {format(new Date(notice.created_at), 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Link to="/employee/notices">
                    <Button variant="outline" className="w-full mt-2" size="sm">
                      View All Notices
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Notices Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="w-5 h-5 text-red-500" />
                Company Notices
              </CardTitle>
              <Link to="/employee/notices">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {notices.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No notices at the moment</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notices.map((notice, index) => {
                  // Strip HTML for preview
                  const plainContent = notice.content.replace(/<[^>]*>/g, '').substring(0, 150);
                  return (
                    <motion.div
                      key={notice.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-secondary/50 rounded-xl"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-foreground truncate">{notice.title}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {plainContent}{plainContent.length >= 150 ? '...' : ''}
                          </p>
                        </div>
                        <Badge variant="outline" className="shrink-0">
                          {format(new Date(notice.created_at), 'MMM d')}
                        </Badge>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
