# Performance Testing Quick Start ⚡

**TL;DR**: Run all performance tests in 2 minutes with one command.

## The 2-Minute Setup

```bash
# Install dependencies (one time)
cd frontend
npm install
cd ..

# Install backend dependencies (one time)  
pip install -r backend/requirements.txt

# Run all performance tests
npm run test:performance
```

**Expected result**: ✅ All tests pass in ~45 seconds

---

## What This Tests

| Component | What We Measure | Expected Time |
|-----------|-----------------|---|
| **Frontend** | How fast pages load | 1-10 seconds |
| **Backend** | How fast API responds | <2 seconds |
| **Concurrent** | Multiple users at once | All succeed |
| **Database** | Query performance | Scales well |

---

## Run Individual Tests

### Frontend Only (5 minutes)
```bash
npm run test:performance:frontend

# View details
npm run test:performance:frontend:report
```

### Backend Only (1 minute)
```bash
npm run test:performance:backend
```

### Include in Full Test Suite
```bash
# E2E + API + Accessibility + Performance
npm run test:all
```

---

## Sample Output (What You'll See)

### Frontend Results
```
✓ 8 tests passed
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[PERF] Login page load performance
  ✓ Page loaded in 1234ms (< 5000ms limit)

[PERF] Admin dashboard load performance
  ✓ Page loaded in 2456ms (< 8000ms limit)

[PERF] Employee list load performance
  ✓ Page loaded in 2103ms (< 8000ms limit)

✅ All pages loaded within expected time!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Backend Results
```
test_login_response_time PASSED
[PERF] Login endpoint response time: 1234.56ms ✅

test_get_user_profile_response_time PASSED
[PERF] Get user profile response time: 456.78ms ✅

test_concurrent_login_requests PASSED
[PERF] Concurrent Login Requests (5 parallel):
  - Average: 1523.21ms
  - Min: 1234.56ms
  - Max: 1876.32ms ✅

test_heavy_load_simulation PASSED
[PERF] Heavy Load Simulation (10 concurrent requests):
  - Average: 987.65ms
  - P95: 1456.78ms
  - P99: 1876.32ms
  - Success rate: 100% ✅

✓ 8 passed in 45.23s
```

---

## Troubleshooting (30 seconds)

### "Cannot find module 'pytest'"
```bash
pip install -r backend/requirements.txt
npm run test:performance:backend  # Try again
```

### "ConnectionError: Failed to connect to backend"
```bash
# Verify backend is running
curl https://brighthr.emergent.host/docs

# Should return 200 OK
```

### "Test timeout after 30 seconds"
```bash
# Check your internet connection
ping google.com

# If slow, run during off-peak hours
# Tests may timeout due to network latency
```

### "Unauthorized: 401 errors"
```bash
# Set test credentials
export TEST_USER_EMAIL="SGadmin@gmail.com"
export TEST_USER_PASSWORD="TestPass123!"

