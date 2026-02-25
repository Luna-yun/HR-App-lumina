# LuminaHR Testing Guide

## Overview

This guide covers the end-to-end testing setup for the LuminaHR frontend application using Playwright. The tests validate critical user workflows against the deployed backend at `https://brighthr.emergent.host/`.

## Testing Stack

- **Framework**: Playwright v1.x
- **Language**: TypeScript
- **Pattern**: Page Object Model
- **Execution**: Parallel across Chromium, Firefox, and WebKit
# LuminaHR Testing Guide

## Overview

This guide covers end-to-end (E2E), API, security/access-control, and accessibility testing for the LuminaHR frontend using Playwright. Tests use the Page Object Model and are organized for clarity and deterministic execution.

## Testing Stack

- Framework: Playwright v1.x
- Language: TypeScript
- Pattern: Page Object Model
- Execution: Parallel across Chromium, Firefox, and WebKit (configurable)

## Installation Steps

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup
```bash
cd frontend
npm install
npx playwright install --with-deps
```

Note: Scripts work on Windows, macOS, and Linux. Windows users don't need to do anything special—the scripts use `cross-env` for compatibility.

### Environment Configuration
Tests can run against a local dev server or a backend API. Configure the backend and test user via environment variables. Recommended variables:

```env
# frontend base (used by Playwright baseURL for UI tests)
VITE_TEST_BASE_URL=http://localhost:3000

# backend API used by API tests (include protocol + port)
TEST_BACKEND_URL=http://localhost:8001

# deterministic test user (CI should set these)
TEST_USER_EMAIL=SGadmin@gmail.com
TEST_USER_PASSWORD=TestPass123!

# optional legacy env
REACT_APP_BACKEND_URL=$TEST_BACKEND_URL
VITE_BACKEND_URL=$TEST_BACKEND_URL
```

Notes:
- Prefer running tests against a seeded local/test backend. Do not run tests against production.
- CI should provision a dedicated test user or seed the DB for deterministic results.

## How to Run Frontend Locally

### Development Server
```bash
cd frontend
npm run dev
```
App will be at `http://localhost:3000` by default.

### Production Build
```bash
cd frontend
npm run build
npm run preview
```

## How to Run Playwright Tests

### Run All E2E Tests
```bash
cd frontend
npm run test:e2e
```

### Run Tests with UI Mode
```bash
cd frontend
npm run test:e2e:ui
```

### View Test Reports
```bash
cd frontend
npm run test:e2e:report
```

### Run API Tests
```bash
npm run test:api
```

### Run Specific Tests
```bash
# Run only auth tests
npx playwright test tests/e2e/auth.spec.ts

# Run tests in a specific browser
npx playwright test --project=chromium

# Run tests in headed mode
npx playwright test --headed
```

## Test Structure

```
frontend/tests/
├── setup/
│   └── auth.setup.ts              # Authentication setup
├── pages/
│   ├── LoginPage.ts               # Login page object
│   ├── DashboardPage.ts           # Dashboard page object
│   └── EmployeePage.ts            # Employee management page object
├── e2e/
│   ├── auth.spec.ts               # Authentication tests
│   ├── dashboard.spec.ts          # Dashboard tests
│   ├── employee.spec.ts           # Employee management tests
│   └── navigation.spec.ts         # Navigation tests
├── api/
│   └── auth.api.spec.ts           # API and access-control tests
└── a11y/
    └── accessibility.spec.ts      # WCAG 2.1 accessibility audits (non-blocking)
```

## Explanation of Test Structure

### Page Object Model
Each page has a POM class in `tests/pages/` encapsulating locators and actions.

### Authentication Setup
`auth.setup.ts` logs in with test credentials and writes `playwright/.auth/user.json` for reuse.

## Test Categories Implemented

- **Functional (E2E UI)**: `tests/e2e/*.spec.ts` (login, dashboard, navigation, employee).
- **API Testing**: `tests/api/auth.api.spec.ts` — validates login (401/200) and protected endpoints.
- **Security / Access Control**: API-level checks ensure protected endpoints return 401/403 without token and 200 with valid token.
- **Accessibility Audits**: `tests/a11y/accessibility.spec.ts` — WCAG 2.1 compliance scanning (non-blocking, informational).

All test categories run across Chromium, Firefox, and WebKit browsers for cross-browser compatibility (except accessibility audits which run on Chromium only).

## Accessibility Testing

### Overview
Accessibility tests scan key pages using axe-core to detect WCAG 2.1 violations. **These tests are non-blocking and always pass**—violations are reported for awareness and gradual improvement.

### Why Non-Blocking?
Accessibility is a continuous improvement process. Non-blocking tests allow teams to:
- Track accessibility progress over sprints/releases
- Avoid build failures while remediating issues
- Prioritize fixes based on impact and severity
- Integrate accessibility into the CI/CD pipeline without friction

### Run Accessibility Tests
```bash
# Run all accessibility audits
npm run test:accessibility

# View accessibility report
npm run test:accessibility:report
```

