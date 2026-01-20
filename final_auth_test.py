#!/usr/bin/env python3
"""
Final comprehensive test of all EMS authentication endpoints
"""

import requests
import json

BASE_URL = "https://brighthr.preview.emergentagent.com/api"

def test_all_endpoints():
    print("🔍 Final Comprehensive Authentication Test")
    print("=" * 50)
    
    # Test data
    admin_email = "final.admin@luminahr.com"
    employee_email = "final.employee@luminahr.com"
    company_name = "FinalTestCorp"
    password = "TestPass123!"
    
    results = []
    
    # 1. Test Admin Signup
    print("1. Testing Admin Signup...")
    signup_data = {
        "email": admin_email,
        "password": password,
        "company_name": company_name,
        "country": "Singapore",
        "role": "Admin"
    }
    
    response = requests.post(f"{BASE_URL}/auth/signup", json=signup_data)
    if response.status_code == 200:
        print("   ✅ Admin signup successful")
        results.append("✅ Admin Signup")
    else:
        print(f"   ❌ Admin signup failed: {response.text}")
        results.append("❌ Admin Signup")
    
    # 2. Test Employee Signup
    print("2. Testing Employee Signup...")
    signup_data["email"] = employee_email
    signup_data["role"] = "Employee"
    
    response = requests.post(f"{BASE_URL}/auth/signup", json=signup_data)
    if response.status_code == 200:
        print("   ✅ Employee signup successful")
        results.append("✅ Employee Signup")
    else:
        print(f"   ❌ Employee signup failed: {response.text}")
        results.append("❌ Employee Signup")
    
    # 3. Test Get Companies
    print("3. Testing Get Companies...")
    response = requests.get(f"{BASE_URL}/companies")
    if response.status_code == 200:
        companies = response.json()
        print(f"   ✅ Found {len(companies)} companies")
        results.append("✅ Get Companies")
    else:
        print(f"   ❌ Get companies failed: {response.text}")
        results.append("❌ Get Companies")
    
    # 4. Test Login (should fail - unverified)
    print("4. Testing Login (unverified)...")
    login_data = {"email": admin_email, "password": password}
    response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    if response.status_code == 403:
        print("   ✅ Correctly blocked unverified user")
        results.append("✅ Login Blocked (Unverified)")
    else:
        print(f"   ❌ Should have blocked unverified user: {response.text}")
        results.append("❌ Login Blocked (Unverified)")
    
    # 5. Test Invalid Email Verification
    print("5. Testing Invalid Email Verification...")
    response = requests.get(f"{BASE_URL}/auth/verify-email?token=invalid_token")
    if response.status_code == 400:
        print("   ✅ Correctly rejected invalid token")
        results.append("✅ Invalid Token Rejected")
    else:
        print(f"   ❌ Should have rejected invalid token: {response.text}")
        results.append("❌ Invalid Token Rejected")
    
    # 6. Test Password Validation
    print("6. Testing Password Validation...")
    weak_signup = {
        "email": "weak@test.com",
        "password": "weak",
        "company_name": "TestCorp",
        "country": "Singapore",
        "role": "Admin"
    }
    response = requests.post(f"{BASE_URL}/auth/signup", json=weak_signup)
    if response.status_code == 422:
        print("   ✅ Correctly rejected weak password")
        results.append("✅ Password Validation")
    else:
        print(f"   ❌ Should have rejected weak password: {response.text}")
        results.append("❌ Password Validation")
    
    # 7. Test Invalid Country
    print("7. Testing Country Validation...")
    invalid_country = {
        "email": "country@test.com",
        "password": "ValidPass123!",
        "company_name": "TestCorp",
        "country": "InvalidCountry",
        "role": "Admin"
    }
    response = requests.post(f"{BASE_URL}/auth/signup", json=invalid_country)
    if response.status_code == 422:
        print("   ✅ Correctly rejected invalid country")
        results.append("✅ Country Validation")
    else:
        print(f"   ❌ Should have rejected invalid country: {response.text}")
        results.append("❌ Country Validation")
    
    # 8. Test Unauthorized Access
    print("8. Testing Unauthorized Access...")
    response = requests.get(f"{BASE_URL}/auth/me")
    if response.status_code == 403:
        print("   ✅ Correctly blocked unauthorized access")
        results.append("✅ Unauthorized Access Blocked")
    else:
        print(f"   ❌ Should have blocked unauthorized access: {response.text}")
        results.append("❌ Unauthorized Access Blocked")
    
    # 9. Test Admin Endpoints Without Token
    print("9. Testing Admin Endpoints (no token)...")
    response = requests.get(f"{BASE_URL}/admin/pending-employees")
    if response.status_code == 403:
        print("   ✅ Correctly blocked admin endpoint without token")
        results.append("✅ Admin Endpoint Protected")
    else:
        print(f"   ❌ Should have blocked admin endpoint: {response.text}")
        results.append("❌ Admin Endpoint Protected")
    
    print("\n" + "=" * 50)
    print("📊 FINAL TEST RESULTS")
    print("=" * 50)
    
    for result in results:
        print(f"  {result}")
    
    passed = len([r for r in results if r.startswith("✅")])
    total = len(results)
    
    print(f"\nSUMMARY: {passed}/{total} tests passed ({(passed/total)*100:.1f}%)")
    
    if passed == total:
        print("🎉 ALL AUTHENTICATION ENDPOINTS WORKING CORRECTLY!")
    else:
        print("⚠️  Some issues found - see details above")

if __name__ == "__main__":
    test_all_endpoints()