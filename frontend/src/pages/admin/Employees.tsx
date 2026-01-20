import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Mail,
  Building2,
  MapPin,
  Calendar,
  Loader2,
  UserPlus
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useAdminData } from "@/hooks/useAdminData";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type Employee = Database["public"]["Tables"]["employees"]["Row"];

interface EmployeeWithDetails extends Employee {
  department?: { id: string; name: string } | null;
  profile?: { full_name: string; email: string; country: string } | null;
}

export default function AdminEmployees() {
  const { employees, departments, isLoading } = useAdminData();
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Filter employees
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = !searchQuery || 
      emp.profile?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.profile?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employee_code?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDepartment = departmentFilter === "all" || 
      emp.department_id === departmentFilter ||
      (departmentFilter === "unassigned" && !emp.department_id);
    
    const matchesStatus = statusFilter === "all" || 
      emp.employment_status === statusFilter;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Stats
  const stats = {
    total: employees.length,
    active: employees.filter(e => e.employment_status === "active").length,
    onLeave: employees.filter(e => e.employment_status === "on-leave").length,
    unassigned: employees.filter(e => !e.department_id).length,
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "active":
        return "bg-emerald-500/10 text-emerald-600";
      case "on-leave":
        return "bg-amber-500/10 text-amber-600";
      case "terminated":
        return "bg-rose-500/10 text-rose-600";
      default:
        return "bg-muted text-muted-foreground";
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
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Employees</h1>
            <p className="text-muted-foreground mt-1">Manage your organization's workforce</p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
      >
        <div className="card-subtle p-4">
          <p className="text-2xl font-bold text-primary">{stats.total}</p>
          <p className="text-sm text-muted-foreground">Total Employees</p>
        </div>
        <div className="card-subtle p-4">
          <p className="text-2xl font-bold text-emerald-600">{stats.active}</p>
          <p className="text-sm text-muted-foreground">Active</p>
        </div>
        <div className="card-subtle p-4">
          <p className="text-2xl font-bold text-amber-600">{stats.onLeave}</p>
          <p className="text-sm text-muted-foreground">On Leave</p>
        </div>
        <div className="card-subtle p-4">
          <p className="text-2xl font-bold text-rose-600">{stats.unassigned}</p>
          <p className="text-sm text-muted-foreground">Unassigned</p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4 mb-6"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[180px]">
              <Building2 className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              {departments.map(dept => (
                <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="on-leave">On Leave</SelectItem>
              <SelectItem value="terminated">Terminated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Employee List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="card-elevated overflow-hidden"
      >
        {filteredEmployees.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Employees Found</h2>
            <p className="text-muted-foreground">
              {searchQuery || departmentFilter !== "all" || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "Start by adding employees to your organization"
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Employee</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Department</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Job Title</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Joined</th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredEmployees.map((employee, index) => (
                    <motion.tr
                      key={employee.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.02 }}
                      className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-primary font-semibold text-sm">
                              {employee.profile?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '?'}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium truncate">{employee.profile?.full_name || 'Unknown'}</p>
                            <p className="text-sm text-muted-foreground truncate">{employee.profile?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {employee.department ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            <Building2 className="w-3 h-3" />
                            {employee.department.name}
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-sm">Unassigned</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-sm">
                        {employee.job_title || '-'}
                      </td>
                      <td className="py-4 px-6">
                        <span className={cn(
                          "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize",
                          getStatusColor(employee.employment_status)
                        )}>
                          {employee.employment_status || 'Unknown'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-muted-foreground">
                        {employee.hire_date 
                          ? format(new Date(employee.hire_date), "MMM d, yyyy")
                          : '-'
                        }
                      </td>
                      <td className="py-4 px-6 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                            <DropdownMenuItem>Edit Details</DropdownMenuItem>
                            <DropdownMenuItem>Assign Department</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
