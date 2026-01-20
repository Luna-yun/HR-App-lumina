import React from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, DollarSign, FileText, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function EmployeeDashboard() {
  const { user } = useAuth();

  // Pending Approval State
  if (!user?.is_approved) {
    return (
      <DashboardLayout>
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="max-w-2xl w-full relative"
          >
            {/* Subtle blurred preview in background */}
            <div className="absolute inset-0 opacity-10 blur-2xl pointer-events-none">
              <div className="grid grid-cols-2 gap-4 p-6">
                <div className="h-32 bg-slate-300 dark:bg-slate-700 rounded-lg" />
                <div className="h-32 bg-slate-300 dark:bg-slate-700 rounded-lg" />
                <div className="h-48 col-span-2 bg-slate-300 dark:bg-slate-700 rounded-lg" />
              </div>
            </div>

            {/* Main message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="relative bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-8 sm:p-12 text-center"
            >
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.3, duration: 0.6 }}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-2 border-amber-500/20 flex items-center justify-center mx-auto mb-6"
              >
                <Clock className="w-10 h-10 sm:w-12 sm:h-12 text-amber-600 dark:text-amber-400" />
              </motion.div>

              {/* Heading */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="text-2xl sm:text-3xl font-bold mb-3 text-slate-900 dark:text-white"
              >
                Account Under Review
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mb-6 leading-relaxed"
              >
                Your account is being reviewed by your organization's administrator.
                You'll receive an email notification once your access has been approved.
              </motion.p>

              {/* Info cards */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="grid sm:grid-cols-2 gap-4 mt-8"
              >
                <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 text-left">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-slate-900 dark:text-white mb-1">Email Verified</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Your email has been confirmed</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 text-left">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-slate-900 dark:text-white mb-1">Processing Time</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Usually 1-2 business days</p>
                  </div>
                </div>
              </motion.div>

              {/* Footer note */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.4 }}
                className="mt-6 text-sm text-slate-500 dark:text-slate-400"
              >
                Need help? Contact your organization administrator.
              </motion.p>
            </motion.div>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  // Approved Dashboard
  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
          <p className="text-muted-foreground">Here's your overview for today</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Attendance</CardTitle>
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">96%</div>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Leave Balance</CardTitle>
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12 days</div>
              <p className="text-xs text-muted-foreground mt-1">Available this year</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Worked Hours</CardTitle>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">168</div>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Salary</CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$4,200</div>
              <p className="text-xs text-muted-foreground mt-1">Current month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent actions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: 'Attendance marked', time: 'Today, 9:00 AM', status: 'success' },
                  { action: 'Leave request approved', time: 'Yesterday', status: 'success' },
                  { action: 'Payslip generated', time: '2 days ago', status: 'info' },
                  { action: 'Profile updated', time: '3 days ago', status: 'info' },
                ].map((activity, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className={`w-2 h-2 rounded-full ${activity.status === 'success' ? 'bg-green-600' : 'bg-blue-600'}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notices */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Company Notices</CardTitle>
              <CardDescription>Important announcements and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: 'Holiday Notice', content: 'Office will be closed on Jan 25', time: '1 day ago' },
                  { title: 'Policy Update', content: 'New remote work policy effective', time: '3 days ago' },
                  { title: 'Team Meeting', content: 'Quarterly review next Monday', time: '1 week ago' },
                ].map((notice, i) => (
                  <div key={i} className="p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-sm font-medium">{notice.title}</p>
                      <Badge variant="secondary" className="text-xs">{notice.time}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{notice.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Overview */}
          <Card className="border-border/50 shadow-sm lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Performance Overview
              </CardTitle>
              <CardDescription>Your performance metrics for this quarter</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
                  <p className="text-sm text-muted-foreground">Task Completion</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <div className="text-3xl font-bold text-blue-600 mb-2">A+</div>
                  <p className="text-sm text-muted-foreground">Quality Rating</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <div className="text-3xl font-bold text-orange-600 mb-2">98%</div>
                  <p className="text-sm text-muted-foreground">Attendance Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
