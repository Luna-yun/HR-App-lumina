import React, { useState, useEffect } from 'react';
import { leaveAPI } from '@/services/api';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import type { LeaveRequest } from '@/types';

export default function AdminLeaves() {
  const [pendingLeaves, setPendingLeaves] = useState<LeaveRequest[]>([]);
  const [allLeaves, setAllLeaves] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => { fetchLeaves(); }, []);

  const fetchLeaves = async () => {
    try {
      const [pending, all] = await Promise.all([
        leaveAPI.getPendingRequests(),
        leaveAPI.getAllRequests(),
      ]);
      setPendingLeaves(pending);
      setAllLeaves(all);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch leaves', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await leaveAPI.approveRequest(id);
      toast({ title: 'Success', description: 'Leave approved' });
      fetchLeaves();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to approve', variant: 'destructive' });
    }
  };

  const handleReject = async (id: string) => {
    try {
      await leaveAPI.rejectRequest(id, 'Request rejected by admin');
      toast({ title: 'Success', description: 'Leave rejected' });
      fetchLeaves();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to reject', variant: 'destructive' });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <Badge className="bg-green-500">Approved</Badge>;
      case 'rejected': return <Badge variant="destructive">Rejected</Badge>;
      default: return <Badge variant="secondary">Pending</Badge>;
    }
  };

  if (isLoading) {
    return <DashboardLayout><div className="flex items-center justify-center h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" /></div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Leave Requests</h1>
          <p className="text-muted-foreground">Manage employee leave requests</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[{ label: 'Pending', value: pendingLeaves.length, icon: Clock, color: 'text-orange-500' },
            { label: 'Approved', value: allLeaves.filter(l => l.status === 'approved').length, icon: CheckCircle, color: 'text-green-500' },
            { label: 'Rejected', value: allLeaves.filter(l => l.status === 'rejected').length, icon: XCircle, color: 'text-red-500' },
            { label: 'Total', value: allLeaves.length, icon: Calendar, color: 'text-blue-500' }].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <Card key={i}><CardContent className="p-4 flex items-center gap-4"><div className={`p-3 rounded-xl bg-secondary`}><Icon className={`w-5 h-5 ${stat.color}`} /></div><div><p className="text-2xl font-bold">{stat.value}</p><p className="text-sm text-muted-foreground">{stat.label}</p></div></CardContent></Card>
              );
            })}
        </div>

        <Tabs defaultValue="pending">
          <TabsList><TabsTrigger value="pending">Pending ({pendingLeaves.length})</TabsTrigger><TabsTrigger value="all">All Requests</TabsTrigger></TabsList>
          <TabsContent value="pending">
            <Card>
              <CardContent className="p-4">
                {pendingLeaves.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground"><AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>No pending requests</p></div>
                ) : (
                  <div className="space-y-3">
                    {pendingLeaves.map((leave) => (
                      <div key={leave.id} className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Avatar><AvatarFallback>{leave.employee_name?.charAt(0)}</AvatarFallback></Avatar>
                          <div>
                            <p className="font-medium">{leave.employee_name}</p>
                            <p className="text-sm text-muted-foreground">{leave.start_date} to {leave.end_date}</p>
                            <p className="text-sm text-muted-foreground mt-1">{leave.reason}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleApprove(leave.id)}><CheckCircle className="w-4 h-4 mr-1" />Approve</Button>
                          <Button size="sm" variant="destructive" onClick={() => handleReject(leave.id)}><XCircle className="w-4 h-4 mr-1" />Reject</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="all">
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {allLeaves.map((leave) => (
                    <div key={leave.id} className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Avatar><AvatarFallback>{leave.employee_name?.charAt(0)}</AvatarFallback></Avatar>
                        <div>
                          <p className="font-medium">{leave.employee_name}</p>
                          <p className="text-sm text-muted-foreground">{leave.start_date} to {leave.end_date}</p>
                        </div>
                      </div>
                      {getStatusBadge(leave.status)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
