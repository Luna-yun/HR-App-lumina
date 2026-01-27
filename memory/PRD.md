# LuminaHR - Product Requirements Document

## Original Problem Statement
Build a comprehensive HR management application by merging functionalities and designs from two GitHub repositories:
1. `Luna-yun/HR-App-lumina` - Backend logic and landing page aesthetics
2. `DavidMacha/lumina` - Premium dashboard UI
3. `phoenixcoded/able-pro-free-admin-dashboard-template` - Auth page design reference

## Core Requirements

### ✅ Completed Features

#### Employee Task & Performance Management UI (Jan 27, 2026)
- [x] **Employee Tasks Page** - Dedicated `/employee/tasks` page showing assigned tasks
- [x] **Task Status Updates** - Employees can update task status (Pending → In Progress → Completed) with notes
- [x] **Employee Performance Reviews** - New `/employee/performance` page for employees to view their reviews
- [x] **Review Detail Dialog** - Click on any review to see full feedback, scores, strengths, and improvement areas
- [x] **Sidebar Navigation** - Added "My Tasks" and "Performance" links to employee sidebar
- [x] **Notification Bell** - Bell icon in header now redirects to notices page (/admin/notices or /employee/notices)
- [x] **Real Analytics** - Admin analytics dashboard shows actual calculated data:
  - Task completion rate (from real task statuses)
  - Average goals achieved (calculated from reviews)
  - Average review scores (calculated from reviews)
  - Pending tasks count
- [x] **Country-Based Timezone** - Dashboard time displays based on company's ASEAN/Timor-Leste country timezone instead of user device time

#### RAG System Overhaul & UI Enhancements (Jan 25, 2026)
- [x] **Fixed Embedding System** - Replaced failing OpenAI API calls with local `sentence-transformers/all-MiniLM-L6-v2` model
- [x] **Embedding Dimension** - Standardized to 384 dimensions (local model)
- [x] **Groq LLM Integration** - LLaMA 3.1 8B for response generation (unchanged)
- [x] **Processing Progress Dialogs** - Added detailed step-by-step progress indicators for:
  - Document upload: Uploading → Extracting → Chunking → Embedding → Storing → Complete
  - Chat queries: Analyzing → Embedding → Searching → Retrieving → Reasoning → Generating
- [x] **Document Deletion UI** - Delete button on each document with confirmation dialog
- [x] **Timor-Leste Added** - Added to ASEAN countries dropdown in signup form
- [x] **Technical Documentation** - Created:
  - `/app/backend/researchReport.md` - IEEE-style research paper on RAG system
  - `/app/backend/architecture.md` - Comprehensive system architecture documentation

#### Performance & Task Management System (Jan 24, 2026)
- [x] **Backend**: Created `performance_routes.py` with full CRUD for tasks and performance reviews
- [x] **Task Assignment**: Admins can assign tasks to employees with priority, due date, category
- [x] **Performance Reviews**: Admins can create reviews with scores (quality, productivity, teamwork, communication)
- [x] **Analytics Endpoint**: `/api/admin/analytics/performance` returns task/review stats and top performers
- [x] **Employee Tasks**: Employees can view and update status of their assigned tasks
- [x] **Notifications**: Tasks and reviews trigger automatic notifications to employees

#### Employee Management Features (Jan 24, 2026)
- [x] **Employee Termination**: Terminate employees with reason dropdown and notes
- [x] **Termination Reasons**: Configurable list (Voluntary Resignation, Performance Issues, etc.)
- [x] **Department Assignment**: Assign employees to departments from the employee list
- [x] **Bulk Import**: Import multiple employees via CSV format (name, email, department, job_title)

