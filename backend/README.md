# Lumina Backend API

Modern FastAPI backend powering the Lumina HR Management Platform.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Local Setup](#local-setup)
- [Environment Variables](#environment-variables)
- [Running the Server](#running-the-server)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [AI Chat System](#ai-chat-system)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

The Lumina backend provides RESTful APIs for:
- User authentication with JWT tokens
- Employee management (CRUD operations)
- Leave request workflows
- Attendance tracking
- Payroll management
- Department organization
- Recruitment pipeline
- AI-powered HR chatbot with RAG
- Real-time notifications

---

## 🛠 Tech Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Framework | FastAPI | 0.100+ |
| Python | Python | 3.11+ |
| Database | MongoDB Atlas | 6.0+ |
| ODM | Motor (async) | 3.3+ |
| Auth | JWT (PyJWT) | 2.8+ |
| AI/LLM | Groq | LLaMA 3.1 |
| Vector DB | Qdrant | Cloud |
| Password | bcrypt | 4.1+ |

---

## 📦 Prerequisites

Before setting up locally, ensure you have:

1. **Python 3.11+** installed
   ```bash
   python --version  # Should be 3.11 or higher
   ```

2. **pip** package manager
   ```bash
   pip --version
   ```

3. **MongoDB Atlas account** (free tier works)
   - Create account at https://www.mongodb.com/atlas
   - Create a cluster
   - Get connection string

4. **Groq API key** (for AI Chat)
   - Sign up at https://console.groq.com
   - Generate API key

5. **Qdrant Cloud account** (for RAG vector storage)
   - Sign up at https://cloud.qdrant.io
   - Create a cluster
   - Get URL and API key

---

## 🚀 Local Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-org/lumina.git
cd lumina/backend
```

### Step 2: Create Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/macOS:
source venv/bin/activate
# On Windows:
.\venv\Scripts\activate
```

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 4: Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your credentials (see [Environment Variables](#environment-variables) section).

### Step 5: Verify MongoDB Connection

```bash
python -c "from motor.motor_asyncio import AsyncIOMotorClient; import os; from dotenv import load_dotenv; load_dotenv(); client = AsyncIOMotorClient(os.environ.get('MONGO_URL')); print('✅ MongoDB connected!')"
```

### Step 6: Run the Server

```bash
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

The API will be available at `http://localhost:8001`

---

## 🔐 Environment Variables

Create a `.env` file with the following variables:

```env
# ==========================================
# REQUIRED: Database Configuration
# ==========================================
MONGO_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
DB_NAME=lumina_db

# ==========================================
# REQUIRED: JWT Authentication
# ==========================================
SECRET_KEY=your-super-secret-key-at-least-32-characters-long
JWT_ALGORITHM=HS256
JWT_EXPIRATION_MINUTES=1440

# ==========================================
# OPTIONAL: AI Chat Configuration (for RAG)
# ==========================================
GROQ_API_KEY=gsk_your_groq_api_key_here
QDRANT_URL=https://your-cluster.qdrant.tech
QDRANT_API_KEY=your_qdrant_api_key_here

# ==========================================
# OPTIONAL: CORS Configuration
# ==========================================
CORS_ORIGINS=http://localhost:3000,https://your-domain.com
```

### Getting API Keys

#### MongoDB Atlas
1. Go to https://www.mongodb.com/atlas
2. Create free cluster
3. Create database user
4. Whitelist IP (0.0.0.0/0 for development)
5. Get connection string from "Connect" button

#### Groq API
1. Go to https://console.groq.com
2. Sign up/Login
3. Navigate to API Keys
4. Create new key
5. Copy the `gsk_...` key

#### Qdrant Cloud
1. Go to https://cloud.qdrant.io
2. Create free cluster
3. Get cluster URL (e.g., `https://xxx.qdrant.tech`)
4. Generate API key from cluster settings

---

## 🖥 Running the Server

### Development Mode (with hot reload)

```bash
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

### Production Mode (with Gunicorn)

```bash
gunicorn server:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8001
```

### Using Docker

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8001
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8001"]
```

```bash
docker build -t lumina-backend .
docker run -p 8001:8001 --env-file .env lumina-backend
```

---

## 📚 API Documentation

Once the server is running, access the interactive API documentation:

| Documentation | URL |
|---------------|-----|
| Swagger UI | http://localhost:8001/docs |
| ReDoc | http://localhost:8001/redoc |
| OpenAPI JSON | http://localhost:8001/openapi.json |

### Key Endpoints

| Category | Endpoint | Method | Description |
|----------|----------|--------|-------------|
| **Auth** | `/api/auth/signup` | POST | Register new user |
| | `/api/auth/login` | POST | Login & get JWT |
| | `/api/auth/me` | GET | Get current user |
| **Employees** | `/api/admin/employees` | GET | List employees |
| | `/api/admin/employees` | POST | Create employee |
| | `/api/admin/employees/{id}` | PUT | Update employee |
| **Leave** | `/api/leave/request` | POST | Request leave |
| | `/api/leave/pending` | GET | Get pending leaves |
| | `/api/leave/{id}/approve` | PUT | Approve leave |
| **Attendance** | `/api/attendance/check-in` | POST | Check in |
| | `/api/attendance/check-out` | POST | Check out |
| **AI Chat** | `/api/admin/chat` | POST | Send message |
| | `/api/admin/chat/upload` | POST | Upload document |
| **Notifications** | `/api/notifications` | GET | Get notifications |

### Example API Calls

```bash
# Health Check
curl http://localhost:8001/api/health

# Register User
curl -X POST http://localhost:8001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@company.com",
    "password": "SecurePass123!",
    "full_name": "John Admin",
    "company_name": "Acme Corp",
    "country": "Singapore",
    "role": "Admin"
  }'

# Login
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@company.com", "password": "SecurePass123!"}'

# Authenticated Request
curl http://localhost:8001/api/admin/employees \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 📊 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique),
  hashed_password: String,
  full_name: String,
  company_name: String,
  country: String,
  role: "Admin" | "Employee",
  department: String,
  phone: String,
  is_active: Boolean,
  created_at: Date,
  updated_at: Date
}
```

### Leave Requests Collection
```javascript
{
  _id: ObjectId,
  employee_id: String,
  employee_name: String,
  company_id: String,
  leave_type: String,
  start_date: String,
  end_date: String,
  reason: String,
  status: "pending" | "approved" | "rejected",
  created_at: Date,
  reviewed_by: String,
  reviewed_at: Date
}
```

### Notifications Collection
```javascript
{
  _id: ObjectId,
  title: String,
  message: String,
  type: "info" | "success" | "warning" | "error",
  target_user_id: String | null,
  company_id: String,
  is_read: Boolean,
  created_at: Date,
  read_at: Date
}
```

---

## 🤖 AI Chat System

For detailed technical documentation on the RAG-based AI Chat system, see [chat.md](./chat.md).

### Quick Overview

The AI Chat system uses:
- **Groq** for fast LLM inference (LLaMA 3.1 8B)
- **Qdrant** for vector similarity search
- **Hash-based embeddings** for document vectorization
- **Chunked document processing** for optimal retrieval

### Uploading Documents

```bash
curl -X POST http://localhost:8001/api/admin/chat/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/hr_policy.pdf"
```

### Querying the Chatbot

```bash
curl -X POST http://localhost:8001/api/admin/chat \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "What is our leave policy?"}'
```

---

## 🧪 Testing

### Run All Tests

```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest

# Run with coverage
pytest --cov=. --cov-report=html
```

### Test Specific Module

```bash
pytest tests/test_auth.py -v
pytest tests/test_leave.py -v
```

### Manual Testing with curl

```bash
# Test health endpoint
curl http://localhost:8001/api/health

# Test authentication flow
./scripts/test_auth.sh
```

---

## 🚀 Deployment

### Option 1: Emergent Platform

1. Push code to GitHub
2. Connect repository to Emergent
3. Configure environment variables
4. Deploy

### Option 2: Docker + Cloud Run

```bash
# Build image
docker build -t gcr.io/PROJECT_ID/lumina-backend .

# Push to registry
docker push gcr.io/PROJECT_ID/lumina-backend

# Deploy to Cloud Run
gcloud run deploy lumina-backend \
  --image gcr.io/PROJECT_ID/lumina-backend \
  --platform managed \
  --region us-central1 \
  --set-env-vars "MONGO_URL=..." 
```

### Option 3: Traditional Server

```bash
# Install dependencies
pip install -r requirements.txt

# Run with gunicorn
gunicorn server:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8001
```

---

## 🔧 Troubleshooting

### Common Issues

**1. MongoDB Connection Failed**
```
Error: Failed to connect to MongoDB
```
Solution:
- Verify `MONGO_URL` is correct
- Check IP whitelist in MongoDB Atlas
- Ensure network connectivity

**2. JWT Token Invalid**
```
Error: Could not validate credentials
```
Solution:
- Token may have expired (default: 24 hours)
- Ensure `SECRET_KEY` is consistent
- Check token format in Authorization header

**3. AI Chat Not Working**
```
Error: Groq API error
```
Solution:
- Verify `GROQ_API_KEY` is valid
- Check Groq service status
- Ensure rate limits not exceeded

**4. Document Upload Fails**
```
Error: Failed to upload document
```
Solution:
- Check file format (PDF, DOC, DOCX only)
- Verify file size < 10MB
- Ensure Qdrant credentials are correct

### Logs

```bash
# View application logs
tail -f /var/log/supervisor/backend.out.log
tail -f /var/log/supervisor/backend.err.log

# Debug mode
LOGLEVEL=DEBUG uvicorn server:app --reload
```

---

## 📝 License

Copyright © 2024-2026 Lumina. All rights reserved.

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

*Documentation Version: 1.0*
*Last Updated: January 2026*



----

## Database Architecture & Relationships

### Core Entities

**1. Users (Employees & Admins)**
- `id` - Unique identifier
- `email`, `full_name`, `hashed_password`
- `company_name` - Links user to their organization
- `role` - Either "Admin" or "Employee"
- `is_approved` - Employees need admin approval to access the system
- `department_id` - Links to their department

**2. Organization/Company**
- There's no separate "organizations" collection
- **Company is identified by `company_name`** field on users
- All users with the same `company_name` belong to the same organization
- This is a soft-link (string matching), not a foreign key

**3. Departments**
- `id`, `name`, `description`
- `company_name` - Which company this department belongs to
- `employee_count` - Computed count
- Employees are assigned via `department_id`

### Relationships Diagram
```
Company (implicit via company_name string)
    │
    ├── Users (Admin/Employee)
    │       └── department_id → Department
    │
    ├── Departments
    │
    ├── Leave Requests
    │       └── employee_id → User
    │
    ├── Attendance Records
    │       └── employee_id → User
    │
    ├── Salary Records
    │       └── employee_id → User
    │
    ├── Notices
    │       └── published_by → User (Admin)
    │
    ├── Job Postings (Recruitment)
    │       └── created_by → User (Admin)
    │
    └── Notifications
            └── target_user_id → User
```

### Key Relationships

| Parent | Child | Link Field |
|--------|-------|------------|
| Company | User | `company_name` (string) |
| Company | Department | `company_name` (string) |
| Department | User | `department_id` |
| User | Leave Request | `employee_id` |
| User | Attendance | `employee_id` |
| User | Salary Record | `employee_id` |
| Admin | Notice | `published_by` |

---

## AI Chatbot Architecture (RAG System)

### Components

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ Chat UI     │  │ Document    │  │ Chat History        │ │
│  │ Input/Output│  │ Upload/List │  │ Session Management  │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└──────────────────────────┬──────────────────────────────────┘
                           │ API Calls
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (FastAPI)                         │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              ai_chat_routes.py                        │  │
│  │                                                       │  │
│  │  1. Document Upload:                                  │  │
│  │     PDF/DOCX → Extract Text → Chunk → Embed → Store  │  │
│  │                                                       │  │
│  │  2. Chat Query:                                       │  │
│  │     Question → Embed → Search → Context → LLM → Reply │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────┬────────────────┬────────────────┬─────────────────┘
          │                │                │
          ▼                ▼                ▼
┌─────────────────┐ ┌─────────────┐ ┌─────────────────┐
│    MongoDB      │ │   Qdrant    │ │     Groq        │
│                 │ │ (Vectors)   │ │   (LLM API)     │
│ • knowledge_    │ │             │ │                 │
│   documents     │ │ • Embeddings│ │ • LLaMA 3.1 8B  │
│ • chat_messages │ │ • Semantic  │ │ • Chat          │
│                 │ │   Search    │ │   Completions   │
└─────────────────┘ └─────────────┘ └─────────────────┘
```

### RAG Flow (Step by Step)

**Document Upload:**
1. User uploads PDF/DOCX
2. Backend extracts text (PyPDF2/python-docx)
3. Text is chunked into ~500 word segments
4. Each chunk is embedded using **Sentence Transformers** (`all-MiniLM-L6-v2` → 384 dimensions)
5. Embeddings stored in **Qdrant** with metadata (document_id, text, company_id)
6. Document record saved in **MongoDB**

**Chat Query:**
1. User asks a question
2. Question is embedded using same model (384-dim vector)
3. **Qdrant** searches for similar vectors (cosine similarity, threshold 0.3)
4. Top 5 relevant text chunks retrieved
5. Chunks become "context" for the LLM prompt
6. **Groq API** (LLaMA 3.1) generates response based on context
7. Response + sources returned to user
8. Messages saved to MongoDB (chat history)

### Data Isolation
- Each company has its own Qdrant collection: `hr_knowledge_{company_id}`
- Chat history filtered by `company_id`
- Documents filtered by `company_id`
- One company cannot see another's documents or chat

### Key Collections (MongoDB)

| Collection | Purpose |
|------------|---------|
| `knowledge_documents` | Metadata about uploaded files (filename, type, size, chunk_count) |
| `chat_messages` | Chat history with role, content, sources, session_id |

### Key External Services

| Service | Purpose |
|---------|---------|
| **Sentence Transformers** | Local embedding generation (no API key needed) |
| **Qdrant Cloud** | Vector database for semantic search |
| **Groq** | Fast LLM inference (LLaMA 3.1 8B) |
