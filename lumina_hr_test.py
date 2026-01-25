#!/usr/bin/env python3
"""
LuminaHR Backend API Comprehensive Tests
Tests all backend endpoints according to the review request specifications.
"""

import requests
import json
import time
from typing import Dict, Optional

# Configuration
BASE_URL = "https://lumina-staff.preview.emergentagent.com/api"
TIMEOUT = 30

class LuminaHRTester:
    def __init__(self):
        self.auth_token = None
        self.admin_user_data = None
        self.department_id = None
        self.notice_id = None
        self.test_results = []
        
        # Test data as specified in review request
        self.admin_email = "testadmin@lumina.com"
        self.admin_password = "TestPass123!"
        self.admin_full_name = "Test Admin"
        self.company_name = "Test Company"
        self.country = "Singapore"
        self.role = "Admin"
        
    def log_result(self, test_name: str, success: bool, message: str, details: Optional[Dict] = None):
        """Log test result"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "details": details or {}
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        if details:
            print(f"   Details: {json.dumps(details, indent=2)}")
        print()

    def make_request(self, method: str, endpoint: str, data: Optional[Dict] = None, 
                    headers: Optional[Dict] = None, params: Optional[Dict] = None) -> Dict:
        """Make HTTP request with error handling"""
        url = f"{BASE_URL}{endpoint}"
        
        default_headers = {"Content-Type": "application/json"}
        if headers:
            default_headers.update(headers)
            
        try:
            if method.upper() == "GET":
                response = requests.get(url, headers=default_headers, params=params, timeout=TIMEOUT)
            elif method.upper() == "POST":
                response = requests.post(url, json=data, headers=default_headers, timeout=TIMEOUT)
            else:
                raise ValueError(f"Unsupported method: {method}")
                
            return {
                "status_code": response.status_code,
                "data": response.json() if response.content else {},
                "success": 200 <= response.status_code < 300,
                "raw_response": response.text
            }
        except requests.exceptions.RequestException as e:
            return {
                "status_code": 0,
                "data": {"error": str(e)},
                "success": False,
                "raw_response": ""
            }
        except json.JSONDecodeError:
            return {
                "status_code": response.status_code,
                "data": {"error": "Invalid JSON response", "raw_content": response.text},
                "success": False,
                "raw_response": response.text
            }

    def test_1_health_check(self):
        """Test 1: Health Check - GET /api/health"""
        print("🔄 Testing Health Check...")
        
        result = self.make_request("GET", "/health")
        
        if result["success"]:
            response_data = result["data"]
            expected_keys = ["status", "service", "version"]
            
            if all(key in response_data for key in expected_keys):
                if response_data["status"] == "healthy":
                    self.log_result("Health Check", True, "Health check successful", response_data)
                else:
                    self.log_result("Health Check", False, f"Service not healthy: {response_data['status']}", response_data)
            else:
                self.log_result("Health Check", False, "Missing required fields in health response", response_data)
        else:
            self.log_result("Health Check", False, f"Health check failed: {result['data']}", result)

    def test_2_admin_signup(self):
        """Test 2: Admin Signup - POST /api/auth/signup"""
        print("🔄 Testing Admin Signup...")
        
        signup_data = {
            "email": self.admin_email,
            "password": self.admin_password,
            "full_name": self.admin_full_name,
            "company_name": self.company_name,
            "country": self.country,
            "role": self.role
        }
        
        result = self.make_request("POST", "/auth/signup", signup_data)
        
        if result["success"]:
            response_data = result["data"]
            if "message" in response_data and "email" in response_data:
                if response_data["email"] == self.admin_email:
                    self.log_result("Admin Signup", True, "Admin signup successful", response_data)
                else:
                    self.log_result("Admin Signup", False, "Email mismatch in response", response_data)
            else:
                self.log_result("Admin Signup", False, "Missing required fields in signup response", response_data)
        else:
            # Check if user already exists
            error_detail = result["data"].get("detail", "")
            if "already exists" in error_detail.lower() or "already registered" in error_detail.lower():
                self.log_result("Admin Signup", True, "User already exists (expected for repeated tests)", result["data"])
            else:
                self.log_result("Admin Signup", False, f"Signup failed: {result['data']}", result)

    def test_3_admin_login(self):
        """Test 3: Admin Login - POST /api/auth/login"""
        print("🔄 Testing Admin Login...")
        
        login_data = {
            "email": self.admin_email,
            "password": self.admin_password
        }
        
        result = self.make_request("POST", "/auth/login", login_data)
        
        if result["success"]:
            response_data = result["data"]
            if "access_token" in response_data and "user" in response_data:
                self.auth_token = response_data["access_token"]
                self.admin_user_data = response_data["user"]
                self.log_result("Admin Login", True, "Admin login successful", {
                    "user_role": self.admin_user_data.get("role"),
                    "user_email": self.admin_user_data.get("email")
                })
            else:
                self.log_result("Admin Login", False, "Invalid login response format", response_data)
        else:
            error_detail = result["data"].get("detail", "")
            if "verify" in error_detail.lower():
                self.log_result("Admin Login", False, "Email verification required", result["data"])
            elif "credentials" in error_detail.lower() or "password" in error_detail.lower():
                self.log_result("Admin Login", False, "Invalid credentials", result["data"])
            else:
                self.log_result("Admin Login", False, f"Login failed: {error_detail}", result)

    def test_4_admin_stats(self):
        """Test 4: Admin Dashboard Stats - GET /api/admin/stats"""
        print("🔄 Testing Admin Dashboard Stats...")
        
        if not self.auth_token:
            self.log_result("Admin Stats", False, "No auth token available", {})
            return
            
        headers = {"Authorization": f"Bearer {self.auth_token}"}
        result = self.make_request("GET", "/admin/stats", headers=headers)
        
        if result["success"]:
            stats_data = result["data"]
            # Check for common dashboard stats fields
            expected_fields = ["total_employees", "departments", "pending_leaves", "total_attendance"]
            
            if any(field in stats_data for field in expected_fields):
                self.log_result("Admin Stats", True, "Admin stats retrieved successfully", stats_data)
            else:
                self.log_result("Admin Stats", True, "Stats endpoint working (custom format)", stats_data)
        else:
            self.log_result("Admin Stats", False, f"Failed to get admin stats: {result['data']}", result)

    def test_5_create_department(self):
        """Test 5: Create Department - POST /api/admin/departments"""
        print("🔄 Testing Create Department...")
        
        if not self.auth_token:
            self.log_result("Create Department", False, "No auth token available", {})
            return
            
        headers = {"Authorization": f"Bearer {self.auth_token}"}
        department_data = {
            "name": "Engineering",
            "description": "Software Development Team"
        }
        
        result = self.make_request("POST", "/admin/departments", department_data, headers)
        
        if result["success"]:
            response_data = result["data"]
            if "id" in response_data or "department_id" in response_data:
                self.department_id = response_data.get("id") or response_data.get("department_id")
                self.log_result("Create Department", True, "Department created successfully", response_data)
            else:
                self.log_result("Create Department", True, "Department creation successful", response_data)
        else:
            # Check if department already exists
            error_detail = result["data"].get("detail", "")
            if "already exists" in error_detail.lower() or "duplicate" in error_detail.lower():
                self.log_result("Create Department", True, "Department already exists (expected for repeated tests)", result["data"])
            else:
                self.log_result("Create Department", False, f"Failed to create department: {result['data']}", result)

    def test_6_get_departments(self):
        """Test 6: Get Departments - GET /api/departments"""
        print("🔄 Testing Get Departments...")
        
        if not self.auth_token:
            self.log_result("Get Departments", False, "No auth token available", {})
            return
            
        headers = {"Authorization": f"Bearer {self.auth_token}"}
        result = self.make_request("GET", "/departments", headers=headers)
        
        if result["success"]:
            departments = result["data"]
            if isinstance(departments, list):
                # Look for our Engineering department
                engineering_dept = next((dept for dept in departments if dept.get("name") == "Engineering"), None)
                if engineering_dept:
                    self.log_result("Get Departments", True, f"Found {len(departments)} departments including Engineering", {
                        "department_count": len(departments),
                        "engineering_dept": engineering_dept
                    })
                else:
                    self.log_result("Get Departments", True, f"Retrieved {len(departments)} departments", {
                        "department_count": len(departments),
                        "departments": departments
                    })
            else:
                self.log_result("Get Departments", False, "Invalid departments response format", result["data"])
        else:
            self.log_result("Get Departments", False, f"Failed to get departments: {result['data']}", result)

    def test_7_get_pending_leaves(self):
        """Test 7: Get Pending Leaves - GET /api/admin/leave/pending"""
        print("🔄 Testing Get Pending Leaves...")
        
        if not self.auth_token:
            self.log_result("Get Pending Leaves", False, "No auth token available", {})
            return
            
        headers = {"Authorization": f"Bearer {self.auth_token}"}
        result = self.make_request("GET", "/admin/leave/pending", headers=headers)
        
        if result["success"]:
            pending_leaves = result["data"]
            if isinstance(pending_leaves, list):
                self.log_result("Get Pending Leaves", True, f"Retrieved {len(pending_leaves)} pending leave requests", {
                    "pending_count": len(pending_leaves)
                })
            else:
                self.log_result("Get Pending Leaves", True, "Pending leaves endpoint working", result["data"])
        else:
            self.log_result("Get Pending Leaves", False, f"Failed to get pending leaves: {result['data']}", result)

    def test_8_attendance_checkin(self):
        """Test 8: Attendance Check-in - POST /api/attendance/check-in"""
        print("🔄 Testing Attendance Check-in...")
        
        if not self.auth_token:
            self.log_result("Attendance Check-in", False, "No auth token available", {})
            return
            
        headers = {"Authorization": f"Bearer {self.auth_token}"}
        result = self.make_request("POST", "/attendance/check-in", {}, headers)
        
        if result["success"]:
            response_data = result["data"]
            self.log_result("Attendance Check-in", True, "Check-in successful", response_data)
        else:
            # Check if already checked in
            error_detail = result["data"].get("detail", "")
            if "already" in error_detail.lower() or "checked in" in error_detail.lower():
                self.log_result("Attendance Check-in", True, "Already checked in (expected for repeated tests)", result["data"])
            else:
                self.log_result("Attendance Check-in", False, f"Check-in failed: {result['data']}", result)

    def test_9_attendance_status(self):
        """Test 9: Get Attendance Status - GET /api/attendance/my-status"""
        print("🔄 Testing Get Attendance Status...")
        
        if not self.auth_token:
            self.log_result("Get Attendance Status", False, "No auth token available", {})
            return
            
        headers = {"Authorization": f"Bearer {self.auth_token}"}
        result = self.make_request("GET", "/attendance/my-status", headers=headers)
        
        if result["success"]:
            status_data = result["data"]
            self.log_result("Get Attendance Status", True, "Attendance status retrieved", status_data)
        else:
            self.log_result("Get Attendance Status", False, f"Failed to get attendance status: {result['data']}", result)

    def test_10_create_notice(self):
        """Test 10: Create Notice - POST /api/admin/notices"""
        print("🔄 Testing Create Notice...")
        
        if not self.auth_token:
            self.log_result("Create Notice", False, "No auth token available", {})
            return
            
        headers = {"Authorization": f"Bearer {self.auth_token}"}
        notice_data = {
            "title": "Welcome to LuminaHR",
            "content": "Welcome to our new HR management system!"
        }
        
        result = self.make_request("POST", "/admin/notices", notice_data, headers)
        
        if result["success"]:
            response_data = result["data"]
            if "id" in response_data or "notice_id" in response_data:
                self.notice_id = response_data.get("id") or response_data.get("notice_id")
                self.log_result("Create Notice", True, "Notice created successfully", response_data)
            else:
                self.log_result("Create Notice", True, "Notice creation successful", response_data)
        else:
            self.log_result("Create Notice", False, f"Failed to create notice: {result['data']}", result)

    def test_11_get_notices(self):
        """Test 11: Get Notices - GET /api/notices"""
        print("🔄 Testing Get Notices...")
        
        if not self.auth_token:
            self.log_result("Get Notices", False, "No auth token available", {})
            return
            
        headers = {"Authorization": f"Bearer {self.auth_token}"}
        result = self.make_request("GET", "/notices", headers=headers)
        
        if result["success"]:
            notices = result["data"]
            if isinstance(notices, list):
                # Look for our welcome notice
                welcome_notice = next((notice for notice in notices if "Welcome to LuminaHR" in notice.get("title", "")), None)
                if welcome_notice:
                    self.log_result("Get Notices", True, f"Found {len(notices)} notices including welcome notice", {
                        "notice_count": len(notices),
                        "welcome_notice": welcome_notice
                    })
                else:
                    self.log_result("Get Notices", True, f"Retrieved {len(notices)} notices", {
                        "notice_count": len(notices)
                    })
            else:
                self.log_result("Get Notices", True, "Notices endpoint working", result["data"])
        else:
            self.log_result("Get Notices", False, f"Failed to get notices: {result['data']}", result)

    def run_all_tests(self):
        """Run all tests in sequence"""
        print("🚀 Starting LuminaHR Backend API Comprehensive Tests")
        print("=" * 70)
        
        # Run tests in order as specified in review request
        self.test_1_health_check()
        self.test_2_admin_signup()
        self.test_3_admin_login()
        self.test_4_admin_stats()
        self.test_5_create_department()
        self.test_6_get_departments()
        self.test_7_get_pending_leaves()
        self.test_8_attendance_checkin()
        self.test_9_attendance_status()
        self.test_10_create_notice()
        self.test_11_get_notices()
        
        # Print summary
        self.print_summary()

    def print_summary(self):
        """Print test summary"""
        print("=" * 70)
        print("📊 LUMINA HR BACKEND API TEST SUMMARY")
        print("=" * 70)
        
        passed = sum(1 for result in self.test_results if result["success"])
        total = len(self.test_results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        print()
        
        # Show failed tests
        failed_tests = [result for result in self.test_results if not result["success"]]
        if failed_tests:
            print("❌ FAILED TESTS:")
            for test in failed_tests:
                print(f"  - {test['test']}: {test['message']}")
                if test.get('details'):
                    print(f"    Details: {test['details']}")
        else:
            print("🎉 ALL TESTS PASSED!")
        
        print("=" * 70)

if __name__ == "__main__":
    tester = LuminaHRTester()
    tester.run_all_tests()