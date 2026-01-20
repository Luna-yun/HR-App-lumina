import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { salaryAPI, employeeAPI } from '@/services/api';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, Plus, Users, TrendingUp, Wallet, Sparkles, Receipt } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { SalaryRecord, Employee } from '@/types';

export default function AdminPayroll() {
  const [salaries, setSalaries] = useState<SalaryRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ 
    employee_id: '', 
    month: new Date().getMonth() + 1, 
    year: new Date().getFullYear(), 
    gross_salary: 0, 
    deductions: 0, 
    currency: 'USD' 
  });
  const { toast } = useToast();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [salaryData, empData] = await Promise.all([
        salaryAPI.getCompanySalaries(), 
        employeeAPI.getEmployees()
      ]);
      setSalaries(salaryData);
      setEmployees(empData.filter(e => e.is_approved));
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch data', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employee_id) {
      toast({ title: 'Error', description: 'Please select an employee', variant: 'destructive' });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await salaryAPI.createSalary(formData);
      toast({ title: 'Success', description: 'Salary record created successfully' });
      handleDialogClose();
      fetchData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create salary record', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setFormData({ 
      employee_id: '', 
      month: new Date().getMonth() + 1, 
      year: new Date().getFullYear(), 
      gross_salary: 0, 
      deductions: 0, 
      currency: 'USD' 
    });
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      handleDialogClose();
    } else {
      setIsDialogOpen(true);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-violet-600 mx-auto mb-4 flex items-center justify-center"
            >
              <DollarSign className="w-6 h-6 text-white" />
            </motion.div>
            <p className="text-muted-foreground">Loading payroll data...</p>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  const totalPayroll = salaries.reduce((acc, s) => acc + s.net_salary, 0);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Wallet className="w-6 h-6 text-primary" />
              Payroll Management
            </h1>
            <p className="text-muted-foreground">Manage employee compensation</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-lg shadow-primary/25">
                <Plus className="w-4 h-4" />
                Add Salary
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Add Salary Record
                </DialogTitle>
                <DialogDescription>
                  Create a new salary record for an employee. Net salary is automatically calculated.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="employee" className="text-sm font-medium">
                    Employee
                  </Label>
                  <Select 
                    value={formData.employee_id} 
                    onValueChange={(v) => setFormData(p => ({ ...p, employee_id: v }))}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select an employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map(e => (
                        <SelectItem key={e.id} value={e.id}>
                          {e.full_name || e.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="month" className="text-sm font-medium">
                      Month
                    </Label>
                    <Select 
                      value={formData.month.toString()} 
                      onValueChange={(v) => setFormData(p => ({ ...p, month: parseInt(v) }))}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month, index) => (
                          <SelectItem key={index} value={(index + 1).toString()}>
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="year" className="text-sm font-medium">
                      Year
                    </Label>
                    <Input 
                      id="year"
                      type="number" 
                      value={formData.year} 
                      onChange={(e) => setFormData(p => ({ ...p, year: parseInt(e.target.value) }))} 
                      className="h-11"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gross" className="text-sm font-medium">
                    Gross Salary (USD)
                  </Label>
                  <Input 
                    id="gross"
                    type="number" 
                    min={0}
                    step={100}
                    value={formData.gross_salary} 
                    onChange={(e) => setFormData(p => ({ ...p, gross_salary: parseFloat(e.target.value) || 0 }))} 
                    className="h-11"
                    placeholder="0.00"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="deductions" className="text-sm font-medium">
                    Deductions (USD)
                  </Label>
                  <Input 
                    id="deductions"
                    type="number" 
                    min={0}
                    step={50}
                    value={formData.deductions} 
                    onChange={(e) => setFormData(p => ({ ...p, deductions: parseFloat(e.target.value) || 0 }))} 
                    className="h-11"
                    placeholder="0.00"
                  />
                </div>
                
                {/* Net Salary Preview */}
                <div className="bg-secondary/50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Net Salary</span>
                    <span className="text-xl font-bold text-emerald-500">
                      ${(formData.gross_salary - formData.deductions).toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleDialogClose}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                        Creating...
                      </>
                    ) : (
                      'Create Record'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
          >
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-green-500" />
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-emerald-500/10">
                  <DollarSign className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">${totalPayroll.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Payroll</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-500/10">
                  <Receipt className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">{salaries.length}</p>
                  <p className="text-sm text-muted-foreground">Salary Records</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-purple-500" />
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-violet-500/10">
                  <TrendingUp className="w-6 h-6 text-violet-500" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">
                    ${salaries.length > 0 ? Math.round(totalPayroll / salaries.length).toLocaleString() : 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Average Salary</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Salary Records */}
        <Card className="overflow-hidden">
          <CardHeader className="border-b bg-secondary/30">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Receipt className="w-5 h-5 text-primary" />
              Salary Records
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <AnimatePresence mode="popLayout">
              {salaries.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">No salary records yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first salary record to get started
                  </p>
                  <Button onClick={() => setIsDialogOpen(true)} variant="outline" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Salary
                  </Button>
                </motion.div>
              ) : (
                <div className="divide-y divide-border">
                  {salaries.map((salary, index) => (
                    <motion.div
                      key={salary.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-5 hover:bg-secondary/30 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 rounded-xl bg-primary/10 shrink-0">
                          <DollarSign className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{salary.employee_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {months[salary.month - 1]} {salary.year}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-emerald-500">
                          {salary.currency} {salary.net_salary.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Gross: {salary.gross_salary.toLocaleString()} | Deductions: {salary.deductions.toLocaleString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
