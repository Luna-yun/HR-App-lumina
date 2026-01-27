"""
Backend Tests for Task Management and Performance Review Features
Tests: Employee tasks, performance reviews, analytics, and notification bell navigation
"""

import pytest
import requests
import os
import time

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials
ADMIN_EMAIL = "admin@lumina.com"
ADMIN_PASSWORD = "Password123!"
EMPLOYEE_EMAIL = "employee.test@lumina.com"
EMPLOYEE_PASSWORD = "Employee123!"


class TestAuthSetup:
    """Authentication setup tests"""
    
    @pytest.fixture(scope="class")
    def admin_token(self):
        """Get admin authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200, f"Admin login failed: {response.text}"
        data = response.json()
        assert "access_token" in data, "No access_token in response"
        return data["access_token"]
    
    @pytest.fixture(scope="class")
    def employee_token(self):
        """Get employee authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": EMPLOYEE_EMAIL,
            "password": EMPLOYEE_PASSWORD
        })
        assert response.status_code == 200, f"Employee login failed: {response.text}"
        data = response.json()
        assert "access_token" in data, "No access_token in response"
        return data["access_token"]
    
    @pytest.fixture(scope="class")
    def admin_headers(self, admin_token):
        """Admin auth headers"""
        return {"Authorization": f"Bearer {admin_token}", "Content-Type": "application/json"}
    
    @pytest.fixture(scope="class")
    def employee_headers(self, employee_token):
        """Employee auth headers"""
        return {"Authorization": f"Bearer {employee_token}", "Content-Type": "application/json"}
    
    def test_admin_login(self, admin_token):
        """Test admin can login"""
        assert admin_token is not None
        assert len(admin_token) > 0
        print(f"Admin login successful, token length: {len(admin_token)}")
    
    def test_employee_login(self, employee_token):
        """Test employee can login"""
        assert employee_token is not None
        assert len(employee_token) > 0
        print(f"Employee login successful, token length: {len(employee_token)}")


