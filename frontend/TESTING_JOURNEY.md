# LuminaHR Testing Journey - Complete Workflow

This guide shows the exact testing workflow for LuminaHR, including E2E, accessibility, and API testing running in parallel.

## 🚀 Complete Testing Workflow

### Step 1: Fresh Setup
```bash
# In your local repo
git fetch origin
git reset --hard origin/main
```

### Step 2: Install Dependencies & Browser Binaries
```bash
cd frontend
npm install
npx playwright install --with-deps
```

### Step 3: Verify Frontend Works Locally
```bash
npm run dev
```
- Open browser to `http://localhost:3000`
- Verify login page loads
- Test login with valid credentials
- Verify admin/employee dashboards load
- Close this terminal when satisfied

### Step 4: Terminal 1 - Functional Testing (E2E)
```bash
cd frontend
npm run test:e2e
```

**What to expect:**
- Tests will take several minutes ⏳
- You may see error messages - this is normal, tests handle these situations
- Tests run 3x (Chromium, Firefox, WebKit)
- Tests use deployed backend at `https://brighthr.emergent.host/`
- **Don't stop the test!** Let it complete

### Step 5: Terminal 2 - Accessibility Testing (While E2E runs)
```bash
# Open a NEW terminal while E2E tests are running
cd frontend
npm run test:accessibility
```

**What to expect:**
- Scans 7 pages: login, admin dashboard, employee dashboard, leave, employees, attendance, analytics
- Reports accessibility issues (color-contrast, labels, button names, etc.)
- **Always passes** - violations are reported, not blocking
- Console output shows each page's status: `[A11Y] Page Name - N issue(s) found` or `✓ No violations found`
- Runs on Chromium only (no need to repeat 3x)

### Step 6: Terminal 3 - API Testing (While E2E & A11Y run)
```bash
# Open a THIRD terminal while other tests are running
cd frontend
npm run test:api
```

**What to expect:**
- Tests auth endpoints against deployed backend
- Validates login (401 vs 200), protected routes, token validation
- Faster than E2E tests
- Runs on Chromium only

---

## 📊 Expected Timeline

| Terminal | Test | Duration | Runs | Backend |
|----------|------|----------|------|---------|
| 1 | E2E (test:e2e) | 5-10 min | 3 browsers | Deployed |
| 2 | A11Y (test:accessibility) | 1-2 min | 1 browser | Deployed |
| 3 | API (test:api) | 1 min | 1 browser | Deployed |

**All 3 run in parallel** - total time ~10 mins, not 16 mins!

---

## 📝 What Each Test Does

### E2E Tests (Functional)
✓ Tests real user workflows  
✓ Verifies page navigation  
✓ Checks UI elements display correctly  
✓ Tests cross-browser compatibility (3 browsers)  
✓ Runs against deployed backend  

**Run command:**
```bash
npm run test:e2e
```

**Optional: Interactive UI mode**
```bash
npm run test:e2e:ui
```

### Accessibility Tests (A11Y)
✓ Scans for WCAG 2.1 violations  
✓ Checks color contrast, labels, button names, etc.  
✓ **Non-blocking** - doesn't fail the build  
✓ Reports findings for awareness  
✓ Helps track accessibility progress over time  

**Run command:**
```bash
npm run test:accessibility
```

**View detailed report:**
```bash
npm run test:accessibility:report
```

### API Tests
✓ Tests backend endpoints directly (no UI)  
✓ Validates authentication (login, token validation)  
✓ Tests protected routes (401 without token, 200 with token)  
✓ Faster than E2E  
✓ Independent of frontend UI  

**Run command:**
```bash
npm run test:api
```

---

## 🎯 Run All Tests at Once

To run all tests sequentially (E2E → API → Accessibility):
```bash
npm run test:all
```

---

## 📋 Checklist for PR

Before pushing:
- ✅ Fresh setup (git fetch/reset)
- ✅ Dependencies installed
- ✅ App runs locally on localhost:3000
- ✅ E2E tests pass (npm run test:e2e)
- ✅ Accessibility audit complete (npm run test:accessibility)
- ✅ API tests pass (npm run test:api)
- ✅ Check test reports if needed

---

## 🛠️ Troubleshooting

### "Element not found" during E2E
- Normal - some elements may not load if backend is slow
- Tests handle this and continue
- Don't stop the test

### Accessibility test fails?
- **They don't fail!** Violations are reported, not blocking
- Check console output for specific issues
- Fix them incrementally

### API test fails?
- Verify deployed backend is reachable: `https://brighthr.emergent.host/`
- Check test user credentials exist
- Check network connectivity

### Tests timeout?
- Run tests individually instead of in parallel
- Check if localhost:3000 (dev server) is running for E2E config
- Increase timeout in playwright.config.ts if needed

---

## 📚 Test Structure

```
frontend/tests/
├── setup/
│   └── auth.setup.ts              # Stores auth credentials
├── pages/
│   ├── LoginPage.ts               # Reusable login page object
│   ├── DashboardPage.ts           # Reusable dashboard page object
│   └── EmployeePage.ts            # Reusable employee page object
├── e2e/
│   ├── auth.spec.ts               # Login/auth workflows
│   ├── dashboard.spec.ts          # Admin dashboard
│   ├── employee.spec.ts           # Employee management
│   └── navigation.spec.ts         # Navigation flows
├── api/
│   └── auth.api.spec.ts           # API endpoint tests
└── a11y/
    └── accessibility.spec.ts      # WCAG 2.1 audits (non-blocking)
```

---

## 🔗 Related Documentation

- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Detailed testing setup and configuration
- [tests/a11y/README.md](./tests/a11y/README.md) - Accessibility testing deep dive
- [A11Y_IMPLEMENTATION.md](./A11Y_IMPLEMENTATION.md) - Implementation summary

---

## ✅ Accessibility Testing is Non-Blocking

**Key Point:** The accessibility tests in `npm run test:accessibility` **ALWAYS PASS**. They report WCAG 2.1 violations without failing the test suite. This allows:

- Teams to track accessibility metrics over sprints
- Gradual improvement without build failures
- Integration into CI/CD from day one
- Focus on high-impact violations first

Example output:
```
[A11Y] Login Page - ✓ No violations found
[A11Y] Admin Dashboard - 2 accessibility issue(s) found
  - color-contrast: Ensures the contrast...
  - label: Ensures form elements...
```

The test passes, but issues are logged for awareness.

---

**Ready to test?** Follow the complete workflow above and run all 3 tests in parallel! 🚀
