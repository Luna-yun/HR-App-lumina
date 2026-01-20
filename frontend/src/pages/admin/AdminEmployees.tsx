import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { employeeAPI, departmentAPI } from '@/services/api';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Search, Plus, Edit, Trash2, CheckCircle, XCircle, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Employee, Department, PendingEmployee } from '@/types';

export default function AdminEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [pendingEmployees, setPendingEmployees] = useState<PendingEmployee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [empData, pendingData, deptData] = await Promise.all([
        employeeAPI.getEmployees(),
        employeeAPI.getPendingEmployees(),
        departmentAPI.getDepartments(),
      ]);
      setEmployees(empData);
      setPendingEmployees(pendingData);
      setDepartments(deptData);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch data', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await employeeAPI.approveEmployee(id);
      toast({ title: 'Success', description: 'Employee approved' });
      fetchData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to approve', variant: 'destructive' });
    }
  };

  const handleReject = async (id: string) => {
    try {
      await employeeAPI.rejectEmployee(id);
      toast({ title: 'Success', description: 'Employee rejected' });
      fetchData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to reject', variant: 'destructive' });
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.department?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <DashboardLayout><div className="flex items-center justify-center h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" /></div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Employees</h1>
            <p className="text-muted-foreground">Manage your team members</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search employees..." className="pl-10 w-full sm:w-64" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
        </div>

        {pendingEmployees.length > 0 && (
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><UserPlus className="w-5 h-5 text-orange-500" />Pending Approvals ({pendingEmployees.length})</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingEmployees.map((emp) => (
                  <div key={emp.id} className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Avatar><AvatarFallback>{emp.full_name?.charAt(0) || emp.email.charAt(0)}</AvatarFallback></Avatar>
                      <div>
                        <p className="font-medium">{emp.full_name || emp.email}</p>
                        <p className="text-sm text-muted-foreground">{emp.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleApprove(emp.id)}><CheckCircle className="w-4 h-4 mr-1" />Approve</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleReject(emp.id)}><XCircle className="w-4 h-4 mr-1" />Reject</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Users className="w-5 h-5 text-blue-500" />All Employees ({filteredEmployees.length})</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredEmployees.map((emp) => (
                <div key={emp.id} className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Avatar><AvatarFallback>{emp.full_name?.charAt(0) || emp.email.charAt(0)}</AvatarFallback></Avatar>
                    <div>
                      <p className="font-medium">{emp.full_name || emp.email}</p>
                      <p className="text-sm text-muted-foreground">{emp.email}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline">{emp.department || 'Unassigned'}</Badge>
                        <Badge variant={emp.role === 'Admin' ? 'default' : 'secondary'}>{emp.role}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost"><Edit className="w-4 h-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
