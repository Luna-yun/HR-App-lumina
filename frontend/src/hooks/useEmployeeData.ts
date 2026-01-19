import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Database } from "@/integrations/supabase/types";

type Employee = Database["public"]["Tables"]["employees"]["Row"];
type Attendance = Database["public"]["Tables"]["attendance"]["Row"];
type LeaveRequest = Database["public"]["Tables"]["leave_requests"]["Row"];
type LeaveBalance = Database["public"]["Tables"]["leave_balances"]["Row"];
type LeaveType = Database["public"]["Tables"]["leave_types"]["Row"];
type Salary = Database["public"]["Tables"]["salaries"]["Row"];
type Notice = Database["public"]["Tables"]["notices"]["Row"];

interface EmployeeWithDetails extends Employee {
  department?: { id: string; name: string } | null;
  profile?: { full_name: string; email: string } | null;
}

interface LeaveRequestWithType extends LeaveRequest {
  leave_type?: { name: string } | null;
}

export function useEmployeeData() {
  const { user } = useAuth();
  const [employee, setEmployee] = useState<EmployeeWithDetails | null>(null);
  const [todayAttendance, setTodayAttendance] = useState<Attendance | null>(null);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequestWithType[]>([]);
  const [leaveBalances, setLeaveBalances] = useState<(LeaveBalance & { leave_type: LeaveType })[]>([]);
  const [currentSalary, setCurrentSalary] = useState<Salary | null>(null);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const today = new Date().toISOString().split('T')[0];

  // Fetch employee record
  const fetchEmployee = useCallback(async () => {
    if (!user) return null;

    const { data, error } = await supabase
      .from("employees")
      .select(`
        *,
        department:departments(id, name),
        profile:profiles(full_name, email)
      `)
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching employee:", error);
      return null;
    }

    return data as EmployeeWithDetails | null;
  }, [user]);

  // Fetch today's attendance
  const fetchTodayAttendance = useCallback(async (employeeId: string) => {
    const { data, error } = await supabase
      .from("attendance")
      .select("*")
      .eq("employee_id", employeeId)
      .eq("date", today)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching attendance:", error);
    }

    return data;
  }, [today]);

  // Fetch leave requests
  const fetchLeaveRequests = useCallback(async () => {
    if (!user) return [];

    const { data, error } = await supabase
      .from("leave_requests")
      .select(`
        *,
        leave_type:leave_types(name)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Error fetching leave requests:", error);
      return [];
    }

    return data as LeaveRequestWithType[];
  }, [user]);

  // Fetch leave balances
  const fetchLeaveBalances = useCallback(async (employeeId: string) => {
    const currentYear = new Date().getFullYear();

    const { data, error } = await supabase
      .from("leave_balances")
      .select(`
        *,
        leave_type:leave_types(*)
      `)
      .eq("employee_id", employeeId)
      .eq("year", currentYear);

    if (error) {
      console.error("Error fetching leave balances:", error);
      return [];
    }

    return data as (LeaveBalance & { leave_type: LeaveType })[];
  }, []);

  // Fetch current salary
  const fetchCurrentSalary = useCallback(async () => {
    if (!user) return null;

    const { data, error } = await supabase
      .from("salaries")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_current", true)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching salary:", error);
    }

    return data;
  }, [user]);

  // Fetch notices
  const fetchNotices = useCallback(async () => {
    const { data, error } = await supabase
      .from("notices")
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(5);

    if (error) {
      console.error("Error fetching notices:", error);
      return [];
    }

    return data;
  }, []);

  // Check in
  const checkIn = useCallback(async () => {
    if (!employee || !user) {
      return { error: new Error("Not authenticated or employee record not found") };
    }

    // Check if already checked in today
    if (todayAttendance?.check_in) {
      return { error: new Error("Already checked in today") };
    }

    const now = new Date().toISOString();
    const isLate = new Date().getHours() >= 9; // Simple late check (after 9 AM)

    if (todayAttendance) {
      // Update existing record
      const { data, error } = await supabase
        .from("attendance")
        .update({ 
          check_in: now,
          status: isLate ? 'late' : 'present'
        })
        .eq("id", todayAttendance.id)
        .select()
        .single();

      if (error) return { error };
      setTodayAttendance(data);
      return { data };
    } else {
      // Create new record
      const { data, error } = await supabase
        .from("attendance")
        .insert({
          employee_id: employee.id,
          user_id: user.id,
          date: today,
          check_in: now,
          status: isLate ? 'late' : 'present'
        })
        .select()
        .single();

      if (error) return { error };
      setTodayAttendance(data);
      return { data };
    }
  }, [employee, user, todayAttendance, today]);

  // Check out
  const checkOut = useCallback(async () => {
    if (!todayAttendance) {
      return { error: new Error("No attendance record found for today") };
    }

    if (!todayAttendance.check_in) {
      return { error: new Error("Please check in first") };
    }

    if (todayAttendance.check_out) {
      return { error: new Error("Already checked out today") };
    }

    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("attendance")
      .update({ check_out: now })
      .eq("id", todayAttendance.id)
      .select()
      .single();

    if (error) return { error };
    setTodayAttendance(data);
    return { data };
  }, [todayAttendance]);

  // Load all data
  useEffect(() => {
    async function loadData() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const emp = await fetchEmployee();
        setEmployee(emp);

        if (emp) {
          const [attendance, balances] = await Promise.all([
            fetchTodayAttendance(emp.id),
            fetchLeaveBalances(emp.id),
          ]);
          setTodayAttendance(attendance);
          setLeaveBalances(balances);
        }

        const [requests, salary, noticesData] = await Promise.all([
          fetchLeaveRequests(),
          fetchCurrentSalary(),
          fetchNotices(),
        ]);

        setLeaveRequests(requests);
        setCurrentSalary(salary);
        setNotices(noticesData);
      } catch (err) {
        console.error("Error loading employee data:", err);
        setError("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [user, fetchEmployee, fetchTodayAttendance, fetchLeaveRequests, fetchLeaveBalances, fetchCurrentSalary, fetchNotices]);

  // Calculate leave summary
  const leaveSummary = {
    pending: leaveRequests.filter(r => r.status === 'pending').length,
    approved: leaveRequests.filter(r => r.status === 'approved').length,
    rejected: leaveRequests.filter(r => r.status === 'rejected').length,
  };

  // Attendance status
  const attendanceStatus = todayAttendance?.check_in
    ? todayAttendance.check_out
      ? 'completed'
      : 'checked-in'
    : 'not-checked-in';

  return {
    employee,
    todayAttendance,
    attendanceStatus,
    leaveRequests,
    leaveBalances,
    leaveSummary,
    currentSalary,
    notices,
    isLoading,
    error,
    checkIn,
    checkOut,
  };
}
