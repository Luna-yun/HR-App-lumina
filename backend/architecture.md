# LuminaHR System Architecture Documentation

## Overview

LuminaHR is a comprehensive Human Resources Management System (HRMS) designed for ASEAN enterprises. This document provides detailed technical architecture documentation suitable for system administrators, developers, and technical stakeholders.

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Frontend Architecture](#2-frontend-architecture)
3. [Backend Architecture](#3-backend-architecture)
4. [Database Schema](#4-database-schema)
5. [RAG System Architecture](#5-rag-system-architecture)
6. [Authentication & Authorization](#6-authentication--authorization)
7. [API Reference](#7-api-reference)
8. [Deployment Architecture](#8-deployment-architecture)
9. [Data Flow Diagrams](#9-data-flow-diagrams)

---

## 1. System Overview

### 1.1 Technology Stack

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           TECHNOLOGY STACK                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  FRONTEND                    BACKEND                    INFRASTRUCTURE   │
│  ─────────                   ───────                    ──────────────   │
│  • React 18                  • FastAPI (Python)         • Docker         │
│  • TypeScript                • Motor (Async MongoDB)    • Kubernetes     │
│  • Vite                      • Pydantic                 • MongoDB Atlas  │
│  • TailwindCSS               • PyJWT                    • Qdrant Cloud   │
│  • Shadcn/UI                 • Sentence Transformers    • Groq Cloud     │
│  • Framer Motion             • PyPDF2                                    │
│  • Anime.js                  • python-docx                               │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 1.2 System Components

```
                    ┌──────────────────────────────┐
                    │      Load Balancer           │
                    │   (Kubernetes Ingress)       │
                    └──────────────┬───────────────┘
                                   │
            ┌──────────────────────┼──────────────────────┐
            │                      │                      │
            ▼                      ▼                      ▼
    ┌───────────────┐      ┌───────────────┐      ┌───────────────┐
    │   Frontend    │      │   Backend     │      │   Worker      │
    │   (React)     │      │   (FastAPI)   │      │  (Optional)   │
    │   Port 3000   │      │   Port 8001   │      │               │
    └───────────────┘      └───────┬───────┘      └───────────────┘
                                   │
          ┌────────────────────────┼────────────────────────┐
          │                        │                        │
          ▼                        ▼                        ▼
  ┌───────────────┐        ┌───────────────┐        ┌───────────────┐
  │   MongoDB     │        │   Qdrant      │        │   Groq API    │
  │   Atlas       │        │   Cloud       │        │   (LLM)       │
  └───────────────┘        └───────────────┘        └───────────────┘
```

---

## 2. Frontend Architecture

### 2.1 Directory Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/              # Shadcn/UI base components
│   │   ├── dashboard/       # Dashboard layout components
│   │   └── common/          # Shared components
│   │
│   ├── pages/
│   │   ├── admin/           # Admin dashboard pages
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AdminEmployees.tsx
│   │   │   ├── AdminAIChat.tsx
│   │   │   └── ...
│   │   │
│   │   ├── employee/        # Employee dashboard pages
│   │   ├── Landing.tsx      # Public landing page
│   │   ├── Login.tsx        # Authentication
│   │   └── Signup.tsx       # Registration
│   │
│   ├── services/
│   │   └── api.ts           # API client with axios
│   │
│   ├── contexts/
│   │   └── AuthContext.tsx  # Authentication state
│   │
│   ├── hooks/
│   │   └── use-toast.ts     # Toast notifications
│   │
│   ├── types/
│   │   └── index.ts         # TypeScript interfaces
│   │
│   └── App.tsx              # Root component with routing
│
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

### 2.2 State Management

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         STATE MANAGEMENT                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   Global State (React Context)                                           │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │ AuthContext                                                      │   │
│   │ ├── user: User | null                                           │   │
│   │ ├── token: string | null                                        │   │
│   │ ├── isAuthenticated: boolean                                    │   │
│   │ ├── login(credentials): Promise<void>                           │   │
│   │ └── logout(): void                                              │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│   Component State (useState, useReducer)                                 │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │ Page-level state                                                 │   │
│   │ ├── Loading states                                              │   │
│   │ ├── Form data                                                   │   │
│   │ ├── Modal visibility                                            │   │
│   │ └── Pagination                                                  │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Backend Architecture

### 3.1 Directory Structure

```
backend/
├── server.py               # Main FastAPI application
├── auth_routes.py          # Authentication endpoints
├── auth_utils.py           # JWT utilities
├── ai_chat_routes.py       # RAG system endpoints
├── notification_routes.py  # Notification endpoints
├── performance_routes.py   # Task & review endpoints
├── models.py               # Pydantic data models
├── requirements.txt        # Python dependencies
└── .env                    # Environment variables
```

### 3.2 API Route Organization

```python
# server.py - Route Registration

from fastapi import FastAPI

app = FastAPI(title="LuminaHR API", version="1.0.0")

# Route prefixes
app.include_router(auth_router)           # /api/auth/*
app.include_router(attendance_router)     # /api/attendance/*
app.include_router(leave_router)          # /api/leave/*
app.include_router(salary_router)         # /api/salary/*
app.include_router(notice_router)         # /api/notices/*
app.include_router(department_router)     # /api/departments/*
app.include_router(recruitment_router)    # /api/admin/jobs/*
app.include_router(ai_chat_router)        # /api/admin/chat/*
app.include_router(notification_router)   # /api/notifications/*
app.include_router(performance_router)    # /api/admin/tasks/*, /api/admin/performance-reviews/*
```

### 3.3 Dependency Injection Pattern

```python
# Database dependency
async def get_db() -> AsyncIOMotorDatabase:
    from server import db
    return db

# Authentication dependency
async def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    """Validates JWT and returns user claims"""
    payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    return {
        "sub": payload["sub"],
        "email": payload["email"],
        "role": payload["role"],
        "company_id": payload["company_id"]
    }

# Admin-only dependency
async def get_current_admin(user: dict = Depends(get_current_user)) -> dict:
    """Ensures user has Admin role"""
    if user["role"] != "Admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

# Usage in endpoints
@router.get("/admin/employees")
async def get_employees(
    current_user: dict = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    # Only admins can access this endpoint
    # Database is injected automatically
    pass
```

---

## 4. Database Schema

### 4.1 MongoDB Collections

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          DATABASE SCHEMA                                 │
│                          ems_database                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  users                         companies                                 │
│  ├── id: UUID                  ├── id: UUID                             │
│  ├── email: string (unique)    ├── name: string                         │
│  ├── password_hash: string     ├── country: string                      │
│  ├── full_name: string         ├── admin_emails: string[]               │
│  ├── role: enum                └── created_at: datetime                 │
│  ├── company_id: UUID                                                   │
│  ├── company_name: string      attendance                               │
│  ├── department: string        ├── id: UUID                             │
│  ├── job_title: string         ├── employee_id: UUID                    │
│  ├── is_verified: boolean      ├── company_id: UUID                     │
│  ├── is_approved: boolean      ├── check_in: datetime                   │
│  ├── is_active: boolean        ├── check_out: datetime | null           │
│  └── created_at: datetime      ├── date: date                           │
│                                └── status: enum                          │
│  leave_requests                                                          │
│  ├── id: UUID                  salaries                                  │
│  ├── employee_id: UUID         ├── id: UUID                             │
│  ├── company_id: UUID          ├── employee_id: UUID                    │
│  ├── start_date: date          ├── company_id: UUID                     │
│  ├── end_date: date            ├── month: int                           │
│  ├── reason: string            ├── year: int                            │
│  ├── status: enum              ├── gross_salary: Decimal                │
│  └── created_at: datetime      ├── deductions: Decimal                  │
│                                └── currency: string                      │
│  departments                                                             │
│  ├── id: UUID                  notices                                   │
│  ├── company_id: UUID          ├── id: UUID                             │
│  ├── name: string              ├── company_id: UUID                     │
│  ├── description: string       ├── title: string                        │
│  └── created_at: datetime      ├── content: string (HTML)               │
│                                └── created_at: datetime                  │
│                                                                          │
│  knowledge_documents           chat_messages                             │
│  ├── id: UUID                  ├── id: UUID                             │
│  ├── company_id: UUID          ├── company_id: UUID                     │
│  ├── filename: string          ├── user_id: UUID                        │
│  ├── file_type: string         ├── session_id: UUID                     │
│  ├── file_size: int            ├── role: enum                           │
│  ├── content_hash: MD5         ├── content: string                      │
│  ├── chunk_count: int          ├── sources: string[]                    │
│  └── uploaded_by: UUID         └── created_at: datetime                 │
│                                                                          │
│  tasks                         performance_reviews                       │
│  ├── id: UUID                  ├── id: UUID                             │
│  ├── company_id: UUID          ├── company_id: UUID                     │
│  ├── title: string             ├── employee_id: UUID                    │
│  ├── description: string       ├── reviewer_id: UUID                    │
│  ├── assigned_to: UUID         ├── review_period: string                │
│  ├── assigned_by: UUID         ├── quality_score: int (1-5)             │
│  ├── status: enum              ├── productivity_score: int (1-5)        │
│  ├── priority: enum            ├── teamwork_score: int (1-5)            │
│  ├── due_date: datetime        ├── communication_score: int (1-5)       │
│  └── created_at: datetime      ├── feedback: string                     │
│                                └── created_at: datetime                  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Database Indexes

```python
# Indexes for optimal query performance
await db.users.create_index("email", unique=True)
await db.users.create_index("company_id")
await db.attendance.create_index([("employee_id", 1), ("date", -1)])
await db.leave_requests.create_index([("company_id", 1), ("status", 1)])
await db.knowledge_documents.create_index([("company_id", 1), ("content_hash", 1)])
await db.chat_messages.create_index([("session_id", 1), ("created_at", 1)])
```

---

## 5. RAG System Architecture

### 5.1 Document Processing Pipeline

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    DOCUMENT PROCESSING PIPELINE                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────────┐ │
│  │ Upload  │──▶│  Validate   │──▶│   Extract   │──▶│   Deduplicate   │ │
│  │  File   │   │  File Type  │   │    Text     │   │  (MD5 Hash)     │ │
│  └─────────┘   └─────────────┘   └─────────────┘   └─────────────────┘ │
│       │                                                     │           │
│       │              ┌─────────────────────────────────────┘           │
│       │              │                                                  │
│       │              ▼                                                  │
│       │        ┌─────────────┐   ┌─────────────┐   ┌─────────────────┐ │
│       │        │   Chunk     │──▶│   Generate  │──▶│     Store       │ │
│       │        │   Text      │   │  Embeddings │   │   Vectors       │ │
│       │        │ (500 words) │   │  (384 dim)  │   │   (Qdrant)      │ │
│       │        └─────────────┘   └─────────────┘   └─────────────────┘ │
│       │                                                     │           │
│       │              ┌──────────────────────────────────────┘           │
│       │              │                                                  │
│       │              ▼                                                  │
│       │        ┌─────────────────┐                                      │
│       └───────▶│  Store Metadata │                                      │
│                │    (MongoDB)    │                                      │
│                └─────────────────┘                                      │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Query Processing Pipeline

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      QUERY PROCESSING PIPELINE                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│    User Query                                                            │
│        │                                                                 │
│        ▼                                                                 │
│  ┌─────────────┐                                                        │
│  │   Embed     │────────────────┐                                       │
│  │   Query     │                │                                       │
│  │ (MiniLM)    │                │                                       │
│  └─────────────┘                │                                       │
│                                 │                                       │
│                                 ▼                                       │
│                           ┌─────────────┐                               │
│                           │   Search    │                               │
│                           │   Qdrant    │                               │
│                           │  (Top 5)    │                               │
│                           └─────────────┘                               │
│                                 │                                       │
│                                 │ Retrieved Chunks                      │
│                                 ▼                                       │
│  ┌─────────────┐          ┌─────────────┐          ┌─────────────────┐ │
│  │   Chat      │◀─────────│   Build     │◀─────────│   Load Chat     │ │
│  │  History    │          │   Prompt    │          │    History      │ │
│  └─────────────┘          └─────────────┘          └─────────────────┘ │
│                                 │                                       │
│                                 ▼                                       │
│                           ┌─────────────┐                               │
│                           │   Groq      │                               │
│                           │   LLaMA     │                               │
│                           │    3.1      │                               │
│                           └─────────────┘                               │
│                                 │                                       │
│                                 ▼                                       │
│                          Response with Sources                          │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 5.3 Embedding Model Configuration

```python
# Model: all-MiniLM-L6-v2
# - Dimension: 384
# - Max sequence length: 512 tokens
# - Trained on: 1B sentence pairs
# - Model size: ~80MB

EMBEDDING_MODEL_NAME = "all-MiniLM-L6-v2"
EMBEDDING_DIM = 384

# Lazy loading for efficient startup
_embedding_model = None

def get_embedding_model():
    global _embedding_model
    if _embedding_model is None:
        _embedding_model = SentenceTransformer(EMBEDDING_MODEL_NAME)
    return _embedding_model
```

### 5.4 Multi-Tenant Vector Isolation

```
Company A (ID: abc-123)          Company B (ID: xyz-789)
          │                                │
          ▼                                ▼
┌─────────────────────┐         ┌─────────────────────┐
│ Collection:         │         │ Collection:         │
│ hr_knowledge_abc_123│         │ hr_knowledge_xyz_789│
├─────────────────────┤         ├─────────────────────┤
│ Vector: [0.12, ...] │         │ Vector: [0.45, ...] │
│ Payload:            │         │ Payload:            │
│ ├── document_id     │         │ ├── document_id     │
│ ├── document_name   │         │ ├── document_name   │
│ ├── chunk_index     │         │ ├── chunk_index     │
│ ├── text            │         │ ├── text            │
│ └── company_id      │         │ └── company_id      │
└─────────────────────┘         └─────────────────────┘

Note: Each company has its own Qdrant collection.
Collections are named: hr_knowledge_{company_id}
```

---

## 6. Authentication & Authorization

### 6.1 JWT Token Structure

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user-uuid-12345",
    "email": "admin@company.com",
    "role": "Admin",
    "company_id": "company-uuid-67890",
    "exp": 1735689600
  }
}
```

### 6.2 Authorization Matrix

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         AUTHORIZATION MATRIX                              │
├────────────────────────────────┬───────────────┬─────────────────────────┤
│          Endpoint              │    Admin      │       Employee          │
├────────────────────────────────┼───────────────┼─────────────────────────┤
│ /api/auth/login               │      ✓        │           ✓             │
│ /api/auth/signup              │      ✓        │           ✓             │
│ /api/auth/me                  │      ✓        │           ✓             │
├────────────────────────────────┼───────────────┼─────────────────────────┤
│ /api/attendance/check-in      │      ✓        │           ✓             │
│ /api/attendance/my-history    │      ✓        │           ✓             │
│ /api/admin/attendance         │      ✓        │           ✗             │
├────────────────────────────────┼───────────────┼─────────────────────────┤
│ /api/leave/request            │      ✓        │           ✓             │
│ /api/leave/my-requests        │      ✓        │           ✓             │
│ /api/admin/leave/approve      │      ✓        │           ✗             │
├────────────────────────────────┼───────────────┼─────────────────────────┤
│ /api/admin/employees          │      ✓        │           ✗             │
│ /api/admin/departments        │      ✓        │           ✗             │
│ /api/admin/salaries           │      ✓        │           ✗             │
├────────────────────────────────┼───────────────┼─────────────────────────┤
│ /api/admin/chat/*             │      ✓        │           ✗             │
│ /api/admin/tasks/*            │      ✓        │           ✗             │
│ /api/tasks/my                 │      ✓        │           ✓             │
└────────────────────────────────┴───────────────┴─────────────────────────┘
```

---

## 7. API Reference

### 7.1 Authentication APIs

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/login` | Authenticate user | No |
| GET | `/api/auth/me` | Get current user | Yes |
| POST | `/api/auth/change-password` | Change password | Yes |

### 7.2 HR Management APIs

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| POST | `/api/attendance/check-in` | Clock in | Any |
| POST | `/api/attendance/check-out` | Clock out | Any |
| GET | `/api/admin/employees` | List employees | Admin |
| POST | `/api/admin/employees/{id}/terminate` | Terminate employee | Admin |
| POST | `/api/admin/employees/bulk-import` | Bulk import | Admin |

### 7.3 RAG Chat APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/chat/upload` | Upload document to knowledge base |
| GET | `/api/admin/chat/documents` | List uploaded documents |
| DELETE | `/api/admin/chat/documents/{id}` | Delete document and vectors |
| POST | `/api/admin/chat` | Send chat message |
| GET | `/api/admin/chat/history` | Get chat history |
| DELETE | `/api/admin/chat/history` | Clear chat history |

---

## 8. Deployment Architecture

### 8.1 Container Configuration

```yaml
# docker-compose.yml equivalent

services:
  frontend:
    build: ./frontend
    ports: ["3000:3000"]
    environment:
      - REACT_APP_BACKEND_URL=${BACKEND_URL}

  backend:
    build: ./backend
    ports: ["8001:8001"]
    environment:
      - MONGO_URL=${MONGO_URL}
      - DB_NAME=${DB_NAME}
      - JWT_SECRET=${JWT_SECRET}
      - GROQ_API_KEY=${GROQ_API_KEY}
      - QDRANT_URL=${QDRANT_URL}
      - QDRANT_API_KEY=${QDRANT_API_KEY}
```

### 8.2 Environment Variables

```
# Backend (.env)
MONGO_URL=mongodb+srv://...
DB_NAME=ems_database
JWT_SECRET=<secure-random-string>
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

GROQ_API_KEY=gsk_...
QDRANT_URL=https://...qdrant.io
QDRANT_API_KEY=<qdrant-key>

# Frontend (.env)
REACT_APP_BACKEND_URL=https://api.example.com
```

---

## 9. Data Flow Diagrams

### 9.1 User Registration Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  User    │────▶│ Frontend │────▶│ Backend  │────▶│ MongoDB  │
│ (Admin)  │     │  Form    │     │   API    │     │          │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
     │                                  │
     │                                  ▼
     │                           ┌──────────┐
     │                           │ Create   │
     │                           │ Company  │
     │                           └──────────┘
     │                                  │
     ▼                                  ▼
┌──────────┐                     ┌──────────┐
│ Redirect │◀────────────────────│  Create  │
│ to Login │                     │   User   │
└──────────┘                     └──────────┘
```

### 9.2 Employee Approval Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Employee │────▶│ Sign Up  │────▶│  Create  │
│          │     │  Form    │     │   User   │
└──────────┘     └──────────┘     │is_approved│
                                  │  =false   │
                                  └──────────┘
                                       │
                                       ▼
┌──────────┐     ┌──────────┐     ┌──────────┐
│  Admin   │────▶│ Approve  │────▶│  Update  │
│          │     │  Button  │     │is_approved│
└──────────┘     └──────────┘     │  =true    │
                                  └──────────┘
                                       │
                                       ▼
                                  ┌──────────┐
                                  │ Employee │
                                  │ Can Login│
                                  └──────────┘
```

### 9.3 RAG Query Flow

```
User Query: "What is our leave policy?"
                    │
                    ▼
        ┌─────────────────────┐
        │  Generate Embedding │
        │  [0.12, 0.45, ...]  │
        └─────────────────────┘
                    │
                    ▼
        ┌─────────────────────┐
        │    Vector Search    │
        │    Score > 0.3      │
        └─────────────────────┘
                    │
                    ▼
        ┌─────────────────────┐
        │  Retrieved Chunks:  │
        │  - Leave Policy.pdf │
        │    Chunk 3, 5, 7    │
        └─────────────────────┘
                    │
                    ▼
        ┌─────────────────────┐
        │   Build LLM Prompt  │
        │  System + Context   │
        │  + Chat History     │
        │  + User Query       │
        └─────────────────────┘
                    │
                    ▼
        ┌─────────────────────┐
        │    Groq LLM API     │
        │   LLaMA 3.1 8B      │
        └─────────────────────┘
                    │
                    ▼
        ┌─────────────────────┐
        │   Response with     │
        │   Source Citations  │
        └─────────────────────┘
```

---

## Appendix A: Error Handling

### Standard Error Response Format

```json
{
  "detail": "Error message describing what went wrong"
}
```

### HTTP Status Codes

| Code | Meaning | Common Causes |
|------|---------|---------------|
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Invalid/expired token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 500 | Internal Error | Server-side error |

---

## Appendix B: Performance Benchmarks

| Operation | Average Time | P95 Time |
|-----------|--------------|----------|
| Login | 150ms | 300ms |
| Document Upload (1MB) | 3s | 5s |
| Chat Query | 2.5s | 4s |
| Employee List (100 records) | 200ms | 400ms |
| Vector Search | 80ms | 150ms |

---

*Document Version: 1.0*
*Last Updated: January 25, 2026*
