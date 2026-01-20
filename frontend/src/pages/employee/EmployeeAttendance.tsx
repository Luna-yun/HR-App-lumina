import React, { useState, useEffect } from 'react';
import { attendanceAPI } from '@/services/api';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import type { AttendanceRecord } from '@/types';

export default function EmployeeAttendance() {
  const [history, setHistory] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await attendanceAPI.getMyHistory(30);
        setHistory(data);
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to fetch history', variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge className="bg-green-500">Completed</Badge>;
      case 'checked_in': return <Badge className="bg-blue-500">Working</Badge>;
      default: return <Badge variant="secondary">Absent</Badge>;
    }
  };

  if (isLoading) {
    return <DashboardLayout><div className="flex items-center justify-center h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" /></div></DashboardLayout>;
  }

  const completedDays = history.filter(h => h.status === 'completed').length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Attendance History</h1>
          <p className="text-muted-foreground">View your attendance records</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card><CardContent className="p-4 flex items-center gap-4"><div className="p-3 rounded-xl bg-blue-500/10"><Calendar className="w-5 h-5 text-blue-500" /></div><div><p className="text-2xl font-bold">{history.length}</p><p className="text-sm text-muted-foreground">Total Days</p></div></CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-4"><div className="p-3 rounded-xl bg-green-500/10"><CheckCircle className="w-5 h-5 text-green-500" /></div><div><p className="text-2xl font-bold">{completedDays}</p><p className="text-sm text-muted-foreground">Days Worked</p></div></CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-4"><div className="p-3 rounded-xl bg-purple-500/10"><Clock className="w-5 h-5 text-purple-500" /></div><div><p className="text-2xl font-bold">{history.length > 0 ? Math.round(completedDays / history.length * 100) : 0}%</p><p className="text-sm text-muted-foreground">Attendance Rate</p></div></CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Recent Attendance</CardTitle></CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground"><Clock className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>No attendance records yet</p></div>
            ) : (
              <div className="space-y-3">
                {history.map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
                    <div>
                      <p className="font-medium">{format(new Date(record.date), 'EEEE, MMMM d, yyyy')}</p>
                      <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                        <span>In: {record.check_in_time ? format(new Date(record.check_in_time), 'HH:mm') : '--:--'}</span>
                        <span>Out: {record.check_out_time ? format(new Date(record.check_out_time), 'HH:mm') : '--:--'}</span>
                      </div>
                    </div>
                    {getStatusBadge(record.status)}
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
