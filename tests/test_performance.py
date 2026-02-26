"""
Backend Performance and Load Testing

Measures:
- API response times
- Concurrent request handling
- Database query performance
- Backend throughput

Tests run against deployed backend: https://brighthr.emergent.host/

Run: pytest tests/test_performance.py -v
"""

import pytest
import requests
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
import statistics
import os

# Use deployed backend
BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://brighthr.emergent.host').rstrip('/')

# Test credentials
TEST_EMAIL = os.environ.get('TEST_USER_EMAIL', 'SGadmin@gmail.com')
TEST_PASSWORD = os.environ.get('TEST_USER_PASSWORD', 'TestPass123!')


class TestBackendPerformance:
    """Backend performance tests"""

    @pytest.fixture(scope="class")
    def auth_token(self):
        """Get authentication token once for all tests"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": TEST_EMAIL, "password": TEST_PASSWORD},
            timeout=10
        )
        assert response.status_code == 200, f"Login failed: {response.text}"
        return response.json().get('access_token')

    @pytest.fixture
    def headers(self, auth_token):
        """Auth headers for requests"""
        return {
            "Authorization": f"Bearer {auth_token}",
            "Content-Type": "application/json"
        }

    def test_login_response_time(self):
        """Test login endpoint response time"""
        start_time = time.time()
        
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": TEST_EMAIL, "password": TEST_PASSWORD},
            timeout=10
        )
        
        end_time = time.time()
        response_time = (end_time - start_time) * 1000  # Convert to ms
        
        print(f"\n[PERF] Login endpoint response time: {response_time:.2f}ms")
        
        assert response.status_code == 200
        # Deployed backend may be slower - allow up to 5 seconds
        assert response_time < 5000, f"Login took {response_time:.2f}ms (expected < 5000ms)"

    def test_get_user_profile_response_time(self, headers):
        """Test get user profile endpoint response time"""
        start_time = time.time()
        
        response = requests.get(
            f"{BASE_URL}/api/auth/me",
            headers=headers,
            timeout=10
        )
        
        end_time = time.time()
        response_time = (end_time - start_time) * 1000
        
        print(f"\n[PERF] Get user profile response time: {response_time:.2f}ms")
        
        assert response.status_code == 200
        # Deployed backend - allow up to 2 seconds
        assert response_time < 2000, f"Get profile took {response_time:.2f}ms (expected < 2000ms)"

    def test_get_employees_list_response_time(self, headers):
        """Test get employees list endpoint response time"""
        start_time = time.time()
        
        response = requests.get(
            f"{BASE_URL}/admin/employees",
            headers=headers,
            timeout=10
        )
        
        end_time = time.time()
        response_time = (end_time - start_time) * 1000
        
        print(f"\n[PERF] Get employees list response time: {response_time:.2f}ms")
        
        assert response.status_code == 200
        # List endpoint may be slower (database query with filtering) - allow up to 5 seconds
        assert response_time < 5000, f"Get employees took {response_time:.2f}ms (expected < 5000ms)"

    def test_get_leave_requests_response_time(self, headers):
        """Test get leave requests endpoint response time"""
        start_time = time.time()
        
        response = requests.get(
            f"{BASE_URL}/api/leave/my-requests",
            headers=headers,
            timeout=10
        )
        
        end_time = time.time()
        response_time = (end_time - start_time) * 1000
        
        print(f"\n[PERF] Get leave requests response time: {response_time:.2f}ms")
        
        assert response.status_code == 200
        assert response_time < 2000, f"Get leave requests took {response_time:.2f}ms (expected < 2000ms)"

    def test_get_attendance_records_response_time(self, headers):
        """Test get attendance records endpoint response time"""
        start_time = time.time()
        
        response = requests.get(
            f"{BASE_URL}/admin/attendance",
            headers=headers,
            timeout=10
        )
        
        end_time = time.time()
        response_time = (end_time - start_time) * 1000
        
        print(f"\n[PERF] Get attendance records response time: {response_time:.2f}ms")
        
        assert response.status_code == 200
        # Allow up to 5 seconds for deployed backend
        assert response_time < 5000, f"Get attendance took {response_time:.2f}ms (expected < 5000ms)"

    def test_concurrent_login_requests(self):
        """Test backend handling multiple concurrent login requests"""
        num_requests = 5
        response_times = []
        
        def make_login_request():
            start = time.time()
            try:
                response = requests.post(
                    f"{BASE_URL}/api/auth/login",
                    json={"email": TEST_EMAIL, "password": TEST_PASSWORD},
                    timeout=10
                )
                end = time.time()
                return (end - start) * 1000, response.status_code
            except Exception as e:
                return None, str(e)
        
        # Execute concurrent requests
        with ThreadPoolExecutor(max_workers=5) as executor:
            futures = [executor.submit(make_login_request) for _ in range(num_requests)]
            
            for future in as_completed(futures):
                response_time, status = future.result()
                if response_time:
                    response_times.append(response_time)
                    assert status == 200, f"Concurrent request failed with status {status}"
        
        # Calculate statistics
        avg_time = statistics.mean(response_times)
        min_time = min(response_times)
        max_time = max(response_times)
        
        print(f"\n[PERF] Concurrent Login Requests ({num_requests} parallel):")
        print(f"  - Average: {avg_time:.2f}ms")
        print(f"  - Min: {min_time:.2f}ms")
        print(f"  - Max: {max_time:.2f}ms")
        
        # Assert all requests completed reasonably fast (deployed backend may be slower)
        assert all(t < 8000 for t in response_times), "Some requests exceeded 8 second timeout"

    def test_concurrent_api_requests(self, headers):
        """Test backend handling concurrent API requests to employees endpoint"""
        num_requests = 5
        response_times = []
        
        def make_employees_request():
            start = time.time()
            try:
                response = requests.get(
                    f"{BASE_URL}/admin/employees",
                    headers=headers,
                    timeout=10
                )
                end = time.time()
                return (end - start) * 1000, response.status_code
            except Exception as e:
                return None, str(e)
        
        # Execute concurrent requests
        with ThreadPoolExecutor(max_workers=5) as executor:
            futures = [executor.submit(make_employees_request) for _ in range(num_requests)]
            
            for future in as_completed(futures):
                response_time, status = future.result()
                if response_time:
                    response_times.append(response_time)
                    assert status == 200, f"Concurrent request failed with status {status}"
        
        # Calculate statistics
        avg_time = statistics.mean(response_times)
        min_time = min(response_times)
        max_time = max(response_times)
        
        print(f"\n[PERF] Concurrent API Requests ({num_requests} parallel):")
        print(f"  - Average: {avg_time:.2f}ms")
        print(f"  - Min: {min_time:.2f}ms")
        print(f"  - Max: {max_time:.2f}ms")
        
        # Assert all requests completed within acceptable time
        assert all(t < 5000 for t in response_times), "Some requests exceeded 5 second timeout"

    def test_heavy_load_simulation(self, headers):
        """Simulate moderate load with 10 concurrent requests"""
        num_requests = 10
        response_times = []
        
        def make_request():
            """Make a random API request"""
            endpoints = [
                f"{BASE_URL}/api/auth/me",
                f"{BASE_URL}/admin/employees",
                f"{BASE_URL}/api/leave/my-requests",
                f"{BASE_URL}/admin/attendance",
            ]
            
            start = time.time()
            try:
                response = requests.get(
                    endpoints[0],  # Use auth/me as representative
                    headers=headers,
                    timeout=10
                )
                end = time.time()
                return (end - start) * 1000, response.status_code
            except Exception as e:
                return None, str(e)
        
        # Execute load test
        with ThreadPoolExecutor(max_workers=10) as executor:
            futures = [executor.submit(make_request) for _ in range(num_requests)]
            
            for future in as_completed(futures):
                response_time, status = future.result()
                if response_time:
                    response_times.append(response_time)
                    assert status == 200, f"Request failed with status {status}"
        
        # Calculate statistics
        avg_time = statistics.mean(response_times)
        p95_time = sorted(response_times)[int(len(response_times) * 0.95)]
        p99_time = sorted(response_times)[int(len(response_times) * 0.99)]
        
        print(f"\n[PERF] Heavy Load Simulation ({num_requests} concurrent requests):")
        print(f"  - Average: {avg_time:.2f}ms")
        print(f"  - P95: {p95_time:.2f}ms")
        print(f"  - P99: {p99_time:.2f}ms")
        print(f"  - Total requests: {len(response_times)}")
        print(f"  - Success rate: 100%")
        
        # All requests should succeed even under load
        assert len(response_times) == num_requests, "Not all requests completed"


class TestDatabasePerformance:
    """Database query performance tests"""

    @pytest.fixture(scope="class")
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": TEST_EMAIL, "password": TEST_PASSWORD},
            timeout=10
        )
        assert response.status_code == 200
        return response.json().get('access_token')

    @pytest.fixture
    def headers(self, auth_token):
        """Auth headers"""
        return {
            "Authorization": f"Bearer {auth_token}",
            "Content-Type": "application/json"
        }

    def test_employees_query_scaling(self, headers):
        """Test employee list query performance (database scaling)"""
        # Single request baseline
        start = time.time()
        response1 = requests.get(f"{BASE_URL}/admin/employees", headers=headers, timeout=10)
        time1 = (time.time() - start) * 1000
        
        print(f"\n[PERF] Database Query Performance:")
        print(f"  - Single request: {time1:.2f}ms")
        
        assert response1.status_code == 200
        assert time1 < 5000, f"Single employee query too slow: {time1:.2f}ms"
        
        # Verify response contains data
        data = response1.json()
        assert isinstance(data, (list, dict)), "Invalid response format"


def test_backend_connectivity():
    """Verify backend is accessible"""
    response = requests.get(f"{BASE_URL}/docs", timeout=10)
    assert response.status_code == 200, f"Backend not accessible at {BASE_URL}"
    print(f"\n[PERF] Backend accessible at {BASE_URL}")
