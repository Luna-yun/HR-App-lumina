import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, 
  Clock,
  AlertTriangle,
  Info,
  Loader2,
  Megaphone
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useEmployeeData } from "@/hooks/useEmployeeData";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function EmployeeNotices() {
  const { notices, isLoading } = useEmployeeData();

  const getPriorityIcon = (priority: string | null) => {
    switch (priority) {
      case "high":
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case "normal":
        return <Info className="w-4 h-4 text-primary" />;
      default:
        return <Bell className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getPriorityStyles = (priority: string | null) => {
    switch (priority) {
      case "high":
        return "border-l-4 border-l-rose-500 bg-rose-500/5";
      case "normal":
        return "border-l-4 border-l-primary bg-primary/5";
      default:
        return "border-l-4 border-l-muted-foreground/30";
    }
  };

  if (isLoading) {
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
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Company Notices</h1>
        <p className="text-muted-foreground mt-1">Stay updated with the latest announcements</p>
      </motion.div>

      {/* Notices List */}
      {notices.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-elevated p-12 text-center"
        >
          <Megaphone className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Notices Yet</h2>
          <p className="text-muted-foreground">
            When your company publishes announcements, they'll appear here.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {notices.map((notice, index) => (
              <motion.div
                key={notice.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "card-elevated p-6",
                  getPriorityStyles(notice.priority)
                )}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getPriorityIcon(notice.priority)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        {notice.title}
                      </h3>
                      {notice.priority === "high" && (
                        <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-600 border border-rose-500/20">
                          Important
                        </span>
                      )}
                    </div>
                    
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {notice.content}
                    </p>
                    
                    <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>
                        Published {notice.published_at 
                          ? format(new Date(notice.published_at), "MMMM d, yyyy 'at' h:mm a")
                          : format(new Date(notice.created_at), "MMMM d, yyyy")
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </DashboardLayout>
  );
}
