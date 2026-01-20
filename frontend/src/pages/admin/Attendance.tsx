import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  Clock, 
  Calendar,
  CheckCircle,
  AlertCircle,
  Download,
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Users,
  Search
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
import { supabase } from "@/integrations/supabase/client";
import { useAdminData } from "@/hooks/useAdminData";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addWeeks, subWeeks, addMonths, subMonths, eachDayOfInterval, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type Attendance = Database["public"]["Tables"]["attendance"]["Row"];

interface AttendanceWithEmployee extends Attendance {
  employee?: {
    profile?: { full_name: string } | null;
    department?: { name: string } | null;
  } | null;
}

export default function AdminAttendance() {
  const { employees, departments, isLoading: dataLoading } = useAdminData();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceWithEmployee[]>([]);
  const [viewMode, setViewMode] = useState<"week" | "month">("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Calculate date range based on view mode
  const getDateRange = useCallback(() => {
    if (viewMode === "week") {
      return {
        start: startOfWeek(currentDate, { weekStartsOn: 1 }),
        end: endOfWeek(currentDate, { weekStartsOn: 1 }),
      };
    } else {
      return {
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate),
      };
    }
  }, [viewMode, currentDate]);

  // Fetch attendance records
  const fetchAttendance = useCallback(async () => {
    setIsLoading(true);
    const { start, end } = getDateRange();

    const { data, error } = await supabase
      .from("attendance")
      .select(`
        *,
        employee:employees(
          profile:profiles(full_name),
          department:departments(name)
        )
      `)
      .gte("date", format(start, "yyyy-MM-dd"))
      .lte("date", format(end, "yyyy-MM-dd"))
      .order("date", { ascending: false })
      .order("check_in", { ascending: false });

    setIsLoading(false);

    if (error) {
      console.error("Error fetching attendance:", error);
      return;
    }

    setAttendanceRecords(data as AttendanceWithEmployee[] || []);
  }, [getDateRange]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance, currentDate, viewMode]);

  // Navigation handlers
  const goToPrevious = () => {
    if (viewMode === "week") {
      setCurrentDate(subWeeks(currentDate, 1));
    } else {
      setCurrentDate(subMonths(currentDate, 1));
    }
  };

  const goToNext = () => {
    if (viewMode === "week") {
      setCurrentDate(addWeeks(currentDate, 1));
    } else {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Filter records
  const filteredRecords = attendanceRecords.filter(record => {
    const matchesSearch = !searchQuery ||
      record.employee?.profile?.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" ||
      record.status === statusFilter ||
      (statusFilter === "missing" && record.check_in && !record.check_out);

    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const { start, end } = getDateRange();
  const stats = {
    totalRecords: filteredRecords.length,
    presentCount: filteredRecords.filter(r => r.status === "present").length,
    lateCount: filteredRecords.filter(r => r.status === "late").length,
    missingCheckouts: filteredRecords.filter(r => r.check_in && !r.check_out).length,
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ["Date", "Employee", "Check In", "Check Out", "Status"];
    const rows = filteredRecords.map(record => [
      format(new Date(record.date), "yyyy-MM-dd"),
      record.employee?.profile?.full_name || "Unknown",
      record.check_in ? format(new Date(record.check_in), "HH:mm:ss") : "-",
      record.check_out ? format(new Date(record.check_out), "HH:mm:ss") : "-",
      record.status || "-",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance-${format(start, "yyyy-MM-dd")}-to-${format(end, "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Attendance exported successfully!");
  };

  if (dataLoading) {
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
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Attendance Monitoring</h1>
            <p className="text-muted-foreground mt-1">Track employee attendance across your organization</p>
          </div>
          
          <Button onClick={exportToCSV} variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
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
          <p className="text-2xl font-bold text-primary">{stats.totalRecords}</p>
          <p className="text-sm text-muted-foreground">Total Records</p>
        </div>
        <div className="card-subtle p-4">
          <p className="text-2xl font-bold text-emerald-600">{stats.presentCount}</p>
          <p className="text-sm text-muted-foreground">On Time</p>
        </div>
        <div className="card-subtle p-4">
          <p className="text-2xl font-bold text-amber-600">{stats.lateCount}</p>
          <p className="text-sm text-muted-foreground">Late Arrivals</p>
        </div>
        <div className="card-subtle p-4">
          <p className="text-2xl font-bold text-rose-600">{stats.missingCheckouts}</p>
          <p className="text-sm text-muted-foreground">Missing Checkouts</p>
        </div>
      </motion.div>

      {/* Filters and Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6"
      >
        {/* Date Navigation */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={goToPrevious}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="text-center min-w-[200px]">
            <p className="font-semibold">
              {viewMode === "week"
                ? `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`
                : format(currentDate, "MMMM yyyy")
              }
            </p>
          </div>
          <Button variant="outline" size="icon" onClick={goToNext}>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={goToToday}>
            Today
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search employee..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-[200px]"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="present">On Time</SelectItem>
              <SelectItem value="late">Late</SelectItem>
              <SelectItem value="missing">Missing Checkout</SelectItem>
            </SelectContent>
          </Select>
          <Select value={viewMode} onValueChange={(v) => setViewMode(v as "week" | "month")}>
            <SelectTrigger className="w-[120px]">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Weekly</SelectItem>
              <SelectItem value="month">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Attendance Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="card-elevated overflow-hidden"
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Attendance Records</h2>
            <p className="text-muted-foreground">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "No attendance data for this period"
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Date</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Employee</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Check In</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Check Out</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record, index) => {
                  const isMissingCheckout = record.check_in && !record.check_out;
                  
                  return (
                    <motion.tr
                      key={record.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.02 }}
                      className={cn(
                        "border-b border-border/50 transition-colors",
                        isMissingCheckout && "bg-amber-500/5"
                      )}
                    >
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium">{format(new Date(record.date), "MMM d, yyyy")}</p>
                          <p className="text-xs text-muted-foreground">{format(new Date(record.date), "EEEE")}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-primary text-xs font-semibold">
                              {record.employee?.profile?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '?'}
                            </span>
                          </div>
                          <span className="font-medium">{record.employee?.profile?.full_name || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm">
                        {record.check_in ? (
                          <span className="font-mono">{format(new Date(record.check_in), "h:mm a")}</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-sm">
                        {record.check_out ? (
                          <span className="font-mono">{format(new Date(record.check_out), "h:mm a")}</span>
                        ) : record.check_in ? (
                          <span className="inline-flex items-center gap-1 text-amber-600">
                            <AlertCircle className="w-3 h-3" />
                            Missing
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                          record.status === "present" && "bg-emerald-500/10 text-emerald-600",
                          record.status === "late" && "bg-amber-500/10 text-amber-600",
                          !record.status && "bg-muted text-muted-foreground"
                        )}>
                          {record.status === "present" && <CheckCircle className="w-3 h-3" />}
                          {record.status === "late" && <Clock className="w-3 h-3" />}
                          {record.status || "Unknown"}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