#### AI Chat RAG System Fix (Jan 20, 2026 - Updated Jan 25, 2026)
- [x] **Fixed Embedding System** - Uses local `sentence-transformers/all-MiniLM-L6-v2` model (384 dimensions)
- [x] **Fixed Qdrant API** - Updated from deprecated `.search()` to `.query_points()` method
- [x] **RAG Now Working** - Documents are properly indexed and retrieved based on semantic similarity
- [x] **Document Upload/Delete** - Both working correctly with proper vector storage management
- [x] **Chat History** - Session-based chat history preserved across messages
- [x] **Note**: Documents uploaded with old embeddings (1536 dim) need to be re-uploaded to work with new model (384 dim)

#### Premium Dialog System & WYSIWYG Editor (Jan 20, 2026)
- [x] **Fixed Dialog Alignment** - All pop-up dialogs now properly centered using flexbox approach (`flex items-center justify-center`)
- [x] **Root Cause**: Previous transform-based centering (`translate-x-[-50%]`) was being overridden by Tailwind CSS animations
- [x] **Premium Dialog Styling** - Gradient accent, backdrop blur, close button with rotation animation, responsive design
- [x] **WYSIWYG Rich Text Editor** - TipTap-based editor for notices with:
  - Bold, Italic, Underline, Strikethrough formatting
  - Text alignment (Left, Center, Right)
  - Bullet and numbered lists
  - Undo/Redo functionality
  - Character count
  - Mobile-responsive toolbar
- [x] **Updated Dialog Pages**: AdminNotices, AdminDepartments, AdminPayroll, EmployeeLeave, AdminRecruitment

#### Blank Screen Bug Fix (Jan 20, 2026)
- [x] **Fixed Backend Crash** - Resolved `notification_routes.py` import error (`UserInDB` class did not exist)
- [x] **Dashboard Now Renders** - Admin and Employee dashboards fully functional after login
- [x] **Root Cause**: Backend was crashing on startup, preventing API calls from frontend

#### Landing Page (100% Complete - Jan 20, 2026)
- [x] **Header** - Sticky navigation with smooth scroll, ThemeSwitcher, mobile menu
- [x] **Hero Section** - Animated headline, CTAs, parallax background with peaceful landscape
- [x] **Features Section** - 8 feature cards with icons, hover animations, link to feature pages
- [x] **Employee Info Section** - Interactive accordion with customize image
- [x] **Settings & Operations Section** - Dark theme, parallax scroll, settings/operations preview
- [x] **Testimonials Section** - Carousel with star ratings, auto-rotate
- [x] **FAQ Section** - Dark theme accordion, smooth animations
- [x] **Final CTA Section** - Sign up prompt
- [x] **Contact Form** - Form with validation, success state
- [x] **Premium Footer** - Newsletter, social links, sitemap columns, contact info

#### Feature Pages (100% Complete - Jan 20, 2026)
- [x] **ASEAN Labour Policies** - Countries grid, capabilities, CTA
- [x] **Team Page** - Member cards with contact toggle, bio sections
- [x] **Employee Management** - Feature overview (placeholder)
- [x] **Leave & Attendance** - Feature overview (placeholder)
- [x] **Performance Reviews** - Feature overview (placeholder)
- [x] **Document Management** - Feature overview (placeholder)
- [x] **Time Tracking** - Feature overview (placeholder)
- [x] **HR Administration** - Feature overview (placeholder)
- [x] **Workflow Automation** - Feature overview (placeholder)

#### Authentication (100% Complete)
- [x] **Login Page** - Email/Password only, styled with Able Pro reference
- [x] **Signup Page** - Full Name, Email, Country, Password, Company, Role
- [x] Email verification **REMOVED** (per user request)

#### Backend API (100% Complete)
- [x] FastAPI server with MongoDB
- [x] Authentication with JWT tokens
- [x] Attendance, Leave, Salary, Notice, Department endpoints
- [x] Recruitment endpoints
- [x] AI Chat with Groq + Qdrant RAG

#### Theme System (100% Complete)
- [x] ThemeSwitcher component with 5 color themes
- [x] 5 typography options
- [x] Smooth CSS variable transitions

