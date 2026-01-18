from fastapi import APIRouter, HTTPException, status, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List
import logging
from datetime import datetime

from models import (
    LeaveRequest, LeaveStatus, LeaveRequestCreate, LeaveRequestResponse,
    LeaveReviewRequest, LeaveSummaryResponse
)
from auth_utils import get_current_user, get_current_admin

logger = logging.getLogger(__name__)

router = APIRouter()

# Dependency to get database
async def get_db() -> AsyncIOMotorDatabase:
    from server import db
    return db


@router.post("/leave/request")
async def create_leave_request(
    request: LeaveRequestCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Employee creates leave request"""
    try:
        employee_id = current_user["sub"]
        company_id = current_user["company_id"]
        
        # Get employee details
        employee = await db.users.find_one({"id": employee_id})
        if not employee:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Employee not found"
            )
        
        # Create leave request
        leave_request = LeaveRequest(
            employee_id=employee_id,
            employee_name=employee.get("full_name", ""),
            employee_email=employee["email"],
            company_id=company_id,
            start_date=request.start_date,
            end_date=request.end_date,
            reason=request.reason,
            status=LeaveStatus.PENDING
        )
        
        await db.leave_requests.insert_one(leave_request.dict())
        
        return {
            "message": "Leave request submitted successfully",
            "request_id": leave_request.id,
            "status": LeaveStatus.PENDING
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Create leave request error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while creating leave request"
        )


@router.get("/leave/my-requests", response_model=List[LeaveRequestResponse])
async def get_my_leave_requests(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get leave requests for current employee"""
    try:
        employee_id = current_user["sub"]
        
        requests = await db.leave_requests.find({
            "employee_id": employee_id
        }).sort("created_at", -1).to_list(100)
        
        return [
            LeaveRequestResponse(
                id=req["id"],
                employee_id=req["employee_id"],
                employee_name=req.get("employee_name", ""),
                employee_email=req["employee_email"],
                start_date=req["start_date"],
                end_date=req["end_date"],
                reason=req["reason"],
                status=req["status"],
                reviewed_by=req.get("reviewed_by"),
                reviewed_at=req.get("reviewed_at"),
                rejection_reason=req.get("rejection_reason"),
                created_at=req["created_at"]
            )
            for req in requests
        ]
    
    except Exception as e:
        logger.error(f"Get my leave requests error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred"
        )


@router.get("/leave/my-summary", response_model=LeaveSummaryResponse)
async def get_my_leave_summary(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get leave summary counts for current employee"""
    try:
        employee_id = current_user["sub"]
        
        # Count by status
        pending = await db.leave_requests.count_documents({
            "employee_id": employee_id,
            "status": LeaveStatus.PENDING
        })
        
        approved = await db.leave_requests.count_documents({
            "employee_id": employee_id,
            "status": LeaveStatus.APPROVED
        })
        
        rejected = await db.leave_requests.count_documents({
            "employee_id": employee_id,
            "status": LeaveStatus.REJECTED
        })
        
        total = pending + approved + rejected
        
        return LeaveSummaryResponse(
            pending=pending,
            approved=approved,
            rejected=rejected,
            total=total
        )
    
    except Exception as e:
        logger.error(f"Get leave summary error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred"
        )


@router.get("/admin/leave/pending", response_model=List[LeaveRequestResponse])
async def get_pending_leave_requests(
    current_user: dict = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get pending leave requests for company (Admin only)"""
    try:
        company_id = current_user["company_id"]
        
        requests = await db.leave_requests.find({
            "company_id": company_id,
            "status": LeaveStatus.PENDING
        }).sort("created_at", 1).to_list(100)
        
        return [
            LeaveRequestResponse(
                id=req["id"],
                employee_id=req["employee_id"],
                employee_name=req.get("employee_name", ""),
                employee_email=req["employee_email"],
                start_date=req["start_date"],
                end_date=req["end_date"],
                reason=req["reason"],
                status=req["status"],
                reviewed_by=req.get("reviewed_by"),
                reviewed_at=req.get("reviewed_at"),
                rejection_reason=req.get("rejection_reason"),
                created_at=req["created_at"]
            )
            for req in requests
        ]
    
    except Exception as e:
        logger.error(f"Get pending leave requests error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred"
        )


@router.get("/admin/leave/all", response_model=List[LeaveRequestResponse])
async def get_all_leave_requests(
    status_filter: str = None,
    current_user: dict = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get all leave requests for company (Admin only)"""
    try:
        company_id = current_user["company_id"]
        
        query = {"company_id": company_id}
        if status_filter:
            query["status"] = status_filter
        
        requests = await db.leave_requests.find(query).sort("created_at", -1).to_list(200)
        
        return [
            LeaveRequestResponse(
                id=req["id"],
                employee_id=req["employee_id"],
                employee_name=req.get("employee_name", ""),
                employee_email=req["employee_email"],
                start_date=req["start_date"],
                end_date=req["end_date"],
                reason=req["reason"],
                status=req["status"],
                reviewed_by=req.get("reviewed_by"),
                reviewed_at=req.get("reviewed_at"),
                rejection_reason=req.get("rejection_reason"),
                created_at=req["created_at"]
            )
            for req in requests
        ]
    
    except Exception as e:
        logger.error(f"Get all leave requests error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred"
        )


@router.post("/admin/leave/approve/{request_id}")
async def approve_leave_request(
    request_id: str,
    current_user: dict = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Approve leave request (Admin only)"""
    try:
        company_id = current_user["company_id"]
        admin_id = current_user["sub"]
        
        # Find leave request
        leave_request = await db.leave_requests.find_one({"id": request_id})
        if not leave_request:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Leave request not found"
            )
        
        # Verify belongs to admin's company
        if leave_request["company_id"] != company_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only approve leave requests from your company"
            )
        
        # Check if already reviewed
        if leave_request["status"] != LeaveStatus.PENDING:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Leave request is already {leave_request['status']}"
            )
        
        # Approve
        await db.leave_requests.update_one(
            {"id": request_id},
            {"$set": {
                "status": LeaveStatus.APPROVED,
                "reviewed_by": admin_id,
                "reviewed_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }}
        )
        
        return {"message": "Leave request approved successfully"}
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Approve leave request error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred"
        )


@router.post("/admin/leave/reject/{request_id}")
async def reject_leave_request(
    request_id: str,
    review: LeaveReviewRequest,
    current_user: dict = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Reject leave request (Admin only)"""
    try:
        company_id = current_user["company_id"]
        admin_id = current_user["sub"]
        
        # Find leave request
        leave_request = await db.leave_requests.find_one({"id": request_id})
        if not leave_request:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Leave request not found"
            )
        
        # Verify belongs to admin's company
        if leave_request["company_id"] != company_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only reject leave requests from your company"
            )
        
        # Check if already reviewed
        if leave_request["status"] != LeaveStatus.PENDING:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Leave request is already {leave_request['status']}"
            )
        
        # Reject
        await db.leave_requests.update_one(
            {"id": request_id},
            {"$set": {
                "status": LeaveStatus.REJECTED,
                "reviewed_by": admin_id,
                "reviewed_at": datetime.utcnow(),
                "rejection_reason": review.rejection_reason or "No reason provided",
                "updated_at": datetime.utcnow()
            }}
        )
        
        return {"message": "Leave request rejected"}
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Reject leave request error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred"
        )
