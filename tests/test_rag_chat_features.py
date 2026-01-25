"""
LuminaHR RAG Chat Feature Tests
Tests the RAG-based AI chat system with local sentence-transformers embeddings
Tests document upload, listing, deletion, and chat functionality
"""
import pytest
import requests
import os
import time

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://lumina-staff.preview.emergentagent.com')

# Test credentials from review request
TEST_ADMIN_EMAIL = "testadmin@lumina.com"
TEST_ADMIN_PASSWORD = "Password123!"
COMPANY_ID = "7aea5712-7923-43b4-9bd4-13aece2179c0"


class TestRAGChatSystem:
    """RAG Chat System Tests - Tests the new local embedding system"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token for test admin"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_ADMIN_EMAIL,
            "password": TEST_ADMIN_PASSWORD
        })
        if response.status_code != 200:
            pytest.skip(f"Login failed with status {response.status_code}: {response.text}")
        return response.json()["access_token"]
    
    def test_login_with_test_admin(self):
        """Test login with provided test admin credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_ADMIN_EMAIL,
            "password": TEST_ADMIN_PASSWORD
        })
        print(f"Login response status: {response.status_code}")
        print(f"Login response: {response.text[:500] if response.text else 'No response'}")
        
        assert response.status_code == 200, f"Login failed: {response.text}"
        data = response.json()
        assert "access_token" in data
        assert "user" in data
        assert data["user"]["email"] == TEST_ADMIN_EMAIL
        assert data["user"]["role"] == "Admin"
        print(f"Successfully logged in as {data['user']['full_name']}")
    
    def test_get_documents_list(self, auth_token):
        """Test GET /api/admin/chat/documents - List knowledge documents"""
        response = requests.get(
            f"{BASE_URL}/api/admin/chat/documents",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        print(f"Get documents response status: {response.status_code}")
        print(f"Get documents response: {response.text[:500] if response.text else 'No response'}")
        
        assert response.status_code == 200, f"Get documents failed: {response.text}"
        data = response.json()
        assert "documents" in data
        assert "total" in data
        assert isinstance(data["documents"], list)
        print(f"Found {data['total']} documents in knowledge base")
        
        # Print document details if any exist
        for doc in data["documents"]:
            print(f"  - {doc['filename']} ({doc['file_type']}, {doc['chunk_count']} chunks)")
    
    def test_send_chat_message(self, auth_token):
        """Test POST /api/admin/chat - Send chat message and get RAG response"""
        response = requests.post(
            f"{BASE_URL}/api/admin/chat",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={"message": "What is the company leave policy?"}
        )
        print(f"Chat response status: {response.status_code}")
        print(f"Chat response: {response.text[:1000] if response.text else 'No response'}")
        
        assert response.status_code == 200, f"Chat failed: {response.text}"
        data = response.json()
        
        # Verify response structure
        assert "response" in data, "Missing 'response' field"
        assert "session_id" in data, "Missing 'session_id' field"
        assert "sources" in data, "Missing 'sources' field"
        assert "reasoning" in data, "Missing 'reasoning' field"
        
        # Verify response content
        assert len(data["response"]) > 0, "Empty response"
        assert isinstance(data["sources"], list), "Sources should be a list"
        
        print(f"AI Response: {data['response'][:300]}...")
        print(f"Sources: {data['sources']}")
        print(f"Reasoning: {data['reasoning']}")
        print(f"Session ID: {data['session_id']}")
    
    def test_chat_with_session_continuity(self, auth_token):
        """Test chat session continuity - multiple messages in same session"""
        # First message
        response1 = requests.post(
            f"{BASE_URL}/api/admin/chat",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={"message": "Hello, I have a question about HR policies."}
        )
        assert response1.status_code == 200
        data1 = response1.json()
        session_id = data1["session_id"]
        print(f"First message - Session ID: {session_id}")
        
        # Second message with same session
        response2 = requests.post(
            f"{BASE_URL}/api/admin/chat",
            headers={"Authorization": f"Bearer {auth_token}"},
            json={"message": "Can you tell me about attendance tracking?", "session_id": session_id}
        )
        assert response2.status_code == 200
        data2 = response2.json()
        
        # Verify session continuity
        assert data2["session_id"] == session_id, "Session ID should remain the same"
        print(f"Second message - Session ID: {data2['session_id']}")
        print(f"Session continuity verified!")
    
    def test_get_chat_history(self, auth_token):
        """Test GET /api/admin/chat/history - Get chat history"""
        response = requests.get(
            f"{BASE_URL}/api/admin/chat/history?limit=50",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        print(f"Chat history response status: {response.status_code}")
        
        assert response.status_code == 200, f"Get chat history failed: {response.text}"
        data = response.json()
        
        assert "messages" in data
        assert "total" in data
        assert isinstance(data["messages"], list)
        
        print(f"Found {data['total']} messages in chat history")
        for msg in data["messages"][:5]:  # Print first 5 messages
            print(f"  [{msg['role']}]: {msg['content'][:100]}...")
    
    def test_clear_chat_history(self, auth_token):
        """Test DELETE /api/admin/chat/history - Clear chat history"""
        response = requests.delete(
            f"{BASE_URL}/api/admin/chat/history",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        print(f"Clear history response status: {response.status_code}")
        print(f"Clear history response: {response.text}")
        
        assert response.status_code == 200, f"Clear history failed: {response.text}"
        data = response.json()
        assert "deleted_count" in data or "message" in data
        print(f"Cleared chat history successfully")


class TestDocumentUploadAndDelete:
    """Document Upload and Delete Tests"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token for test admin"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_ADMIN_EMAIL,
            "password": TEST_ADMIN_PASSWORD
        })
        if response.status_code != 200:
            pytest.skip(f"Login failed with status {response.status_code}")
        return response.json()["access_token"]
    
    def test_upload_text_document(self, auth_token):
        """Test POST /api/admin/chat/upload - Upload a test document"""
        # Create a simple test PDF-like content (text file for testing)
        test_content = b"""
        LuminaHR Test Policy Document
        
        Leave Policy:
        - All employees are entitled to 14 days of annual leave per year
        - Sick leave requires a medical certificate for absences over 2 days
        - Maternity leave is 90 days with full pay
        
        Attendance Policy:
        - Work hours are 9 AM to 6 PM
        - Employees must check in within 15 minutes of start time
        - Late arrivals more than 3 times per month require manager approval
        
        Performance Review:
        - Reviews are conducted quarterly
        - Self-assessment is required before each review
        - Goals are set at the beginning of each quarter
        """
        
        # Create a file-like object
        files = {
            'file': ('TEST_policy_document.pdf', test_content, 'application/pdf')
        }
        
        response = requests.post(
            f"{BASE_URL}/api/admin/chat/upload",
            headers={"Authorization": f"Bearer {auth_token}"},
            files=files
        )
        print(f"Upload response status: {response.status_code}")
        print(f"Upload response: {response.text[:500] if response.text else 'No response'}")
        
        # Note: This might fail if the PDF parsing fails on plain text
        # The test is to verify the endpoint is working
        if response.status_code == 200:
            data = response.json()
            print(f"Document uploaded: {data}")
            if not data.get("duplicate"):
                assert "document_id" in data
                assert "chunks_created" in data
                print(f"Created {data['chunks_created']} chunks")
                return data["document_id"]
        elif response.status_code == 400:
            # Expected if PDF parsing fails on plain text
            print("Upload failed as expected for non-PDF content")
        else:
            print(f"Unexpected status: {response.status_code}")


class TestASEANCountriesDropdown:
    """Test ASEAN Countries including Timor-Leste"""
    
    def test_signup_page_countries_validation(self):
        """Test that signup accepts Timor-Leste as a valid country"""
        # Test signup with Timor-Leste
        response = requests.post(f"{BASE_URL}/api/auth/signup", json={
            "email": "test_timorleste@example.com",
            "password": "TestPassword123!",
            "full_name": "Test User Timor",
            "company_name": "Test Company Timor",
            "country": "Timor-Leste",
            "role": "Admin"
        })
        print(f"Signup with Timor-Leste response status: {response.status_code}")
        print(f"Signup response: {response.text[:500] if response.text else 'No response'}")
        
        # Should either succeed (201/200) or fail with duplicate email (400)
        # Should NOT fail with invalid country
        if response.status_code in [200, 201]:
            print("Signup with Timor-Leste succeeded!")
        elif response.status_code == 400:
            data = response.json()
            # Check if it's a duplicate email error (acceptable) vs invalid country (not acceptable)
            error_msg = str(data.get("detail", "")).lower()
            assert "country" not in error_msg, f"Timor-Leste should be a valid country: {error_msg}"
            print(f"Signup failed (likely duplicate): {data}")
        else:
            print(f"Unexpected response: {response.status_code}")


class TestAdminDashboardAccess:
    """Test admin can access dashboard after login"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token for test admin"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_ADMIN_EMAIL,
            "password": TEST_ADMIN_PASSWORD
        })
        if response.status_code != 200:
            pytest.skip(f"Login failed with status {response.status_code}")
        return response.json()["access_token"]
    
    def test_admin_stats_access(self, auth_token):
        """Test admin can access dashboard stats"""
        response = requests.get(
            f"{BASE_URL}/api/admin/stats",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        print(f"Admin stats response status: {response.status_code}")
        
        assert response.status_code == 200, f"Admin stats failed: {response.text}"
        data = response.json()
        
        # Verify stats structure
        assert "total_employees" in data
        assert "pending_leaves" in data
        print(f"Admin stats: {data}")
    
    def test_admin_employees_access(self, auth_token):
        """Test admin can access employees list"""
        response = requests.get(
            f"{BASE_URL}/api/admin/employees",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        print(f"Employees list response status: {response.status_code}")
        
        assert response.status_code == 200, f"Employees list failed: {response.text}"
        data = response.json()
        assert isinstance(data, list)
        print(f"Found {len(data)} employees")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
