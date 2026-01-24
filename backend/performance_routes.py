"""
Performance/Task Management Routes for Lumina HR System
Handles task assignment, performance reviews, and goals tracking
"""

from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
import uuid
import logging

from auth_utils import get_current_user, get_current_admin

logger = logging.getLogger(__name__)
router = APIRouter()


# Models
class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str = ""
    assigned_to: str  # Employee ID
    due_date: Optional[str] = None  # YYYY-MM-DD
    priority: str = "medium"  # low, medium, high, urgent
    category: str = "general"  # general, project, review, training


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None  # pending, in_progress, completed, cancelled
    priority: Optional[str] = None
    due_date: Optional[str] = None


class TaskResponse(BaseModel):
    id: str
    title: str
    description: str
    assigned_to: str
    assigned_to_name: str
    assigned_by: str
    assigned_by_name: str
    status: str
    priority: str
    category: str
    due_date: Optional[str]
    completed_at: Optional[str]
    created_at: str


class PerformanceReviewCreate(BaseModel):
    employee_id: str
    review_period: str  # e.g., "Q1 2026", "2025 Annual"
    goals_achieved: int = Field(ge=0, le=100)  # Percentage
    quality_score: int = Field(ge=1, le=5)
    productivity_score: int = Field(ge=1, le=5)
    teamwork_score: int = Field(ge=1, le=5)
    communication_score: int = Field(ge=1, le=5)
    feedback: str = ""
    strengths: str = ""
    areas_for_improvement: str = ""
    goals_for_next_period: str = ""


class PerformanceReviewResponse(BaseModel):
    id: str
    employee_id: str
    employee_name: str
    reviewer_id: str
    reviewer_name: str
    review_period: str
    goals_achieved: int
    quality_score: int
    productivity_score: int
    teamwork_score: int
    communication_score: int
    overall_score: float
    feedback: str
    strengths: str
    areas_for_improvement: str
    goals_for_next_period: str
    created_at: str


def get_db():
    from server import db
    return db


# Task Endpoints
@router.post("/admin/tasks")
async def create_task(
    task: TaskCreate,
    current_user: dict = Depends(get_current_admin)
):
    """Create a new task for an employee (Admin only)"""
    try:
        db = get_db()
        company_id = current_user.get("company_id")
        admin_id = current_user.get("sub")
        
        # Verify employee exists and belongs to same company
        employee = await db.users.find_one({"id": task.assigned_to})
        if not employee or employee.get("company_id") != company_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Employee not found"
            )
        
        # Get admin name
        admin = await db.users.find_one({"id": admin_id})
        admin_name = admin.get("full_name", admin.get("email", "Admin"))
        
        task_doc = {
            "id": str(uuid.uuid4()),
            "company_id": company_id,
            "title": task.title,
            "description": task.description,
            "assigned_to": task.assigned_to,
            "assigned_to_name": employee.get("full_name", employee.get("email")),
            "assigned_by": admin_id,
            "assigned_by_name": admin_name,
            "status": "pending",
            "priority": task.priority,
            "category": task.category,
            "due_date": task.due_date,
            "completed_at": None,
            "created_at": datetime.utcnow()
        }
        
        await db.tasks.insert_one(task_doc)
        
        # Create notification for employee
        from notification_routes import create_system_notification
        await create_system_notification(
            db,
            title="New Task Assigned",
            message=f"You have been assigned a new task: {task.title}",
            notification_type="info",
            company_id=company_id,
            target_user_id=task.assigned_to,
            link="/employee/tasks"
        )
        
        return {
            "id": task_doc["id"],
            "message": "Task created successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Create task error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create task"
        )


