# Backend Performance Testing Guide 🔧

Quick reference for backend performance testing in LuminaHR.

## Quick Start

```bash
# Run backend performance tests
npm run test:performance:backend

# Or directly with pytest
cd backend
pytest ../tests/test_performance.py -v
```

---

## What Gets Tested?

### Individual Endpoint Response Times

Each endpoint is tested for how fast it responds:

```
✓ Login endpoint              - < 2 seconds
✓ Get user profile           - < 1 second  
✓ Get employees list         - < 3 seconds
✓ Get leave requests         - < 2 seconds
✓ Get attendance records     - < 2.5 seconds
```

**Why?** Fast responses = happy users. Slow endpoints = user frustration.

### Concurrent Request Handling

Tests what happens when **multiple users request at the same time**:

```bash
# 5 concurrent logins
[PERF] Concurrent Login Requests (5 parallel):
  - Average: 1523.21ms       └─ Typical response time
  - Min: 1234.56ms           └─ Fastest response
  - Max: 1876.32ms           └─ Slowest response
```

**Why?** Real users don't wait for each other. Backend must handle parallel requests.

### Heavy Load Simulation

Tests backend under realistic load (10 concurrent requests):

```bash
[PERF] Heavy Load Simulation (10 concurrent requests):
  - Average: 987.65ms
  - P95: 1456.78ms           └─ 95% of requests faster than this
  - P99: 1876.32ms           └─ 99% of requests faster than this
  - Total requests: 10
  - Success rate: 100%       └─ All requests succeeded
```

### Database Query Performance

Tests if queries scale well with data growth.

---

## Reading Test Output

### Example: Full Test Run

```
===================================================
Backend Performance and Load Testing
===================================================

test_login_response_time PASSED                    ✅
[PERF] Login endpoint response time: 1234.56ms
  → User sees login button in ~1.2 seconds

test_get_user_profile_response_time PASSED        ✅
[PERF] Get user profile response time: 456.78ms
  → Very fast! < 500ms

test_get_employees_list_response_time PASSED      ✅
[PERF] Get employees list response time: 2123.45ms
  → Takes 2.1 seconds (includes database query)

test_concurrent_login_requests PASSED             ✅
[PERF] Concurrent Login Requests (5 parallel):
  - Average: 1523.21ms       (baseline is ok)
  - Min: 1234.56ms           (fastest)
  - Max: 1876.32ms           (still under 2s limit)

test_database_query_scaling PASSED                ✅
  → Queries still fast even with large datasets

✓ 8 passed in 45.23s                              ✓ Complete!
===================================================
```

### Color Coding

- ✅ **GREEN/PASSED**: Test passed, performance meets targets
- ⚠️ **YELLOW/WARNING**: Test passed but approaching limits
- ❌ **RED/FAILED**: Test failed, performance below targets

---

## Performance Targets (What's Good?)

### Response Times

**Excellent** ⭐⭐⭐⭐⭐
- Login: < 1 second
- Profile fetch: < 500ms
- List endpoints: < 2 seconds

**Good** ⭐⭐⭐⭐
- Login: < 2 seconds
- Profile fetch: < 800ms
- List endpoints: < 3 seconds

**Fair** ⭐⭐⭐
- Login: < 3 seconds
- Profile fetch: < 1 second
- List endpoints: < 4 seconds

**Needs Improvement** ⚠️
- Login: > 3 seconds
- Profile fetch: > 1 second
- List endpoints: > 4 seconds

### Concurrent Performance

**Good Indicators** ✅
- Average response time: < 2 seconds (across all concurrent requests)
- Max response time: < 3 seconds (slowest request still acceptable)
- Success rate: 100% (no timeouts or errors)

**Red Flags** 🚩
- Average response time: > 3 seconds
- Any request failures: < 100% success rate
- Max response time: > 5 seconds

### Percentile Targets

- **P95 < 2 seconds**: 95% of users see fast responses
- **P99 < 3 seconds**: Even slow responses are acceptable
- **P100 (max) < 5 seconds**: No catastrophic slowdowns

