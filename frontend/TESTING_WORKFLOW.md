# Testing Journey - Visual Reference

## Complete Parallel Testing Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 1: Fresh Setup (One Time)                                   │
├─────────────────────────────────────────────────────────────────┤
│ $ git fetch origin                                               │
│ $ git reset --hard origin/main                                   │
│                                                                  │
│ $ cd frontend                                                    │
│ $ npm install                                                    │
│ $ npx playwright install --with-deps                             │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 2: Verify Frontend Works (One Time)                         │
├─────────────────────────────────────────────────────────────────┤
│ $ npm run dev                                                    │
│                                                                  │
│ → Open http://localhost:3000 in browser                         │
│ → Test login, verify dashboards load                            │
│ → Close terminal when satisfied                                 │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────────────────────┐
│                    STEP 3: PARALLEL TESTING (3 Terminals)                    │
├────────────────────────────────┬───────────────────┬───────────────────────────┤
│                                │                   │                           │
│  Terminal 1: FUNCTIONAL E2E    │  Terminal 2: A11Y │  Terminal 3: API        │
│  ════════════════════════════  │  ═══════════════  │  ═════════════════       │
│                                │                   │                           │
│  $ cd frontend                 │  $ cd frontend    │  $ cd frontend            │
│  $ npm run test:e2e            │  $ npm run        │  $ npm run test:api      │
│                                │    test:...       │                           │
│  ⏱️  Duration: 5-10 min         │  accessibility    │  ⏱️  Duration: 1 min      │
│  🌐 Browsers: 3x               │                   │  🌐 Browsers: 1x         │
│  (Chromium, Firefox, WebKit)   │  ⏱️  Duration:     │  (Chromium only)         │
│                                │    1-2 min        │                           │
│  ✓ Tests user workflows        │                   │  ✓ Tests endpoints       │
│  ✓ Tests navigation            │  🌐 Browser:      │  ✓ Tests auth            │
│  ✓ Tests cross-browser         │    1x             │  ✓ Tests protected       │
│    compatibility               │    (Chromium)     │    routes                │
│                                │                   │                           │
│  📊 Result: PASS/FAIL          │  ✓ Tests WCAG     │  📊 Result: PASS/FAIL   │
│                                │    2.1 standards  │                           │
│  Notes:                        │  ✓ Scans 7 pages │  Notes:                  │
│  • May show errors             │                   │  • Fast and independent  │
│  • This is NORMAL              │  📊 Result:       │  • No UI needed          │
│  • Don't stop the test!        │    ALWAYS PASS    │  • Runs on deployed      │
│  • Let it complete             │                   │    backend               │
│  • Runs on deployed backend    │  Notes:           │                          │
│    https://brighthr...         │  • Always passes  │                          │
│                                │  • Reports        │                          │
│                                │    violations     │                          │
│                                │  • Non-blocking   │                          │
├────────────────────────────────┴───────────────────┴───────────────────────────┤
│                            ↓ All Complete ↓                                    │
│                    Total Time: ~10 minutes                                     │
│              (Running in parallel, not sequential)                             │
└────────────────────────────────────────────────────────────────────────────────┘
```

## Quickstart Commands (Copy-Paste)

### Setup (First Time Only)
```bash
# Pull latest
git fetch origin
git reset --hard origin/main

# Setup
cd frontend
npm install
npx playwright install --with-deps

# Verify it works
npm run dev
# → Check localhost:3000 works, then close this terminal
```

### Testing (Open 3 Terminals)

**Terminal 1:**
```bash
cd frontend
npm run test:e2e
```

**Terminal 2** (while Terminal 1 runs):
```bash
cd frontend
npm run test:accessibility
```

**Terminal 3** (while Terminals 1 & 2 run):
```bash
cd frontend
npm run test:api
```

---

## What You'll See

### E2E Test Output
```
Running 18 tests using 3 workers
 ✓ auth › simple page load test (2s)
 ✓ auth › successful login redirects to dashboard (5s)
 ✓ ...more tests...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 18 passed (45s)
```

### Accessibility Test Output
```
========================================
Accessibility Audits
========================================
[A11Y] Login Page - ✓ No violations found
[A11Y] Admin Dashboard - 2 accessibility issue(s) found
  - color-contrast: Ensures the contrast...
  - label: Ensures form elements...
[A11Y] Employee Dashboard - ✓ No violations found
[A11Y] Admin Employees - ✓ No violations found
...
========================================
 7 passed (30s)
```

### API Test Output
```
========================================
Auth API
========================================
 ✓ login with wrong credentials returns 401 (1s)
 ✓ login with valid credentials returns 200 and token (1s)
 ✓ protected endpoint requires token (2s)
 ✓ protected endpoint accepts valid token (1s)
========================================
 4 passed (5s)
```

---

## Run All Tests Sequentially (Alternative)

If you want to run everything one after another instead of in parallel:

```bash
npm run test:all
```

This runs:
1. E2E tests
2. API tests  
3. Accessibility tests

Total time: ~15 minutes (without parallelization)

---

## View Test Reports

After tests complete:

```bash
# E2E report
npm run test:e2e:report

# Accessibility report  
npm run test:accessibility:report
```

Both open HTML reports in your browser.

---

## Key Points to Remember

✅ **E2E tests may show errors** - This is normal. Tests handle them and continue.  
✅ **Accessibility tests always pass** - They report findings, never block builds.  
✅ **API tests are fast** - 1 minute usually.  
✅ **Run in parallel** - Open 3 terminals to test faster.  
✅ **All use deployed backend** - `https://brighthr.emergent.host/`  
✅ **Don't stop tests early** - Let them complete naturally.  

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Element not found" | Normal for E2E. Tests handle this. Don't stop. |
| Accessibility test shows violations | This is expected! It means tests are working. Violations are non-blocking. |
| "Failed to connect to backend" | Check: `https://brighthr.emergent.host/` is accessible |
| Tests timeout | Increase `timeout` in `playwright.config.ts` |
| Port 3000 already in use | Kill existing process: `lsof -ti:3000 \| xargs kill -9` |

---

## PR Checklist

Before pushing to your forked repo:

- [ ] Fresh setup with `git fetch/reset`
- [ ] Installed dependencies
- [ ] Verified `localhost:3000` works
- [ ] E2E tests pass or show expected errors
- [ ] Accessibility tests run (always pass)
- [ ] API tests pass
- [ ] All test reports generated cleanly

---

**You're all set! Open 3 terminals and run the tests in parallel** 🚀
