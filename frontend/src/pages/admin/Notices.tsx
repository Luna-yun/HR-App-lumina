import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, 
  Plus,
  Clock,
  AlertTriangle,
  Info,
  Loader2,
  Megaphone,
  Edit3,
  Trash2,
  Eye,
  EyeOff
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import { supabase } from "@/integrations/supabase/client";
import { useAdminData } from "@/hooks/useAdminData";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminNotices() {
  const { notices, createNotice, isLoading } = useAdminData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    priority: "normal",
  });

  const handleCreateNotice = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    setIsSubmitting(true);
    const { error } = await createNotice(formData.title, formData.content, formData.priority);
    setIsSubmitting(false);

    if (error) {
      toast.error("Failed to create notice");
      console.error(error);
    } else {
      toast.success("Notice published successfully!");
      setIsDialogOpen(false);
      setFormData({ title: "", content: "", priority: "normal" });
    }
  };

  const handleDeleteNotice = async (id: string) => {
    const { error } = await supabase
      .from("notices")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete notice");
    } else {
      toast.success("Notice deleted!");
      window.location.reload();
    }
  };

  const togglePublish = async (id: string, isCurrentlyPublished: boolean) => {
    const { error } = await supabase
      .from("notices")
      .update({
        is_published: !isCurrentlyPublished,
        published_at: !isCurrentlyPublished ? new Date().toISOString() : null,
      })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update notice");
    } else {
      toast.success(isCurrentlyPublished ? "Notice unpublished" : "Notice published!");
      window.location.reload();
    }
  };

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
        return "border-l-4 border-l-rose-500";
      case "normal":
        return "border-l-4 border-l-primary";
      default:
        return "border-l-4 border-l-muted-foreground/30";
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Notices</h1>
            <p className="text-muted-foreground mt-1">Create and manage company announcements</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4" />
                Create Notice
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-primary" />
                  New Notice
                </DialogTitle>
                <DialogDescription>
                  Create a new announcement for your employees
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input
                    placeholder="e.g., Holiday Schedule Update"
                    value={formData.title}
                    onChange={(e) => setFormData(f => ({ ...f, title: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(v) => setFormData(f => ({ ...f, priority: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High (Important)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Content *</Label>
                  <Textarea
                    placeholder="Write your announcement here..."
                    value={formData.content}
                    onChange={(e) => setFormData(f => ({ ...f, content: e.target.value }))}
                    rows={6}
                  />
                </div>

                <Button
                  onClick={handleCreateNotice}
                  disabled={isSubmitting || !formData.title.trim() || !formData.content.trim()}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    "Publish Notice"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
      >
        <div className="card-subtle p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Megaphone className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{notices.length}</p>
              <p className="text-sm text-muted-foreground">Total Notices</p>
            </div>
          </div>
        </div>
        <div className="card-subtle p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Eye className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{notices.filter(n => n.is_published).length}</p>
              <p className="text-sm text-muted-foreground">Published</p>
            </div>
          </div>
        </div>
        <div className="card-subtle p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <EyeOff className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{notices.filter(n => !n.is_published).length}</p>
              <p className="text-sm text-muted-foreground">Drafts</p>
            </div>
          </div>
        </div>
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
          <p className="text-muted-foreground mb-6">
            Create your first announcement to keep your team informed
          </p>
          <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Create Notice
          </Button>
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
                  getPriorityStyles(notice.priority),
                  !notice.is_published && "opacity-70"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex-shrink-0 mt-1">
                      {getPriorityIcon(notice.priority)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          {notice.title}
                        </h3>
                        <div className="flex gap-2 flex-shrink-0">
                          {notice.priority === "high" && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-600 border border-rose-500/20">
                              Important
                            </span>
                          )}
                          {!notice.is_published && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                              Draft
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground whitespace-pre-wrap">
                        {notice.content}
                      </p>
                      
                      <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>
                          {notice.is_published && notice.published_at
                            ? `Published ${format(new Date(notice.published_at), "MMM d, yyyy 'at' h:mm a")}`
                            : `Created ${format(new Date(notice.created_at), "MMM d, yyyy")}`
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => togglePublish(notice.id, notice.is_published || false)}
                    >
                      {notice.is_published ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteNotice(notice.id)}
                      className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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
