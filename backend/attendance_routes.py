from fastapi import APIRouter, HTTPException, status, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Optional
import logging
from datetime import datetime, date

from models import (
    Attendance, AttendanceStatus, AttendanceResponse, TodayAttendanceResponse
)
from auth_utils import get_current_user, get_current_admin

logger = logging.getLogger(__name__)

router = APIRouter()

# Dependency to get database
async def get_db() -> AsyncIOMotorDatabase:
    from server import db
    return db


@router.post("/attendance/check-in")
async def check_in(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Employee check-in for today"""
    try:
        employee_id = current_user["sub"]
        company_id = current_user["company_id"]
        today = date.today().isoformat()
        
        # Check if already checked in today
        existing = await db.attendance.find_one({
            "employee_id": employee_id,
            "date": today
        })
        
        if existing and existing["status"] in [AttendanceStatus.CHECKED_IN, AttendanceStatus.COMPLETED]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You have already checked in today"
            )
        
        # Create or update attendance record
        now = datetime.utcnow()
        if existing:
            # Update existing record
            await db.attendance.update_one(
                {"id": existing["id"]},
                {"$set": {
                    "check_in_time": now,
                    "status": AttendanceStatus.CHECKED_IN,
                    "updated_at": now
                }}
            )
            record_id = existing["id"]
        else:
            # Create new record
            new_attendance = Attendance(
                employee_id=employee_id,
                company_id=company_id,
                date=today,
                check_in_time=now,
                status=AttendanceStatus.CHECKED_IN
            )
            await db.attendance.insert_one(new_attendance.dict())
            record_id = new_attendance.id
        
        return {
            "message": "Checked in successfully",
            "check_in_time": now,
            "status": AttendanceStatus.CHECKED_IN
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Check-in error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during check-in"
        )


@router.post("/attendance/check-out")
async def check_out(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Employee check-out for today"""
    try:
        employee_id = current_user["sub"]
        today = date.today().isoformat()
        
        # Find today's attendance record
        attendance = await db.attendance.find_one({
            "employee_id": employee_id,
            "date": today
        })
        
        if not attendance:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You must check in before checking out"
            )
        
        if attendance["status"] == AttendanceStatus.COMPLETED:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You have already checked out today"
            )
        
        if attendance["status"] == AttendanceStatus.NOT_CHECKED_IN:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You must check in before checking out"
            )
        
        # Update with check-out time
        now = datetime.utcnow()
        await db.attendance.update_one(
            {"id": attendance["id"]},
            {"$set": {
                "check_out_time": now,
                "status": AttendanceStatus.COMPLETED,
                "updated_at": now
            }}
        )
        
        return {
            "message": "Checked out successfully",
            "check_out_time": now,
            "status": AttendanceStatus.COMPLETED
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Check-out error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during check-out"
        )


@router.get("/attendance/my-status", response_model=TodayAttendanceResponse)
async def get_my_status(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get today's attendance status for current employee"""
    try:
        employee_id = current_user["sub"]
        today = date.today().isoformat()
        
        attendance = await db.attendance.find_one({
            "employee_id": employee_id,
            "date": today
        })
        
        if not attendance:
            return TodayAttendanceResponse(
                status=AttendanceStatus.NOT_CHECKED_IN,
                check_in_time=None,
                check_out_time=None,
                can_check_in=True,
                can_check_out=False
            )
        
        return TodayAttendanceResponse(
            status=attendance["status"],
            check_in_time=attendance.get("check_in_time"),
            check_out_time=attendance.get("check_out_time"),
            can_check_in=False,
            can_check_out=attendance["status"] == AttendanceStatus.CHECKED_IN
        )
    
    except Exception as e:
        logger.error(f"Get status error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred"
        )


@router.get("/attendance/my-history", response_model=List[AttendanceResponse])
async def get_my_history(
    limit: int = 30,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get attendance history for current employee"""
    try:
        employee_id = current_user["sub"]
        
        records = await db.attendance.find({
            "employee_id": employee_id
        }).sort("date", -1).limit(limit).to_list(limit)
        
        return [
            AttendanceResponse(
                id=rec["id"],
                employee_id=rec["employee_id"],
                date=rec["date"],
                check_in_time=rec.get("check_in_time"),
                check_out_time=rec.get("check_out_time"),
                status=rec["status"],
                notes=rec.get("notes", "")
            )
            for rec in records
        ]
    
    except Exception as e:
        logger.error(f"Get history error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred"
        )


@router.get("/admin/attendance")
async def get_company_attendance(
    date_filter: Optional[str] = None,  # YYYY-MM-DD
    employee_id: Optional[str] = None,
    limit: int = 100,
    current_user: dict = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get attendance records for company (Admin only)"""
    try:
        company_id = current_user["company_id"]
        
        # Build query
        query = {"company_id": company_id}
        if date_filter:
            query["date"] = date_filter
        if employee_id:
            query["employee_id"] = employee_id
        
        # Get attendance records
        records = await db.attendance.find(query).sort("date", -1).limit(limit).to_list(limit)
        
        # Enrich with employee info
        result = []
        for rec in records:
            employee = await db.users.find_one({"id": rec["employee_id"]})
            result.append({
                "id": rec["id"],
                "employee_id": rec["employee_id"],
                "employee_name": employee.get("full_name", "") if employee else "Unknown",
                "employee_email": employee["email"] if employee else "Unknown",
                "date": rec["date"],
                "check_in_time": rec.get("check_in_time"),
                "check_out_time": rec.get("check_out_time"),
                "status": rec["status"],
                "notes": rec.get("notes", "")
            })
        
        return {"records": result, "total": len(result)}
    
    except Exception as e:
        logger.error(f"Get company attendance error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred"
        )


@router.get("/admin/attendance/stats")
async def get_attendance_stats(
    current_user: dict = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get attendance statistics for today (Admin only)"""
    try:
        company_id = current_user["company_id"]
        today = date.today().isoformat()
        
        # Total employees
        total_employees = await db.users.count_documents({
            "company_id": company_id,
            "role": "Employee",
            "is_approved": True,
            "is_active": True
        })
        
        # Checked in today
        checked_in = await db.attendance.count_documents({
            "company_id": company_id,
            "date": today,
            "status": {"$in": [AttendanceStatus.CHECKED_IN, AttendanceStatus.COMPLETED]}
        })
        
        # Completed (checked out)
        completed = await db.attendance.count_documents({
            "company_id": company_id,
            "date": today,
            "status": AttendanceStatus.COMPLETED
        })
        
        # Not checked in
        not_checked_in = total_employees - checked_in
        
        attendance_rate = (checked_in / total_employees * 100) if total_employees > 0 else 0
        
        return {
            "total_employees": total_employees,
            "checked_in": checked_in,
            "completed": completed,
            "not_checked_in": not_checked_in,
            "attendance_rate": round(attendance_rate, 1)
        }
    
    except Exception as e:
        logger.error(f"Get attendance stats error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred"
        )
