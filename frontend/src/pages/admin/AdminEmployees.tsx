import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { employeeAPI, departmentAPI, employeeManagementAPI } from '@/services/api';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Search, UserX, Building2, Upload, CheckCircle, XCircle, Clock, FileSpreadsheet, UserCheck, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Employee, Department } from '@/types';

export default function AdminEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [terminationReasons, setTerminationReasons] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDept, setFilterDept] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Dialog states
  const [terminateDialog, setTerminateDialog] = useState<{ open: boolean; employee: Employee | null }>({ open: false, employee: null });
  const [assignDeptDialog, setAssignDeptDialog] = useState<{ open: boolean; employee: Employee | null }>({ open: false, employee: null });
  const [bulkImportDialog, setBulkImportDialog] = useState(false);
  
  // Form states
  const [terminationData, setTerminationData] = useState({ reason: '', notes: '', effective_date: '' });
  const [selectedDept, setSelectedDept] = useState('');
  const [bulkImportText, setBulkImportText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [empData, deptData, reasonsData] = await Promise.all([
        employeeAPI.getEmployees(),
        departmentAPI.getDepartments(),
        employeeManagementAPI.getTerminationReasons()
      ]);
      setEmployees(empData);
      setDepartments(deptData);
      setTerminationReasons(reasonsData.reasons);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch data', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (employeeId: string) => {
    setIsSubmitting(true);
    try {
      await employeeAPI.approveEmployee(employeeId);
      toast({ title: 'Success', description: 'Employee approved successfully' });
      fetchData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to approve employee', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async (employeeId: string) => {
    setIsSubmitting(true);
    try {
      await employeeAPI.deleteEmployee(employeeId);
      toast({ title: 'Success', description: 'Employee registration rejected' });
      fetchData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to reject employee', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTerminate = async () => {
    if (!terminateDialog.employee || !terminationData.reason) {
      toast({ title: 'Error', description: 'Please select a reason', variant: 'destructive' });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await employeeManagementAPI.terminateEmployee(terminateDialog.employee.id, terminationData);
      toast({ title: 'Success', description: 'Employee terminated successfully' });
      setTerminateDialog({ open: false, employee: null });
      setTerminationData({ reason: '', notes: '', effective_date: '' });
      fetchData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to terminate employee', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignDepartment = async () => {
    if (!assignDeptDialog.employee || !selectedDept) {
      toast({ title: 'Error', description: 'Please select a department', variant: 'destructive' });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await employeeManagementAPI.assignDepartment(assignDeptDialog.employee.id, selectedDept);
      toast({ title: 'Success', description: `Employee assigned to ${selectedDept}` });
      setAssignDeptDialog({ open: false, employee: null });
      setSelectedDept('');
      fetchData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to assign department', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkImport = async () => {
    if (!bulkImportText.trim()) {
      toast({ title: 'Error', description: 'Please enter employee data', variant: 'destructive' });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const lines = bulkImportText.trim().split('\n').filter(l => l.trim());
      const employeesList = lines.map(line => {
        const parts = line.split(',').map(p => p.trim());
        return {
          full_name: parts[0] || '',
          email: parts[1] || '',
          department: parts[2] || 'Unassigned',
          job_title: parts[3] || '',
        };
      }).filter(e => e.full_name && e.email);
      
      if (employeesList.length === 0) {
        toast({ title: 'Error', description: 'No valid employees found', variant: 'destructive' });
        return;
      }
      
      const result = await employeeManagementAPI.bulkImportEmployees(employeesList);
      toast({ 
        title: 'Import Complete', 
        description: `Created ${result.created.length} employees, skipped ${result.skipped.length}` 
      });
      setBulkImportDialog(false);
      setBulkImportText('');
      fetchData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to import employees', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const pendingEmployees = employees.filter(e => !e.is_approved);
  const approvedEmployees = employees.filter(e => e.is_approved);

  const filteredEmployees = approvedEmployees.filter(emp => {
    const matchesSearch = emp.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         emp.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = filterDept === 'all' || emp.department === filterDept;
    return matchesSearch && matchesDept;
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-violet-600 mx-auto mb-4 flex items-center justify-center"
            >
              <Users className="w-6 h-6 text-white" />
            </motion.div>
            <p className="text-muted-foreground">Loading employees...</p>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              Employees
            </h1>
            <p className="text-muted-foreground">{employees.length} employees in your organization</p>
          </div>
          
          <Dialog open={bulkImportDialog} onOpenChange={setBulkImportDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-lg shadow-primary/25">
                <Upload className="w-4 h-4" />
                Bulk Import
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-primary" />
                  Bulk Import Employees
                </DialogTitle>
                <DialogDescription>
                  Enter employee data in CSV format. Each line: name, email, department, job_title
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="bg-secondary/50 rounded-lg p-3 text-sm">
                  <p className="font-medium mb-2">Format Example:</p>
                  <code className="text-xs text-muted-foreground">
                    John Doe, john@company.com, Engineering, Software Engineer<br/>
                    Jane Smith, jane@company.com, Marketing, Marketing Manager
                  </code>
                </div>
                
                <Textarea
                  value={bulkImportText}
                  onChange={(e) => setBulkImportText(e.target.value)}
                  placeholder="Enter employee data here..."
                  rows={10}
                  className="font-mono text-sm"
                />
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setBulkImportDialog(false)}>Cancel</Button>
                <Button onClick={handleBulkImport} disabled={isSubmitting}>
                  {isSubmitting ? 'Importing...' : 'Import Employees'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Pending Approvals Section */}
        {pendingEmployees.length > 0 && (
          <Card className="border-amber-500/50 bg-amber-500/5">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg text-amber-600">
                <Clock className="w-5 h-5" />
                Pending Approvals ({pendingEmployees.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingEmployees.map((employee) => (
                  <motion.div
                    key={employee.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-4 bg-background rounded-xl border"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-600 font-semibold">
                        {(employee.full_name || employee.email)[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{employee.full_name || 'No Name'}</p>
                        <p className="text-sm text-muted-foreground">{employee.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleReject(employee.id)}
                        disabled={isSubmitting}
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        className="gap-1 bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => handleApprove(employee.id)}
                        disabled={isSubmitting}
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={filterDept} onValueChange={setFilterDept}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Employee List */}
        <Card className="overflow-hidden">
          <CardHeader className="border-b bg-secondary/30">
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserCheck className="w-5 h-5 text-primary" />
              Active Employees ({filteredEmployees.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              <AnimatePresence mode="popLayout">
                {filteredEmployees.length === 0 ? (
                  <div className="text-center py-16">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No employees found</p>
                  </div>
                ) : (
                  filteredEmployees.map((employee, index) => (
                    <motion.div
                      key={employee.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.03 }}
                      className="p-4 hover:bg-secondary/30 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-white font-semibold shrink-0">
                            {(employee.full_name || employee.email)[0].toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground truncate">{employee.full_name || employee.email}</p>
                            <p className="text-sm text-muted-foreground truncate">{employee.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 shrink-0">
                          {/* Department Badge & Assignment */}
                          <div className="hidden sm:block">
                            <Select
                              value={employee.department || 'Unassigned'}
                              onValueChange={async (value) => {
                                try {
                                  await employeeManagementAPI.assignDepartment(employee.id, value);
                                  toast({ title: 'Success', description: `Assigned to ${value}` });
                                  fetchData();
                                } catch {
                                  toast({ title: 'Error', description: 'Failed to assign', variant: 'destructive' });
                                }
                              }}
                            >
                              <SelectTrigger className="w-[160px] h-8">
                                <Building2 className="w-3 h-3 mr-1" />
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {departments.map(dept => (
                                  <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          {employee.job_title && (
                            <Badge variant="outline" className="hidden md:flex">
                              {employee.job_title}
                            </Badge>
                          )}
                          
                          {/* Terminate Button */}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => setTerminateDialog({ open: true, employee })}
                          >
                            <UserX className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>

        {/* Terminate Employee Dialog */}
        <Dialog open={terminateDialog.open} onOpenChange={(open) => setTerminateDialog({ open, employee: open ? terminateDialog.employee : null })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive">
                <UserX className="w-5 h-5" />
                Terminate Employee
              </DialogTitle>
              <DialogDescription>
                This will revoke {terminateDialog.employee?.full_name || 'this employee'}'s access to the system.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <p className="text-sm text-destructive font-medium">
                  Warning: This action cannot be undone. The employee will lose access immediately.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>Termination Reason <span className="text-destructive">*</span></Label>
                <Select 
                  value={terminationData.reason} 
                  onValueChange={(v) => setTerminationData(p => ({ ...p, reason: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {terminationReasons.map(reason => (
                      <SelectItem key={reason} value={reason}>{reason}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Effective Date</Label>
                <Input
                  type="date"
                  value={terminationData.effective_date}
                  onChange={(e) => setTerminationData(p => ({ ...p, effective_date: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Notes (Optional)</Label>
                <Textarea
                  value={terminationData.notes}
                  onChange={(e) => setTerminationData(p => ({ ...p, notes: e.target.value }))}
                  placeholder="Additional notes..."
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setTerminateDialog({ open: false, employee: null });
                setTerminationData({ reason: '', notes: '', effective_date: '' });
              }}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleTerminate} 
                disabled={isSubmitting || !terminationData.reason}
              >
                {isSubmitting ? 'Processing...' : 'Confirm Termination'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
