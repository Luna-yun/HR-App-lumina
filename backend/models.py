from pydantic import BaseModel, Field, EmailStr, field_validator
from typing import Optional, List
from datetime import datetime
import uuid

# ASEAN Countries
ASEAN_COUNTRIES = [
    "Brunei",
    "Cambodia",
    "Indonesia",
    "Laos",
    "Malaysia",
    "Myanmar",
    "Philippines",
    "Singapore",
    "Thailand",
    "Vietnam"
]

# User Roles
class UserRole:
    ADMIN = "Admin"
    EMPLOYEE = "Employee"

# Database Models
class Company(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    country: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    admin_emails: List[str] = Field(default_factory=list)

    @field_validator('country')
    @classmethod
    def validate_country(cls, v):
        if v not in ASEAN_COUNTRIES:
            raise ValueError(f'Country must be one of ASEAN countries: {ASEAN_COUNTRIES}')
        return v

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    password_hash: str
    role: str  # Admin or Employee
    company_id: str
    company_name: str = ""  # Denormalized for easier queries
    
    # Profile fields
    full_name: str = ""
    department: str = "Unassigned"
    job_title: str = ""
    phone: str = ""
    
    # Status fields
    is_verified: bool = False
    is_approved: bool = False  # Only for Employees
    is_active: bool = True
    verification_token: Optional[str] = None
    password_changed_at: Optional[datetime] = None  # Track password changes for token invalidation
    last_login: Optional[datetime] = None
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None

    @field_validator('role')
    @classmethod
    def validate_role(cls, v):
        if v not in [UserRole.ADMIN, UserRole.EMPLOYEE]:
            raise ValueError(f'Role must be either {UserRole.ADMIN} or {UserRole.EMPLOYEE}')
        return v

# API Request/Response Models
class SignUpRequest(BaseModel):
    email: EmailStr
    password: str
    company_name: str
    country: str
    role: str

    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one digit')
        if not any(c in '!@#$%^&*()_+-=[]{}|;:,.<>?' for c in v):
            raise ValueError('Password must contain at least one special character')
        return v

    @field_validator('country')
    @classmethod
    def validate_country(cls, v):
        if v not in ASEAN_COUNTRIES:
            raise ValueError(f'Country must be one of ASEAN countries')
        return v

    @field_validator('role')
    @classmethod
    def validate_role(cls, v):
        if v not in [UserRole.ADMIN, UserRole.EMPLOYEE]:
            raise ValueError(f'Role must be either {UserRole.ADMIN} or {UserRole.EMPLOYEE}')
        return v

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

    @field_validator('new_password')
    @classmethod
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one digit')
        if not any(c in '!@#$%^&*()_+-=[]{}|;:,.<>?' for c in v):
            raise ValueError('Password must contain at least one special character')
        return v

class UserResponse(BaseModel):
    id: str
    email: str
    role: str
    company_id: str
    company_name: str
    full_name: str
    department: str
    job_title: str
    phone: str
    is_verified: bool
    is_approved: bool
    is_active: bool
    last_login: Optional[datetime]
    created_at: datetime

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class CompanyResponse(BaseModel):
    id: str
    name: str
    country: str

class PendingEmployeeResponse(BaseModel):
    id: str
    email: str
    full_name: str
    company_name: str
    created_at: datetime

class ProfileUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    department: Optional[str] = None
    job_title: Optional[str] = None
    phone: Optional[str] = None

class EmployeeListResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    department: str
    job_title: str
    is_active: bool
    is_approved: bool
    created_at: datetime


# ========================================
# PHASE 3 MODELS - OPERATIONAL EMS
# ========================================

# Attendance Models
class AttendanceStatus:
    NOT_CHECKED_IN = "not_checked_in"
    CHECKED_IN = "checked_in"
    COMPLETED = "completed"

class Attendance(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    employee_id: str
    company_id: str
    date: str  # YYYY-MM-DD format
    check_in_time: Optional[datetime] = None
    check_out_time: Optional[datetime] = None
    status: str = AttendanceStatus.NOT_CHECKED_IN  # not_checked_in, checked_in, completed
    notes: str = ""
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None

class AttendanceResponse(BaseModel):
    id: str
    employee_id: str
    date: str
    check_in_time: Optional[datetime]
    check_out_time: Optional[datetime]
    status: str
    notes: str

class TodayAttendanceResponse(BaseModel):
    status: str
    check_in_time: Optional[datetime]
    check_out_time: Optional[datetime]
    can_check_in: bool
    can_check_out: bool

# Leave Request Models
class LeaveStatus:
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class LeaveRequest(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    employee_id: str
    employee_name: str
    employee_email: str
    company_id: str
    start_date: str  # YYYY-MM-DD
    end_date: str  # YYYY-MM-DD
    reason: str
    status: str = LeaveStatus.PENDING
    reviewed_by: Optional[str] = None  # Admin ID who approved/rejected
    reviewed_at: Optional[datetime] = None
    rejection_reason: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None

class LeaveRequestCreate(BaseModel):
    start_date: str
    end_date: str
    reason: str

class LeaveRequestResponse(BaseModel):
    id: str
    employee_id: str
    employee_name: str
    employee_email: str
    start_date: str
    end_date: str
    reason: str
    status: str
    reviewed_by: Optional[str]
    reviewed_at: Optional[datetime]
    rejection_reason: Optional[str]
    created_at: datetime

class LeaveReviewRequest(BaseModel):
    rejection_reason: Optional[str] = None

class LeaveSummaryResponse(BaseModel):
    pending: int
    approved: int
    rejected: int
    total: int

# Salary Models
class SalaryRecord(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    employee_id: str
    employee_name: str
    employee_email: str
    company_id: str
    month: int  # 1-12
    year: int
    gross_salary: float
    deductions: float = 0.0
    net_salary: float
    currency: str = "USD"
    payment_date: Optional[datetime] = None
    notes: str = ""
    created_by: str  # Admin ID
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None

class SalaryRecordCreate(BaseModel):
    employee_id: str
    month: int
    year: int
    gross_salary: float
    deductions: float = 0.0
    currency: str = "USD"
    notes: str = ""

    @field_validator('month')
    @classmethod
    def validate_month(cls, v):
        if v < 1 or v > 12:
            raise ValueError('Month must be between 1 and 12')
        return v

    @field_validator('gross_salary', 'deductions')
    @classmethod
    def validate_amounts(cls, v):
        if v < 0:
            raise ValueError('Amount cannot be negative')
        return v

class SalaryRecordResponse(BaseModel):
    id: str
    employee_id: str
    employee_name: str
    employee_email: str
    month: int
    year: int
    gross_salary: float
    deductions: float
    net_salary: float
    currency: str
    payment_date: Optional[datetime]
    notes: str
    created_at: datetime

class MySalaryResponse(BaseModel):
    month: int
    year: int
    gross_salary: float
    deductions: float
    net_salary: float
    currency: str
    payment_date: Optional[datetime]

# Notice Models
class Notice(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    company_id: str
    title: str
    content: str
    published_by: str  # Admin ID
    publisher_name: str
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None

class NoticeCreate(BaseModel):
    title: str
    content: str

    @field_validator('title')
    @classmethod
    def validate_title(cls, v):
        if len(v.strip()) < 3:
            raise ValueError('Title must be at least 3 characters long')
        return v.strip()

    @field_validator('content')
    @classmethod
    def validate_content(cls, v):
        if len(v.strip()) < 10:
            raise ValueError('Content must be at least 10 characters long')
        return v.strip()

class NoticeResponse(BaseModel):
    id: str
    title: str
    content: str
    publisher_name: str
    is_active: bool
    created_at: datetime

# Department Models
class Department(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    company_id: str
    name: str
    description: str = ""
    created_by: str  # Admin ID
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None

class DepartmentCreate(BaseModel):
    name: str
    description: str = ""

    @field_validator('name')
    @classmethod
    def validate_name(cls, v):
        if len(v.strip()) < 2:
            raise ValueError('Department name must be at least 2 characters long')
        return v.strip()

class DepartmentResponse(BaseModel):
    id: str
    name: str
    description: str
    employee_count: int
    created_at: datetime