class TestEmployeeTasks:
    """Tests for employee task management"""
    
    @pytest.fixture(scope="class")
    def employee_token(self):
        """Get employee authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": EMPLOYEE_EMAIL,
            "password": EMPLOYEE_PASSWORD
        })
        assert response.status_code == 200, f"Employee login failed: {response.text}"
        return response.json()["access_token"]
    
    @pytest.fixture(scope="class")
    def employee_headers(self, employee_token):
        """Employee auth headers"""
        return {"Authorization": f"Bearer {employee_token}", "Content-Type": "application/json"}
    
    def test_get_my_tasks(self, employee_headers):
        """Test GET /api/tasks/my - Employee can fetch their assigned tasks"""
        response = requests.get(f"{BASE_URL}/api/tasks/my", headers=employee_headers)
        assert response.status_code == 200, f"Failed to get tasks: {response.text}"
        
        data = response.json()
        assert "tasks" in data, "Response should contain 'tasks' key"
        assert "total" in data, "Response should contain 'total' key"
        
        print(f"Employee has {data['total']} tasks assigned")
        
        # Verify task structure if tasks exist
        if data["tasks"]:
            task = data["tasks"][0]
            required_fields = ["id", "title", "status", "priority", "assigned_by_name", "created_at"]
            for field in required_fields:
                assert field in task, f"Task missing required field: {field}"
            print(f"First task: {task['title']} - Status: {task['status']}")
    
    def test_get_my_tasks_with_status_filter(self, employee_headers):
        """Test GET /api/tasks/my with status filter"""
        response = requests.get(f"{BASE_URL}/api/tasks/my?status_filter=pending", headers=employee_headers)
        assert response.status_code == 200, f"Failed to get filtered tasks: {response.text}"
        
        data = response.json()
        # All returned tasks should have pending status
        for task in data["tasks"]:
            assert task["status"] == "pending", f"Task status should be pending, got: {task['status']}"
        
        print(f"Found {len(data['tasks'])} pending tasks")


class TestTaskStatusUpdate:
    """Tests for task status update functionality"""
    
    @pytest.fixture(scope="class")
    def employee_token(self):
        """Get employee authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": EMPLOYEE_EMAIL,
            "password": EMPLOYEE_PASSWORD
        })
        assert response.status_code == 200
        return response.json()["access_token"]
    
    @pytest.fixture(scope="class")
    def employee_headers(self, employee_token):
        """Employee auth headers"""
        return {"Authorization": f"Bearer {employee_token}", "Content-Type": "application/json"}
    
    def test_update_task_status(self, employee_headers):
        """Test PUT /api/tasks/{task_id} - Employee can update task status"""
        # First get tasks
        response = requests.get(f"{BASE_URL}/api/tasks/my", headers=employee_headers)
        assert response.status_code == 200
        
        data = response.json()
        if not data["tasks"]:
            pytest.skip("No tasks available to update")
        
        task = data["tasks"][0]
        task_id = task["id"]
        original_status = task["status"]
        
        # Update to in_progress
        new_status = "in_progress" if original_status != "in_progress" else "pending"
        update_response = requests.put(
            f"{BASE_URL}/api/tasks/{task_id}",
            headers=employee_headers,
            json={"status": new_status, "notes": "TEST_Status update test note"}
        )
        assert update_response.status_code == 200, f"Failed to update task: {update_response.text}"
        
        result = update_response.json()
        assert "message" in result
        print(f"Task status updated from {original_status} to {new_status}")
        
        # Verify the update persisted
        verify_response = requests.get(f"{BASE_URL}/api/tasks/my", headers=employee_headers)
        assert verify_response.status_code == 200
        
        updated_tasks = verify_response.json()["tasks"]
        updated_task = next((t for t in updated_tasks if t["id"] == task_id), None)
        assert updated_task is not None, "Task not found after update"
        assert updated_task["status"] == new_status, f"Status not updated: expected {new_status}, got {updated_task['status']}"
        
        # Restore original status
        requests.put(
            f"{BASE_URL}/api/tasks/{task_id}",
            headers=employee_headers,
            json={"status": original_status}
        )
        print("Task status restored to original")