@router.get("/admin/tasks")
async def get_all_tasks(
    employee_id: Optional[str] = None,
    status_filter: Optional[str] = None,
    current_user: dict = Depends(get_current_admin)
):
    """Get all tasks in the company (Admin only)"""
    try:
        db = get_db()
        company_id = current_user.get("company_id")
        
        query = {"company_id": company_id}
        if employee_id:
            query["assigned_to"] = employee_id
        if status_filter:
            query["status"] = status_filter
        
        tasks = await db.tasks.find(query).sort("created_at", -1).to_list(500)
        
        return {
            "tasks": [
                TaskResponse(
                    id=t["id"],
                    title=t["title"],
                    description=t.get("description", ""),
                    assigned_to=t["assigned_to"],
                    assigned_to_name=t.get("assigned_to_name", ""),
                    assigned_by=t["assigned_by"],
                    assigned_by_name=t.get("assigned_by_name", ""),
                    status=t["status"],
                    priority=t.get("priority", "medium"),
                    category=t.get("category", "general"),
                    due_date=t.get("due_date"),
                    completed_at=t.get("completed_at"),
                    created_at=t["created_at"].isoformat() if isinstance(t["created_at"], datetime) else t["created_at"]
                )
                for t in tasks
            ],
            "total": len(tasks)
        }
    except Exception as e:
        logger.error(f"Get tasks error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch tasks"
        )


@router.get("/tasks/my")
async def get_my_tasks(
    status_filter: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get tasks assigned to current user"""
    try:
        db = get_db()
        user_id = current_user.get("sub")
        
        query = {"assigned_to": user_id}
        if status_filter:
            query["status"] = status_filter
        
        tasks = await db.tasks.find(query).sort("created_at", -1).to_list(500)
        
        return {
            "tasks": [
                TaskResponse(
                    id=t["id"],
                    title=t["title"],
                    description=t.get("description", ""),
                    assigned_to=t["assigned_to"],
                    assigned_to_name=t.get("assigned_to_name", ""),
                    assigned_by=t["assigned_by"],
                    assigned_by_name=t.get("assigned_by_name", ""),
                    status=t["status"],
                    priority=t.get("priority", "medium"),
                    category=t.get("category", "general"),
                    due_date=t.get("due_date"),
                    completed_at=t.get("completed_at"),
                    created_at=t["created_at"].isoformat() if isinstance(t["created_at"], datetime) else t["created_at"]
                )
                for t in tasks
            ],
            "total": len(tasks)
        }
    except Exception as e:
        logger.error(f"Get my tasks error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch tasks"
        )


@router.put("/tasks/{task_id}")
async def update_task(
    task_id: str,
    update: TaskUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update task status (Employee can update their own tasks)"""
    try:
        db = get_db()
        user_id = current_user.get("sub")
        role = current_user.get("role")
        
        task = await db.tasks.find_one({"id": task_id})
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )
        
        # Check permission - admins can update any task, employees only their own
        if role != "Admin" and task["assigned_to"] != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only update your own tasks"
            )
        
        update_fields = {"updated_at": datetime.utcnow()}
        
        if update.title and role == "Admin":
            update_fields["title"] = update.title
        if update.description is not None and role == "Admin":
            update_fields["description"] = update.description
        if update.priority and role == "Admin":
            update_fields["priority"] = update.priority
        if update.due_date and role == "Admin":
            update_fields["due_date"] = update.due_date
        if update.status:
            update_fields["status"] = update.status
            if update.status == "completed":
                update_fields["completed_at"] = datetime.utcnow().isoformat()
        
        await db.tasks.update_one(
            {"id": task_id},
            {"$set": update_fields}
        )
        
        return {"message": "Task updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Update task error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update task"
        )


@router.delete("/admin/tasks/{task_id}")
async def delete_task(
    task_id: str,
    current_user: dict = Depends(get_current_admin)
):
    """Delete a task (Admin only)"""
    try:
        db = get_db()
        company_id = current_user.get("company_id")
        
        result = await db.tasks.delete_one({"id": task_id, "company_id": company_id})
        
        if result.deleted_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )
        
        return {"message": "Task deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Delete task error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete task"
        )


