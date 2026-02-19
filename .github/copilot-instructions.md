# LuminaHR Copilot Instructions

## Architecture Overview

LuminaHR is an ASEAN-focused HR management platform with a modern microservices architecture:

- **Frontend**: React 18 + TypeScript + TailwindCSS + Shadcn UI, deployed on Vercel
- **Backend**: FastAPI + Python 3.11 + MongoDB Atlas, deployed on Emergent
- **AI Layer**: Groq (LLaMA 3.1) + Qdrant vector database for RAG-based HR chatbot
- **Database**: MongoDB with Motor async driver, optimized with strategic indexes
- **Auth**: JWT-based with role-based access (Admin/Employee)

## Key Design Patterns

### API Structure
- All endpoints prefixed with `/api`
- JWT authentication via `Authorization: Bearer <token>` header
- RESTful design with consistent response formats
- CORS configured for cross-origin requests

### Database Schema
- Company-scoped data with `company_id` fields
- Denormalized fields for performance (e.g., `company_name`, `country`)
- Strategic indexes on `company_id + status`, `employee_id + date` combinations
- Collections: users, companies, leave_requests, attendance, salary_records, notifications, etc.

### Frontend Patterns
- React Router with protected routes based on user roles
- Auth context for global state management
- Axios interceptors for automatic token injection
- Shadcn UI components with TailwindCSS styling
- TypeScript strict mode with comprehensive type definitions

### ASEAN Compliance
- Country-specific validation using `ASEAN_COUNTRIES` list
- Labor law considerations in leave policies and termination workflows
- Multi-currency support implied in salary management

## Development Workflow

### Backend Development
```bash
# Start development server with hot reload
uvicorn server:app --host 0.0.0.0 --port 8001 --reload

# Run tests
pytest

# API documentation at http://localhost:8001/docs
```

### Frontend Development
```bash
# Start development server
yarn dev  # or npm run dev

# Build for production
yarn build

# Run tests
yarn test
```

### Environment Setup
- Backend: `.env` with `MONGO_URL`, `SECRET_KEY`, `GROQ_API_KEY`, `QDRANT_URL`
- Frontend: `.env` with `VITE_BACKEND_URL` (note: VITE_ prefix for client-side exposure)

## Code Organization

### Backend Routes
- `auth_routes.py`: JWT auth, user management
- `*_routes.py`: Feature-specific endpoints (leave, attendance, salary, etc.)
- `ai_chat_routes.py`: RAG chatbot with document upload
- All routes included with `app.include_router(router, prefix="/api")`

### Frontend Structure
- `/admin/*`: Admin dashboard routes (employees, analytics, recruitment)
- `/employee/*`: Employee self-service routes (profile, leave, attendance)
- `/features/*`: Public marketing pages
- Protected routes use `ProtectedRoute` component with role checking

## Common Patterns

### Authentication Flow
1. Login/signup creates JWT token stored in localStorage
2. Axios interceptor adds `Bearer` token to all requests
3. Backend validates token with `get_current_user()` dependency
4. Role-based access via `get_current_admin()` for admin-only endpoints

### Database Queries
- Use `company_id` for data isolation between companies
- Leverage MongoDB aggregation pipelines for analytics
- Async operations with Motor for non-blocking I/O

### Error Handling
- FastAPI HTTPException with appropriate status codes
- Frontend toast notifications for user feedback
- Logging with structured format for debugging

### AI Integration
- Document upload chunks content for vector storage
- RAG retrieval combines user query with relevant HR documents
- Groq API for fast LLM inference with LLaMA models

## Testing Strategy

- Backend: pytest with async support, focus on API endpoints
- Frontend: React Testing Library for component testing
- Integration tests for critical workflows (auth, leave approval)

## Deployment

- Frontend: Vercel with `yarn build` command
- Backend: Emergent platform with Gunicorn workers
- Environment variables configured in respective platforms
- MongoDB Atlas for production database

## Key Files to Reference

- `backend/server.py`: Main FastAPI app with route inclusion and DB setup
- `backend/models.py`: Pydantic models and ASEAN country validation
- `frontend/src/App.tsx`: React Router configuration with protected routes
- `frontend/src/services/api.ts`: Axios configuration with auth interceptors
- `frontend/src/contexts/AuthContext.tsx`: Authentication state management</content>
<parameter name="filePath">/workspaces/HR-App-lumina/.github/copilot-instructions.md