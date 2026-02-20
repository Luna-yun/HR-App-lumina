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

### Run Accessibility Tests (axe)
```bash
npm run test:accessibility
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
│   └── auth.setup.ts          # Authentication setup
├── pages/
│   ├── LoginPage.ts           # Login page object
│   ├── DashboardPage.ts       # Dashboard page object
│   └── EmployeePage.ts        # Employee management page object
├── e2e/
│   ├── auth.spec.ts           # Authentication tests
│   ├── dashboard.spec.ts      # Dashboard tests
│   ├── accessibility.spec.ts  # Accessibility checks (axe)
│   ├── employee.spec.ts       # Employee management tests
│   └── navigation.spec.ts     # Navigation tests
└── api/
    └── auth.api.spec.ts       # API and access-control tests
```

## Explanation of Test Structure

### Page Object Model
Each page has a POM class in `tests/pages/` encapsulating locators and actions.

### Authentication Setup
`auth.setup.ts` logs in with test credentials and writes `playwright/.auth/user.json` for reuse.

## Test Categories Implemented

- Functional (E2E UI): `tests/e2e/*.spec.ts` (login, dashboard, navigation, employee).
- API Testing: `tests/api/auth.api.spec.ts` — validates login (401/200) and protected endpoints.
- Security / Access Control: API-level checks ensure protected endpoints return 401/403 without token and 200 with valid token.
- Accessibility: `tests/e2e/accessibility.spec.ts` uses `@axe-core/playwright`; tests fail on violations for `/login` and `/admin`.

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
