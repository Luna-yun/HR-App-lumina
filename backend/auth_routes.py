from fastapi import APIRouter, HTTPException, status, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List
import logging
from datetime import datetime

from models import (
    SignUpRequest, LoginRequest, ChangePasswordRequest,
    TokenResponse, UserResponse, CompanyResponse, PendingEmployeeResponse,
    ProfileUpdateRequest, EmployeeListResponse,
    User, Company, UserRole
)
from auth_utils import (
    hash_password, verify_password, create_access_token,
    generate_verification_token, get_current_user, get_current_admin
)

logger = logging.getLogger(__name__)

router = APIRouter()

# Dependency to get database
async def get_db() -> AsyncIOMotorDatabase:
    from server import db
    return db

@router.post("/auth/signup", response_model=dict)
async def signup(request: SignUpRequest, db: AsyncIOMotorDatabase = Depends(get_db)):
    """
    Sign up a new user (Admin or Employee)
    - Admin: Creates new company or joins existing as additional admin
    - Employee: Can only join existing company, needs approval
    - No email verification required
    """
    try:
        # Check if user already exists
        existing_user = await db.users.find_one({"email": request.email})
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        company = None
        company_id = None
        
        if request.role == UserRole.ADMIN:
            # Admin: Check if company exists
            company = await db.companies.find_one({"name": request.company_name, "country": request.country})
            
            if company:
                # Company exists, add this admin to the company
                company_id = company["id"]
                await db.companies.update_one(
                    {"id": company_id},
                    {"$addToSet": {"admin_emails": request.email}}
                )
            else:
                # Create new company
                new_company = Company(
                    name=request.company_name,
                    country=request.country,
                    admin_emails=[request.email]
                )
                await db.companies.insert_one(new_company.dict())
                company_id = new_company.id
                company = new_company.dict()
        
        elif request.role == UserRole.EMPLOYEE:
            # Employee: Company must exist
            company = await db.companies.find_one({"name": request.company_name})
            if not company:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Company not found. Please contact your administrator."
                )
            company_id = company["id"]
        
        # Create user - No email verification required
        hashed_password = hash_password(request.password)
        
        new_user = User(
            email=request.email,
            password_hash=hashed_password,
            role=request.role,
            company_id=company_id,
            company_name=request.company_name,
            full_name=request.full_name,
            is_verified=True,  # Auto-verified
            is_approved=(request.role == UserRole.ADMIN),  # Admins are auto-approved
        )
        
        await db.users.insert_one(new_user.dict())
        
        return {
            "message": "Registration successful! You can now log in.",
            "email": request.email,
            "requires_approval": (request.role == UserRole.EMPLOYEE)
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Signup error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during registration"
        )

