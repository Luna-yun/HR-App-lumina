import React, { useState, useEffect } from 'react';
import { attendanceAPI } from '@/services/api';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Clock, CheckCircle, XCircle, Users, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import type { AttendanceRecord, AttendanceStats } from '@/types';

export default function AdminAttendance() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [dateFilter, setDateFilter] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => { fetchData(); }, [dateFilter]);

  const fetchData = async () => {
    try {
      const [attendanceData, statsData] = await Promise.all([
        attendanceAPI.getCompanyAttendance(dateFilter),
        attendanceAPI.getAttendanceStats(),
      ]);
      setAttendance(attendanceData.records);
      setStats(statsData);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch data', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge className="bg-green-500">Completed</Badge>;
      case 'checked_in': return <Badge className="bg-blue-500">Working</Badge>;
      default: return <Badge variant="secondary">Not Checked In</Badge>;
    }
  };

  if (isLoading) {
    return <DashboardLayout><div className="flex items-center justify-center h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" /></div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Attendance</h1>
            <p className="text-muted-foreground">Monitor employee attendance</p>
          </div>
          <Input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="w-40" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[{ label: 'Total Employees', value: stats?.total_employees || 0, icon: Users, color: 'text-blue-500' },
            { label: 'Checked In', value: stats?.checked_in || 0, icon: CheckCircle, color: 'text-green-500' },
            { label: 'Not Checked In', value: stats?.not_checked_in || 0, icon: XCircle, color: 'text-red-500' },
            { label: 'Attendance Rate', value: `${stats?.attendance_rate || 0}%`, icon: Clock, color: 'text-purple-500' }].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <Card key={i}><CardContent className="p-4 flex items-center gap-4"><div className={`p-3 rounded-xl bg-secondary`}><Icon className={`w-5 h-5 ${stat.color}`} /></div><div><p className="text-2xl font-bold">{stat.value}</p><p className="text-sm text-muted-foreground">{stat.label}</p></div></CardContent></Card>
              );
            })}
        </div>

        <Card>
          <CardHeader><CardTitle>Attendance Records - {format(new Date(dateFilter), 'MMM d, yyyy')}</CardTitle></CardHeader>
          <CardContent>
            {attendance.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground"><Clock className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>No attendance records for this date</p></div>
            ) : (
              <div className="space-y-3">
                {attendance.map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Avatar><AvatarFallback>{record.employee_name?.charAt(0)}</AvatarFallback></Avatar>
                      <div>
                        <p className="font-medium">{record.employee_name}</p>
                        <p className="text-sm text-muted-foreground">{record.employee_email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm">In: {record.check_in_time ? format(new Date(record.check_in_time), 'HH:mm') : '--:--'}</p>
                        <p className="text-sm">Out: {record.check_out_time ? format(new Date(record.check_out_time), 'HH:mm') : '--:--'}</p>
                      </div>
                      {getStatusBadge(record.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
