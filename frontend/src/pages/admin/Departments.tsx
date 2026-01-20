import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, 
  Plus,
  Users,
  MoreHorizontal,
  Edit3,
  Trash2,
  Loader2,
  Save
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminData } from "@/hooks/useAdminData";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminDepartments() {
  const { user } = useAuth();
  const { departments, employees, isLoading, createDepartment } = useAdminData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingDept, setEditingDept] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleCreateDepartment = async () => {
    if (!formData.name.trim()) {
      toast.error("Department name is required");
      return;
    }

    setIsSubmitting(true);
    const { error } = await createDepartment(formData.name, formData.description);
    setIsSubmitting(false);

    if (error) {
      toast.error("Failed to create department");
      console.error(error);
    } else {
      toast.success("Department created successfully!");
      setIsDialogOpen(false);
      setFormData({ name: "", description: "" });
    }
  };

  const handleUpdateDepartment = async (deptId: string) => {
    if (!formData.name.trim()) {
      toast.error("Department name is required");
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase
      .from("departments")
      .update({
        name: formData.name,
        description: formData.description || null,
      })
      .eq("id", deptId);
    
    setIsSubmitting(false);

    if (error) {
      toast.error("Failed to update department");
    } else {
      toast.success("Department updated successfully!");
      setEditingDept(null);
      setFormData({ name: "", description: "" });
      // Refresh page to get updated data
      window.location.reload();
    }
  };

  const handleDeleteDepartment = async (deptId: string, deptName: string) => {
    const deptEmployees = employees.filter(e => e.department_id === deptId);
    
    if (deptEmployees.length > 0) {
      toast.error(`Cannot delete "${deptName}" - it has ${deptEmployees.length} employees assigned`);
      return;
    }

    const { error } = await supabase
      .from("departments")
      .delete()
      .eq("id", deptId);

    if (error) {
      toast.error("Failed to delete department");
    } else {
      toast.success("Department deleted successfully!");
      window.location.reload();
    }
  };

  const startEditing = (dept: typeof departments[0]) => {
    setEditingDept(dept.id);
    setFormData({
      name: dept.name,
      description: dept.description || "",
    });
  };

  const cancelEditing = () => {
    setEditingDept(null);
    setFormData({ name: "", description: "" });
  };

  // Get employees without department
  const unassignedEmployees = employees.filter(e => !e.department_id);

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
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Departments</h1>
            <p className="text-muted-foreground mt-1">Organize your company structure</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4" />
                Add Department
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Department</DialogTitle>
                <DialogDescription>
                  Add a new department to organize your workforce
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Department Name *</Label>
                  <Input
                    placeholder="e.g., Engineering, Marketing, Sales"
                    value={formData.name}
                    onChange={(e) => setFormData(f => ({ ...f, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description (Optional)</Label>
                  <Textarea
                    placeholder="Brief description of the department..."
                    value={formData.description}
                    onChange={(e) => setFormData(f => ({ ...f, description: e.target.value }))}
                    rows={3}
                  />
                </div>

                <Button
                  onClick={handleCreateDepartment}
                  disabled={isSubmitting || !formData.name.trim()}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Department"
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
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{departments.length}</p>
              <p className="text-sm text-muted-foreground">Departments</p>
            </div>
          </div>
        </div>
        <div className="card-subtle p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{employees.length}</p>
              <p className="text-sm text-muted-foreground">Total Employees</p>
            </div>
          </div>
        </div>
        <div className="card-subtle p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{unassignedEmployees.length}</p>
              <p className="text-sm text-muted-foreground">Unassigned</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Department Grid */}
      {departments.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-elevated p-12 text-center"
        >
          <Building2 className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Departments Yet</h2>
          <p className="text-muted-foreground mb-6">
            Create your first department to start organizing your team
          </p>
          <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Create Department
          </Button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <AnimatePresence>
            {departments.map((dept, index) => (
              <motion.div
                key={dept.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="card-interactive p-6"
              >
                {editingDept === dept.id ? (
                  <div className="space-y-4">
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData(f => ({ ...f, name: e.target.value }))}
                      placeholder="Department name"
                    />
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData(f => ({ ...f, description: e.target.value }))}
                      placeholder="Description"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleUpdateDepartment(dept.id)}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelEditing}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-primary" />
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => startEditing(dept)}>
                            <Edit3 className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteDepartment(dept.id, dept.name)}
                            className="text-rose-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <h3 className="text-lg font-semibold mb-1">{dept.name}</h3>
                    {dept.description && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {dept.description}
                      </p>
                    )}

                    <div className="flex items-center gap-2 pt-4 border-t border-border">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {dept.employee_count} {dept.employee_count === 1 ? 'employee' : 'employees'}
                      </span>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Unassigned Card */}
          {unassignedEmployees.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: departments.length * 0.05 }}
              className="card-interactive p-6 border-dashed border-2 border-amber-500/30 bg-amber-500/5"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-amber-600" />
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-1 text-amber-700">Unassigned Employees</h3>
              <p className="text-sm text-muted-foreground mb-4">
                These employees need to be assigned to a department
              </p>

              <div className="flex items-center gap-2 pt-4 border-t border-amber-500/20">
                <Users className="w-4 h-4 text-amber-600" />
                <span className="text-sm text-amber-600 font-medium">
                  {unassignedEmployees.length} {unassignedEmployees.length === 1 ? 'employee' : 'employees'}
                </span>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </DashboardLayout>
  );
}
