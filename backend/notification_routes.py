"""
Notification Routes for Lumina HR System
Real-time notification management for admin and employee dashboards
"""

from fastapi import APIRouter, HTTPException, Depends, status, Query
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, timezone
from bson import ObjectId
import logging

# Import auth utilities
from auth_utils import get_current_user

logger = logging.getLogger(__name__)
router = APIRouter()

# Models
class NotificationCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    message: str = Field(..., min_length=1, max_length=1000)
    type: str = Field(default="info")  # info, success, warning, error, leave, attendance, payroll
    target_user_id: Optional[str] = None  # If None, send to all in company
    link: Optional[str] = None  # Optional link to related resource

class NotificationResponse(BaseModel):
    id: str
    title: str
    message: str
    type: str
    is_read: bool
    created_at: str
    link: Optional[str] = None

class NotificationListResponse(BaseModel):
    notifications: List[NotificationResponse]
    unread_count: int
    total: int


def get_db():
    """Get database instance"""
    from server import db
    return db


@router.get("/notifications", response_model=NotificationListResponse)
async def get_notifications(
    limit: int = Query(default=20, le=100),
    offset: int = Query(default=0, ge=0),
    unread_only: bool = Query(default=False),
    current_user: dict = Depends(get_current_user)
):
    """Get notifications for the current user"""
    try:
        db = get_db()
        user_id = current_user.get("sub")
        company_name = current_user.get("company_name")
        
        # Build query - notifications for this user or company-wide
        query = {
            "$or": [
                {"target_user_id": user_id},
                {"target_user_id": None, "company_id": company_name}
            ]
        }
        
        if unread_only:
            query["is_read"] = False
        
        # Get notifications
        cursor = db.notifications.find(query).sort("created_at", -1).skip(offset).limit(limit)
        notifications = await cursor.to_list(length=limit)
        
        # Get total count and unread count
        total = await db.notifications.count_documents(query)
        unread_query = {**query, "is_read": False}
        unread_count = await db.notifications.count_documents(unread_query)
        
        # Format response
        formatted_notifications = []
        for notif in notifications:
            formatted_notifications.append(NotificationResponse(
                id=str(notif["_id"]),
                title=notif["title"],
                message=notif["message"],
                type=notif.get("type", "info"),
                is_read=notif.get("is_read", False),
                created_at=notif["created_at"].isoformat() if isinstance(notif["created_at"], datetime) else notif["created_at"],
                link=notif.get("link")
            ))
        
        return NotificationListResponse(
            notifications=formatted_notifications,
            unread_count=unread_count,
            total=total
        )
    except Exception as e:
        logger.error(f"Get notifications error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch notifications"
        )


@router.post("/notifications", response_model=NotificationResponse)
async def create_notification(
    notification: NotificationCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create a new notification (Admin only)"""
    try:
        if current_user.get("role") != "Admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only admins can create notifications"
            )
        
        db = get_db()
        user_id = current_user.get("sub")
        company_name = current_user.get("company_name")
        
        notif_doc = {
            "title": notification.title,
            "message": notification.message,
            "type": notification.type,
            "target_user_id": notification.target_user_id,
            "company_id": company_name,
            "created_by": user_id,
            "is_read": False,
            "created_at": datetime.now(timezone.utc),
            "link": notification.link
        }
        
        result = await db.notifications.insert_one(notif_doc)
        
        return NotificationResponse(
            id=str(result.inserted_id),
            title=notification.title,
            message=notification.message,
            type=notification.type,
            is_read=False,
            created_at=notif_doc["created_at"].isoformat(),
            link=notification.link
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Create notification error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create notification"
        )


@router.put("/notifications/{notification_id}/read")
async def mark_notification_read(
    notification_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Mark a notification as read"""
    try:
        db = get_db()
        
        result = await db.notifications.update_one(
            {"_id": ObjectId(notification_id)},
            {"$set": {"is_read": True, "read_at": datetime.now(timezone.utc)}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Notification not found"
            )
        
        return {"message": "Notification marked as read"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Mark notification read error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update notification"
        )


@router.put("/notifications/read-all")
async def mark_all_notifications_read(
    current_user: dict = Depends(get_current_user)
):
    """Mark all notifications as read for the current user"""
    try:
        db = get_db()
        user_id = current_user.get("sub")
        company_name = current_user.get("company_name")
        
        query = {
            "$or": [
                {"target_user_id": user_id},
                {"target_user_id": None, "company_id": company_name}
            ],
            "is_read": False
        }
        
        result = await db.notifications.update_many(
            query,
            {"$set": {"is_read": True, "read_at": datetime.now(timezone.utc)}}
        )
        
        return {"message": f"Marked {result.modified_count} notifications as read"}
    except Exception as e:
        logger.error(f"Mark all notifications read error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update notifications"
        )


@router.delete("/notifications/{notification_id}")
async def delete_notification(
    notification_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete a notification"""
    try:
        db = get_db()
        
        result = await db.notifications.delete_one({"_id": ObjectId(notification_id)})
        
        if result.deleted_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Notification not found"
            )
        
        return {"message": "Notification deleted"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Delete notification error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete notification"
        )


# Helper function to create system notifications
async def create_system_notification(
    db,
    title: str,
    message: str,
    notification_type: str,
    company_id: str,
    target_user_id: Optional[str] = None,
    link: Optional[str] = None
):
    """Create a system notification (called from other parts of the app)"""
    try:
        notif_doc = {
            "title": title,
            "message": message,
            "type": notification_type,
            "target_user_id": target_user_id,
            "company_id": company_id,
            "created_by": "system",
            "is_read": False,
            "created_at": datetime.now(timezone.utc),
            "link": link
        }
        
        await db.notifications.insert_one(notif_doc)
        return True
    except Exception as e:
        logger.error(f"System notification error: {str(e)}")
        return False