@router.post("/auth/login", response_model=TokenResponse)
async def login(request: LoginRequest, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Login user and return JWT token - Email + Password only"""
    try:
        # Find user by email only
        user = await db.users.find_one({"email": request.email})
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Verify password
        if not verify_password(request.password, user["password_hash"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Check if employee is approved (only for employees)
        if user["role"] == UserRole.EMPLOYEE and not user["is_approved"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Your account is pending approval from your administrator"
            )
        
        # Update last login
        await db.users.update_one(
            {"id": user["id"]},
            {"$set": {"last_login": datetime.utcnow()}}
        )
        
        # Create access token
        access_token = create_access_token(
            data={
                "sub": user["id"],
                "email": user["email"],
                "role": user["role"],
                "company_id": user["company_id"]
            }
        )
        
        user_response = UserResponse(
            id=user["id"],
            email=user["email"],
            role=user["role"],
            company_id=user["company_id"],
            company_name=user["company_name"],
            full_name=user.get("full_name", ""),
            department=user.get("department", "Unassigned"),
            job_title=user.get("job_title", ""),
            phone=user.get("phone", ""),
            is_verified=user["is_verified"],
            is_approved=user["is_approved"],
            is_active=user.get("is_active", True),
            last_login=datetime.utcnow(),
            created_at=user["created_at"]
        )
        
        return TokenResponse(
            access_token=access_token,
            user=user_response
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during login"
        )

@router.get("/auth/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user), db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get current user info"""
    try:
        user = await db.users.find_one({"id": current_user["sub"]})
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return UserResponse(
            id=user["id"],
            email=user["email"],
            role=user["role"],
            company_id=user["company_id"],
            company_name=user["company_name"],
            full_name=user.get("full_name", ""),
            department=user.get("department", "Unassigned"),
            job_title=user.get("job_title", ""),
            phone=user.get("phone", ""),
            is_verified=user["is_verified"],
            is_approved=user["is_approved"],
            is_active=user.get("is_active", True),
            last_login=user.get("last_login"),
            created_at=user["created_at"]
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get me error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred"
        )

@router.post("/auth/change-password")
async def change_password(
    request: ChangePasswordRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Change user password"""
    try:
        user = await db.users.find_one({"id": current_user["sub"]})
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Verify current password
        if not verify_password(request.current_password, user["password_hash"]):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Current password is incorrect"
            )
        
        # Hash and update new password
        new_password_hash = hash_password(request.new_password)
        await db.users.update_one(
            {"id": user["id"]},
            {"$set": {
                "password_hash": new_password_hash,
                "password_changed_at": datetime.utcnow()
            }}
        )
        
        return {
            "message": "Password updated successfully. Please sign in again with your new password.",
            "requires_reauth": True
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Change password error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred"
        )

@router.get("/companies", response_model=List[CompanyResponse])
async def get_companies(db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get all companies (for employee signup)"""
    try:
        companies = await db.companies.find().to_list(1000)
        return [
            CompanyResponse(
                id=company["id"],
                name=company["name"],
                country=company["country"]
            )
            for company in companies
        ]
    except Exception as e:
        logger.error(f"Get companies error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred"
        )

@router.get("/admin/pending-employees", response_model=List[PendingEmployeeResponse])
async def get_pending_employees(
    current_user: dict = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get pending employees for approval (Admin only)"""
    try:
        pending_employees = await db.users.find({
            "company_id": current_user["company_id"],
            "role": UserRole.EMPLOYEE,
            "is_approved": False
        }).to_list(1000)
        
        return [
            PendingEmployeeResponse(
                id=emp["id"],
                email=emp["email"],
                full_name=emp.get("full_name", ""),
                company_name=emp["company_name"],
                created_at=emp["created_at"]
            )
            for emp in pending_employees
        ]
    except Exception as e:
        logger.error(f"Get pending employees error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred"
        )

@router.post("/admin/approve-employee/{employee_id}")
async def approve_employee(
    employee_id: str,
    current_user: dict = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Approve an employee (Admin only)"""
    try:
        employee = await db.users.find_one({"id": employee_id})
        if not employee:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Employee not found"
            )
        
        # Verify employee belongs to admin's company
        if employee["company_id"] != current_user["company_id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only approve employees from your company"
            )
        
        # Approve employee
        await db.users.update_one(
            {"id": employee_id},
            {"$set": {"is_approved": True}}
        )
        
        return {"message": "Employee approved successfully"}
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Approve employee error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred"
        )

@router.post("/admin/reject-employee/{employee_id}")
async def reject_employee(
    employee_id: str,
    current_user: dict = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Reject and delete an employee (Admin only)"""
    try:
        employee = await db.users.find_one({"id": employee_id})
        if not employee:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Employee not found"
            )
        
        if employee["company_id"] != current_user["company_id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only reject employees from your company"
            )
        
        # Delete the employee record
        await db.users.delete_one({"id": employee_id})
        
        return {"message": "Employee rejected and removed"}
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Reject employee error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred"
        )

@router.put("/auth/profile")
async def update_profile(
    request: ProfileUpdateRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update user profile information"""
    try:
        user = await db.users.find_one({"id": current_user["sub"]})
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Build update dict from provided fields only
        update_fields = {}
        if request.full_name is not None:
            update_fields["full_name"] = request.full_name
        if request.department is not None:
            update_fields["department"] = request.department
        if request.job_title is not None:
            update_fields["job_title"] = request.job_title
        if request.phone is not None:
            update_fields["phone"] = request.phone
        
        if update_fields:
            update_fields["updated_at"] = datetime.utcnow()
            await db.users.update_one(
                {"id": user["id"]},
                {"$set": update_fields}
            )
        
        # Get updated user
        updated_user = await db.users.find_one({"id": user["id"]})
        
        return UserResponse(
            id=updated_user["id"],
            email=updated_user["email"],
            role=updated_user["role"],
            company_id=updated_user["company_id"],
            company_name=updated_user["company_name"],
            full_name=updated_user.get("full_name", ""),
            department=updated_user.get("department", "Unassigned"),
            job_title=updated_user.get("job_title", ""),
            phone=updated_user.get("phone", ""),
            is_verified=updated_user["is_verified"],
            is_approved=updated_user["is_approved"],
            is_active=updated_user.get("is_active", True),
            last_login=updated_user.get("last_login"),
            created_at=updated_user["created_at"]
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Update profile error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while updating profile"
        )

@router.get("/admin/employees", response_model=List[EmployeeListResponse])
async def get_company_employees(
    current_user: dict = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get all employees in admin's company"""
    try:
        employees = await db.users.find({
            "company_id": current_user["company_id"]
        }).to_list(1000)
        
        return [
            EmployeeListResponse(
                id=emp["id"],
                email=emp["email"],
                full_name=emp.get("full_name", ""),
                role=emp["role"],
                department=emp.get("department", "Unassigned"),
                job_title=emp.get("job_title", ""),
                is_active=emp.get("is_active", True),
                is_approved=emp["is_approved"],
                created_at=emp["created_at"]
            )
            for emp in employees
        ]
    except Exception as e:
        logger.error(f"Get employees error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred"
        )

@router.put("/admin/employees/{employee_id}")
async def update_employee(
    employee_id: str,
    request: ProfileUpdateRequest,
    current_user: dict = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update employee details (Admin only)"""
    try:
        employee = await db.users.find_one({"id": employee_id})
        if not employee:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Employee not found"
            )
        
        if employee["company_id"] != current_user["company_id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only update employees from your company"
            )
        
        update_fields = {}
        if request.full_name is not None:
            update_fields["full_name"] = request.full_name
        if request.department is not None:
            update_fields["department"] = request.department
        if request.job_title is not None:
            update_fields["job_title"] = request.job_title
        if request.phone is not None:
            update_fields["phone"] = request.phone
        
        if update_fields:
            update_fields["updated_at"] = datetime.utcnow()
            await db.users.update_one(
                {"id": employee_id},
                {"$set": update_fields}
            )
        
        updated_employee = await db.users.find_one({"id": employee_id})
        
        return EmployeeListResponse(
            id=updated_employee["id"],
            email=updated_employee["email"],
            full_name=updated_employee.get("full_name", ""),
            role=updated_employee["role"],
            department=updated_employee.get("department", "Unassigned"),
            job_title=updated_employee.get("job_title", ""),
            is_active=updated_employee.get("is_active", True),
            is_approved=updated_employee["is_approved"],
            created_at=updated_employee["created_at"]
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Update employee error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred"
        )

@router.delete("/admin/employees/{employee_id}")
async def delete_employee(
    employee_id: str,
    current_user: dict = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Delete an employee (Admin only)"""
    try:
        employee = await db.users.find_one({"id": employee_id})
        if not employee:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Employee not found"
            )
        
        if employee["company_id"] != current_user["company_id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only delete employees from your company"
            )
        
        if employee["id"] == current_user["sub"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You cannot delete your own account"
            )
        
        await db.users.delete_one({"id": employee_id})
        
        return {"message": "Employee deleted successfully"}
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Delete employee error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred"
        )

@router.get("/admin/stats")
async def get_company_stats(
    current_user: dict = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get comprehensive company statistics for admin dashboard"""
    try:
        company_id = current_user["company_id"]
        from datetime import date
        today = date.today().isoformat()
        
        # Employee counts
        total_employees = await db.users.count_documents({"company_id": company_id})
        active_employees = await db.users.count_documents({
            "company_id": company_id,
            "is_active": True,
            "is_approved": True
        })
        pending_approvals = await db.users.count_documents({
            "company_id": company_id,
            "role": UserRole.EMPLOYEE,
            "is_approved": False
        })
        
        # Role counts
        admin_count = await db.users.count_documents({
            "company_id": company_id,
            "role": UserRole.ADMIN
        })
        employee_count = await db.users.count_documents({
            "company_id": company_id,
            "role": UserRole.EMPLOYEE
        })
        
        # Department distribution
        pipeline = [
            {"$match": {"company_id": company_id}},
            {"$group": {"_id": "$department", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}}
        ]
        departments = await db.users.aggregate(pipeline).to_list(100)
        
        # Attendance stats for today
        checked_in_today = await db.attendance.count_documents({
            "company_id": company_id,
            "date": today,
            "status": {"$in": ["checked_in", "completed"]}
        })
        
        # Leave stats
        pending_leaves = await db.leave_requests.count_documents({
            "company_id": company_id,
            "status": "pending"
        })
        
        # Calculate attendance rate
        attendance_rate = (checked_in_today / active_employees * 100) if active_employees > 0 else 0
        
        # New hires this month
        from datetime import datetime
        first_of_month = datetime(datetime.now().year, datetime.now().month, 1)
        new_hires = await db.users.count_documents({
            "company_id": company_id,
            "created_at": {"$gte": first_of_month}
        })
        
        return {
            "total_employees": total_employees,
            "active_employees": active_employees,
            "pending_approvals": pending_approvals,
            "admin_count": admin_count,
            "employee_count": employee_count,
            "checked_in_today": checked_in_today,
            "pending_leaves": pending_leaves,
            "attendance_rate": round(attendance_rate, 1),
            "new_hires_this_month": new_hires,
            "departments": [
                {"name": dept["_id"] or "Unassigned", "count": dept["count"]}
                for dept in departments
            ]
        }
    except Exception as e:
        logger.error(f"Get stats error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred"
        )
