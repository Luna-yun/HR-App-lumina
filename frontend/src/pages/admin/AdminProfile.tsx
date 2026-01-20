import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { authAPI, notificationAPI } from '@/services/api';
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
import {
  User, Mail, Building, Briefcase, Phone, Lock, Save, Edit2, Check, X,
  Bell, Shield, Globe, Palette, Camera, MapPin, Calendar, Award, 
  ChevronRight, AlertCircle, CheckCircle2, Clock, Trash2, Eye, EyeOff
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
  link?: string;
}

export default function AdminProfile() {
  const { user, updateUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    department: user?.department || '',
    job_title: user?.job_title || '',
    phone: user?.phone || ''
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationSettings, setNotificationSettings] = useState({
    email_notifications: true,
    push_notifications: true,
    leave_updates: true,
    attendance_alerts: true,
    payroll_notifications: true,
    system_updates: false
  });
  const { toast } = useToast();

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await notificationAPI.getNotifications(20, 0, false);
        setNotifications(data.notifications);
        setUnreadCount(data.unread_count);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };
    fetchNotifications();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updated = await authAPI.updateProfile(formData);
      updateUser(updated);
      setIsEditing(false);
      toast({ title: 'Profile Updated', description: 'Your changes have been saved successfully.' });
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
    if (passwordData.new_password.length < 8) {
      toast({ title: 'Weak Password', description: 'Password must be at least 8 characters', variant: 'destructive' });
      return;
    }
    try {
      await authAPI.changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      });
      toast({ title: 'Password Changed', description: 'Please log in again with your new password.' });
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

  const handleMarkAllRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
      toast({ title: 'Done', description: 'All notifications marked as read' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update notifications', variant: 'destructive' });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'leave': return <Calendar className="w-5 h-5 text-blue-500" />;
      case 'attendance': return <Clock className="w-5 h-5 text-violet-500" />;
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
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-violet-600 p-6 lg:p-8 text-white shadow-xl"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
          
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              <Avatar className="w-24 h-24 lg:w-28 lg:h-28 ring-4 ring-white/30 shadow-2xl">
                <AvatarFallback className="text-3xl lg:text-4xl bg-white/20 text-white font-bold">
                  {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'A'}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white text-primary flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl lg:text-3xl font-bold">{user?.full_name || 'Admin User'}</h1>
              <p className="text-white/70 flex items-center justify-center sm:justify-start gap-2 mt-1">
                <Briefcase className="w-4 h-4" />
                {user?.job_title || user?.role || 'Administrator'}
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
                <Badge variant="secondary" className="bg-emerald-500/80 text-white border-0">
                  <Shield className="w-3 h-3 mr-1" />
                  {user?.role}
                </Badge>
              </div>
            </div>
            
            <div className="hidden lg:block text-right">
              <p className="text-white/60 text-sm">Member since</p>
              <p className="font-semibold">January 2024</p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
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
            <TabsTrigger value="preferences" className="gap-2">
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">Preferences</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" />
                      Personal Information
                    </CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
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
                      <Label className="text-muted-foreground">Email Address</Label>
                      <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                        <Mail className="w-5 h-5 text-muted-foreground" />
                        <span className="font-medium">{user?.email}</span>
                        <Badge variant="outline" className="ml-auto text-xs">Verified</Badge>
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
                      <Label>Job Title</Label>
                      <Input
                        value={formData.job_title}
                        onChange={(e) => setFormData(p => ({ ...p, job_title: e.target.value }))}
                        disabled={!isEditing}
                        placeholder="e.g. HR Manager"
                        className={!isEditing ? 'bg-secondary/50' : ''}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Department</Label>
                      <Input
                        value={formData.department}
                        onChange={(e) => setFormData(p => ({ ...p, department: e.target.value }))}
                        disabled={!isEditing}
                        placeholder="e.g. Human Resources"
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
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-primary" />
                      Notifications
                      {unreadCount > 0 && (
                        <Badge variant="default" className="ml-2">{unreadCount} unread</Badge>
                      )}
                    </CardTitle>
                    <CardDescription>Stay updated with important alerts</CardDescription>
                  </div>
                  {unreadCount > 0 && (
                    <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
                      <Check className="w-4 h-4 mr-2" />
                      Mark all read
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    {notifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                          <Bell className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="font-semibold mb-1">No notifications</h3>
                        <p className="text-muted-foreground text-sm">You're all caught up!</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {notifications.map((notification) => (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`flex items-start gap-4 p-4 rounded-xl transition-colors ${
                              notification.is_read ? 'bg-secondary/30' : 'bg-primary/5 border border-primary/10'
                            }`}
                          >
                            <div className="shrink-0 mt-0.5">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className={`font-medium ${!notification.is_read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                  {notification.title}
                                </h4>
                                {!notification.is_read && (
                                  <button
                                    onClick={() => handleMarkAsRead(notification.id)}
                                    className="shrink-0 text-xs text-primary hover:underline"
                                  >
                                    Mark read
                                  </button>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                              <p className="text-xs text-muted-foreground mt-2">
                                {new Date(notification.created_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Notification Settings */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Notification Preferences</CardTitle>
                  <CardDescription>Control what notifications you receive</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(notificationSettings).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium capitalize">{key.replace(/_/g, ' ')}</p>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications about {key.replace(/_/g, ' ').toLowerCase()}
                        </p>
                      </div>
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) => 
                          setNotificationSettings(prev => ({ ...prev, [key]: checked }))
                        }
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-primary" />
                    Change Password
                  </CardTitle>
                  <CardDescription>Update your password to keep your account secure</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4 max-w-md">
                    <div className="space-y-2">
                      <Label>Current Password</Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          value={passwordData.current_password}
                          onChange={(e) => setPasswordData(p => ({ ...p, current_password: e.target.value }))}
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
                        placeholder="Enter new password"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Confirm New Password</Label>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={passwordData.confirm_password}
                        onChange={(e) => setPasswordData(p => ({ ...p, confirm_password: e.target.value }))}
                        placeholder="Confirm new password"
                      />
                    </div>
                    <Button onClick={handleChangePassword} className="w-full sm:w-auto">
                      <Lock className="w-4 h-4 mr-2" />
                      Update Password
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Account Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5 text-primary" />
                    Display Preferences
                  </CardTitle>
                  <CardDescription>Customize your dashboard experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium">Compact Mode</p>
                      <p className="text-sm text-muted-foreground">Use smaller UI elements</p>
                    </div>
                    <Switch />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium">Show Quick Actions</p>
                      <p className="text-sm text-muted-foreground">Display quick action buttons on dashboard</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium">Animations</p>
                      <p className="text-sm text-muted-foreground">Enable smooth animations and transitions</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
