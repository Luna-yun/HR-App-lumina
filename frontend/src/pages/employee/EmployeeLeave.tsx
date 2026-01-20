import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { leaveAPI } from '@/services/api';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Calendar, Plus, CheckCircle, XCircle, Clock, CalendarDays, Sparkles, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import type { LeaveRequest, LeaveSummary } from '@/types';

export default function EmployeeLeave() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [summary, setSummary] = useState<LeaveSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ start_date: '', end_date: '', reason: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [requestsData, summaryData] = await Promise.all([
        leaveAPI.getMyRequests(), 
        leaveAPI.getMySummary()
      ]);
      setRequests(requestsData);
      setSummary(summaryData);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch data', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.start_date || !formData.end_date || !formData.reason.trim()) {
      toast({ title: 'Error', description: 'Please fill in all fields', variant: 'destructive' });
      return;
    }

    if (new Date(formData.end_date) < new Date(formData.start_date)) {
      toast({ title: 'Error', description: 'End date must be after start date', variant: 'destructive' });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await leaveAPI.createRequest(formData);
      toast({ title: 'Success', description: 'Leave request submitted successfully' });
      setIsDialogOpen(false);
      setFormData({ start_date: '', end_date: '', reason: '' });
      fetchData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to submit request', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setFormData({ start_date: '', end_date: '', reason: '' });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': 
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200 hover:bg-emerald-500/20">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case 'rejected': 
        return (
          <Badge variant="destructive" className="bg-red-500/10 text-red-600 border-red-200 hover:bg-red-500/20">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default: 
        return (
          <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 border-amber-200 hover:bg-amber-500/20">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
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
              <Calendar className="w-6 h-6 text-white" />
            </motion.div>
            <p className="text-muted-foreground">Loading leave data...</p>
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
              <CalendarDays className="w-6 h-6 text-primary" />
              Leave Management
            </h1>
            <p className="text-muted-foreground">Request and track your time off</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-lg shadow-primary/25">
                <Plus className="w-4 h-4" />
                Request Leave
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Request Time Off
                </DialogTitle>
                <DialogDescription>
                  Submit a leave request for approval. Your manager will review it shortly.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date" className="text-sm font-medium">
                      Start Date
                    </Label>
                    <Input 
                      id="start_date"
                      type="date" 
                      value={formData.start_date} 
                      onChange={(e) => setFormData(p => ({ ...p, start_date: e.target.value }))} 
                      required 
                      className="h-11"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="end_date" className="text-sm font-medium">
                      End Date
                    </Label>
                    <Input 
                      id="end_date"
                      type="date" 
                      value={formData.end_date} 
                      onChange={(e) => setFormData(p => ({ ...p, end_date: e.target.value }))} 
                      required 
                      className="h-11"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reason" className="text-sm font-medium">
                    Reason for Leave
                  </Label>
                  <Textarea 
                    id="reason"
                    rows={4} 
                    value={formData.reason} 
                    onChange={(e) => setFormData(p => ({ ...p, reason: e.target.value }))} 
                    required 
                    placeholder="Please provide details about your leave request..."
                    className="resize-none"
                  />
                </div>
                
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => handleDialogOpenChange(false)}
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
                        Submitting...
                      </>
                    ) : (
                      'Submit Request'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
          >
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-amber-500/10">
                  <Clock className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">{summary?.pending || 0}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
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
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-green-500" />
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-emerald-500/10">
                  <CheckCircle className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">{summary?.approved || 0}</p>
                  <p className="text-sm text-muted-foreground">Approved</p>
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
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-rose-500" />
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-red-500/10">
                  <XCircle className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">{summary?.rejected || 0}</p>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Leave Requests List */}
        <Card className="overflow-hidden">
          <CardHeader className="border-b bg-secondary/30">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="w-5 h-5 text-primary" />
              My Leave Requests
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <AnimatePresence mode="popLayout">
              {requests.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">No leave requests yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Submit your first leave request to get started
                  </p>
                  <Button onClick={() => setIsDialogOpen(true)} variant="outline" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Request Leave
                  </Button>
                </motion.div>
              ) : (
                <div className="divide-y divide-border">
                  {requests.map((request, index) => (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-5 hover:bg-secondary/30 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-2.5 rounded-xl bg-primary/10 shrink-0">
                          <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            {format(new Date(request.start_date), 'MMM d, yyyy')} 
                            <span className="text-muted-foreground font-normal mx-2">to</span>
                            {format(new Date(request.end_date), 'MMM d, yyyy')}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                            {request.reason}
                          </p>
                          {request.rejection_reason && (
                            <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                              <XCircle className="w-3 h-3" />
                              {request.rejection_reason}
                            </p>
                          )}
                        </div>
                      </div>
                      {getStatusBadge(request.status)}
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
