# LuminaHR - Product Requirements Document

## Original Problem Statement
Build a comprehensive HR management application by merging functionalities and designs from two GitHub repositories:
1. `Luna-yun/HR-App-lumina` - Backend logic and landing page aesthetics
2. `DavidMacha/lumina` - Premium dashboard UI
3. `phoenixcoded/able-pro-free-admin-dashboard-template` - Auth page design reference

## Core Requirements

### ✅ Completed Features

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

#### AI Chat RAG System Fix (Jan 20, 2026)
- [x] **Fixed Embedding System** - Replaced hash-based pseudo-embeddings with proper semantic embeddings using `sentence-transformers/all-MiniLM-L6-v2`
- [x] **Fixed Qdrant API** - Updated from deprecated `.search()` to `.query_points()` method
- [x] **Embedding Dimension** - Changed from 1024 (hash-based) to 384 (semantic embeddings)
- [x] **RAG Now Working** - Documents are properly indexed and retrieved based on semantic similarity
- [x] **Document Upload/Delete** - Both working correctly with proper vector storage management
- [x] **Chat History** - Session-based chat history preserved across messages

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

#### Admin Dashboard (P1)
- [ ] AdminDashboard - Analytics overview
- [ ] AdminEmployees - Employee management CRUD
- [ ] AdminDepartments - Department management
- [ ] AdminLeaves - Leave approval workflow
- [ ] AdminAttendance - Attendance monitoring
- [ ] AdminPayroll - Salary management
- [ ] AdminNotices - Company announcements
- [ ] AdminRecruitment - Job postings & candidates
- [ ] AdminAnalytics - Workforce insights
- [ ] AdminAIChat - AI assistant with doc upload
- [ ] AdminProfile - Admin profile management

#### Employee Dashboard (P1)
- [ ] EmployeeDashboard - Personal overview
- [ ] EmployeeProfile - Profile management
- [ ] EmployeeLeave - Leave requests
- [ ] EmployeeAttendance - Attendance history
- [ ] EmployeeSalary - Payslip viewing
- [ ] EmployeeNotices - Company notices

### 📋 Backlog / Future Tasks

#### P0 - Critical
- [ ] Connect dashboard pages to backend APIs

#### P1 - High Priority
- [ ] GSAP animations on dashboard components
- [ ] Real-time notifications
- [ ] File upload for AI Chat (.doc, .pdf)

#### P2 - Medium Priority
- [ ] Dark mode toggle (full app)
- [ ] Multi-language support (ASEAN languages)
- [ ] Export functionality (PDF reports)

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
User: {id, full_name, email, hashed_password, company_name, country, role}
Attendance: {employee_id, check_in, check_out, date}
Leave: {employee_id, start_date, end_date, reason, status}
Salary: {employee_id, amount, effective_date}
Notice: {title, content, created_at}
Department: {name, description}
Candidate: {full_name, email, resume_url, status}
JobOpening: {title, description, department_id}
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
January 20, 2026
