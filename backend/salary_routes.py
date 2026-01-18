from fastapi import APIRouter, HTTPException, status, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Optional
import logging
from datetime import datetime

from models import (
    SalaryRecord, SalaryRecordCreate, SalaryRecordResponse, MySalaryResponse
)
from auth_utils import get_current_user, get_current_admin

logger = logging.getLogger(__name__)

router = APIRouter()

# Dependency to get database
async def get_db() -> AsyncIOMotorDatabase:
    from server import db
    return db


@router.get("/salary/mine")
async def get_my_salary(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get latest salary record for current employee (Read-only)"""
    try:
        employee_id = current_user["sub"]
        
        # Get latest salary record
        salary = await db.salary_records.find_one(
            {"employee_id": employee_id},
            sort=[("year", -1), ("month", -1)]
        )
        
        if not salary:
            return {
                "message": "No salary record published yet",
                "has_salary": False,
                "salary": None
            }
        
        return {
            "message": "Salary record found",
            "has_salary": True,
            "salary": MySalaryResponse(
                month=salary["month"],
                year=salary["year"],
                gross_salary=salary["gross_salary"],
                deductions=salary["deductions"],
                net_salary=salary["net_salary"],
                currency=salary["currency"],
                payment_date=salary.get("payment_date")
            )
        }
    
    except Exception as e:
        logger.error(f"Get my salary error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred"
        )


@router.get("/salary/my-history")
async def get_my_salary_history(
    limit: int = 12,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get salary history for current employee"""
    try:
        employee_id = current_user["sub"]
        
        records = await db.salary_records.find({
            "employee_id": employee_id
        }).sort([("year", -1), ("month", -1)]).limit(limit).to_list(limit)
        
        return {
            "records": [
                MySalaryResponse(
                    month=rec["month"],
                    year=rec["year"],
                    gross_salary=rec["gross_salary"],
                    deductions=rec["deductions"],
                    net_salary=rec["net_salary"],
                    currency=rec["currency"],
                    payment_date=rec.get("payment_date")
                )
                for rec in records
            ],
            "total": len(records)
        }
    
    except Exception as e:
        logger.error(f"Get salary history error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred"
        )


@router.post("/admin/salary", response_model=SalaryRecordResponse)
async def create_salary_record(
    request: SalaryRecordCreate,
    current_user: dict = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Create or update salary record for employee (Admin only)"""
    try:
        company_id = current_user["company_id"]
        admin_id = current_user["sub"]
        
        # Verify employee exists and belongs to same company
        employee = await db.users.find_one({"id": request.employee_id})
        if not employee:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Employee not found"
            )
        
        if employee["company_id"] != company_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only manage salaries for employees in your company"
            )
        
        # Check if salary record already exists for this month/year
        existing = await db.salary_records.find_one({
            "employee_id": request.employee_id,
            "month": request.month,
            "year": request.year
        })
        
        # Calculate net salary
        net_salary = request.gross_salary - request.deductions
        
        if existing:
            # Update existing record
            await db.salary_records.update_one(
                {"id": existing["id"]},
                {"$set": {
                    "gross_salary": request.gross_salary,
                    "deductions": request.deductions,
                    "net_salary": net_salary,
                    "currency": request.currency,
                    "notes": request.notes,
                    "updated_at": datetime.utcnow()
                }}
            )
            record_id = existing["id"]
        else:
            # Create new record
            salary_record = SalaryRecord(
                employee_id=request.employee_id,
                employee_name=employee.get("full_name", ""),
                employee_email=employee["email"],
                company_id=company_id,
                month=request.month,
                year=request.year,
                gross_salary=request.gross_salary,
                deductions=request.deductions,
                net_salary=net_salary,
                currency=request.currency,
                notes=request.notes,
                created_by=admin_id
            )
            await db.salary_records.insert_one(salary_record.dict())
            record_id = salary_record.id
        
        # Get the created/updated record
        record = await db.salary_records.find_one({"id": record_id})
        
        return SalaryRecordResponse(
            id=record["id"],
            employee_id=record["employee_id"],
            employee_name=record["employee_name"],
            employee_email=record["employee_email"],
            month=record["month"],
            year=record["year"],
            gross_salary=record["gross_salary"],
            deductions=record["deductions"],
            net_salary=record["net_salary"],
            currency=record["currency"],
            payment_date=record.get("payment_date"),
            notes=record["notes"],
            created_at=record["created_at"]
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Create salary record error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while creating salary record"
        )


@router.get("/admin/salaries", response_model=List[SalaryRecordResponse])
async def get_company_salaries(
    employee_id: Optional[str] = None,
    month: Optional[int] = None,
    year: Optional[int] = None,
    current_user: dict = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get salary records for company with optional filters (Admin only)"""
    try:
        company_id = current_user["company_id"]
        
        # Build query
        query = {"company_id": company_id}
        if employee_id:
            query["employee_id"] = employee_id
        if month:
            query["month"] = month
        if year:
            query["year"] = year
        
        records = await db.salary_records.find(query).sort([("year", -1), ("month", -1)]).to_list(500)
        
        return [
            SalaryRecordResponse(
                id=rec["id"],
                employee_id=rec["employee_id"],
                employee_name=rec["employee_name"],
                employee_email=rec["employee_email"],
                month=rec["month"],
                year=rec["year"],
                gross_salary=rec["gross_salary"],
                deductions=rec["deductions"],
                net_salary=rec["net_salary"],
                currency=rec["currency"],
                payment_date=rec.get("payment_date"),
                notes=rec["notes"],
                created_at=rec["created_at"]
            )
            for rec in records
        ]
    
    except Exception as e:
        logger.error(f"Get company salaries error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred"
        )


@router.delete("/admin/salary/{salary_id}")
async def delete_salary_record(
    salary_id: str,
    current_user: dict = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Delete salary record (Admin only)"""
    try:
        company_id = current_user["company_id"]
        
        # Find salary record
        salary = await db.salary_records.find_one({"id": salary_id})
        if not salary:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Salary record not found"
            )
        
        # Verify belongs to admin's company
        if salary["company_id"] != company_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only delete salary records from your company"
            )
        
        # Delete
        await db.salary_records.delete_one({"id": salary_id})
        
        return {"message": "Salary record deleted successfully"}
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Delete salary record error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred"
        )
