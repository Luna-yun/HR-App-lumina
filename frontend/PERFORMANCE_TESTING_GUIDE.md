# Performance Testing Guide 🚀

This guide explains how to test the **LuminaHR** application's performance - both the frontend (React app) and backend (FastAPI server).

## What is Performance Testing?

Performance testing measures how **fast** your application runs. It answers questions like:
- ✅ How long does it take to load a page?
- ✅ Can the backend handle multiple users at the same time?
- ✅ Are there slow database queries?
- ✅ Does the app stay responsive under heavy use?

---

## Quick Start (5 minutes)

### Run All Performance Tests
```bash
# Frontend + Backend
npm run test:performance

# View results
npm run test:performance:frontend:report
```

### Run Only Frontend Performance
```bash
npm run test:performance:frontend
```

### Run Only Backend Performance
```bash
npm run test:performance:backend
```

---

## Frontend Performance Testing (Playwright)

### What Gets Tested?

| Page | Expected Load Time | Test Measures |
|------|-------------------|---------------|
| Login Page | < 5 seconds | Time to display login form |
| Admin Dashboard | < 8 seconds | Time to load dashboard with widgets |
| Employee Dashboard | < 8 seconds | Time to load employee view |
| Employees List | < 8 seconds | Time to fetch and display employee data |
| Leave Requests | < 8 seconds | Time to load leave management page |
| Attendance | < 8 seconds | Time to display attendance records |
| Analytics | < 10 seconds | Time to load charts and data |
| Performance Report | < 8 seconds | Time to generate performance metrics |

### Running Frontend Tests

```bash
npm run test:performance:frontend
```

#### Sample Output:
```
[PERF] Login page load performance ✓
  ✓ (1.2s) - Page loaded in 1234ms
[PERF] Login Page Load Time: 1234ms

[PERF] Admin dashboard load performance ✓
  ✓ (2.1s) - Page loaded in 2456ms
[PERF] Admin Dashboard Load Time: 2456ms

[PERF] Employee dashboard load performance ✓
  ✓ (2.0s) - Page loaded in 2103ms
[PERF] Employee Dashboard Load Time: 2103ms

===================================
 Fast ✅ All pages loaded in expected time!
===================================
```

### Understanding Frontend Metrics

**Page Load Time** = Time from clicking a link until the page is fully loaded
- Includes: Network requests, React rendering, CSS styling
- Measured in: **milliseconds (ms)**

**Good Performance Targets**:
- < 2 seconds: Excellent ⭐⭐⭐⭐⭐
- 2-4 seconds: Good ⭐⭐⭐⭐
- 4-8 seconds: Fair ⭐⭐⭐
- > 8 seconds: Needs improvement ⚠️

### What If Tests Fail?

**Problem**: Tests taking > expected time

**Solutions**:
1. **Check your internet connection** - Slow network = slow page loads
2. **Check backend status** - Is https://brighthr.emergent.host/ responding?
3. **Browser cache** - Close and reopen the browser
4. **System resources** - Close other programs, restart if needed

### View Detailed Report

```bash
npm run test:performance:frontend:report
```

This opens an HTML report showing:
- Test execution timeline
- Screenshots of each page
- Errors (if any)
- Video recording of tests

---

## Backend Performance Testing (Pytest)

### What Gets Tested?

#### 1. **Response Time Tests**
Measures how fast the backend responds to individual requests:

| Endpoint | Purpose | Expected Time |
|----------|---------|---|
| `/api/auth/login` | User authentication | < 2 seconds |
| `/api/auth/me` | Get current user | < 1 second |
| `/api/employees` | Fetch employee list | < 3 seconds |
| `/api/leave/my-requests` | Get user's leave requests | < 2 seconds |
| `/api/attendance/records` | Fetch attendance data | < 2.5 seconds |

#### 2. **Concurrent Load Tests**
Measures how the backend handles **multiple users accessing at the same time**:

| Test | Concurrent Users | Expected Behavior |
|------|-----------------|---|
| Concurrent Logins | 5 users | All < 5 seconds each |
| Concurrent API Calls | 5 users | All < 5 seconds each |
| Heavy Load | 10 users | All requests succeed |

