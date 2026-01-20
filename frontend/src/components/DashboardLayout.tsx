import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { LogOut, Settings, User as UserIcon, Lock, Mail } from 'lucide-react';
import { authAPI } from '@/lib/api';
import { toast } from 'sonner';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [changingPassword, setChangingPassword] = useState(false);

  const handleChangePassword = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('Passwords do not match');
      return;
    }

    setChangingPassword(true);
    try {
      const response = await authAPI.changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      });
      
      const message = response.data?.message || 'Password changed successfully';
      toast.success(message);
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
      setShowProfile(false);
      
      // If requires reauth, logout user
      if (response.data?.requires_reauth) {
        setTimeout(() => {
          logout();
        }, 2000);
      }
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Failed to change password';
      toast.error(message);
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shadow-sm">
                <span className="text-primary-foreground font-bold text-lg font-display">L</span>
              </div>
              <span className="text-lg font-display font-bold text-foreground">LuminaHR</span>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium">{user?.email}</p>
                <p className="text-xs text-muted-foreground">{user?.role} • {user?.company_name}</p>
              </div>
              
              <Dialog open={showProfile} onOpenChange={setShowProfile}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Settings className="w-5 h-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Profile Settings</DialogTitle>
                    <DialogDescription>Manage your account settings</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    {/* User Info */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Account Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Email</p>
                            <p className="text-sm text-muted-foreground">{user?.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <UserIcon className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Role</p>
                            <p className="text-sm text-muted-foreground">{user?.role}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Change Password */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Change Password</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="current_password">Current Password</Label>
                          <Input
                            id="current_password"
                            type="password"
                            value={passwordData.current_password}
                            onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new_password">New Password</Label>
                          <Input
                            id="new_password"
                            type="password"
                            value={passwordData.new_password}
                            onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm_password">Confirm New Password</Label>
                          <Input
                            id="confirm_password"
                            type="password"
                            value={passwordData.confirm_password}
                            onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                          />
                        </div>
                        <Button
                          onClick={handleChangePassword}
                          disabled={changingPassword}
                          className="w-full"
                        >
                          <Lock className="w-4 h-4 mr-2" />
                          {changingPassword ? 'Changing...' : 'Change Password'}
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </DialogContent>
              </Dialog>

              <Button variant="ghost" size="icon" onClick={logout} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
