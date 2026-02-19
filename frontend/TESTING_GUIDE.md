# LuminaHR Testing Guide

## Overview

This guide covers the end-to-end testing setup for the LuminaHR frontend application using Playwright. The tests validate critical user workflows against the deployed backend at `https://brighthr.emergent.host/`.

## Testing Stack

- **Framework**: Playwright v1.x
- **Language**: TypeScript
- **Pattern**: Page Object Model
- **Execution**: Parallel across Chromium, Firefox, and WebKit
- **Authentication**: Storage state reuse for performance

## Installation Steps

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup
```bash
cd frontend
npm install
npx playwright install
```

### Environment Configuration
The tests use the deployed backend. Ensure these environment variables are set:

```env
REACT_APP_BACKEND_URL=https://brighthr.emergent.host/
VITE_BACKEND_URL=https://brighthr.emergent.host/
WDS_SOCKET_PORT=443
ENABLE_HEALTH_CHECK=false
```

**Note**: Tests require a test admin user with credentials:
- Email: `testadmin@luminahr.com`
- Password: `TestPass123!`

If this user doesn't exist in the deployed backend, create it manually or update the credentials in `tests/setup/auth.setup.ts`.

## How to Run Frontend Locally

### Development Server
```bash
cd frontend
npm run dev
```
The app will be available at `http://localhost:3000`

### Production Build
```bash
cd frontend
npm run build
npm run preview
```

## How to Run Playwright Tests

### Run All Tests
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
└── e2e/
    ├── auth.spec.ts           # Authentication tests
    ├── dashboard.spec.ts      # Dashboard tests
    ├── employee.spec.ts       # Employee management tests
    └── navigation.spec.ts     # Navigation tests
```

## Explanation of Test Structure

### Page Object Model
Each page has a corresponding class in `tests/pages/` that encapsulates:
- Locators for page elements
- Actions that can be performed on the page
- Assertions for page state

### Authentication Setup
The `auth.setup.ts` file:
1. Logs in with test credentials
2. Saves the authentication state to `playwright/.auth/user.json`
3. Other tests reuse this state for faster execution

### Test Categories

#### Authentication Tests (`auth.spec.ts`)
- Successful login redirects to dashboard
- Failed login displays error message

#### Dashboard Tests (`dashboard.spec.ts`)
- Dashboard loads successfully
- Key widgets are visible
- Sidebar navigation works

#### Employee Management Tests (`employee.spec.ts`)
- Employee list loads
- Search functionality works
- Employee count is displayed

#### Navigation Tests (`navigation.spec.ts`)
- Unauthenticated users are redirected to login
- Authenticated users can access protected routes
- Sidebar navigation functions properly

## How Authentication Reuse Works

1. **Setup Phase**: `auth.setup.ts` runs first and creates `playwright/.auth/user.json`
2. **Test Execution**: Other test projects depend on the setup and load the saved auth state
3. **Performance**: Tests start already authenticated, avoiding login delays

## Troubleshooting Common Issues

### Tests Fail Due to Authentication
- Ensure the test user `testadmin@luminahr.com` exists in the deployed backend
- Check that the password `TestPass123!` is correct
- Verify backend is accessible

### Tests Timeout
- Increase timeout in `playwright.config.ts`
- Check network connectivity to backend
- Ensure frontend dev server is running

### Element Not Found Errors
- Page may not be fully loaded; add `await page.waitForLoadState('networkidle')`
- Selectors may be unstable; consider adding `data-testid` attributes
- Check if the element exists in the current user role

### Browser Dependencies
- Run `npx playwright install-deps` if browsers fail to launch
- Use `--headed` mode to debug visually

### Flaky Tests
- Add proper waits: `await page.waitForSelector()` or `await page.waitForTimeout()`
- Use more specific selectors
- Check for race conditions in the application

## Best Practices

### Writing New Tests
1. Create page objects for new pages
2. Use stable selectors (prefer `data-testid` over CSS classes)
3. Add proper waits and assertions
4. Keep tests independent and isolated

### Selector Strategy
1. **Primary**: `data-testid` attributes (most stable)
2. **Secondary**: Semantic selectors (roles, labels)
3. **Fallback**: CSS selectors with context

### Adding data-testid Attributes
For unstable selectors, add `data-testid` to components:

```tsx
<Button data-testid="submit-btn">Submit</Button>
<div data-testid="user-list">
  {/* content */}
</div>
```

## Command List Summary

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run test:e2e` | Run all E2E tests |
| `npm run test:e2e:ui` | Run tests with UI mode |
| `npm run test:e2e:report` | View test reports |
| `npx playwright install` | Install browsers |
| `npx playwright test --headed` | Run tests in headed mode |

## Contributing

When adding new tests:
1. Follow the Page Object Model pattern
2. Add appropriate `data-testid` attributes if needed
3. Update this guide if new patterns are introduced
4. Ensure tests pass in all browsers

## Support

For issues with the testing setup:
1. Check the Playwright documentation
2. Review browser console logs
3. Verify backend connectivity
4. Check network tab for failed requests