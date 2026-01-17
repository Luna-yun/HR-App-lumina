# 📘 `lovable.md`

## Employee Management System (EMS)

**AI-Assisted Development & HR-Aligned System Documentation**

---

## 1. SYSTEM PURPOSE & PHILOSOPHY

### 1.1 Purpose

This repository implements a **role-based Employee Management System (EMS)** designed to support **day-to-day HR operations** and **employee self-service** for small to mid-sized organizations.

The system prioritizes:

* Operational clarity
* HR control and compliance
* Employee transparency
* Extensibility for future AI-assisted features

---

### 1.2 Design Philosophy (For AI Editor)

When modifying or extending this codebase, always assume:

1. **Admin (HR) is the system owner**
2. **Employees are self-service users**
3. **Data correctness is as important as UI aesthetics**
4. **Auditability matters**
5. **Every feature must map to a real HR process**

If a feature does not map to a real HR workflow, it should **not** be added.

---

## 2. USER ROLES & PERMISSIONS

### 2.1 Role Definitions

#### 2.1.1 HR / Admin

The **Admin role** is the highest authority in the system.

HR or Admin can:

* Create, update, delete employees
* Approve or reject leave requests
* View and manage attendance records
* Manage departments
* Publish notices
* Create Custom Workflows
* View and manage salary records
* Access recruitment/interview data
* Have complience chatbot with RAG with document upload feature
* Manage Documents
* Performance Reviews and KPIs

HR **cannot**:

* Modify system audit logs (future)
* View employee passwords

---

#### 2.1.2 Employee

The **Employee role** is a self-service role.

Employees can:

* Log in securely
* Mark attendance (check-in / check-out)
* Apply for leave
* View leave status
* View salary details
* Read company notices
* Get onboarding AI support
* See workflows

Employees **cannot**:

* View other employees' data
* Approve anything
* Modify salary or attendance records
* Access HR dashboards

---

> ⚠️ IMPORTANT FOR AI EDITOR
> Any new route, component, or API must explicitly declare **which role can access it**.

---

## 3. SYSTEM ARCHITECTURE OVERVIEW

### 3.1 High-Level Architecture

```
React (Client)
   ↓ REST API (Axios)
 (Server)
   ↓
MongoDB (Mongoose Models)
```

---

### 3.2 Major System Domains

The EMS is divided into the following **functional domains**:

1. Authentication & Authorization
2. Employee Self-Service
3. HR Operations
4. Attendance Management
5. Leave Management
6. Payroll / Salary Visibility
7. Department Management
8. Notices & Communication
9. Recruitment (Partial)
10. Performance Reviews and KPIs

---

## 4. AUTHENTICATION & SECURITY MODULE

### 4.1 Features Implemented

* Email + password login
* JWT token authentication
* Role-based route protection
* Password reset via email
* Encrypted password storage

---

### 4.2 Core Functions

#### Login Flow

1. User enters email + password
2. Backend validates credentials
3. JWT issued
4. Role stored in client state
5. User redirected to role-specific dashboard


---

## 5. EMPLOYEE DASHBOARD (SELF-SERVICE)

### 5.1 Purpose

The employee dashboard is designed to **reduce HR workload** by enabling employees to manage routine tasks independently.

---

### 5.2 Dashboard Components

#### 5.2.1 Attendance Widget

**Elements**

* Check-In button
* Check-Out button
* Today's status indicator

**Functions**

* Records timestamp
* Prevents double check-in/out
* Links attendance to employee ID

---

#### 5.2.2 Leave Summary Widget

**Elements**

* Pending leave count
* Approved leave count
* Rejected leave count

**Functions**

* Fetches leave history
* Displays status clearly

---

#### 5.2.3 Salary Summary Widget

**Elements**

* Last paid salary
* Net amount

**Functions**

* Read-only salary visibility

---

#### 5.2.4 Notices Feed

**Elements**

