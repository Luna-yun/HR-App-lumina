from fastapi import APIRouter, HTTPException, status, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List
import logging
from datetime import datetime

from models import (
    Notice, NoticeCreate, NoticeResponse
)
from auth_utils import get_current_user, get_current_admin

logger = logging.getLogger(__name__)

router = APIRouter()

# Dependency to get database
async def get_db() -> AsyncIOMotorDatabase:
    from server import db
    return db


@router.get("/notices", response_model=List[NoticeResponse])
async def get_notices(
    limit: int = 50,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get notices for current user's company"""
    try:
        company_id = current_user["company_id"]
        
        notices = await db.notices.find({
            "company_id": company_id,
            "is_active": True
        }).sort("created_at", -1).limit(limit).to_list(limit)
        
        return [
            NoticeResponse(
                id=notice["id"],
                title=notice["title"],
                content=notice["content"],
                publisher_name=notice["publisher_name"],
                is_active=notice["is_active"],
                created_at=notice["created_at"]
            )
            for notice in notices
        ]
    
    except Exception as e:
        logger.error(f"Get notices error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred"
        )


@router.post("/admin/notices", response_model=NoticeResponse)
async def create_notice(
    request: NoticeCreate,
    current_user: dict = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Create notice (Admin only)"""
    try:
        company_id = current_user["company_id"]
        admin_id = current_user["sub"]
        
        # Get admin info
        admin = await db.users.find_one({"id": admin_id})
        if not admin:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Admin not found"
            )
        
        # Create notice
        notice = Notice(
            company_id=company_id,
            title=request.title,
            content=request.content,
            published_by=admin_id,
            publisher_name=admin.get("full_name", "") or admin["email"],
            is_active=True
        )
        
        await db.notices.insert_one(notice.dict())
        
        return NoticeResponse(
            id=notice.id,
            title=notice.title,
            content=notice.content,
            publisher_name=notice.publisher_name,
            is_active=notice.is_active,
            created_at=notice.created_at
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Create notice error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while creating notice"
        )


@router.put("/admin/notices/{notice_id}")
async def update_notice(
    notice_id: str,
    request: NoticeCreate,
    current_user: dict = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update notice (Admin only)"""
    try:
        company_id = current_user["company_id"]
        
        # Find notice
        notice = await db.notices.find_one({"id": notice_id})
        if not notice:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Notice not found"
            )
        
        # Verify belongs to admin's company
        if notice["company_id"] != company_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only update notices from your company"
            )
        
        # Update
        await db.notices.update_one(
            {"id": notice_id},
            {"$set": {
                "title": request.title,
                "content": request.content,
                "updated_at": datetime.utcnow()
            }}
        )
        
        # Get updated notice
        updated_notice = await db.notices.find_one({"id": notice_id})
        
        return NoticeResponse(
            id=updated_notice["id"],
            title=updated_notice["title"],
            content=updated_notice["content"],
            publisher_name=updated_notice["publisher_name"],
            is_active=updated_notice["is_active"],
            created_at=updated_notice["created_at"]
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Update notice error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred"
        )


@router.delete("/admin/notices/{notice_id}")
async def delete_notice(
    notice_id: str,
    current_user: dict = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Delete (deactivate) notice (Admin only)"""
    try:
        company_id = current_user["company_id"]
        
        # Find notice
        notice = await db.notices.find_one({"id": notice_id})
        if not notice:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Notice not found"
            )
        
        # Verify belongs to admin's company
        if notice["company_id"] != company_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only delete notices from your company"
            )
        
        # Soft delete (deactivate)
        await db.notices.update_one(
            {"id": notice_id},
            {"$set": {
                "is_active": False,
                "updated_at": datetime.utcnow()
            }}
        )
        
        return {"message": "Notice deleted successfully"}
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Delete notice error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred"
        )


@router.get("/admin/notices/all", response_model=List[NoticeResponse])
async def get_all_notices(
    include_inactive: bool = False,
    current_user: dict = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get all notices including inactive ones (Admin only)"""
    try:
        company_id = current_user["company_id"]
        
        query = {"company_id": company_id}
        if not include_inactive:
            query["is_active"] = True
        
        notices = await db.notices.find(query).sort("created_at", -1).to_list(200)
        
        return [
            NoticeResponse(
                id=notice["id"],
                title=notice["title"],
                content=notice["content"],
                publisher_name=notice["publisher_name"],
                is_active=notice["is_active"],
                created_at=notice["created_at"]
            )
            for notice in notices
        ]
    
    except Exception as e:
        logger.error(f"Get all notices error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred"
        )
