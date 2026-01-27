import axios from 'axios';
import type {
  LoginRequest,
  SignUpRequest,
  AuthResponse,
  User,
  Company,
  AttendanceStatus,
  AttendanceRecord,
  LeaveRequest,
  LeaveSummary,
  SalaryRecord,
  MySalary,
  Notice,
  Department,
  Employee,
  PendingEmployee,
  JobPosting,
  Applicant,
  KnowledgeDocument,
  ChatMessage,
  ChatResponse,
  AdminStats,
  AttendanceStats,
  RecruitmentStats,
} from '@/types';

const API_URL = import.meta.env.VITE_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL || '';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================
// Authentication APIs
// ==================

export const authAPI = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  signup: async (data: SignUpRequest): Promise<{ message: string; email: string; requires_approval: boolean }> => {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },

  getMe: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  changePassword: async (data: { current_password: string; new_password: string }): Promise<{ message: string }> => {
    const response = await api.post('/auth/change-password', data);
    return response.data;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },

  getCompanies: async (): Promise<Company[]> => {
    const response = await api.get('/companies');
    return response.data;
  },
};

// ==================
// Attendance APIs
// ==================

export const attendanceAPI = {
  checkIn: async (): Promise<{ message: string; check_in_time: string; status: string }> => {
    const response = await api.post('/attendance/check-in');
    return response.data;
  },

  checkOut: async (): Promise<{ message: string; check_out_time: string; status: string }> => {
    const response = await api.post('/attendance/check-out');
    return response.data;
  },

  getMyStatus: async (): Promise<AttendanceStatus> => {
    const response = await api.get('/attendance/my-status');
    return response.data;
  },

  getMyHistory: async (limit = 30): Promise<AttendanceRecord[]> => {
    const response = await api.get(`/attendance/my-history?limit=${limit}`);
    return response.data;
  },

  // Admin only
  getCompanyAttendance: async (date?: string, employeeId?: string): Promise<{ records: AttendanceRecord[]; total: number }> => {
    const params = new URLSearchParams();
    if (date) params.append('date_filter', date);
    if (employeeId) params.append('employee_id', employeeId);
    const response = await api.get(`/admin/attendance?${params.toString()}`);
    return response.data;
  },

  getAttendanceStats: async (): Promise<AttendanceStats> => {
    const response = await api.get('/admin/attendance/stats');
    return response.data;
  },
};

// ==================
// Leave APIs
// ==================

export const leaveAPI = {
  createRequest: async (data: { start_date: string; end_date: string; reason: string }): Promise<{ message: string; request_id: string }> => {
    const response = await api.post('/leave/request', data);
    return response.data;
  },

  getMyRequests: async (): Promise<LeaveRequest[]> => {
    const response = await api.get('/leave/my-requests');
    return response.data;
  },

  getMySummary: async (): Promise<LeaveSummary> => {
    const response = await api.get('/leave/my-summary');
    return response.data;
  },

  // Admin only
  getPendingRequests: async (): Promise<LeaveRequest[]> => {
    const response = await api.get('/admin/leave/pending');
    return response.data;
  },

  getAllRequests: async (status?: string): Promise<LeaveRequest[]> => {
    const params = status ? `?status_filter=${status}` : '';
    const response = await api.get(`/admin/leave/all${params}`);
    return response.data;
  },

  approveRequest: async (requestId: string): Promise<{ message: string }> => {
    const response = await api.post(`/admin/leave/approve/${requestId}`);
    return response.data;
  },

  rejectRequest: async (requestId: string, reason?: string): Promise<{ message: string }> => {
    const response = await api.post(`/admin/leave/reject/${requestId}`, { rejection_reason: reason });
    return response.data;
  },
};

// ==================
// Salary APIs
// ==================