---

## Understanding the Metrics

### Average
Sum of all response times ÷ number of requests
- Most important metric for overall performance
- Example: (1200 + 1300 + 1400) ÷ 3 = 1300ms average

### Min (Minimum)
The **fastest** response among all requests
- Shows your backend can be fast
- Usually indicates cache hits or optimized queries

### Max (Maximum)
The **slowest** response among all requests
- Shows worst-case performance
- Often first request (cache miss) or heavy load
- Should still be acceptable (< 5 seconds)

### P95 (95th Percentile)
When sorted by speed, **95% are faster than this**
- Key metric for user satisfaction
- Example: If P95 = 1456ms → 95 out of 100 requests are < 1456ms

### P99 (99th Percentile)
When sorted by speed, **99% are faster than this**
- Catches the slow outliers
- Should still be acceptable
- Example: If P99 = 1876ms → Even the slowest 1% of requests are < 1876ms

### Success Rate
Percentage of requests that **completed successfully**
- Goal: Always 100%
- Failures indicate: timeouts, database errors, server crashes
- Any failure during tests = performance regression

---

## Test Scenarios

### Scenario 1: Admin Logging In
**What Happens**:
1. Frontend sends email + password to backend
2. Backend checks database
3. Backend creates JWT token
4. Returns token to frontend

**Performance Target**: < 2 seconds

**Why?** Users want to log in quickly

---

### Scenario 2: 5 Users Log In Simultaneously
**What Happens**:
1. 5 users send login requests at the exact same time
2. Backend processes all 5 in parallel
3. All 5 receive tokens

**Performance Target**:
- Average: < 2 seconds per user
- All complete: Yes
- No timeouts: Yes

**Why?** Backend must handle peak usage without slowdown

---

### Scenario 3: 10 Users Accessing Different Pages
**What Happens**:
1. 10 concurrent requests to various endpoints
2. Backend handles database queries for all 10
3. All requests complete successfully

**Performance Target**:
- P95: < 2 seconds
- Success Rate: 100%
- No errors: Yes

**Why?** Real-world load with mixed request types

---

## Common Issues & Fixes

### Issue 1: "Connection refused: [backend URL]"

**Cause**: Backend server is not running

**Fix**:
```bash
# Check if backend is accessible
curl https://brighthr.emergent.host/docs

# If not, contact backend team to check deployment
```

### Issue 2: "Authentication failed: 401 Unauthorized"

**Cause**: Test credentials are invalid or expired

**Fix**:
```bash
# Verify credentials
export TEST_USER_EMAIL="SGadmin@gmail.com"
export TEST_USER_PASSWORD="TestPass123!"

# Run test again
npm run test:performance:backend
```

### Issue 3: "Login response time: 5234ms" (Over limit)

**Cause**: Backend or network is slow

**Diagnosis**:
```bash
# Check if it's your network
time curl -I https://brighthr.emergent.host/

# Check if it's the endpoint
time curl -X POST https://brighthr.emergent.host/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test"}'

# Report to backend team with timing data
```

### Issue 4: "Success rate: 95%" (Some requests failed)

**Cause**: Backend crashed or had errors during load

**Diagnosis**:
```bash
# Check error logs
pytest tests/test_performance.py -v -s

# Look for specific error messages
# Report to backend team with stack trace
```

### Issue 5: "Tests timeout after 30 seconds"

**Cause**: Backend is extremely slow or unresponsive

**Fix**:
```bash
# First, verify the URL is correct
echo $REACT_APP_BACKEND_URL

# If using localhost, start backend server
cd backend
python -m uvicorn server:app --reload

# If using deployed backend, check status page
curl https://brighthr.emergent.host/docs
```

---

## Environment Variables

### For Local Testing

```bash
# Backend location
export REACT_APP_BACKEND_URL=https://brighthr.emergent.host

# Test user credentials
export TEST_USER_EMAIL=SGadmin@gmail.com
export TEST_USER_PASSWORD=TestPass123!

# Run tests
npm run test:performance:backend
```