class TestEmployeePerformanceReviews:
    """Tests for employee performance reviews"""
    
    @pytest.fixture(scope="class")
    def employee_token(self):
        """Get employee authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": EMPLOYEE_EMAIL,
            "password": EMPLOYEE_PASSWORD
        })
        assert response.status_code == 200
        return response.json()["access_token"]
    
    @pytest.fixture(scope="class")
    def employee_headers(self, employee_token):
        """Employee auth headers"""
        return {"Authorization": f"Bearer {employee_token}", "Content-Type": "application/json"}
    
    def test_get_my_reviews(self, employee_headers):
        """Test GET /api/performance-reviews/my - Employee can fetch their reviews"""
        response = requests.get(f"{BASE_URL}/api/performance-reviews/my", headers=employee_headers)
        assert response.status_code == 200, f"Failed to get reviews: {response.text}"
        
        data = response.json()
        assert "reviews" in data, "Response should contain 'reviews' key"
        assert "total" in data, "Response should contain 'total' key"
        
        print(f"Employee has {data['total']} performance reviews")
        
        # Verify review structure if reviews exist
        if data["reviews"]:
            review = data["reviews"][0]
            required_fields = [
                "id", "review_period", "goals_achieved", "quality_score",
                "productivity_score", "teamwork_score", "communication_score",
                "overall_score", "reviewer_name", "created_at"
            ]
            for field in required_fields:
                assert field in review, f"Review missing required field: {field}"
            
            print(f"First review: {review['review_period']} - Score: {review['overall_score']}")
            
            # Verify score ranges
            assert 0 <= review["goals_achieved"] <= 100, "Goals achieved should be 0-100"
            assert 1 <= review["overall_score"] <= 5, "Overall score should be 1-5"


class TestAdminAnalytics:
    """Tests for admin analytics with real calculated data"""
    
    @pytest.fixture(scope="class")
    def admin_token(self):
        """Get admin authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        return response.json()["access_token"]
    
    @pytest.fixture(scope="class")
    def admin_headers(self, admin_token):
        """Admin auth headers"""
        return {"Authorization": f"Bearer {admin_token}", "Content-Type": "application/json"}
    
    def test_get_performance_analytics(self, admin_headers):
        """Test GET /api/admin/analytics/performance - Admin can get real analytics"""
        response = requests.get(f"{BASE_URL}/api/admin/analytics/performance", headers=admin_headers)
        assert response.status_code == 200, f"Failed to get analytics: {response.text}"
        
        data = response.json()
        
        # Verify reviews analytics
        assert "reviews" in data, "Response should contain 'reviews' analytics"
        reviews = data["reviews"]
        assert "total" in reviews
        assert "avg_overall_score" in reviews
        assert "avg_goals_achieved" in reviews
        assert "score_distribution" in reviews
        
        print(f"Reviews Analytics: Total={reviews['total']}, Avg Score={reviews['avg_overall_score']}, Avg Goals={reviews['avg_goals_achieved']}%")
        
        # Verify tasks analytics
        assert "tasks" in data, "Response should contain 'tasks' analytics"
        tasks = data["tasks"]
        assert "total" in tasks
        assert "completed" in tasks
        assert "pending" in tasks
        assert "in_progress" in tasks
        assert "completion_rate" in tasks
        
        print(f"Tasks Analytics: Total={tasks['total']}, Completed={tasks['completed']}, Pending={tasks['pending']}, Completion Rate={tasks['completion_rate']}%")
        
        # Verify top performers
        assert "top_performers" in data, "Response should contain 'top_performers'"
        print(f"Top Performers: {len(data['top_performers'])} employees")
    
    def test_analytics_data_consistency(self, admin_headers):
        """Test that analytics data is consistent with actual data"""
        # Get analytics
        analytics_response = requests.get(f"{BASE_URL}/api/admin/analytics/performance", headers=admin_headers)
        assert analytics_response.status_code == 200
        analytics = analytics_response.json()
        
        # Get all tasks
        tasks_response = requests.get(f"{BASE_URL}/api/admin/tasks", headers=admin_headers)
        assert tasks_response.status_code == 200
        tasks_data = tasks_response.json()
        
        # Verify task counts match
        actual_total = tasks_data["total"]
        analytics_total = analytics["tasks"]["total"]
        assert actual_total == analytics_total, f"Task count mismatch: actual={actual_total}, analytics={analytics_total}"
        
        # Count by status
        actual_pending = len([t for t in tasks_data["tasks"] if t["status"] == "pending"])
        actual_completed = len([t for t in tasks_data["tasks"] if t["status"] == "completed"])
        
        assert actual_pending == analytics["tasks"]["pending"], "Pending count mismatch"
        assert actual_completed == analytics["tasks"]["completed"], "Completed count mismatch"
        
        print("Analytics data is consistent with actual task data")


