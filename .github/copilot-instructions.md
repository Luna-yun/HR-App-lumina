# LuminaHR Copilot Instructions

## Critical Architecture Patterns

### Backend: Dependency Injection Pattern
FastAPI routes use dependency injection for database and auth. **Always** follow this pattern:
```python
from fastapi import Depends
from auth_utils import get_current_user, get_current_admin

@router.post("/leave/request")
async def create_leave(
    request: LeaveRequestCreate,
    current_user: dict = Depends(get_current_user),  # Any endpoint needing auth
    db: AsyncIOMotorDatabase = Depends(get_db)      # Database access
):
    employee_id = current_user["sub"]  # Extract user ID from JWT payload
    company_id = current_user["company_id"]  # Always scope queries to company_id
```
- `get_current_user()`: Returns decoded JWT with `sub` (user ID) and `company_id`
- `get_current_admin()`: Wraps `get_current_user()`, raises 403 if not admin
- Never skip `company_id` scoping—this is multi-tenant data isolation

### Frontend: API Service Organization
Services in `src/services/api.ts` use axios with two critical interceptors:
```typescript
// Token injection (automatic on every request)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 401 logout (automatic redirect on token expiry)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```
Services organized by feature: `authAPI`, `employeeAPI`, `attendanceAPI`, etc.

### Multi-Tenancy via company_id
All queries MUST include `company_id` filtering:
```python
# Correct: Company-scoped query
leave_reqs = await db.leave_requests.find({
    "employee_id": employee_id,
    "company_id": company_id  # Required for data isolation
}).to_list(100)

# Incorrect: Would leak data between companies
leave_reqs = await db.leave_requests.find({"employee_id": employee_id}).to_list(100)
```

## Testing: Playwright Patterns (E2E & API)

### E2E Testing with Page Objects
Tests live in `frontend/tests/e2e/` and use Page Object Model pattern:
```typescript
// Test file (e.g., auth.spec.ts)
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('successful login redirects to dashboard', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('SGadmin@gmail.com', 'TestPass123!');
  await expect(page).toHaveURL(/\/admin/);
});
```
Page Objects in `frontend/tests/pages/` encapsulate selectors and interactions:
```typescript
export class LoginPage {
  readonly emailInput: Locator = page.locator('#email');
  readonly submitButton: Locator = page.locator('[data-testid="login-submit-btn"]');
  
  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.submitButton.click();
    await this.page.waitForLoadState('networkidle');
  }
}
```

### Test Setup: Auth State Storage
Setup project in `frontend/tests/setup/auth.setup.ts` authenticates once, stores state:
```typescript
const authFile = 'playwright/.auth/user.json';
setup('authenticate', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login(TEST_EMAIL, TEST_PASSWORD);
  await page.context().storageState({ path: authFile }); // Store auth state
});
```
E2E tests depend on setup and reuse auth state (no re-login per test).

### API Testing
`frontend/tests/api/` tests backend directly (integration, no UI):
```typescript
// No UI, just HTTP requests (can run in parallel)
test('login returns token', async ({ request }) => {
  const resp = await request.post(`${API_BASE}/auth/login`, 
    { data: { email: TEST_EMAIL, password: TEST_PASSWORD } });
  expect(resp.status()).toBe(200);
  expect(resp.json()).toHaveProperty('access_token');
});
```
Use `test:api` script which configures `VITE_BACKEND_URL` (points to deployed backend).

### Running Tests
```bash
# E2E (uses local frontend + backend)
npm run test:e2e
npm run test:e2e:ui          # Interactive mode

# API (tests deployed backend, runs anywhere)
npm run test:api

# All
npm run test:all
```

## Database & Validation

### ASEAN Compliance
`backend/models.py` validates country against ASEAN list:
```python
ASEAN_COUNTRIES = ["Brunei", "Cambodia", ..., "Vietnam", "Timor-Leste"]

class Company(BaseModel):
    country: str
    
    @field_validator('country')
    def validate_country(cls, v):
        if v not in ASEAN_COUNTRIES:
            raise ValueError(f'Must be ASEAN country')
        return v
```

### Strategic Indexes (Performance)
Indexes created on startup in `server.py`:
- `users`: `email` (unique), `company_id`, `(company_id, role)`, `(company_id, department)`
- `leave_requests`: `(company_id, employee_id)`, `(company_id, status)`
- Always query on indexed fields for company scoping

## Environment Variables

### Backend
```plaintext
MONGO_URL=mongodb+srv://...              # Atlas connection string
DB_NAME=ems_database                     # Default database name
JWT_SECRET=your_secret_key               # For token signing (HS256)
JWT_ALGORITHM=HS256                      # Token algorithm
ACCESS_TOKEN_EXPIRE_MINUTES=10080        # 7 days default
CORS_ORIGINS=*                           # Frontend URL in production
GROQ_API_KEY=...                         # LLaMA inference (AI chat)
QDRANT_URL=...                           # Vector DB (RAG documents)
```

### Frontend
```plaintext
VITE_BACKEND_URL=http://localhost:8001   # API base URL (note VITE_ prefix)
VITE_TEST_BASE_URL=http://localhost:3000 # Playwright base URL for tests
```

## Development & Deployment

### Backend Commands
```bash
uvicorn server:app --host 0.0.0.0 --port 8001 --reload  # Dev with hot reload
pytest                                                    # Run tests
# API docs at http://localhost:8001/docs (auto-generated)
```

### Frontend Commands
```bash
yarn dev        # Vite dev server (hot reload)
yarn build      # Production build (output: build/)
yarn test:e2e   # Playwright tests
```

### Deployment
- **Frontend**: Vercel (from `frontend/`) — runs `yarn build`
- **Backend**: Emergent platform with Gunicorn workers
- **Database**: MongoDB Atlas
- **Vector DB**: Qdrant (for AI documents)

## Code Organization Quick Reference

| Component | Location | Pattern |
|-----------|----------|---------|
| Auth | `backend/auth_routes.py` | Signup/login, JWT creation |
| Features | `backend/{leave,attendance,salary,*}_routes.py` | Feature endpoints, all use `Depends(get_current_user)` |
| Models | `backend/models.py` | Pydantic validation, ASEAN countries |
| Database | `backend/server.py` | Startup indexes, Motor client |
| Frontend Router | `frontend/src/App.tsx` | Protected routes by role (Admin/Employee) |
| API Calls | `frontend/src/services/api.ts` | Feature-grouped services with axios |
| Auth Context | `frontend/src/contexts/AuthContext.tsx` | Token/user state, localStorage sync |
| E2E Tests | `frontend/tests/e2e/` | Playwright with page objects |
| Setup | `frontend/tests/setup/auth.setup.ts` | Pre-authenticate, store state |</content>
<parameter name="filePath">/workspaces/HR-App-lumina/.github/copilot-instructions.md