export const salaryAPI = {
  getMySalary: async (): Promise<{ has_salary: boolean; salary: MySalary | null }> => {
    const response = await api.get('/salary/mine');
    return response.data;
  },

  getMyHistory: async (limit = 12): Promise<{ records: MySalary[]; total: number }> => {
    const response = await api.get(`/salary/my-history?limit=${limit}`);
    return response.data;
  },

  // Admin only
  createSalary: async (data: {
    employee_id: string;
    month: number;
    year: number;
    gross_salary: number;
    deductions: number;
    currency: string;
    notes?: string;
  }): Promise<SalaryRecord> => {
    const response = await api.post('/admin/salary', data);
    return response.data;
  },

  getCompanySalaries: async (params?: { employee_id?: string; month?: number; year?: number }): Promise<SalaryRecord[]> => {
    const queryParams = new URLSearchParams();
    if (params?.employee_id) queryParams.append('employee_id', params.employee_id);
    if (params?.month) queryParams.append('month', params.month.toString());
    if (params?.year) queryParams.append('year', params.year.toString());
    const response = await api.get(`/admin/salaries?${queryParams.toString()}`);
    return response.data;
  },

  deleteSalary: async (salaryId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/admin/salary/${salaryId}`);
    return response.data;
  },
};

// ==================
// Notice APIs
// ==================

export const noticeAPI = {
  getNotices: async (limit = 50): Promise<Notice[]> => {
    const response = await api.get(`/notices?limit=${limit}`);
    return response.data;
  },

  // Admin only
  createNotice: async (data: { title: string; content: string }): Promise<Notice> => {
    const response = await api.post('/admin/notices', data);
    return response.data;
  },

  updateNotice: async (noticeId: string, data: { title: string; content: string }): Promise<Notice> => {
    const response = await api.put(`/admin/notices/${noticeId}`, data);
    return response.data;
  },

  deleteNotice: async (noticeId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/admin/notices/${noticeId}`);
    return response.data;
  },

  getAllNotices: async (includeInactive = false): Promise<Notice[]> => {
    const response = await api.get(`/admin/notices/all?include_inactive=${includeInactive}`);
    return response.data;
  },
};

// ==================
// Department APIs
// ==================

export const departmentAPI = {
  getDepartments: async (): Promise<Department[]> => {
    const response = await api.get('/departments');
    return response.data;
  },

  // Admin only
  createDepartment: async (data: { name: string; description?: string }): Promise<Department> => {
    const response = await api.post('/admin/departments', data);
    return response.data;
  },

  updateDepartment: async (departmentId: string, data: { name: string; description?: string }): Promise<Department> => {
    const response = await api.put(`/admin/departments/${departmentId}`, data);
    return response.data;
  },

  deleteDepartment: async (departmentId: string, reassignTo = 'Unassigned'): Promise<{ message: string }> => {
    const response = await api.delete(`/admin/departments/${departmentId}?reassign_to=${reassignTo}`);
    return response.data;
  },

  getDepartmentEmployees: async (departmentId: string): Promise<{ employees: Employee[]; total: number }> => {
    const response = await api.get(`/admin/departments/${departmentId}/employees`);
    return response.data;
  },
};

// ==================
// Employee APIs (Admin)
// ==================