### For CI/CD

Tests automatically set these in GitHub Actions:
- Backend URL: https://brighthr.emergent.host (deployed)
- Test account: Provided by CI secrets
- Timeout: 30 seconds

---

## Performance Optimization Tips

### If Tests Are Failing

**Quick Wins** (Try these first):
1. Restart the test: `npm run test:performance:backend`
2. Check your internet: `ping google.com`
3. Restart your computer: Powers everything down and up

**Moderate Fixes** (Takes 30 mins):
1. Clear browser cache
2. Check backend logs
3. Verify database is responding

**Advanced Fixes** (Takes hours):
1. Add database indexes
2. Optimize API endpoints
3. Implement caching layer
4. Use connection pooling

### If Tests Are Passing But Slow

**Optimization Targets**:
- **Login > 1 second?** Check user table index on email field
- **Employee List > 2 seconds?** Add pagination or filtering
- **Concurrent failures?** Add database connection pool
- **P99 is high?** Identify and optimize slowest query

---

## Running Tests in Different Ways

### Verbose Output (See everything)
```bash
pytest tests/test_performance.py -v -s
```

### Focus on One Test
```bash
pytest tests/test_performance.py::TestBackendPerformance::test_login_response_time -v
```

### Show Test Names
```bash
pytest tests/test_performance.py -v --tb=short
```

### Generate Test Report
```bash
pytest tests/test_performance.py -v --html=report.html
```

---

## Integration with GitHub

Performance tests run automatically:
- ✅ On every Pull Request
- ✅ Before merge to main
- ✅ Before production deployment

### View Results

1. Go to GitHub PR
2. Scroll to "Checks"
3. Find "Backend Performance Tests"
4. Click "Details" to see output

### Prevent Performance Regressions

If any test fails:
1. PR cannot be merged
2. Fix the performance issue
3. Push new commit
4. Tests re-run automatically

---

## Performance Baseline by Database Size

| Dataset Size | Expected Login Time | Expected List Time |
|---|---|---|
| 100 employees | < 800ms | < 1 second |
| 1,000 employees | < 1 second | < 2 seconds |
| 10,000 employees | < 1.5 seconds | < 3 seconds |
| 100,000+ employees | < 2 seconds | < 4 seconds |

---

## Monitoring Performance Over Time

### Track Trends

Run tests weekly and log results:
```
Week 1:  Login avg = 1200ms
Week 2:  Login avg = 1250ms (↑ slightly)
Week 3:  Login avg = 1450ms (↑ regression!)
Week 4:  Login avg = 1220ms (↓ fixed!)
```

**If average increases > 20%**: Investigate changes from that week

### Create Alerts

Setup GitHub workflows to notify if:
- Average response time increases
- Any endpoint exceeds limits
- Success rate drops below 100%
- P99 exceeds threshold

---

## FAQ

**Q: Do I run these tests every day?**
A: No, they run automatically in CI. Run manually when:
- Testing code changes
- Investigating performance issues
- Before major deployment

**Q: How long do tests take?**
A: ~45 seconds total (includes network delays)

**Q: Can tests run in parallel?**
A: Yes, pytest automatically parallelizes with `-n auto` flag

**Q: Do tests affect production?**
A: No, they only read data and test existing accounts

**Q: What if tests pass locally but fail in CI?**
A: CI environment may have limited resources - increase timeouts

**Q: How do I know if performance is good?**
A: All tests pass + response times are green ✅

---

## Summary

✅ **Response Times**: Login < 2s, endpoints < 3s
✅ **Concurrent Load**: All requests succeed, < 2s average
✅ **Database**: Queries scale with dataset growth
✅ **Monitoring**: Tests run automatically on PR
✅ **Easy Commands**: `npm run test:performance:backend`

**Performance is healthy when**:
- All tests pass ✅
- Average response time < 2 seconds
- P95 within acceptable range
- Success rate = 100%
- No regression from previous run
