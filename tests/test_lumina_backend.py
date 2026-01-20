"""
Lumina HR Management Backend API Tests
Tests authentication, admin dashboard, employees, departments, leaves, attendance, payroll, notices, recruitment, and AI chat
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://brighthr.preview.emergentagent.com')

# Test credentials
ADMIN_EMAIL = "admin@lumina.com"
ADMIN_PASSWORD = "Test123!"

class TestHealthCheck:
    """Health check endpoint tests"""
    
    def test_health_endpoint(self):
        """Test health check returns healthy status"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "Lumina EMS API"
        assert "version" in data


class TestAuthentication:
    """Authentication endpoint tests"""
    
    def test_login_success(self):
        """Test successful admin login"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "user" in data
        assert data["user"]["email"] == ADMIN_EMAIL
        assert data["user"]["role"] == "Admin"
        assert data["token_type"] == "bearer"
    
    def test_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "wrong@example.com",
            "password": "wrongpassword"
        })
        assert response.status_code == 401
    
    def test_login_missing_fields(self):
        """Test login with missing fields"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL
        })
        assert response.status_code == 422  # Validation error
    
    def test_get_me_authenticated(self):
        """Test get current user with valid token"""
        # First login
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        token = login_response.json()["access_token"]
        
        # Get current user
        response = requests.get(f"{BASE_URL}/api/auth/me", headers={
            "Authorization": f"Bearer {token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == ADMIN_EMAIL
        assert data["role"] == "Admin"
    
    def test_get_me_unauthenticated(self):
        """Test get current user without token"""
        response = requests.get(f"{BASE_URL}/api/auth/me")
        assert response.status_code == 401
    
    def test_get_companies(self):
        """Test get companies list"""
        response = requests.get(f"{BASE_URL}/api/companies")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)


class TestAdminStats:
    """Admin dashboard stats tests"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        return response.json()["access_token"]
    
    def test_get_admin_stats(self, auth_token):
        """Test get admin dashboard stats"""
        response = requests.get(f"{BASE_URL}/api/admin/stats", headers={
            "Authorization": f"Bearer {auth_token}"
        })
        assert response.status_code == 200
        data = response.json()
        # Verify stats structure
        assert "total_employees" in data
        assert "pending_leaves" in data
        assert "attendance_rate" in data


class TestEmployeeManagement:
    """Employee management tests"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        return response.json()["access_token"]
    
    def test_get_employees(self, auth_token):
        """Test get employees list"""
        response = requests.get(f"{BASE_URL}/api/admin/employees", headers={
            "Authorization": f"Bearer {auth_token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    def test_get_pending_employees(self, auth_token):
        """Test get pending employees"""
        response = requests.get(f"{BASE_URL}/api/admin/pending-employees", headers={
            "Authorization": f"Bearer {auth_token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)


class TestDepartments:
    """Department management tests"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        return response.json()["access_token"]
    
    def test_get_departments(self, auth_token):
        """Test get departments list"""
        response = requests.get(f"{BASE_URL}/api/departments", headers={
            "Authorization": f"Bearer {auth_token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    def test_create_and_delete_department(self, auth_token):
        """Test create and delete department"""
        # Create department
        create_response = requests.post(f"{BASE_URL}/api/admin/departments", 
            headers={"Authorization": f"Bearer {auth_token}"},
            json={"name": "TEST_Department", "description": "Test department"}
        )
        assert create_response.status_code in [200, 201]
        dept_data = create_response.json()
        dept_id = dept_data.get("id")
        
        # Verify department exists
        get_response = requests.get(f"{BASE_URL}/api/departments", headers={
            "Authorization": f"Bearer {auth_token}"
        })
        assert get_response.status_code == 200
        
        # Delete department
        if dept_id:
            delete_response = requests.delete(f"{BASE_URL}/api/admin/departments/{dept_id}", headers={
                "Authorization": f"Bearer {auth_token}"
            })
            assert delete_response.status_code in [200, 204]


class TestLeaveManagement:
    """Leave management tests"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        return response.json()["access_token"]
    
    def test_get_pending_leaves(self, auth_token):
        """Test get pending leave requests"""
        response = requests.get(f"{BASE_URL}/api/admin/leave/pending", headers={
            "Authorization": f"Bearer {auth_token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    def test_get_all_leaves(self, auth_token):
        """Test get all leave requests"""
        response = requests.get(f"{BASE_URL}/api/admin/leave/all", headers={
            "Authorization": f"Bearer {auth_token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)


class TestAttendance:
    """Attendance management tests"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        return response.json()["access_token"]
    
    def test_get_my_attendance_status(self, auth_token):
        """Test get current user attendance status"""
        response = requests.get(f"{BASE_URL}/api/attendance/my-status", headers={
            "Authorization": f"Bearer {auth_token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert "is_checked_in" in data or "checked_in" in data or "status" in data
    
    def test_get_my_attendance_history(self, auth_token):
        """Test get attendance history"""
        response = requests.get(f"{BASE_URL}/api/attendance/my-history?limit=30", headers={
            "Authorization": f"Bearer {auth_token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    def test_get_company_attendance(self, auth_token):
        """Test get company attendance (admin)"""
        response = requests.get(f"{BASE_URL}/api/admin/attendance", headers={
            "Authorization": f"Bearer {auth_token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert "records" in data or isinstance(data, list)


class TestSalary:
    """Salary/Payroll management tests"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        return response.json()["access_token"]
    
    def test_get_my_salary(self, auth_token):
        """Test get current user salary"""
        response = requests.get(f"{BASE_URL}/api/salary/mine", headers={
            "Authorization": f"Bearer {auth_token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert "has_salary" in data
    
    def test_get_salary_history(self, auth_token):
        """Test get salary history"""
        response = requests.get(f"{BASE_URL}/api/salary/my-history?limit=12", headers={
            "Authorization": f"Bearer {auth_token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert "records" in data or isinstance(data, list)
    
    def test_get_company_salaries(self, auth_token):
        """Test get company salaries (admin)"""
        response = requests.get(f"{BASE_URL}/api/admin/salaries", headers={
            "Authorization": f"Bearer {auth_token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)


class TestNotices:
    """Notice management tests"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        return response.json()["access_token"]
    
    def test_get_notices(self, auth_token):
        """Test get notices"""
        response = requests.get(f"{BASE_URL}/api/notices?limit=50", headers={
            "Authorization": f"Bearer {auth_token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    def test_create_and_delete_notice(self, auth_token):
        """Test create and delete notice"""
        # Create notice
        create_response = requests.post(f"{BASE_URL}/api/admin/notices", 
            headers={"Authorization": f"Bearer {auth_token}"},
            json={"title": "TEST_Notice", "content": "Test notice content"}
        )
        assert create_response.status_code in [200, 201]
        notice_data = create_response.json()
        notice_id = notice_data.get("id")
        
        # Delete notice
        if notice_id:
            delete_response = requests.delete(f"{BASE_URL}/api/admin/notices/{notice_id}", headers={
                "Authorization": f"Bearer {auth_token}"
            })
            assert delete_response.status_code in [200, 204]


class TestRecruitment:
    """Recruitment management tests"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        return response.json()["access_token"]
    
    def test_get_jobs(self, auth_token):
        """Test get job postings"""
        response = requests.get(f"{BASE_URL}/api/admin/jobs", headers={
            "Authorization": f"Bearer {auth_token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    def test_get_recruitment_stats(self, auth_token):
        """Test get recruitment stats"""
        response = requests.get(f"{BASE_URL}/api/admin/recruitment/stats", headers={
            "Authorization": f"Bearer {auth_token}"
        })
        assert response.status_code == 200


class TestAIChat:
    """AI Chat tests"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        return response.json()["access_token"]
    
    def test_get_documents(self, auth_token):
        """Test get knowledge documents"""
        response = requests.get(f"{BASE_URL}/api/admin/chat/documents", headers={
            "Authorization": f"Bearer {auth_token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert "documents" in data
        assert "total" in data
    
    def test_send_chat_message(self, auth_token):
        """Test send chat message"""
        response = requests.post(f"{BASE_URL}/api/admin/chat", 
            headers={"Authorization": f"Bearer {auth_token}"},
            json={"message": "What is the leave policy?"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "response" in data
        assert "session_id" in data
    
    def test_get_chat_history(self, auth_token):
        """Test get chat history"""
        response = requests.get(f"{BASE_URL}/api/admin/chat/history?limit=50", headers={
            "Authorization": f"Bearer {auth_token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert "messages" in data


class TestSignup:
    """Signup flow tests"""
    
    def test_signup_validation(self):
        """Test signup with invalid data"""
        response = requests.post(f"{BASE_URL}/api/auth/signup", json={
            "email": "invalid-email",
            "password": "weak",
            "full_name": "",
            "company_name": "",
            "country": "",
            "role": "Admin"
        })
        # Should fail validation
        assert response.status_code in [400, 422]


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
