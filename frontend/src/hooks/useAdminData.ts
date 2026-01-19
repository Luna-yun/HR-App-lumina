import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Database } from "@/integrations/supabase/types";

type Employee = Database["public"]["Tables"]["employees"]["Row"];
type Department = Database["public"]["Tables"]["departments"]["Row"];
type Attendance = Database["public"]["Tables"]["attendance"]["Row"];
type LeaveRequest = Database["public"]["Tables"]["leave_requests"]["Row"];
type Notice = Database["public"]["Tables"]["notices"]["Row"];

interface EmployeeWithDetails extends Employee {
  department?: { id: string; name: string } | null;
  profile?: { full_name: string; email: string; country: string } | null;
}

interface LeaveRequestWithDetails extends LeaveRequest {
  leave_type?: { name: string } | null;
  employee?: {
    profile?: { full_name: string } | null;
  } | null;
}

interface AttendanceWithEmployee extends Attendance {
  employee?: {
    profile?: { full_name: string } | null;
  } | null;
}

interface DepartmentStats extends Department {
  employee_count: number;
}

export function useAdminData() {
  const { user, userRole } = useAuth();
  const [employees, setEmployees] = useState<EmployeeWithDetails[]>([]);
  const [departments, setDepartments] = useState<DepartmentStats[]>([]);
  const [pendingLeaveRequests, setPendingLeaveRequests] = useState<LeaveRequestWithDetails[]>([]);
  const [todayAttendance, setTodayAttendance] = useState<AttendanceWithEmployee[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const today = new Date().toISOString().split('T')[0];

  // Fetch all employees
  const fetchEmployees = useCallback(async () => {
    const { data, error } = await supabase
      .from("employees")
      .select(`
        *,
        department:departments(id, name),
        profile:profiles(full_name, email, country)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching employees:", error);
      return [];
    }

    return data as EmployeeWithDetails[];
  }, []);

  // Fetch departments with employee count
  const fetchDepartments = useCallback(async () => {
    const { data: depts, error: deptError } = await supabase
      .from("departments")
      .select("*")
      .order("name");

    if (deptError) {
      console.error("Error fetching departments:", deptError);
      return [];
    }

    // Get employee counts per department
    const { data: empCounts, error: countError } = await supabase
      .from("employees")
      .select("department_id");

    if (countError) {
      console.error("Error fetching employee counts:", countError);
      return depts.map(d => ({ ...d, employee_count: 0 }));
    }

    const countMap = empCounts.reduce((acc, emp) => {
      if (emp.department_id) {
        acc[emp.department_id] = (acc[emp.department_id] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return depts.map(d => ({
      ...d,
      employee_count: countMap[d.id] || 0,
    }));
  }, []);

  // Fetch pending leave requests
  const fetchPendingLeaveRequests = useCallback(async () => {
    const { data, error } = await supabase
      .from("leave_requests")
      .select(`
        *,
        leave_type:leave_types(name),
        employee:employees(
          profile:profiles(full_name)
        )
      `)
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching leave requests:", error);
      return [];
    }

    return data as LeaveRequestWithDetails[];
  }, []);

  // Fetch today's attendance
  const fetchTodayAttendance = useCallback(async () => {
    const { data, error } = await supabase
      .from("attendance")
      .select(`
        *,
        employee:employees(
          profile:profiles(full_name)
        )
      `)
      .eq("date", today)
      .order("check_in", { ascending: false });

    if (error) {
      console.error("Error fetching attendance:", error);
      return [];
    }

    return data as AttendanceWithEmployee[];
  }, [today]);

  // Fetch all notices (including unpublished for admin)
  const fetchNotices = useCallback(async () => {
    const { data, error } = await supabase
      .from("notices")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Error fetching notices:", error);
      return [];
    }

    return data;
  }, []);

  // Approve leave request
  const approveLeaveRequest = useCallback(async (requestId: string) => {
    if (!user) return { error: new Error("Not authenticated") };

    const { error } = await supabase
      .from("leave_requests")
      .update({
        status: "approved",
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", requestId);

    if (error) return { error };

    // Refresh leave requests
    const updated = await fetchPendingLeaveRequests();
    setPendingLeaveRequests(updated);

    return { error: null };
  }, [user, fetchPendingLeaveRequests]);

  // Reject leave request
  const rejectLeaveRequest = useCallback(async (requestId: string, reason?: string) => {
    if (!user) return { error: new Error("Not authenticated") };

    const { error } = await supabase
      .from("leave_requests")
      .update({
        status: "rejected",
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
        rejection_reason: reason || null,
      })
      .eq("id", requestId);

    if (error) return { error };

    // Refresh leave requests
    const updated = await fetchPendingLeaveRequests();
    setPendingLeaveRequests(updated);

    return { error: null };
  }, [user, fetchPendingLeaveRequests]);

  // Create notice
  const createNotice = useCallback(async (title: string, content: string, priority: string = 'normal') => {
    if (!user) return { error: new Error("Not authenticated") };

    const { data, error } = await supabase
      .from("notices")
      .insert({
        title,
        content,
        priority,
        created_by: user.id,
        is_published: true,
        published_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) return { error, data: null };

    // Refresh notices
    const updated = await fetchNotices();
    setNotices(updated);

    return { error: null, data };
  }, [user, fetchNotices]);

  // Create department
  const createDepartment = useCallback(async (name: string, description?: string) => {
    if (!user) return { error: new Error("Not authenticated") };

    const { data, error } = await supabase
      .from("departments")
      .insert({
        name,
        description,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) return { error, data: null };

    // Refresh departments
    const updated = await fetchDepartments();
    setDepartments(updated);

    return { error: null, data };
  }, [user, fetchDepartments]);

  // Load all data
  useEffect(() => {
    async function loadData() {
      if (!user || userRole !== 'admin') {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const [emps, depts, leaves, attendance, noticesData] = await Promise.all([
          fetchEmployees(),
          fetchDepartments(),
          fetchPendingLeaveRequests(),
          fetchTodayAttendance(),
          fetchNotices(),
        ]);

        setEmployees(emps);
        setDepartments(depts);
        setPendingLeaveRequests(leaves);
        setTodayAttendance(attendance);
        setNotices(noticesData);
      } catch (err) {
        console.error("Error loading admin data:", err);
        setError("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [user, userRole, fetchEmployees, fetchDepartments, fetchPendingLeaveRequests, fetchTodayAttendance, fetchNotices]);

  // Calculate stats
  const stats = {
    totalEmployees: employees.length,
    activeEmployees: employees.filter(e => e.employment_status === 'active').length,
    presentToday: todayAttendance.filter(a => a.check_in).length,
    onLeave: employees.filter(e => e.employment_status === 'on-leave').length,
    pendingLeaveCount: pendingLeaveRequests.length,
    departmentCount: departments.length,
    employeesWithoutDepartment: employees.filter(e => !e.department_id).length,
    missingCheckouts: todayAttendance.filter(a => a.check_in && !a.check_out).length,
  };

  return {
    employees,
    departments,
    pendingLeaveRequests,
    todayAttendance,
    notices,
    stats,
    isLoading,
    error,
    approveLeaveRequest,
    rejectLeaveRequest,
    createNotice,
    createDepartment,
  };
}
