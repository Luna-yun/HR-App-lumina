from fastapi import APIRouter, HTTPException, status, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List
import logging
from datetime import datetime

from models import (
    Department, DepartmentCreate, DepartmentResponse
)
from auth_utils import get_current_user, get_current_admin

logger = logging.getLogger(__name__)

router = APIRouter()

# Dependency to get database
async def get_db() -> AsyncIOMotorDatabase:
    from server import db
    return db


@router.get("/departments", response_model=List[DepartmentResponse])
async def get_departments(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get departments for current user's company"""
    try:
        company_id = current_user["company_id"]
        
        # Get departments
        departments = await db.departments.find({
            "company_id": company_id
        }).sort("name", 1).to_list(100)
        
        # Count employees in each department
        result = []
        for dept in departments:
            employee_count = await db.users.count_documents({
                "company_id": company_id,
                "department": dept["name"]
            })
            
            result.append(DepartmentResponse(
                id=dept["id"],
                name=dept["name"],
                description=dept.get("description", ""),
                employee_count=employee_count,
                created_at=dept["created_at"]
            ))
        
        # Add "Unassigned" virtual department
        unassigned_count = await db.users.count_documents({
            "company_id": company_id,
            "$or": [
                {"department": "Unassigned"},
                {"department": {"$exists": False}},
                {"department": ""}
            ]
        })
        
        if unassigned_count > 0:
            result.append(DepartmentResponse(
                id="unassigned",
                name="Unassigned",
                description="Employees without a department",
                employee_count=unassigned_count,
                created_at=datetime.utcnow()
            ))
        
        return result
    
    except Exception as e:
        logger.error(f"Get departments error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred"
        )


@router.post("/admin/departments", response_model=DepartmentResponse)
async def create_department(
    request: DepartmentCreate,
    current_user: dict = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Create department (Admin only)"""
    try:
        company_id = current_user["company_id"]
        admin_id = current_user["sub"]
        
        # Check if department already exists
        existing = await db.departments.find_one({
            "company_id": company_id,
            "name": request.name
        })
        
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Department '{request.name}' already exists"
            )
        
        # Create department
        department = Department(
            company_id=company_id,
            name=request.name,
            description=request.description,
            created_by=admin_id
        )
        
        await db.departments.insert_one(department.dict())
        
        return DepartmentResponse(
            id=department.id,
            name=department.name,
            description=department.description,
            employee_count=0,
            created_at=department.created_at
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Create department error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while creating department"
        )


@router.put("/admin/departments/{department_id}")
async def update_department(
    department_id: str,
    request: DepartmentCreate,
    current_user: dict = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update department (Admin only)"""
    try:
        company_id = current_user["company_id"]
        
        # Find department
        department = await db.departments.find_one({"id": department_id})
        if not department:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Department not found"
            )
        
        # Verify belongs to admin's company
        if department["company_id"] != company_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only update departments from your company"
            )
        
        # Check if new name conflicts with existing
        if request.name != department["name"]:
            existing = await db.departments.find_one({
                "company_id": company_id,
                "name": request.name
            })
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Department '{request.name}' already exists"
                )
        
        old_name = department["name"]
        
        # Update department
        await db.departments.update_one(
            {"id": department_id},
            {"$set": {
                "name": request.name,
                "description": request.description,
                "updated_at": datetime.utcnow()
            }}
        )
        
        # Update all employees' department field if name changed
        if request.name != old_name:
            await db.users.update_many(
                {
                    "company_id": company_id,
                    "department": old_name
                },
                {"$set": {"department": request.name}}
            )
        
        # Get employee count
        employee_count = await db.users.count_documents({
            "company_id": company_id,
            "department": request.name
        })
        
        return DepartmentResponse(
            id=department_id,
            name=request.name,
            description=request.description,
            employee_count=employee_count,
            created_at=department["created_at"]
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Update department error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred"
        )


@router.delete("/admin/departments/{department_id}")
async def delete_department(
    department_id: str,
    reassign_to: str = "Unassigned",
    current_user: dict = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Delete department and reassign employees (Admin only)"""
    try:
        company_id = current_user["company_id"]
        
        # Find department
        department = await db.departments.find_one({"id": department_id})
        if not department:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Department not found"
            )
        
        # Verify belongs to admin's company
        if department["company_id"] != company_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only delete departments from your company"
            )
        
        # Reassign employees
        await db.users.update_many(
            {
                "company_id": company_id,
                "department": department["name"]
            },
            {"$set": {"department": reassign_to}}
        )
        
        # Delete department
        await db.departments.delete_one({"id": department_id})
        
        return {
            "message": f"Department deleted and employees reassigned to '{reassign_to}'"
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Delete department error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred"
        )


@router.get("/admin/departments/{department_id}/employees")
async def get_department_employees(
    department_id: str,
    current_user: dict = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get all employees in a department (Admin only)"""
    try:
        company_id = current_user["company_id"]
        
        # Handle special "unassigned" case
        if department_id == "unassigned":
            employees = await db.users.find({
                "company_id": company_id,
                "$or": [
                    {"department": "Unassigned"},
                    {"department": {"$exists": False}},
                    {"department": ""}
                ]
            }).to_list(1000)
        else:
            # Find department
            department = await db.departments.find_one({"id": department_id})
            if not department:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Department not found"
                )
            
            # Verify belongs to admin's company
            if department["company_id"] != company_id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="You can only view departments from your company"
                )
            
            # Get employees
            employees = await db.users.find({
                "company_id": company_id,
                "department": department["name"]
            }).to_list(1000)
        
        return {
            "employees": [
                {
                    "id": emp["id"],
                    "email": emp["email"],
                    "full_name": emp.get("full_name", ""),
                    "job_title": emp.get("job_title", ""),
                    "role": emp["role"],
                    "is_active": emp.get("is_active", True)
                }
                for emp in employees
            ],
            "total": len(employees)
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get department employees error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred"
        )