#### 3. **Database Query Tests**
Measures how fast the database responds:

| Test | Purpose |
|------|---------|
| Employees Query Scaling | Large dataset retrieval |

### Running Backend Tests

```bash
npm run test:performance:backend
```

#### Sample Output:
```
Backend Performance and Load Testing
====================================

test_login_response_time PASSED
[PERF] Login endpoint response time: 1234.56ms
✓ PASSED (1.2s)

test_get_user_profile_response_time PASSED
[PERF] Get user profile response time: 456.78ms
✓ PASSED (0.5s)

test_get_employees_list_response_time PASSED
[PERF] Get employees list response time: 2123.45ms
✓ PASSED (2.2s)

test_concurrent_login_requests PASSED
[PERF] Concurrent Login Requests (5 parallel):
  - Average: 1523.21ms
  - Min: 1234.56ms
  - Max: 1876.32ms
✓ PASSED (5.3s)

test_heavy_load_simulation PASSED
[PERF] Heavy Load Simulation (10 concurrent requests):
  - Average: 987.65ms
  - P95: 1456.78ms
  - P99: 1876.32ms
  - Total requests: 10
  - Success rate: 100%
✓ PASSED (10.1s)

====================================
✓ 8 passed in 45.23s
====================================
```

### Understanding Backend Metrics

#### Response Time
- **Time from request sent → response received**
- Measures server processing + network latency
- **Measured in milliseconds (ms)**

#### Concurrent Requests
- **How many users can use the app at the same time**
- Tests if backend can handle parallel logins/requests
- **Shows: Average, Min (fastest), Max (slowest)**

#### Percentiles (P95, P99)
- **P95**: 95% of requests are faster than this time
  - If P95 = 1456ms → 95% of users see response in < 1.5 seconds
- **P99**: 99% of requests are faster than this time
  - Very important metric for user experience

#### Success Rate
- **Percentage of requests that succeeded** (no errors)
- **Goal: Always 100%** even under heavy load

### Good Performance Indicators ✅

**Response Times**:
- Individual endpoint: < 2 seconds
- Average concurrent: < 1.5 seconds
- P95: < 2 seconds

**Concurrent Load**:
- 5 parallel requests: All succeed in < 5 seconds each
- 10 concurrent requests: All succeed, P95 < 2 seconds

**Success Rate**:
- 100% (all requests succeed)

### What If Backend Tests Slow Down?

**Problem**: Slow response times or requests failing

**Solutions**:
1. **Check backend availability**:
   ```bash
   curl https://brighthr.emergent.host/docs
   # Should return 200
   ```

2. **Check internet connection** - Network latency affects results

3. **Database performance** - Contacted backend administrator

4. **High server load** - Wait and retry, test at off-peak hours

---

## Running All Tests Together

```bash
# Frontend + Backend + Accessibility + E2E + API
npm run test:all
```

Expected total time: **3-5 minutes**

### Full Test Output Example:
```
$ npm run test:all

> npm run test:e2e
✓ 12 passed (35.2s)

> npm run test:api
✓ 4 passed (22.9s)

> npm run test:accessibility
✓ 7 passed (28.1s)

> npm run test:performance
Running frontend performance tests...
✓ 8 passed (45.2s)

Running backend performance tests...
✓ 8 passed (45.3s)

===================================
✓ ALL TESTS PASSED - System is healthy! 🎉
===================================
```

---

## Performance Testing in Development

### View Real-Time Browser Performance

When running frontend tests, open Developer Tools (F12) to see:

1. **Network Tab** - Shows all requests and their load times
2. **Performance Tab** - Shows CPU usage and rendering time
3. **Console Tab** - Shows `[PERF]` logs with timing data

### Interpret [PERF] Logs

Every performance test prints logs like:
```
[PERF] Login Page Load Time: 1234ms
[PERF] Admin Dashboard Load Time: 2456ms
[PERF] Concurrent Login Requests (5 parallel):
  - Average: 1523.21ms
```

**Rule of Thumb**:
- If number is **green** ✅ = Within acceptable range
- If number is **yellow** ⚠️ = Monitor this
- If number is **red** ❌ = Needs investigation