class TestAdminTaskManagement:
    """Tests for admin task management"""
    
    @pytest.fixture(scope="class")
    def admin_token(self):
        """Get admin authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        return response.json()["access_token"]
    
    @pytest.fixture(scope="class")
    def admin_headers(self, admin_token):
        """Admin auth headers"""
        return {"Authorization": f"Bearer {admin_token}", "Content-Type": "application/json"}
    
    def test_get_all_tasks(self, admin_headers):
        """Test GET /api/admin/tasks - Admin can get all company tasks"""
        response = requests.get(f"{BASE_URL}/api/admin/tasks", headers=admin_headers)
        assert response.status_code == 200, f"Failed to get tasks: {response.text}"
        
        data = response.json()
        assert "tasks" in data
        assert "total" in data
        
        print(f"Admin can see {data['total']} total tasks")
    
    def test_get_all_performance_reviews(self, admin_headers):
        """Test GET /api/admin/performance-reviews - Admin can get all reviews"""
        response = requests.get(f"{BASE_URL}/api/admin/performance-reviews", headers=admin_headers)
        assert response.status_code == 200, f"Failed to get reviews: {response.text}"
        
        data = response.json()
        assert "reviews" in data
        assert "total" in data
        
        print(f"Admin can see {data['total']} total performance reviews")


class TestNotifications:
    """Tests for notification functionality"""
    
    @pytest.fixture(scope="class")
    def admin_token(self):
        """Get admin authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        return response.json()["access_token"]
    
    @pytest.fixture(scope="class")
    def employee_token(self):
        """Get employee authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": EMPLOYEE_EMAIL,
            "password": EMPLOYEE_PASSWORD
        })
        assert response.status_code == 200
        return response.json()["access_token"]
    
    @pytest.fixture(scope="class")
    def admin_headers(self, admin_token):
        """Admin auth headers"""
        return {"Authorization": f"Bearer {admin_token}", "Content-Type": "application/json"}
    
    @pytest.fixture(scope="class")
    def employee_headers(self, employee_token):
        """Employee auth headers"""
        return {"Authorization": f"Bearer {employee_token}", "Content-Type": "application/json"}
    
    def test_admin_get_notifications(self, admin_headers):
        """Test admin can get notifications"""
        response = requests.get(f"{BASE_URL}/api/notifications", headers=admin_headers)
        assert response.status_code == 200, f"Failed to get notifications: {response.text}"
        
        data = response.json()
        assert "notifications" in data
        print(f"Admin has {len(data['notifications'])} notifications")
    
    def test_employee_get_notifications(self, employee_headers):
        """Test employee can get notifications"""
        response = requests.get(f"{BASE_URL}/api/notifications", headers=employee_headers)
        assert response.status_code == 200, f"Failed to get notifications: {response.text}"
        
        data = response.json()
        assert "notifications" in data
        print(f"Employee has {len(data['notifications'])} notifications")


class TestNoticesEndpoint:
    """Tests for notices endpoint (notification bell destination)"""
    
    @pytest.fixture(scope="class")
    def admin_token(self):
        """Get admin authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        return response.json()["access_token"]
    
    @pytest.fixture(scope="class")
    def employee_token(self):
        """Get employee authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": EMPLOYEE_EMAIL,
            "password": EMPLOYEE_PASSWORD
        })
        assert response.status_code == 200
        return response.json()["access_token"]
    
    @pytest.fixture(scope="class")
    def admin_headers(self, admin_token):
        """Admin auth headers"""
        return {"Authorization": f"Bearer {admin_token}", "Content-Type": "application/json"}
    
    @pytest.fixture(scope="class")
    def employee_headers(self, employee_token):
        """Employee auth headers"""
        return {"Authorization": f"Bearer {employee_token}", "Content-Type": "application/json"}
    
    def test_get_notices(self, admin_headers):
        """Test GET /api/notices - Both admin and employee can access notices"""
        response = requests.get(f"{BASE_URL}/api/notices", headers=admin_headers)
        assert response.status_code == 200, f"Failed to get notices: {response.text}"
        
        data = response.json()
        assert isinstance(data, list), "Notices should be a list"
        print(f"Found {len(data)} notices")
    
    def test_employee_get_notices(self, employee_headers):
        """Test employee can access notices"""
        response = requests.get(f"{BASE_URL}/api/notices", headers=employee_headers)
        assert response.status_code == 200, f"Failed to get notices: {response.text}"
        
        data = response.json()
        assert isinstance(data, list), "Notices should be a list"
        print(f"Employee can see {len(data)} notices")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
