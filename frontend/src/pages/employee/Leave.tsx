import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Plus,
  FileText,
  CalendarIcon,
  Loader2,
  AlertCircle,
  Sparkles
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useEmployeeData } from "@/hooks/useEmployeeData";
import { format, differenceInDays, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface LeaveType {
  id: string;
  name: string;
  default_days: number;
  is_paid: boolean;
  description: string | null;
}

export default function EmployeeLeave() {
  const { user } = useAuth();
  const { employee, leaveRequests, leaveBalances, leaveSummary, isLoading: dataLoading } = useEmployeeData();
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [selectedLeaveType, setSelectedLeaveType] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [reason, setReason] = useState("");

  // Fetch leave types
  const fetchLeaveTypes = useCallback(async () => {
    const { data, error } = await supabase
      .from("leave_types")
      .select("*")
      .eq("is_active", true);

    if (!error && data) {
      setLeaveTypes(data);
    }
  }, []);

  useEffect(() => {
    fetchLeaveTypes();
  }, [fetchLeaveTypes]);

  // Calculate days count
  const daysCount = startDate && endDate 
    ? differenceInDays(endDate, startDate) + 1 
    : 0;

  // Get remaining balance for selected leave type
  const getBalance = (leaveTypeId: string) => {
    const balance = leaveBalances.find(b => b.leave_type_id === leaveTypeId);
    return balance?.remaining_days ?? 0;
  };

  // Submit leave request
  const handleSubmit = async () => {
    if (!employee || !user || !startDate || !endDate || !selectedLeaveType) {
      toast.error("Please fill all required fields");
      return;
    }

    const balance = getBalance(selectedLeaveType);
    if (daysCount > balance) {
      toast.error(`Insufficient leave balance. You have ${balance} days remaining.`);
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase
      .from("leave_requests")
      .insert({
        employee_id: employee.id,
        user_id: user.id,
        leave_type_id: selectedLeaveType,
        start_date: format(startDate, "yyyy-MM-dd"),
        end_date: format(endDate, "yyyy-MM-dd"),
        days_count: daysCount,
        reason: reason || null,
        status: "pending",
      });

    setIsSubmitting(false);

    if (error) {
      toast.error("Failed to submit leave request");
      console.error(error);
    } else {
      toast.success("Leave request submitted successfully!");
      setIsDialogOpen(false);
      resetForm();
      // Refresh the page data
      window.location.reload();
    }
  };

  const resetForm = () => {
    setSelectedLeaveType("");
    setStartDate(undefined);
    setEndDate(undefined);
    setReason("");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-rose-600" />;
      default:
        return <Clock className="w-4 h-4 text-amber-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "rejected":
        return "bg-rose-500/10 text-rose-600 border-rose-500/20";
      default:
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    }
  };

  if (dataLoading) {
    return (
      <DashboardLayout role="employee">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="employee">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Leave Management</h1>
            <p className="text-muted-foreground mt-1">Request time off and track your leave balance</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4" />
                Request Leave
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  New Leave Request
                </DialogTitle>
                <DialogDescription>
                  Submit a new leave request for approval
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Leave Type */}
                <div className="space-y-2">
                  <Label>Leave Type</Label>
                  <Select value={selectedLeaveType} onValueChange={setSelectedLeaveType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      {leaveTypes.map((type) => {
                        const balance = getBalance(type.id);
                        return (
                          <SelectItem key={type.id} value={type.id}>
                            <div className="flex items-center justify-between w-full gap-4">
                              <span>{type.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {balance} days left
                              </span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "MMM d, yyyy") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={startDate}
                          onSelect={(date) => {
                            setStartDate(date);
                            if (date && (!endDate || date > endDate)) {
                              setEndDate(date);
                            }
                          }}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "MMM d, yyyy") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          disabled={(date) => date < (startDate || new Date())}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Days Count */}
                {daysCount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-4 rounded-lg bg-primary/5 border border-primary/10"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Days</span>
                      <span className="text-2xl font-bold text-primary">{daysCount}</span>
                    </div>
                  </motion.div>
                )}

                {/* Reason */}
                <div className="space-y-2">
                  <Label>Reason (Optional)</Label>
                  <Textarea
                    placeholder="Provide a reason for your leave request..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Balance Warning */}
                {selectedLeaveType && daysCount > getBalance(selectedLeaveType) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span className="text-sm text-rose-600">
                      Insufficient balance. You have {getBalance(selectedLeaveType)} days remaining.
                    </span>
                  </motion.div>
                )}

                {/* Submit Button */}
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedLeaveType || !startDate || !endDate || isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Request"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
      >
        <div className="card-elevated p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{leaveSummary.pending}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </div>
        </div>
        <div className="card-elevated p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{leaveSummary.approved}</p>
              <p className="text-sm text-muted-foreground">Approved</p>
            </div>
          </div>
        </div>
        <div className="card-elevated p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{leaveSummary.rejected}</p>
              <p className="text-sm text-muted-foreground">Rejected</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leave Balance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-1"
        >
          <div className="card-elevated p-6">
            <h2 className="text-lg font-semibold mb-4">Leave Balance</h2>
            {leaveBalances.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">
                No leave balance configured
              </p>
            ) : (
              <div className="space-y-4">
                {leaveBalances.map((balance) => {
                  const percentage = (balance.remaining_days / balance.total_days) * 100;
                  return (
                    <div key={balance.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{balance.leave_type?.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {balance.remaining_days} / {balance.total_days}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className={cn(
                            "h-full rounded-full",
                            percentage > 50 ? "bg-emerald-500" :
                            percentage > 25 ? "bg-amber-500" : "bg-rose-500"
                          )}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>

        {/* Leave Requests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="card-elevated p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Requests</h2>
            {leaveRequests.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">No leave requests yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Click "Request Leave" to submit your first request
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {leaveRequests.map((request, index) => (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{request.leave_type?.name || "Leave"}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(request.start_date), "MMM d")} - {format(new Date(request.end_date), "MMM d, yyyy")}
                            <span className="mx-2">•</span>
                            {request.days_count} day{request.days_count > 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                      <div className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border",
                        getStatusColor(request.status || "pending")
                      )}>
                        {getStatusIcon(request.status || "pending")}
                        {(request.status || "pending").charAt(0).toUpperCase() + (request.status || "pending").slice(1)}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