# Performance Review Endpoints
@router.post("/admin/performance-reviews")
async def create_performance_review(
    review: PerformanceReviewCreate,
    current_user: dict = Depends(get_current_admin)
):
    """Create a performance review for an employee (Admin only)"""
    try:
        db = get_db()
        company_id = current_user.get("company_id")
        admin_id = current_user.get("sub")
        
        # Verify employee exists
        employee = await db.users.find_one({"id": review.employee_id})
        if not employee or employee.get("company_id") != company_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Employee not found"
            )
        
        # Get admin name
        admin = await db.users.find_one({"id": admin_id})
        admin_name = admin.get("full_name", admin.get("email", "Admin"))
        
        # Calculate overall score
        overall_score = (
            review.quality_score + 
            review.productivity_score + 
            review.teamwork_score + 
            review.communication_score
        ) / 4
        
        review_doc = {
            "id": str(uuid.uuid4()),
            "company_id": company_id,
            "employee_id": review.employee_id,
            "employee_name": employee.get("full_name", employee.get("email")),
            "reviewer_id": admin_id,
            "reviewer_name": admin_name,
            "review_period": review.review_period,
            "goals_achieved": review.goals_achieved,
            "quality_score": review.quality_score,
            "productivity_score": review.productivity_score,
            "teamwork_score": review.teamwork_score,
            "communication_score": review.communication_score,
            "overall_score": round(overall_score, 2),
            "feedback": review.feedback,
            "strengths": review.strengths,
            "areas_for_improvement": review.areas_for_improvement,
            "goals_for_next_period": review.goals_for_next_period,
            "created_at": datetime.utcnow()
        }
        
        await db.performance_reviews.insert_one(review_doc)
        
        # Create notification for employee
        from notification_routes import create_system_notification
        await create_system_notification(
            db,
            title="New Performance Review",
            message=f"Your performance review for {review.review_period} is now available.",
            notification_type="info",
            company_id=company_id,
            target_user_id=review.employee_id,
            link="/employee/performance"
        )
        
        return {
            "id": review_doc["id"],
            "message": "Performance review created successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Create review error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create review"
        )


@router.get("/admin/performance-reviews")
async def get_all_performance_reviews(
    employee_id: Optional[str] = None,
    current_user: dict = Depends(get_current_admin)
):
    """Get all performance reviews (Admin only)"""
    try:
        db = get_db()
        company_id = current_user.get("company_id")
        
        query = {"company_id": company_id}
        if employee_id:
            query["employee_id"] = employee_id
        
        reviews = await db.performance_reviews.find(query).sort("created_at", -1).to_list(500)
        
        return {
            "reviews": [
                PerformanceReviewResponse(
                    id=r["id"],
                    employee_id=r["employee_id"],
                    employee_name=r.get("employee_name", ""),
                    reviewer_id=r["reviewer_id"],
                    reviewer_name=r.get("reviewer_name", ""),
                    review_period=r["review_period"],
                    goals_achieved=r["goals_achieved"],
                    quality_score=r["quality_score"],
                    productivity_score=r["productivity_score"],
                    teamwork_score=r["teamwork_score"],
                    communication_score=r["communication_score"],
                    overall_score=r.get("overall_score", 0),
                    feedback=r.get("feedback", ""),
                    strengths=r.get("strengths", ""),
                    areas_for_improvement=r.get("areas_for_improvement", ""),
                    goals_for_next_period=r.get("goals_for_next_period", ""),
                    created_at=r["created_at"].isoformat() if isinstance(r["created_at"], datetime) else r["created_at"]
                )
                for r in reviews
            ],
            "total": len(reviews)
        }
    except Exception as e:
        logger.error(f"Get reviews error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch reviews"
        )