export const employeeAPI = {
  getEmployees: async (): Promise<Employee[]> => {
    const response = await api.get('/admin/employees');
    return response.data;
  },

  updateEmployee: async (employeeId: string, data: Partial<Employee>): Promise<Employee> => {
    const response = await api.put(`/admin/employees/${employeeId}`, data);
    return response.data;
  },

  deleteEmployee: async (employeeId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/admin/employees/${employeeId}`);
    return response.data;
  },

  getPendingEmployees: async (): Promise<PendingEmployee[]> => {
    const response = await api.get('/admin/pending-employees');
    return response.data;
  },

  approveEmployee: async (employeeId: string): Promise<{ message: string }> => {
    const response = await api.post(`/admin/approve-employee/${employeeId}`);
    return response.data;
  },

  rejectEmployee: async (employeeId: string): Promise<{ message: string }> => {
    const response = await api.post(`/admin/reject-employee/${employeeId}`);
    return response.data;
  },

  getStats: async (): Promise<AdminStats> => {
    const response = await api.get('/admin/stats');
    return response.data;
  },
};

// ==================
// Recruitment APIs
// ==================

export const recruitmentAPI = {
  getJobs: async (status?: string): Promise<JobPosting[]> => {
    const params = status ? `?status_filter=${status}` : '';
    const response = await api.get(`/admin/jobs${params}`);
    return response.data;
  },

  createJob: async (data: Omit<JobPosting, 'id' | 'status' | 'applicant_count' | 'created_at'>): Promise<JobPosting> => {
    const response = await api.post('/admin/jobs', data);
    return response.data;
  },

  updateJob: async (jobId: string, data: Partial<JobPosting>): Promise<JobPosting> => {
    const response = await api.put(`/admin/jobs/${jobId}`, data);
    return response.data;
  },

  updateJobStatus: async (jobId: string, status: string): Promise<{ message: string }> => {
    const response = await api.put(`/admin/jobs/${jobId}/status`, { status });
    return response.data;
  },

  deleteJob: async (jobId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/admin/jobs/${jobId}`);
    return response.data;
  },

  getApplicants: async (jobId: string, status?: string): Promise<Applicant[]> => {
    const params = status ? `?status_filter=${status}` : '';
    const response = await api.get(`/admin/jobs/${jobId}/applicants${params}`);
    return response.data;
  },

  addApplicant: async (jobId: string, data: { name: string; email: string; phone?: string; cover_letter?: string }): Promise<{ applicant_id: string }> => {
    const response = await api.post(`/admin/jobs/${jobId}/applicants`, data);
    return response.data;
  },

  updateApplicantStatus: async (applicantId: string, status: string, notes?: string, interviewDate?: string): Promise<{ message: string }> => {
    const params = new URLSearchParams({ new_status: status });
    if (notes) params.append('notes', notes);
    if (interviewDate) params.append('interview_date', interviewDate);
    const response = await api.put(`/admin/applicants/${applicantId}/status?${params.toString()}`);
    return response.data;
  },

  deleteApplicant: async (applicantId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/admin/applicants/${applicantId}`);
    return response.data;
  },

  getStats: async (): Promise<RecruitmentStats> => {
    const response = await api.get('/admin/recruitment/stats');
    return response.data;
  },
};

// ==================
// AI Chat APIs
// ==================

export const chatAPI = {
  uploadDocument: async (file: File): Promise<{ document_id: string; filename: string; chunks_created: number; duplicate: boolean }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/admin/chat/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getDocuments: async (): Promise<{ documents: KnowledgeDocument[]; total: number }> => {
    const response = await api.get('/admin/chat/documents');
    return response.data;
  },

  deleteDocument: async (documentId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/admin/chat/documents/${documentId}`);
    return response.data;
  },

  sendMessage: async (message: string, sessionId?: string): Promise<ChatResponse> => {
    const response = await api.post('/admin/chat', { message, session_id: sessionId });
    return response.data;
  },

  getHistory: async (sessionId?: string, limit = 50): Promise<{ messages: ChatMessage[]; total: number }> => {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (sessionId) params.append('session_id', sessionId);
    const response = await api.get(`/admin/chat/history?${params.toString()}`);
    return response.data;
  },

  clearHistory: async (sessionId?: string): Promise<{ deleted_count: number }> => {
    const params = sessionId ? `?session_id=${sessionId}` : '';
    const response = await api.delete(`/admin/chat/history${params}`);
    return response.data;
  },
};

// Notification API
export const notificationAPI = {
  getNotifications: async (limit = 20, offset = 0, unreadOnly = false): Promise<{
    notifications: Array<{
      id: string;
      title: string;
      message: string;
      type: string;
      is_read: boolean;
      created_at: string;
      link?: string;
    }>;
    unread_count: number;
    total: number;
  }> => {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
      unread_only: unreadOnly.toString()
    });
    const response = await api.get(`/notifications?${params.toString()}`);
    return response.data;
  },

  createNotification: async (data: {
    title: string;
    message: string;
    type?: string;
    target_user_id?: string;
    link?: string;
  }): Promise<{
    id: string;
    title: string;
    message: string;
    type: string;
    is_read: boolean;
    created_at: string;
  }> => {
    const response = await api.post('/notifications', data);
    return response.data;
  },

  markAsRead: async (notificationId: string): Promise<{ message: string }> => {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  markAllAsRead: async (): Promise<{ message: string }> => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  },

  deleteNotification: async (notificationId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  },
};

// ==================
// Task APIs
// ==================