### Pages Audited
- Login page
- Admin dashboard
- Employee dashboard
- Employee leave management
- Admin employees management
- Admin attendance
- Admin analytics

### How to Read Results
When running `npm run test:a11y`, output shows violations per page:
```
[A11Y] Login Page - 2 accessibility issue(s) found
  - color-contrast: Ensures the contrast between foreground and background colors meets WCAG standards
  - label: Ensures form elements have associated labels
[A11Y] Admin Dashboard - ✓ No violations found
```

### Interpreting Violations
Each violation includes the `id` (rule name) and `help` (description). Common issues:
- `color-contrast`: Text doesn't meet WCAG AA contrast ratios
- `label`: Form fields missing associated labels
- `heading-order`: Heading structure is not properly hierarchical
- `button-name`: Buttons lack accessible names
- `alt-text`: Images missing alt text

### Adding More Pages to Audit
Edit `tests/a11y/accessibility.spec.ts` and add a new test:
```typescript
test('my-new-page accessibility', async ({ page }) => {
  await page.goto('/route-to-page');
  await injectAxe(page);
  
  const violations = await getViolations(page);
  if (violations.length > 0) {
    console.log(`[A11Y] My New Page - ${violations.length} issue(s) found`);
    violations.forEach((v) => {
      console.log(`  - ${v.id}: ${v.help}`);
    });
  } else {
    console.log('[A11Y] My New Page - ✓ No violations found');
  }
});
```

Then run `npm run test:accessibility` to test it.
```

## Performance Testing 📊

Performance testing measures how **fast** the application loads and responds. Tests check both frontend page load times and backend request response times.

### What Gets Tested?

**Frontend Performance** (Playwright):
- Page load times for all major routes (login, dashboards, lists, analytics)
- Browser rendering performance
- Response times under normal conditions

**Backend Performance** (Pytest):
- Individual API endpoint response times
- Concurrent request handling
- Database query performance
- System stability under load

### Running Performance Tests

```bash
# All performance tests (frontend + backend)
npm run test:performance

# Frontend only
npm run test:performance:frontend

# Backend only
npm run test:performance:backend

# View detailed report
npm run test:performance:frontend:report
```

### Example Output

Frontend Performance:
```
[PERF] Login page load performance ✓
  ✓ (1.2s) - Page loaded in 1234ms
[PERF] Login Page Load Time: 1234ms

[PERF] Admin dashboard load performance ✓
  ✓ (2.1s) - Page loaded in 2456ms
[PERF] Admin Dashboard Load Time: 2456ms
```

Backend Performance:
```
test_login_response_time PASSED
[PERF] Login endpoint response time: 1234.56ms

test_concurrent_login_requests PASSED
[PERF] Concurrent Login Requests (5 parallel):
  - Average: 1523.21ms
  - Min: 1234.56ms
  - Max: 1876.32ms

✓ 8 passed in 45.23s
```

### Performance Targets

**Frontend Page Loads**:
- Login: < 5 seconds
- Dashboards: < 8 seconds
- Lists/Tables: < 8 seconds
- Analytics/Heavy Pages: < 10 seconds

**Backend Endpoints**:
- Login: < 2 seconds
- Profile fetch: < 1 second
- List endpoints: < 3 seconds
- Concurrent requests (5): All < 5 seconds

**Success Metrics**:
- P95: 95% of requests faster than this time
- P99: 99% of requests faster than this time
- Success Rate: 100% (no failures under load)

### Interpreting Results

**All tests pass ✅**: Performance is healthy

**Tests slow down over time ⚠️**: Investigate:
- New database queries
- Additional dependencies
- Backend load issues

**Tests timeout ❌**: Critical performance issue:
- Backend may be down
- Network connectivity problem
- Database performance degraded

### For Detailed Guidance

See [PERFORMANCE_TESTING_GUIDE.md](./PERFORMANCE_TESTING_GUIDE.md) for:
- Complete metrics explanation
- Troubleshooting guide
- Performance optimization tips
- Environment variable setup

## Deterministic Test Guidance

- Use `TEST_USER_EMAIL`/`TEST_USER_PASSWORD` env variables to target a stable account.
- Prefer a local or test backend seeded with known data for CI.
- If an endpoint is unstable, mock it or isolate it in API tests.

## CI Recommendations

- Run `npm ci` and `npx playwright install --with-deps`.
- Set `TEST_BACKEND_URL`, `TEST_USER_EMAIL`, and `TEST_USER_PASSWORD` in CI secrets.
- Use `npm run test:all` to run the full matrix.

## Troubleshooting

- Authentication issues: verify test user exists and env vars are correct.
- Timeouts: increase timeout or check network/back-end health.
- Element not found: prefer `data-testid` or add explicit waits.

## Best Practices

- Use POM for new tests.
- Prefer `data-testid` for stable selectors.
- Keep tests independent and avoid relying on production data.

## Support

For issues: consult Playwright docs, check browser console/network logs, and validate backend connectivity.