@router.get("/performance-reviews/my")
async def get_my_performance_reviews(
    current_user: dict = Depends(get_current_user)
):
    """Get performance reviews for current user"""
    try:
        db = get_db()
        user_id = current_user.get("sub")
        
        reviews = await db.performance_reviews.find(
            {"employee_id": user_id}
        ).sort("created_at", -1).to_list(50)
        
        return {
            "reviews": [
                PerformanceReviewResponse(
                    id=r["id"],
                    employee_id=r["employee_id"],
                    employee_name=r.get("employee_name", ""),
                    reviewer_id=r["reviewer_id"],
                    reviewer_name=r.get("reviewer_name", ""),
                    review_period=r["review_period"],
                    goals_achieved=r["goals_achieved"],
                    quality_score=r["quality_score"],
                    productivity_score=r["productivity_score"],
                    teamwork_score=r["teamwork_score"],
                    communication_score=r["communication_score"],
                    overall_score=r.get("overall_score", 0),
                    feedback=r.get("feedback", ""),
                    strengths=r.get("strengths", ""),
                    areas_for_improvement=r.get("areas_for_improvement", ""),
                    goals_for_next_period=r.get("goals_for_next_period", ""),
                    created_at=r["created_at"].isoformat() if isinstance(r["created_at"], datetime) else r["created_at"]
                )
                for r in reviews
            ],
            "total": len(reviews)
        }
    except Exception as e:
        logger.error(f"Get my reviews error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch reviews"
        )


# Analytics endpoint for performance data
@router.get("/admin/analytics/performance")
async def get_performance_analytics(
    current_user: dict = Depends(get_current_admin)
):
    """Get performance analytics for company"""
    try:
        db = get_db()
        company_id = current_user.get("company_id")
        
        # Get all reviews
        reviews = await db.performance_reviews.find(
            {"company_id": company_id}
        ).to_list(1000)
        
        # Get all tasks
        tasks = await db.tasks.find(
            {"company_id": company_id}
        ).to_list(1000)
        
        # Calculate analytics
        total_reviews = len(reviews)
        avg_overall_score = sum(r.get("overall_score", 0) for r in reviews) / total_reviews if total_reviews > 0 else 0
        avg_goals_achieved = sum(r.get("goals_achieved", 0) for r in reviews) / total_reviews if total_reviews > 0 else 0
        
        # Task stats
        total_tasks = len(tasks)
        completed_tasks = len([t for t in tasks if t.get("status") == "completed"])
        pending_tasks = len([t for t in tasks if t.get("status") == "pending"])
        in_progress_tasks = len([t for t in tasks if t.get("status") == "in_progress"])
        
        # Top performers (by review scores)
        employee_scores = {}
        for r in reviews:
            emp_id = r["employee_id"]
            emp_name = r.get("employee_name", "Unknown")
            score = r.get("overall_score", 0)
            if emp_id not in employee_scores:
                employee_scores[emp_id] = {"name": emp_name, "scores": [], "id": emp_id}
            employee_scores[emp_id]["scores"].append(score)
        
        top_performers = sorted(
            [
                {"id": e["id"], "name": e["name"], "avg_score": sum(e["scores"]) / len(e["scores"])}
                for e in employee_scores.values()
            ],
            key=lambda x: x["avg_score"],
            reverse=True
        )[:5]
        
        # Score distribution
        score_distribution = {
            "excellent": len([r for r in reviews if r.get("overall_score", 0) >= 4.5]),
            "good": len([r for r in reviews if 3.5 <= r.get("overall_score", 0) < 4.5]),
            "average": len([r for r in reviews if 2.5 <= r.get("overall_score", 0) < 3.5]),
            "needs_improvement": len([r for r in reviews if r.get("overall_score", 0) < 2.5])
        }
        
        return {
            "reviews": {
                "total": total_reviews,
                "avg_overall_score": round(avg_overall_score, 2),
                "avg_goals_achieved": round(avg_goals_achieved, 1),
                "score_distribution": score_distribution
            },
            "tasks": {
                "total": total_tasks,
                "completed": completed_tasks,
                "pending": pending_tasks,
                "in_progress": in_progress_tasks,
                "completion_rate": round((completed_tasks / total_tasks * 100) if total_tasks > 0 else 0, 1)
            },
            "top_performers": top_performers
        }
    except Exception as e:
        logger.error(f"Get analytics error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch analytics"
        )