export const taskAPI = {
  // Admin
  createTask: async (data: {
    title: string;
    description?: string;
    assigned_to: string;
    due_date?: string;
    priority?: string;
    category?: string;
  }): Promise<{ id: string; message: string }> => {
    const response = await api.post('/admin/tasks', data);
    return response.data;
  },

  getAllTasks: async (employeeId?: string, status?: string): Promise<{
    tasks: Array<{
      id: string;
      title: string;
      description: string;
      assigned_to: string;
      assigned_to_name: string;
      assigned_by: string;
      assigned_by_name: string;
      status: string;
      priority: string;
      category: string;
      due_date?: string;
      completed_at?: string;
      created_at: string;
    }>;
    total: number;
  }> => {
    const params = new URLSearchParams();
    if (employeeId) params.append('employee_id', employeeId);
    if (status) params.append('status_filter', status);
    const response = await api.get(`/admin/tasks?${params.toString()}`);
    return response.data;
  },

  deleteTask: async (taskId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/admin/tasks/${taskId}`);
    return response.data;
  },

  // Employee
  getMyTasks: async (status?: string): Promise<{
    tasks: Array<{
      id: string;
      title: string;
      description: string;
      assigned_to: string;
      assigned_to_name: string;
      assigned_by: string;
      assigned_by_name: string;
      status: string;
      priority: string;
      category: string;
      due_date?: string;
      completed_at?: string;
      created_at: string;
    }>;
    total: number;
  }> => {
    const params = status ? `?status_filter=${status}` : '';
    const response = await api.get(`/tasks/my${params}`);
    return response.data;
  },

  updateTask: async (taskId: string, data: {
    title?: string;
    description?: string;
    status?: string;
    priority?: string;
    due_date?: string;
  }): Promise<{ message: string }> => {
    const response = await api.put(`/tasks/${taskId}`, data);
    return response.data;
  },
};

// ==================
// Performance APIs
// ==================

export const performanceAPI = {
  // Admin
  createReview: async (data: {
    employee_id: string;
    review_period: string;
    goals_achieved: number;
    quality_score: number;
    productivity_score: number;
    teamwork_score: number;
    communication_score: number;
    feedback?: string;
    strengths?: string;
    areas_for_improvement?: string;
    goals_for_next_period?: string;
  }): Promise<{ id: string; message: string }> => {
    const response = await api.post('/admin/performance-reviews', data);
    return response.data;
  },

  getAllReviews: async (employeeId?: string): Promise<{
    reviews: Array<{
      id: string;
      employee_id: string;
      employee_name: string;
      reviewer_id: string;
      reviewer_name: string;
      review_period: string;
      goals_achieved: number;
      quality_score: number;
      productivity_score: number;
      teamwork_score: number;
      communication_score: number;
      overall_score: number;
      feedback: string;
      strengths: string;
      areas_for_improvement: string;
      goals_for_next_period: string;
      created_at: string;
    }>;
    total: number;
  }> => {
    const params = employeeId ? `?employee_id=${employeeId}` : '';
    const response = await api.get(`/admin/performance-reviews${params}`);
    return response.data;
  },

  getAnalytics: async (): Promise<{
    reviews: {
      total: number;
      avg_overall_score: number;
      avg_goals_achieved: number;
      score_distribution: {
        excellent: number;
        good: number;
        average: number;
        needs_improvement: number;
      };
    };
    tasks: {
      total: number;
      completed: number;
      pending: number;
      in_progress: number;
      completion_rate: number;
    };
    top_performers: Array<{
      id: string;
      name: string;
      avg_score: number;
    }>;
  }> => {
    const response = await api.get('/admin/analytics/performance');
    return response.data;
  },

  // Employee
  getMyReviews: async (): Promise<{
    reviews: Array<{
      id: string;
      employee_id: string;
      employee_name: string;
      reviewer_id: string;
      reviewer_name: string;
      review_period: string;
      goals_achieved: number;
      quality_score: number;
      productivity_score: number;
      teamwork_score: number;
      communication_score: number;
      overall_score: number;
      feedback: string;
      strengths: string;
      areas_for_improvement: string;
      goals_for_next_period: string;
      created_at: string;
    }>;
    total: number;
  }> => {
    const response = await api.get('/performance-reviews/my');
    return response.data;
  },
};

// ==================
// Termination & Bulk Import APIs
// ==================

export const employeeManagementAPI = {
  terminateEmployee: async (employeeId: string, data: {
    reason: string;
    notes?: string;
    effective_date?: string;
  }): Promise<{ message: string; effective_date: string }> => {
    const response = await api.post(`/admin/employees/${employeeId}/terminate`, data);
    return response.data;
  },

  getTerminationReasons: async (): Promise<{ reasons: string[] }> => {
    const response = await api.get('/admin/termination-reasons');
    return response.data;
  },

  getTerminationHistory: async (): Promise<{
    terminations: Array<{
      employee_name: string;
      employee_email: string;
      reason: string;
      notes: string;
      effective_date: string;
      terminated_at: string;
    }>;
    total: number;
  }> => {
    const response = await api.get('/admin/terminations');
    return response.data;
  },

  bulkImportEmployees: async (employees: Array<{
    full_name: string;
    email: string;
    department?: string;
    job_title?: string;
    role?: string;
  }>): Promise<{
    message: string;
    created: Array<{ email: string; full_name: string; temp_password: string }>;
    skipped: Array<{ email: string; reason: string }>;
  }> => {
    const response = await api.post('/admin/employees/bulk-import', { employees });
    return response.data;
  },

  assignDepartment: async (employeeId: string, department: string): Promise<{ message: string }> => {
    const response = await api.put(`/admin/employees/${employeeId}/department?department=${encodeURIComponent(department)}`);
    return response.data;
  },
};

export default api;
