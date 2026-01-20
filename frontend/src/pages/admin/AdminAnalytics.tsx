import React from 'react';
import { employeeAPI } from '@/services/api';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users, Calendar, Clock, TrendingUp, DollarSign } from 'lucide-react';

export default function AdminAnalytics() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">Company insights and reports</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[{ title: 'Employee Analytics', description: 'Track employee growth and turnover', icon: Users, color: 'text-blue-500' },
            { title: 'Attendance Reports', description: 'Monitor attendance patterns', icon: Clock, color: 'text-green-500' },
            { title: 'Leave Statistics', description: 'Analyze leave trends', icon: Calendar, color: 'text-orange-500' },
            { title: 'Payroll Overview', description: 'Financial summaries and trends', icon: DollarSign, color: 'text-purple-500' },
            { title: 'Department Metrics', description: 'Performance by department', icon: BarChart3, color: 'text-teal-500' },
            { title: 'Growth Trends', description: 'Company growth analytics', icon: TrendingUp, color: 'text-pink-500' }].map((item, i) => {
              const Icon = item.icon;
              return (
                <Card key={i} className="hover:shadow-lg transition-all cursor-pointer">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4`}>
                      <Icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                  </CardContent>
                </Card>
              );
            })}
        </div>

        <Card>
          <CardContent className="py-20 text-center text-muted-foreground">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <h3 className="text-lg font-semibold text-foreground">Analytics Dashboard</h3>
            <p className="mt-2">Detailed analytics and reports will be available here.</p>
            <p className="text-sm">Track employee metrics, attendance patterns, and more.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