#### Documentation (100% Complete - Jan 20, 2026)
- [x] Root README.md with business pitch
- [x] Frontend README.md with local testing and Vercel deployment guide
- [x] Backend README.md with local testing and deployment guide

### 🔄 In Progress / Pending

#### Admin Dashboard (P1) - Most features complete
- [x] AdminDashboard - Analytics overview - COMPLETE
- [x] AdminEmployees - Employee management CRUD - COMPLETE
- [x] AdminDepartments - Department management - COMPLETE
- [x] AdminLeaves - Leave approval workflow - COMPLETE
- [x] AdminAttendance - Attendance monitoring - COMPLETE
- [ ] AdminPayroll - Salary management (hidden)
- [x] AdminNotices - Company announcements - COMPLETE
- [x] AdminRecruitment - Job postings & candidates - COMPLETE
- [x] AdminAnalytics - Workforce insights with real data - COMPLETE
- [x] AdminAIChat - AI assistant with RAG - COMPLETE
- [ ] AdminProfile - Admin profile management

#### Employee Dashboard (P1) - Most features complete
- [x] EmployeeDashboard - Personal overview - COMPLETE
- [x] EmployeeProfile - Profile management - COMPLETE
- [x] EmployeeTasks - Task management - COMPLETE (Jan 27, 2026)
- [x] EmployeePerformanceReviews - View reviews - COMPLETE (Jan 27, 2026)
- [x] EmployeeLeave - Leave requests - COMPLETE
- [x] EmployeeAttendance - Attendance history - COMPLETE
- [ ] EmployeeSalary - Payslip viewing (hidden)
- [x] EmployeeNotices - Company notices - COMPLETE

### 📋 Backlog / Future Tasks

#### P0 - Critical
- [x] Connect dashboard pages to backend APIs - COMPLETE

#### P1 - High Priority
- [ ] GSAP animations on dashboard components
- [x] Functional notification bell - COMPLETE (Jan 27, 2026)
- [x] Real-time task/review notifications - COMPLETE

#### P2 - Medium Priority
- [ ] Dark mode toggle (full app)
- [ ] Multi-language support (ASEAN languages)
- [ ] Export functionality (PDF reports)
- [ ] Complete technical documentation (researchReport.md, architecture.md)

#### P3 - Low Priority
- [ ] Email notifications for approvals
- [ ] Calendar integration
- [ ] Mobile app (React Native)

## Technical Architecture

### Frontend Stack
- React 18 + TypeScript
- Vite build tool
- TailwindCSS + Shadcn UI
- Framer Motion + GSAP animations
- React Router v6
- TanStack Query

### Backend Stack
- FastAPI (Python 3.11+)
- Motor (async MongoDB)
- JWT authentication
- Groq LLM (AI Chat)
- Qdrant Vector Store (RAG)

### Database Schema
```
User: {id, full_name, email, hashed_password, company_name, country, role, is_active, is_approved}
Attendance: {employee_id, check_in, check_out, date}
Leave: {employee_id, start_date, end_date, reason, status}
Salary: {employee_id, amount, effective_date}
Notice: {title, content, created_at}
Department: {name, description}
Candidate: {full_name, email, resume_url, status}
JobOpening: {title, description, department_id}
Task: {id, title, description, assigned_to, assigned_by, status, priority, category, due_date, status_history, notes}
PerformanceReview: {id, employee_id, reviewer_id, review_period, goals_achieved, quality_score, productivity_score, teamwork_score, communication_score, overall_score, feedback, strengths, areas_for_improvement}
Notification: {id, title, message, type, target_user_id, is_read, link, created_at}
```

## Design Standards
- "Design like Apple, animate like Disney, code like NASA"
- Mobile-first responsive design
- Warm cream/off-white backgrounds
- Professional blue primary color
- Smooth 60fps animations
- Generous whitespace
- Enterprise-grade visual language

## Last Updated
January 27, 2026
