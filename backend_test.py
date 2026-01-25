#!/usr/bin/env python3
"""
EMS Authentication System Backend API Tests
Tests all authentication endpoints according to the specified test scenarios.
"""

import requests
import json
import time
import uuid
from typing import Dict, Optional

# Configuration
BASE_URL = "https://lumina-staff.preview.emergentagent.com/api"
TIMEOUT = 30

class EMSAuthTester:
    def __init__(self):
        self.admin_token = None
        self.employee_token = None
        self.admin_user_data = None
        self.employee_user_data = None
        self.company_id = None
        self.employee_id = None
        self.verification_token = None
        self.test_results = []
        
        # Generate unique test data
        unique_id = str(uuid.uuid4())[:8]
        self.admin_email = f"admin.test.{unique_id}@luminahr.com"
        self.employee_email = f"employee.test.{unique_id}@luminahr.com"
        self.company_name = f"TestCorp {unique_id}"
        self.admin_password = "AdminPass123!"
        self.employee_password = "EmpPass456!"
        self.new_password = "NewPass789!"
        
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
                "success": 200 <= response.status_code < 300
            }
        except requests.exceptions.RequestException as e:
            return {
                "status_code": 0,
                "data": {"error": str(e)},
                "success": False
            }
        except json.JSONDecodeError:
            return {
                "status_code": response.status_code,
                "data": {"error": "Invalid JSON response"},
                "success": False
            }

    def test_1_admin_signup(self):
        """Test 1: Admin Signup Flow"""
        print("🔄 Testing Admin Signup Flow...")
        
        signup_data = {
            "email": self.admin_email,
            "password": self.admin_password,
            "company_name": self.company_name,
            "country": "Singapore",
            "role": "Admin"
        }
        
        result = self.make_request("POST", "/auth/signup", signup_data)
        
        if result["success"]:
            response_data = result["data"]
            expected_keys = ["message", "email", "requires_approval"]
            
            if all(key in response_data for key in expected_keys):
                if response_data["email"] == self.admin_email and not response_data["requires_approval"]:
                    self.log_result("Admin Signup", True, "Admin signup successful", response_data)
                else:
                    self.log_result("Admin Signup", False, "Invalid response data", response_data)
            else:
                self.log_result("Admin Signup", False, "Missing required fields in response", response_data)
        else:
            self.log_result("Admin Signup", False, f"Signup failed: {result['data']}", result)

    def test_2_get_companies(self):
        """Test 2: Get Companies List"""
        print("🔄 Testing Get Companies...")
        
        result = self.make_request("GET", "/companies")
        
        if result["success"]:
            companies = result["data"]
            if isinstance(companies, list):
                # Find our test company
                test_company = next((c for c in companies if c["name"] == self.company_name), None)
                if test_company:
                    self.company_id = test_company["id"]
                    self.log_result("Get Companies", True, f"Found {len(companies)} companies including test company", {"company_count": len(companies)})
                else:
                    self.log_result("Get Companies", False, "Test company not found in companies list", {"companies": companies})
            else:
                self.log_result("Get Companies", False, "Invalid response format", result["data"])
        else:
            self.log_result("Get Companies", False, f"Failed to get companies: {result['data']}", result)

    def test_3_employee_signup(self):
        """Test 3: Employee Signup Flow"""
        print("🔄 Testing Employee Signup Flow...")
        
        signup_data = {
            "email": self.employee_email,
            "password": self.employee_password,
            "company_name": self.company_name,
            "country": "Singapore",
            "role": "Employee"
        }
        
        result = self.make_request("POST", "/auth/signup", signup_data)
        
        if result["success"]:
            response_data = result["data"]
            expected_keys = ["message", "email", "requires_approval"]
            
            if all(key in response_data for key in expected_keys):
                if response_data["email"] == self.employee_email and response_data["requires_approval"]:
                    self.log_result("Employee Signup", True, "Employee signup successful", response_data)
                else:
                    self.log_result("Employee Signup", False, "Invalid response data", response_data)
            else:
                self.log_result("Employee Signup", False, "Missing required fields in response", response_data)
        else:
            self.log_result("Employee Signup", False, f"Signup failed: {result['data']}", result)

    def test_4_admin_login_unverified(self):
        """Test 4: Admin Login (should fail - email not verified)"""
        print("🔄 Testing Admin Login (unverified email)...")
        
        login_data = {
            "email": self.admin_email,
            "password": self.admin_password
        }
        
        result = self.make_request("POST", "/auth/login", login_data)
        
        if not result["success"] and result["status_code"] == 403:
            error_message = result["data"].get("detail", "")
            if "verify" in error_message.lower():
                self.log_result("Admin Login (Unverified)", True, "Correctly blocked unverified email", {"error": error_message})
            else:
                self.log_result("Admin Login (Unverified)", False, "Wrong error message", result["data"])
        else:
            self.log_result("Admin Login (Unverified)", False, "Should have failed with 403 for unverified email", result)

    def test_5_simulate_email_verification(self):
        """Test 5: Simulate Email Verification (bypass for testing)"""
        print("🔄 Simulating Email Verification...")
        
        # Since we can't access emails in testing, we'll manually verify users
        # This simulates the email verification process
        try:
            import asyncio
            import os
            from motor.motor_asyncio import AsyncIOMotorClient
            from dotenv import load_dotenv
            from pathlib import Path
            
            # Load environment variables
            ROOT_DIR = Path(__file__).parent / "backend"
            load_dotenv(ROOT_DIR / '.env')
            
            async def verify_users():
                mongo_url = os.environ['MONGO_URL']
                client = AsyncIOMotorClient(mongo_url)
                db = client[os.environ['DB_NAME']]
                
                # Verify admin user
                admin_result = await db.users.update_one(
                    {"email": self.admin_email},
                    {"$set": {"is_verified": True, "verification_token": None}}
                )
                
                # Verify employee user
                employee_result = await db.users.update_one(
                    {"email": self.employee_email},
                    {"$set": {"is_verified": True, "verification_token": None}}
                )
                
                client.close()
                return admin_result.modified_count > 0 and employee_result.modified_count > 0
            
            # Run the verification
            verification_success = asyncio.run(verify_users())
            
            if verification_success:
                self.log_result("Email Verification", True, "Users manually verified for testing", {"admin_email": self.admin_email, "employee_email": self.employee_email})
            else:
                self.log_result("Email Verification", False, "Failed to manually verify users", {})
                
        except Exception as e:
            self.log_result("Email Verification", False, f"Verification error: {str(e)}", {})

    def test_6_admin_login_verified(self):
        """Test 6: Admin Login (after manual verification)"""
        print("🔄 Testing Admin Login (assuming verification)...")
        
        login_data = {
            "email": self.admin_email,
            "password": self.admin_password
        }
        
        result = self.make_request("POST", "/auth/login", login_data)
        
        if result["success"]:
            response_data = result["data"]
            if "access_token" in response_data and "user" in response_data:
                self.admin_token = response_data["access_token"]
                self.admin_user_data = response_data["user"]
                self.log_result("Admin Login", True, "Admin login successful", {"user_role": self.admin_user_data.get("role")})
            else:
                self.log_result("Admin Login", False, "Invalid login response format", response_data)
        else:
            # If login fails due to verification, that's expected in testing environment
            error_detail = result["data"].get("detail", "")
            if "verify" in error_detail.lower():
                self.log_result("Admin Login", False, "Email verification required (expected in test environment)", result["data"])
            else:
                self.log_result("Admin Login", False, f"Login failed: {error_detail}", result)

    def test_7_get_current_user(self):
        """Test 7: Get Current User"""
        print("🔄 Testing Get Current User...")
        
        if not self.admin_token:
            self.log_result("Get Current User", False, "No admin token available", {})
            return
            
        headers = {"Authorization": f"Bearer {self.admin_token}"}
        result = self.make_request("GET", "/auth/me", headers=headers)
        
        if result["success"]:
            user_data = result["data"]
            expected_fields = ["id", "email", "role", "company_id"]
            if all(field in user_data for field in expected_fields):
                self.log_result("Get Current User", True, "User data retrieved successfully", user_data)
            else:
                self.log_result("Get Current User", False, "Missing required user fields", user_data)
        else:
            self.log_result("Get Current User", False, f"Failed to get user data: {result['data']}", result)

    def test_8_employee_login_blocked(self):
        """Test 8: Employee Login (should be blocked - not approved)"""
        print("🔄 Testing Employee Login (should be blocked)...")
        
        login_data = {
            "email": self.employee_email,
            "password": self.employee_password
        }
        
        result = self.make_request("POST", "/auth/login", login_data)
        
        if not result["success"]:
            error_detail = result["data"].get("detail", "")
            if "approval" in error_detail.lower() or "verify" in error_detail.lower():
                self.log_result("Employee Login (Blocked)", True, "Correctly blocked unapproved/unverified employee", {"error": error_detail})
            else:
                self.log_result("Employee Login (Blocked)", True, "Login blocked as expected", result["data"])
        else:
            self.log_result("Employee Login (Blocked)", False, "Employee login should have been blocked", result)

    def test_9_get_pending_employees(self):
        """Test 9: Admin Get Pending Employees"""
        print("🔄 Testing Get Pending Employees...")
        
        if not self.admin_token:
            self.log_result("Get Pending Employees", False, "No admin token available", {})
            return
            
        headers = {"Authorization": f"Bearer {self.admin_token}"}
        result = self.make_request("GET", "/admin/pending-employees", headers=headers)
        
        if result["success"]:
            pending_employees = result["data"]
            if isinstance(pending_employees, list):
                # Look for our test employee
                test_employee = next((emp for emp in pending_employees if emp["email"] == self.employee_email), None)
                if test_employee:
                    self.employee_id = test_employee["id"]
                    self.log_result("Get Pending Employees", True, f"Found {len(pending_employees)} pending employees", {"employee_count": len(pending_employees)})
                else:
                    self.log_result("Get Pending Employees", False, "Test employee not found in pending list", {"pending_employees": pending_employees})
            else:
                self.log_result("Get Pending Employees", False, "Invalid response format", result["data"])
        else:
            self.log_result("Get Pending Employees", False, f"Failed to get pending employees: {result['data']}", result)

    def test_10_approve_employee(self):
        """Test 10: Admin Approve Employee"""
        print("🔄 Testing Admin Approve Employee...")
        
        if not self.admin_token:
            self.log_result("Approve Employee", False, "No admin token available", {})
            return
            
        if not self.employee_id:
            self.log_result("Approve Employee", False, "No employee ID available", {})
            return
            
        headers = {"Authorization": f"Bearer {self.admin_token}"}
        result = self.make_request("POST", f"/admin/approve-employee/{self.employee_id}", headers=headers)
        
        if result["success"]:
            response_data = result["data"]
            if "message" in response_data:
                self.log_result("Approve Employee", True, "Employee approved successfully", response_data)
            else:
                self.log_result("Approve Employee", False, "Invalid approval response", response_data)
        else:
            self.log_result("Approve Employee", False, f"Failed to approve employee: {result['data']}", result)

    def test_11_employee_login_success(self):
        """Test 11: Employee Login (should succeed after approval)"""
        print("🔄 Testing Employee Login (after approval)...")
        
        login_data = {
            "email": self.employee_email,
            "password": self.employee_password
        }
        
        result = self.make_request("POST", "/auth/login", login_data)
        
        if result["success"]:
            response_data = result["data"]
            if "access_token" in response_data and "user" in response_data:
                self.employee_token = response_data["access_token"]
                self.employee_user_data = response_data["user"]
                self.log_result("Employee Login (Approved)", True, "Employee login successful after approval", {"user_role": self.employee_user_data.get("role")})
            else:
                self.log_result("Employee Login (Approved)", False, "Invalid login response format", response_data)
        else:
            error_detail = result["data"].get("detail", "")
            if "verify" in error_detail.lower():
                self.log_result("Employee Login (Approved)", False, "Still requires email verification", result["data"])
            elif "approval" in error_detail.lower():
                self.log_result("Employee Login (Approved)", False, "Still requires approval (approval may not have worked)", result["data"])
            else:
                self.log_result("Employee Login (Approved)", False, f"Login failed: {error_detail}", result)

    def test_12_change_password(self):
        """Test 12: Password Change"""
        print("🔄 Testing Password Change...")
        
        # Test with admin token
        if not self.admin_token:
            self.log_result("Change Password", False, "No admin token available", {})
            return
            
        headers = {"Authorization": f"Bearer {self.admin_token}"}
        password_data = {
            "current_password": self.admin_password,
            "new_password": self.new_password
        }
        
        result = self.make_request("POST", "/auth/change-password", password_data, headers)
        
        if result["success"]:
            response_data = result["data"]
            if "message" in response_data:
                self.log_result("Change Password", True, "Password changed successfully", response_data)
                
                # Test login with new password
                login_data = {
                    "email": self.admin_email,
                    "password": self.new_password
                }
                login_result = self.make_request("POST", "/auth/login", login_data)
                
                if login_result["success"]:
                    self.log_result("Login with New Password", True, "Login successful with new password", {})
                else:
                    error_detail = login_result["data"].get("detail", "")
                    if "verify" in error_detail.lower():
                        self.log_result("Login with New Password", False, "Email verification still required", login_result["data"])
                    else:
                        self.log_result("Login with New Password", False, "Login failed with new password", login_result["data"])
            else:
                self.log_result("Change Password", False, "Invalid password change response", response_data)
        else:
            self.log_result("Change Password", False, f"Failed to change password: {result['data']}", result)

    def test_13_invalid_scenarios(self):
        """Test 13: Invalid Scenarios"""
        print("🔄 Testing Invalid Scenarios...")
        
        # Test invalid email format
        invalid_signup = {
            "email": "invalid-email",
            "password": "ValidPass123!",
            "company_name": "TestCorp",
            "country": "Singapore",
            "role": "Admin"
        }
        
        result = self.make_request("POST", "/auth/signup", invalid_signup)
        if not result["success"]:
            self.log_result("Invalid Email Format", True, "Correctly rejected invalid email", result["data"])
        else:
            self.log_result("Invalid Email Format", False, "Should have rejected invalid email", result)
        
        # Test weak password
        weak_password_signup = {
            "email": "test@example.com",
            "password": "weak",
            "company_name": "TestCorp",
            "country": "Singapore",
            "role": "Admin"
        }
        
        result = self.make_request("POST", "/auth/signup", weak_password_signup)
        if not result["success"]:
            self.log_result("Weak Password", True, "Correctly rejected weak password", result["data"])
        else:
            self.log_result("Weak Password", False, "Should have rejected weak password", result)
        
        # Test invalid country
        invalid_country_signup = {
            "email": "test2@example.com",
            "password": "ValidPass123!",
            "company_name": "TestCorp",
            "country": "InvalidCountry",
            "role": "Admin"
        }
        
        result = self.make_request("POST", "/auth/signup", invalid_country_signup)
        if not result["success"]:
            self.log_result("Invalid Country", True, "Correctly rejected invalid country", result["data"])
        else:
            self.log_result("Invalid Country", False, "Should have rejected invalid country", result)

    def run_all_tests(self):
        """Run all tests in sequence"""
        print("🚀 Starting EMS Authentication System Backend Tests")
        print("=" * 60)
        
        # Run tests in order
        self.test_1_admin_signup()
        self.test_2_get_companies()
        self.test_3_employee_signup()
        self.test_4_admin_login_unverified()
        self.test_5_simulate_email_verification()
        self.test_6_admin_login_verified()
        self.test_7_get_current_user()
        self.test_8_employee_login_blocked()
        self.test_9_get_pending_employees()
        self.test_10_approve_employee()
        self.test_11_employee_login_success()
        self.test_12_change_password()
        self.test_13_invalid_scenarios()
        
        # Print summary
        self.print_summary()

    def print_summary(self):
        """Print test summary"""
        print("=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
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
        else:
            print("🎉 ALL TESTS PASSED!")
        
        print("=" * 60)

if __name__ == "__main__":
    tester = EMSAuthTester()
    tester.run_all_tests()