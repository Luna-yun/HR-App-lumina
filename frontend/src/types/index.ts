// User and Authentication Types
export interface User {
  id: string;
  email: string;
  role: 'Admin' | 'Employee';
  company_id: string;
  company_name: string;
  country: string;
  full_name: string;
  department: string;
  job_title: string;
  phone: string;
  is_verified: boolean;
  is_approved: boolean;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  full_name: string;
  company_name: string;
  country: string;
  role: 'Admin' | 'Employee';
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Company {
  id: string;
  name: string;
  country: string;
}

// Attendance Types
export interface AttendanceStatus {
  status: 'not_checked_in' | 'checked_in' | 'completed';
  check_in_time: string | null;
  check_out_time: string | null;
  can_check_in: boolean;
  can_check_out: boolean;
}

export interface AttendanceRecord {
  id: string;
  employee_id: string;
  employee_name?: string;
  employee_email?: string;
  date: string;
  check_in_time: string | null;
  check_out_time: string | null;
  status: string;
  notes: string;
}

// Leave Types
export interface LeaveRequest {
  id: string;
  employee_id: string;
  employee_name: string;
  employee_email: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by: string | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
  created_at: string;
}

export interface LeaveSummary {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}

// Salary Types
export interface SalaryRecord {
  id: string;
  employee_id: string;
  employee_name: string;
  employee_email: string;
  month: number;
  year: number;
  gross_salary: number;
  deductions: number;
  net_salary: number;
  currency: string;
  payment_date: string | null;
  notes: string;
  created_at: string;
}

export interface MySalary {
  month: number;
  year: number;
  gross_salary: number;
  deductions: number;
  net_salary: number;
  currency: string;
  payment_date: string | null;
}

// Notice Types
export interface Notice {
  id: string;
  title: string;
  content: string;
  publisher_name: string;
  is_active: boolean;
  created_at: string;
}

// Department Types
export interface Department {
  id: string;
  name: string;
  description: string;
  employee_count: number;
  created_at: string;
}

// Employee Types
export interface Employee {
  id: string;
  email: string;
  full_name: string;
  role: string;
  department: string;
  job_title: string;
  is_active: boolean;
  is_approved: boolean;
  created_at: string;
}

export interface PendingEmployee {
  id: string;
  email: string;
  full_name: string;
  company_name: string;
  created_at: string;
}

// Recruitment Types
export interface JobPosting {
  id: string;
  title: string;
  department: string;
  description: string;
  requirements: string;
  salary_range: string;
  location: string;
  employment_type: string;
  status: 'open' | 'closed' | 'on_hold';
  applicant_count: number;
  created_at: string;
}

export interface Applicant {
  id: string;
  job_posting_id: string;
  job_title: string;
  name: string;
  email: string;
  phone: string;
  status: 'new' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
  notes: string;
  interview_date: string | null;
  created_at: string;
}

// AI Chat Types
export interface KnowledgeDocument {
  id: string;
  filename: string;
  file_type: string;
  file_size: number;
  chunk_count: number;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources: string[];
  created_at: string;
}

export interface ChatResponse {
  response: string;
  sources: { name: string; relevance: number }[];
  session_id: string;
  reasoning: string;
}

// Dashboard Stats Types
export interface AdminStats {
  total_employees: number;
  active_employees: number;
  pending_approvals: number;
  admin_count: number;
  employee_count: number;
  checked_in_today: number;
  pending_leaves: number;
  attendance_rate: number;
  new_hires_this_month: number;
  departments: { name: string; count: number }[];
}

export interface AttendanceStats {
  total_employees: number;
  checked_in: number;
  completed: number;
  not_checked_in: number;
  attendance_rate: number;
}

export interface RecruitmentStats {
  total_jobs: number;
  open_jobs: number;
  closed_jobs: number;
  total_applicants: number;
  new_applicants: number;
  in_interview: number;
  hired: number;
}

// ASEAN Countries (includes Timor-Leste as observer)
export const ASEAN_COUNTRIES = [
  'Brunei',
  'Cambodia',
  'Indonesia',
  'Laos',
  'Malaysia',
  'Myanmar',
  'Philippines',
  'Singapore',
  'Thailand',
  'Timor-Leste',
  'Vietnam'
] as const;

export type ASEANCountry = typeof ASEAN_COUNTRIES[number];
