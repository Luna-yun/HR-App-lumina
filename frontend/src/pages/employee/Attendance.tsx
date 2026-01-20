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
  TrendingUp
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useEmployeeData } from "@/hooks/useEmployeeData";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addWeeks, subWeeks, addMonths, subMonths, eachDayOfInterval, isToday, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type Attendance = Database["public"]["Tables"]["attendance"]["Row"];

export default function EmployeeAttendance() {
  const { user } = useAuth();
  const { employee, todayAttendance, attendanceStatus, checkIn, checkOut, isLoading: dataLoading } = useEmployeeData();
  const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([]);
  const [viewMode, setViewMode] = useState<"week" | "month">("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

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
    if (!employee) return;

    setIsLoading(true);
    const { start, end } = getDateRange();

    const { data, error } = await supabase
      .from("attendance")
      .select("*")
      .eq("employee_id", employee.id)
      .gte("date", format(start, "yyyy-MM-dd"))
      .lte("date", format(end, "yyyy-MM-dd"))
      .order("date", { ascending: false });

    setIsLoading(false);

    if (error) {
      console.error("Error fetching attendance:", error);
      return;
    }

    setAttendanceRecords(data || []);
  }, [employee, getDateRange]);

  useEffect(() => {
    if (employee) {
      fetchAttendance();
    }
  }, [employee, fetchAttendance, currentDate, viewMode]);

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

  // Get attendance for a specific date
  const getAttendanceForDate = (date: Date) => {
    return attendanceRecords.find(
      (record) => record.date === format(date, "yyyy-MM-dd")
    );
  };

  // Calculate stats
  const stats = {
    totalDays: attendanceRecords.length,
    presentDays: attendanceRecords.filter(r => r.status === "present").length,
    lateDays: attendanceRecords.filter(r => r.status === "late").length,
    missingCheckouts: attendanceRecords.filter(r => r.check_in && !r.check_out).length,
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ["Date", "Check In", "Check Out", "Status"];
    const rows = attendanceRecords.map(record => [
      format(new Date(record.date), "yyyy-MM-dd"),
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
    a.download = `attendance-${format(currentDate, "yyyy-MM")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Attendance exported successfully!");
  };

  // Handle check in/out
  const handleCheckIn = async () => {
    const { error } = await checkIn();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Checked in successfully!");
      fetchAttendance();
    }
  };

  const handleCheckOut = async () => {
    const { error } = await checkOut();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Checked out successfully!");
      fetchAttendance();
    }
  };

  const { start, end } = getDateRange();
  const days = eachDayOfInterval({ start, end });

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
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Attendance History</h1>
            <p className="text-muted-foreground mt-1">Track your daily attendance and work hours</p>
          </div>
          
          <Button onClick={exportToCSV} variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </motion.div>

      {/* Today's Check In/Out */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-elevated p-6 mb-8"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold mb-1">Today's Attendance</h2>
            <p className="text-sm text-muted-foreground">
              {format(new Date(), "EEEE, MMMM d, yyyy")}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              {attendanceStatus === "completed" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-emerald-500/10 text-emerald-600">
                  <CheckCircle className="w-4 h-4" />
                  Day Complete
                </span>
              )}
              {attendanceStatus === "checked-in" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary">
                  <Clock className="w-4 h-4" />
                  Working
                </span>
              )}
              {attendanceStatus === "not-checked-in" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-amber-500/10 text-amber-600">
                  <AlertCircle className="w-4 h-4" />
                  Not Checked In
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleCheckIn}
                disabled={attendanceStatus !== "not-checked-in"}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Clock className="w-4 h-4 mr-2" />
                Check In
              </Button>
              <Button
                onClick={handleCheckOut}
                disabled={attendanceStatus !== "checked-in"}
                variant="outline"
              >
                Check Out
              </Button>
            </div>
          </div>
        </div>

        {todayAttendance && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex gap-8">
              {todayAttendance.check_in && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Check In</p>
                  <p className="text-lg font-semibold">{format(new Date(todayAttendance.check_in), "h:mm a")}</p>
                </div>
              )}
              {todayAttendance.check_out && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Check Out</p>
                  <p className="text-lg font-semibold">{format(new Date(todayAttendance.check_out), "h:mm a")}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
      >
        <div className="card-subtle p-4">
          <p className="text-2xl font-bold text-primary">{stats.totalDays}</p>
          <p className="text-sm text-muted-foreground">Total Days</p>
        </div>
        <div className="card-subtle p-4">
          <p className="text-2xl font-bold text-emerald-600">{stats.presentDays}</p>
          <p className="text-sm text-muted-foreground">Present</p>
        </div>
        <div className="card-subtle p-4">
          <p className="text-2xl font-bold text-amber-600">{stats.lateDays}</p>
          <p className="text-sm text-muted-foreground">Late</p>
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
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6"
      >
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

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={viewMode} onValueChange={(v) => setViewMode(v as "week" | "month")}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Weekly</SelectItem>
              <SelectItem value="month">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Attendance Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="card-elevated overflow-hidden"
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Day</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Check In</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Check Out</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {days.map((day) => {
                  const attendance = getAttendanceForDate(day);
                  const isTodayDate = isToday(day);
                  const isWeekend = day.getDay() === 0 || day.getDay() === 6;

                  return (
                    <tr
                      key={day.toISOString()}
                      className={cn(
                        "border-b border-border/50 transition-colors",
                        isTodayDate && "bg-primary/5",
                        isWeekend && "bg-muted/20"
                      )}
                    >
                      <td className="py-3 px-4">
                        <span className={cn(
                          "font-medium",
                          isTodayDate && "text-primary"
                        )}>
                          {format(day, "MMM d, yyyy")}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {format(day, "EEEE")}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {attendance?.check_in ? (
                          format(new Date(attendance.check_in), "h:mm a")
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {attendance?.check_out ? (
                          format(new Date(attendance.check_out), "h:mm a")
                        ) : attendance?.check_in ? (
                          <span className="text-amber-600">Missing</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {attendance ? (
                          <span className={cn(
                            "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium",
                            attendance.status === "present" && "bg-emerald-500/10 text-emerald-600",
                            attendance.status === "late" && "bg-amber-500/10 text-amber-600",
                            !attendance.status && "bg-muted text-muted-foreground"
                          )}>
                            {attendance.status === "present" && <CheckCircle className="w-3 h-3" />}
                            {attendance.status === "late" && <Clock className="w-3 h-3" />}
                            {attendance.status || "Unknown"}
                          </span>
                        ) : isWeekend ? (
                          <span className="text-xs text-muted-foreground">Weekend</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </td>
                    </tr>
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