npm run test:performance:backend
```

---

## Performance Health Checklist ✅

After running tests, verify:

- [ ] **All tests pass** (show ✓ next to each test name)
- [ ] **Load times reasonable** (< 10s max, < 5s average)
- [ ] **Concurrent success** (100% success rate, no timeouts)
- [ ] **No errors** (0 failed tests)
- [ ] **Run time** (~45 seconds for all performance tests)

If any item fails → Check [PERFORMANCE_TESTING_GUIDE.md](./PERFORMANCE_TESTING_GUIDE.md)

---

## What Performance Targets Mean

### Page Load Time
- **< 2 seconds** = ⭐⭐⭐⭐⭐ Excellent
- **2-4 seconds** = ⭐⭐⭐⭐ Good
- **4-8 seconds** = ⭐⭐⭐ Acceptable
- **> 8 seconds** = ⚠️ Needs improvement

### API Response Time
- **< 500ms** = ⭐⭐⭐⭐⭐ Excellent (instant)
- **500ms-1s** = ⭐⭐⭐⭐ Good (responsive)
- **1-2 seconds** = ⭐⭐⭐ Acceptable
- **> 2 seconds** = ⚠️ Slow (user notices)

### Concurrent Load (5 users at once)
- **All succeed** = ✅ Healthy
- **99%+ success** = ⚠️ Monitor
- **< 99% success** = ❌ Performance issue

---

## Performance Scripts Reference

| Command | What it does | Time |
|---------|-------------|------|
| `npm run test:performance` | Frontend + Backend | 1.5 min |
| `npm run test:performance:frontend` | Pages load times | 45 sec |
| `npm run test:performance:backend` | API response times | 45 sec |
| `npm run test:performance:frontend:report` | View detailed report | Opens browser |
| `npm run test:all` | All tests (E2E + API + A11Y + Perf) | 3-5 min |

---

## Integration with Pull Requests

Performance tests **automatically run** when you:
1. Create a pull request
2. Push new commits to a PR
3. Before merging to `main`

**If tests fail**, your PR cannot merge. Fix performance before pushing again.

---

## Detailed Guides

For more information, see:

- **Frontend Performance**: [frontend/PERFORMANCE_TESTING_GUIDE.md](./frontend/PERFORMANCE_TESTING_GUIDE.md)
  - Page load metrics
  - Core Web Vitals
  - Browser profiling

- **Backend Performance**: [backend/PERFORMANCE_TESTING_GUIDE.md](./backend/PERFORMANCE_TESTING_GUIDE.md)
  - API response times
  - Concurrent load handling
  - Database optimization

- **General Testing**: [frontend/TESTING_GUIDE.md](./frontend/TESTING_GUIDE.md)
  - E2E, API, accessibility tests
  - Test architecture
  - Troubleshooting

---

## Performance Red Flags 🚨

Stop and investigate if you see:

1. **Page load > 10 seconds**
   - Network issue or backend down
   - Feature added too much complexity

2. **API endpoint > 3 seconds**
   - Missing database index
   - Unoptimized query
   - Backend under heavy load

3. **Success rate < 100%**
   - Backend crashes under load
   - Database connection issues
   - Memory leak

4. **P95 timeout (> 30 seconds)**
   - Critical performance regression
   - Needs immediate investigation

---

## Next Steps

After running performance tests:

1. **Performance is great** ✅
   - Merge your PR
   - Deploy to production

2. **Performance needs work** ⚠️
   - Review [PERFORMANCE_TESTING_GUIDE.md](./PERFORMANCE_TESTING_GUIDE.md)
   - Identify slow endpoints/pages
   - Optimize and re-test

3. **Tests timing out** ❌
   - Check backend health
   - Check internet connection
   - Review troubleshooting section

---

## Support Commands

```bash
# View current npm scripts
npm run | grep test

# Run only one type of test
npm run test:performance:frontend
npm run test:performance:backend

# See test details and errors
npm run test:performance -- --verbose

# Generate HTML reports
npm run test:performance:frontend:report

# Use Python/pytest directly
cd backend
pytest ../tests/test_performance.py -v
```

---

## FAQ

**Q: How often should I run performance tests?**
A: Automatically on every PR. Manually when testing local changes.

**Q: Do performance tests affect production?**
A: No! They only read data from existing test accounts. No changes are made.

**Q: Can I parallelize the tests?**
A: Yes! Tests already run in parallel. Runs in ~45 seconds.

**Q: Why does my performance vary between runs?**
A: Network latency, browser cache, system load. Variations of ±10% are normal.

**Q: What if tests pass locally but fail in CI?**
A: CI may have network latency. Standards may differ. Contact the team.

**Q: How do I report performance issues?**
A: Open an issue with the test output, metrics, and reproduction steps.

---

## Summary

✅ **Easy to Run**: One command (`npm run test:performance`)
✅ **Easy to Understand**: Clear metrics and targets
✅ **Early Warning**: Catches performance regressions before production
✅ **Documented**: Guides available for detailed investigation
✅ **Automated**: Runs automatically on every PR

**Healthy performance looks like**:
- ✅ All tests pass
- ✅ Load times < 8 seconds
- ✅ API responses < 2 seconds
- ✅ 100% success under load