* Notice title
* Date
* Short preview

**Functions**

* Displays HR announcements

---

## 6. ATTENDANCE MANAGEMENT

### 6.1 Employee Attendance Flow

1. Employee logs in
2. Clicks **Check-In**
3. Timestamp recorded
4. Later clicks **Check-Out**
5. Total attendance stored

---

### 6.2 HR Attendance Monitoring

**Elements**

* Attendance table
* Filters (date, employee)
* Time stamps

**Functions**

* Identify absences
* Support payroll processing
* Detect irregular patterns

---

## 7. LEAVE MANAGEMENT

### 7.1 Employee Leave Application

**Elements**

* Start date picker
* End date picker (optional)
* Reason text box
* Submit button

**Functions**

* Create leave request
* Default status = Pending

---

### 7.2 HR Leave Approval

**Elements**

* Leave request list
* Employee name
* Dates
* Reason
* Approve / Reject buttons

**Functions**

* Update leave status
* Notify employee

---

### 7.3 Missing (Important)

* Leave types
* Leave balance calculation
* Policy enforcement


---

## 8. SALARY & PAYROLL VISIBILITY

### 8.1 Current Capabilities

* Employees can view salary details
* HR can manage salary records manually

---

### 8.2 Salary Page Components

**Elements**

* Gross salary
* Deductions
* Net salary

**Functions**

* Display payroll data
* Reduce salary-related queries


---

## 9. HR DASHBOARD (CONTROL CENTER)

### 9.1 Purpose

The HR dashboard is the **decision-making hub**.

---

### 9.2 HR Dashboard Components

#### Employee Overview

* Total employees
* Department distribution

#### Leave Overview

* Pending approvals
* Recent decisions

#### Attendance Snapshot

* Today's attendance summary

---

## 10. EMPLOYEE MANAGEMENT (HR)

### 10.1 Employee CRUD

**Elements**

* Employee list table
* Add / Edit / Delete buttons
* Department selector
* Role selector

**Functions**

* Maintain employee records
* Control system access


---

## 11. DEPARTMENT MANAGEMENT

### 11.1 Purpose

Defines organizational structure.

---

### 11.2 Components

**Elements**

* Department list
* Add department form
* Edit department name
* Employee mapping (also show employees without department)

**Functions**

* Group employees
* Enable reporting

---

## 12. NOTICES & COMMUNICATION

### 12.1 HR Notice Creation

**Elements**

* Title input
* Message editor
* Publish button

**Functions**

* Broadcast information
* Ensure consistent communication

---

### 12.2 Employee Notice Consumption

* Read-only access
* Chronological listing

---

## 13. RECRUITMENT MODULE (DEMO)

### 13.1 Current State

* Basic candidate tracking
* Interview notes
* Status updates


---

## 14. AI-ASSISTED FEATURES (PLANNED & GUIDELINES)

### 14.1 Allowed AI Assistance

AI may:

* Suggest validations
* Detect anomalies
* Generate summaries
* Improve UX copy
* Flag missing HR workflows

---


## 15. DATA & COMPLIANCE PRINCIPLES

* All employee data is confidential
* Every HR action should be traceable (future audit logs)
* Changes must not silently overwrite records

---

## 16. DEVELOPMENT RULES FOR AI EDITORS

1. Always ask: **Which role uses this?**
2. Never break HR authority
3. Prefer explicit logic over "magic"
4. Avoid hardcoding policies
5. Maintain backward compatibility

---

## 17. SYSTEM MATURITY ASSESSMENT

* Current Level: **Operational EMS**
* Suitable for: Startups / SMEs
* Not yet enterprise-grade

---

## 18. FINAL NOTE TO AI ASSISTANTS

This system represents **real people, real salaries, real leave, and real trust**.

Any code change must:

* Respect HR processes
* Preserve data integrity
* Improve clarity, not complexity

---

**End of `lovable.md`**
