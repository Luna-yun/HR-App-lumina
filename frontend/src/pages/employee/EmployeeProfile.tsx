import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { authAPI, notificationAPI, attendanceAPI, leaveAPI } from '@/services/api';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  User, Mail, Building, Briefcase, Phone, Lock, Save, Edit2, Check, X,
  Bell, Shield, Globe, Camera, Calendar, Clock, Award, TrendingUp,
  AlertCircle, CheckCircle2, Eye, EyeOff, Star, Target
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export default function EmployeeProfile() {
  const { user, updateUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || ''
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [stats, setStats] = useState({
    leaveBalance: 15,
    leaveTaken: 5,
    attendanceRate: 96,
    performanceScore: 85
  });
  const { toast } = useToast();

  // Fetch notifications
  useEffect(() => {
    const fetchData = async () => {
      try {
        const notifData = await notificationAPI.getNotifications(10, 0, false);
        setNotifications(notifData.notifications);
        setUnreadCount(notifData.unread_count);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updated = await authAPI.updateProfile(formData);
      updateUser(updated);
      setIsEditing(false);
      toast({ title: 'Profile Updated', description: 'Your changes have been saved.' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update profile', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast({ title: 'Password Mismatch', description: 'New passwords do not match', variant: 'destructive' });
      return;
    }
    try {
      await authAPI.changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      });
      toast({ title: 'Password Changed', description: 'Please log in again.' });
      logout();
    } catch (error: any) {
      toast({ title: 'Error', description: error.response?.data?.detail || 'Failed to change password', variant: 'destructive' });
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case 'leave': return <Calendar className="w-5 h-5 text-blue-500" />;
      default: return <Bell className="w-5 h-5 text-primary" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 p-6 lg:p-8 text-white shadow-xl"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
          
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              <Avatar className="w-24 h-24 lg:w-28 lg:h-28 ring-4 ring-white/30 shadow-2xl">
                <AvatarFallback className="text-3xl lg:text-4xl bg-white/20 text-white font-bold">
                  {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'E'}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white text-emerald-600 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl lg:text-3xl font-bold">{user?.full_name || 'Employee'}</h1>
              <p className="text-white/70 flex items-center justify-center sm:justify-start gap-2 mt-1">
                <Briefcase className="w-4 h-4" />
                {user?.job_title || 'Team Member'} • {user?.department || 'General'}
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3">
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  <Building className="w-3 h-3 mr-1" />
                  {user?.company_name}
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  <Globe className="w-3 h-3 mr-1" />
                  {user?.country}
                </Badge>
              </div>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/20">
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.leaveBalance}</p>
              <p className="text-white/70 text-sm">Leave Balance</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.attendanceRate}%</p>
              <p className="text-white/70 text-sm">Attendance</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.performanceScore}</p>
              <p className="text-white/70 text-sm">Performance</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold flex items-center justify-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                4.8
              </p>
              <p className="text-white/70 text-sm">Rating</p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="profile" className="gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2 relative">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Notifications</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Lock className="w-4 h-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Profile Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:col-span-2"
              >
                <Card className="border-0 shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        Personal Information
                      </CardTitle>
                      <CardDescription>Your profile details</CardDescription>
                    </div>
                    {!isEditing ? (
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSave} disabled={isSaving}>
                          <Check className="w-4 h-4 mr-2" />
                          {isSaving ? 'Saving...' : 'Save'}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">Email</Label>
                        <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                          <Mail className="w-5 h-5 text-muted-foreground" />
                          <span className="font-medium">{user?.email}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">Company</Label>
                        <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                          <Building className="w-5 h-5 text-muted-foreground" />
                          <span className="font-medium">{user?.company_name}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input
                          value={formData.full_name}
                          onChange={(e) => setFormData(p => ({ ...p, full_name: e.target.value }))}
                          disabled={!isEditing}
                          className={!isEditing ? 'bg-secondary/50' : ''}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone Number</Label>
                        <Input
                          value={formData.phone}
                          onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                          disabled={!isEditing}
                          placeholder="+65 1234 5678"
                          className={!isEditing ? 'bg-secondary/50' : ''}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">Job Title</Label>
                        <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                          <Briefcase className="w-5 h-5 text-muted-foreground" />
                          <span className="font-medium">{user?.job_title || 'Not set'}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">Department</Label>
                        <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                          <Building className="w-5 h-5 text-muted-foreground" />
                          <span className="font-medium">{user?.department || 'Not set'}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Side Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-6"
              >
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      My Goals
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Attendance Goal</span>
                        <span className="font-medium">{stats.attendanceRate}%</span>
                      </div>
                      <Progress value={stats.attendanceRate} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Performance Score</span>
                        <span className="font-medium">{stats.performanceScore}/100</span>
                      </div>
                      <Progress value={stats.performanceScore} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                        <Award className="w-6 h-6 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-semibold">Top Performer</p>
                        <p className="text-sm text-muted-foreground">December 2025</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Bell className="w-12 h-12 text-muted-foreground mb-4" />
                      <p className="font-medium">No notifications</p>
                      <p className="text-sm text-muted-foreground">You're all caught up!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`flex items-start gap-4 p-4 rounded-xl ${
                            notification.is_read ? 'bg-secondary/30' : 'bg-primary/5 border border-primary/10'
                          }`}
                        >
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <h4 className="font-medium">{notification.title}</h4>
                              {!notification.is_read && (
                                <button
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  className="text-xs text-primary hover:underline"
                                >
                                  Mark read
                                </button>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {new Date(notification.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-primary" />
                  Change Password
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 max-w-md">
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordData.current_password}
                      onChange={(e) => setPasswordData(p => ({ ...p, current_password: e.target.value }))}
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordData.new_password}
                    onChange={(e) => setPasswordData(p => ({ ...p, new_password: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Confirm New Password</Label>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordData.confirm_password}
                    onChange={(e) => setPasswordData(p => ({ ...p, confirm_password: e.target.value }))}
                  />
                </div>
                <Button onClick={handleChangePassword}>
                  <Lock className="w-4 h-4 mr-2" />
                  Update Password
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