---

## Performance Optimization Tips

### If Frontend is Slow:

1. **Reduce bundle size** - Import only needed libraries
2. **Lazy load components** - Load pages only when needed
3. **Cache API responses** - Reduce redundant requests
4. **Optimize images** - Use compressed formats
5. **Enable gzip compression** - Smaller file transfers

### If Backend is Slow:

1. **Add database indexes** - Speed up queries
2. **Cache frequent queries** - Don't hit database repeatedly
3. **Optimize API endpoints** - Remove unnecessary processing
4. **Use connection pooling** - Reuse database connections
5. **Monitor database load** - Check for bottlenecks

---

## Troubleshooting

### "TypeError: page.clock is not defined"
**Cause**: Using old Playwright API
**Fix**: Update Playwright: `npm install -D @playwright/test@latest`

### "Cannot find module 'pytest'"
**Cause**: pytest not installed in backend environment
**Fix**: 
```bash
cd backend
pip install -r requirements.txt
```

### "ConnectionError: Failed to connect to brighthr.emergent.host"
**Cause**: Backend is down or unreachable
**Fix**: 
- Check internet connection
- Verify backend status: https://brighthr.emergent.host/docs
- Wait a few minutes and retry

### Tests Pass Locally But Fail in CI
**Cause**: CI environment is resource-constrained
**Fix**:
- Increase performance thresholds in CI
- Reduce number of concurrent requests in tests
- Run tests on dedicated CI agents

### "Unauthorized: 401" errors
**Cause**: Test credentials invalid
**Fix**: Update environment variables:
```bash
export TEST_USER_EMAIL="SGadmin@gmail.com"
export TEST_USER_PASSWORD="TestPass123!"
```

---

## Environment Variables

### Frontend

Required in `.env` or `frontend/.env`:
```env
VITE_BACKEND_URL=https://brighthr.emergent.host
VITE_TEST_BASE_URL=http://localhost:3000
```

### Backend

Required in repository root or `backend/.env`:
```env
REACT_APP_BACKEND_URL=https://brighthr.emergent.host
TEST_USER_EMAIL=SGadmin@gmail.com
TEST_USER_PASSWORD=TestPass123!
```

---

## Performance Benchmarks

### Baseline Performance (What to Expect)

**Frontend Page Loads** (Average):
- Login: 1.2s
- Admin Dashboard: 2.4s
- Employees: 2.1s
- Leave Requests: 1.8s
- Attendance: 1.9s
- Analytics: 2.3s

**Backend Response Times** (Average):
- Login: 1.2s
- User Profile: 450ms
- Employee List: 2.1s
- Leave Requests: 1.8s
- Attendance: 1.9s

**Concurrent Performance**:
- 5 concurrent requests: 1.5s average
- 10 concurrent requests: P95 < 2s, 100% success rate

---

## Integration with CI/CD

Performance tests run automatically in GitHub Actions:

1. **On every pull request** - Detects performance regressions
2. **Before deployment** - Ensures production readiness
3. **Produces reports** - Available in PR comments

### View CI Performance Results

1. Go to GitHub PR
2. Click "Checks" tab
3. Find "Performance Tests"
4. View test results and logs

---

## Performance Targets by User Load

| Monthly Active Users | Response Time Target |
|-----|-----|
| 100 | < 1 second |
| 1,000 | < 2 seconds |
| 10,000 | < 3 seconds |
| 100,000 | < 4 seconds |

---

## Contact & Support

- **Found a performance issue?** Open an issue with test results
- **Need help running tests?** Check the troubleshooting section
- **Questions?** Reference the [TESTING_WORKFLOW.md](./TESTING_WORKFLOW.md)

---

## Summary

✅ **Frontend Performance**: Track page load times for user experience
✅ **Backend Performance**: Monitor response times and concurrent load handling
✅ **Easy Runs**: `npm run test:performance`
✅ **Easy Reports**: `npm run test:performance:frontend:report`
✅ **Full CI Integration**: Tests run automatically on PR and before deployment

**Your app is performant when**:
- All pages load < 8 seconds
- Backend responds < 3 seconds
- 100% success rate under load
- No performance growth on new PR
