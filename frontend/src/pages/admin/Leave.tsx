import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  FileText,
  Loader2,
  MessageSquare,
  User
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useAdminData } from "@/hooks/useAdminData";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminLeave() {
  const { pendingLeaveRequests, approveLeaveRequest, rejectLeaveRequest, isLoading } = useAdminData();
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    const { error } = await approveLeaveRequest(id);
    setProcessingId(null);
    
    if (error) {
      toast.error("Failed to approve request");
    } else {
      toast.success("Leave request approved!");
    }
  };

  const handleReject = async () => {
    if (!rejectingId) return;
    
    setProcessingId(rejectingId);
    const { error } = await rejectLeaveRequest(rejectingId, rejectionReason);
    setProcessingId(null);
    
    if (error) {
      toast.error("Failed to reject request");
    } else {
      toast.success("Leave request rejected");
      setRejectingId(null);
      setRejectionReason("");
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

  if (isLoading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Leave Requests</h1>
        <p className="text-muted-foreground mt-1">Review and manage employee leave applications</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
      >
        <div className="card-elevated p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingLeaveRequests.length}</p>
              <p className="text-sm text-muted-foreground">Pending Review</p>
            </div>
          </div>
        </div>
        <div className="card-elevated p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {pendingLeaveRequests.reduce((acc, r) => acc + r.days_count, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Days Requested</p>
            </div>
          </div>
        </div>
        <div className="card-elevated p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <User className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {new Set(pendingLeaveRequests.map(r => r.employee_id)).size}
              </p>
              <p className="text-sm text-muted-foreground">Employees Requesting</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Leave Requests */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-elevated"
      >
        {pendingLeaveRequests.length === 0 ? (
          <div className="text-center py-16">
            <CheckCircle className="w-16 h-16 mx-auto text-emerald-500/50 mb-4" />
            <h2 className="text-xl font-semibold mb-2">All Caught Up!</h2>
            <p className="text-muted-foreground">
              No pending leave requests to review
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            <AnimatePresence>
              {pendingLeaveRequests.map((request, index) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Employee Info */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-semibold">
                          {request.employee?.profile?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '?'}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {request.employee?.profile?.full_name || 'Unknown Employee'}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                          <span className="inline-flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5" />
                            {request.leave_type?.name || 'Leave'}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {format(new Date(request.start_date), "MMM d")} - {format(new Date(request.end_date), "MMM d, yyyy")}
                          </span>
                          <span className="font-medium text-foreground">
                            {request.days_count} day{request.days_count > 1 ? 's' : ''}
                          </span>
                        </div>
                        {request.reason && (
                          <div className="mt-3 p-3 rounded-lg bg-muted/50 border border-border">
                            <p className="text-sm text-muted-foreground flex items-start gap-2">
                              <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              {request.reason}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-16 lg:ml-0">
                      <Button
                        onClick={() => handleApprove(request.id)}
                        disabled={processingId === request.id}
                        className="bg-emerald-600 hover:bg-emerald-700 gap-2"
                      >
                        {processingId === request.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        Approve
                      </Button>
                      <Button
                        onClick={() => setRejectingId(request.id)}
                        disabled={processingId === request.id}
                        variant="outline"
                        className="text-rose-600 border-rose-200 hover:bg-rose-50 gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Decline
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Rejection Dialog */}
      <Dialog open={!!rejectingId} onOpenChange={(open) => !open && setRejectingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Decline Leave Request</DialogTitle>
            <DialogDescription>
              Provide a reason for declining this request (optional)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Enter reason for declining..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setRejectingId(null)}>
                Cancel
              </Button>
              <Button
                onClick={handleReject}
                disabled={processingId === rejectingId}
                className="bg-rose-600 hover:bg-rose-700"
              >
                {processingId === rejectingId ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Declining...
                  </>
                ) : (
                  "Confirm Decline"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
