from fastapi import APIRouter, HTTPException, status, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Optional
import logging
from datetime import datetime

from models import (
    JobPosting, JobPostingCreate, JobPostingResponse,
    Applicant, ApplicantCreate, ApplicantResponse,
    RecruitmentStatus, ApplicantStatus
)
from auth_utils import get_current_user, get_current_admin

logger = logging.getLogger(__name__)

router = APIRouter()

# Dependency to get database
async def get_db() -> AsyncIOMotorDatabase:
    from server import db
    return db


# ==================
# JOB POSTINGS
# ==================

@router.get("/admin/jobs", response_model=List[JobPostingResponse])
async def get_job_postings(
    status_filter: Optional[str] = None,
    current_user: dict = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get all job postings for company (Admin only)"""
    try:
        company_id = current_user["company_id"]
        
        query = {"company_id": company_id}
        if status_filter:
            query["status"] = status_filter
        
        jobs = await db.job_postings.find(query).sort("created_at", -1).to_list(100)
        
        result = []
        for job in jobs:
            # Count applicants
            applicant_count = await db.applicants.count_documents({
                "job_posting_id": job["id"]
            })
            
            result.append(JobPostingResponse(
                id=job["id"],
                title=job["title"],
                department=job["department"],
                description=job["description"],
                requirements=job["requirements"],
                salary_range=job.get("salary_range", ""),
                location=job.get("location", ""),
                employment_type=job.get("employment_type", "Full-time"),
                status=job["status"],
                applicant_count=applicant_count,
                created_at=job["created_at"]
            ))
        
        return result
    
    except Exception as e:
        logger.error(f"Get job postings error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred"
        )


@router.post("/admin/jobs", response_model=JobPostingResponse)
async def create_job_posting(
    request: JobPostingCreate,
    current_user: dict = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Create job posting (Admin only)"""
    try:
        company_id = current_user["company_id"]
        admin_id = current_user["sub"]
        
        job = JobPosting(
            company_id=company_id,
            title=request.title,
            department=request.department,
            description=request.description,
            requirements=request.requirements,
            salary_range=request.salary_range,
            location=request.location,
            employment_type=request.employment_type,
            status=RecruitmentStatus.OPEN,
            created_by=admin_id
        )
        
        await db.job_postings.insert_one(job.dict())
        
        return JobPostingResponse(
            id=job.id,
            title=job.title,
            department=job.department,
            description=job.description,
            requirements=job.requirements,
            salary_range=job.salary_range,
            location=job.location,
            employment_type=job.employment_type,
            status=job.status,
            applicant_count=0,
            created_at=job.created_at
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Create job posting error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred"
        )


@router.put("/admin/jobs/{job_id}")
async def update_job_posting(
    job_id: str,
    request: JobPostingCreate,
    current_user: dict = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update job posting (Admin only)"""
    try:
        company_id = current_user["company_id"]
        
        job = await db.job_postings.find_one({"id": job_id})
        if not job:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job posting not found"
            )
        
        if job["company_id"] != company_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only update job postings from your company"
            )
        
        await db.job_postings.update_one(
            {"id": job_id},
            {"$set": {
                "title": request.title,
                "department": request.department,
                "description": request.description,
                "requirements": request.requirements,
                "salary_range": request.salary_range,
                "location": request.location,
                "employment_type": request.employment_type,
                "updated_at": datetime.utcnow()
            }}
        )
        
        updated_job = await db.job_postings.find_one({"id": job_id})
        applicant_count = await db.applicants.count_documents({"job_posting_id": job_id})
        
        return JobPostingResponse(
            id=updated_job["id"],
            title=updated_job["title"],
            department=updated_job["department"],
            description=updated_job["description"],
            requirements=updated_job["requirements"],
            salary_range=updated_job.get("salary_range", ""),
            location=updated_job.get("location", ""),
            employment_type=updated_job.get("employment_type", "Full-time"),
            status=updated_job["status"],
            applicant_count=applicant_count,
            created_at=updated_job["created_at"]
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Update job posting error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred"
        )


@router.put("/admin/jobs/{job_id}/status")
async def update_job_status(
    job_id: str,
    new_status: str,
    current_user: dict = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update job posting status (Admin only)"""
    try:
        company_id = current_user["company_id"]
        
        if new_status not in [RecruitmentStatus.OPEN, RecruitmentStatus.CLOSED, RecruitmentStatus.ON_HOLD]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid status"
            )
        
        job = await db.job_postings.find_one({"id": job_id})
        if not job:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job posting not found"
            )
        
        if job["company_id"] != company_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only update job postings from your company"
            )
        
        await db.job_postings.update_one(
            {"id": job_id},
            {"$set": {
                "status": new_status,
                "updated_at": datetime.utcnow()
            }}
        )
        
        return {"message": f"Job status updated to {new_status}"}
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Update job status error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred"
        )


@router.delete("/admin/jobs/{job_id}")
async def delete_job_posting(
    job_id: str,
    current_user: dict = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Delete job posting and all applicants (Admin only)"""
    try:
        company_id = current_user["company_id"]
        
        job = await db.job_postings.find_one({"id": job_id})
        if not job:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job posting not found"
            )
        
        if job["company_id"] != company_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only delete job postings from your company"
            )
        
        # Delete all applicants for this job
        await db.applicants.delete_many({"job_posting_id": job_id})
        
        # Delete job posting
        await db.job_postings.delete_one({"id": job_id})
        
        return {"message": "Job posting deleted successfully"}
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Delete job posting error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred"
        )


# ==================
# APPLICANTS
# ==================

@router.get("/admin/jobs/{job_id}/applicants", response_model=List[ApplicantResponse])
async def get_job_applicants(
    job_id: str,
    status_filter: Optional[str] = None,
    current_user: dict = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get all applicants for a job (Admin only)"""
    try:
        company_id = current_user["company_id"]
        
        # Verify job belongs to company
        job = await db.job_postings.find_one({"id": job_id})
        if not job:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job posting not found"
            )
        
        if job["company_id"] != company_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only view applicants from your company"
            )
        
        query = {"job_posting_id": job_id}
        if status_filter:
            query["status"] = status_filter
        
        applicants = await db.applicants.find(query).sort("created_at", -1).to_list(500)
        
        return [
            ApplicantResponse(
                id=app["id"],
                job_posting_id=app["job_posting_id"],
                job_title=job["title"],
                name=app["name"],
                email=app["email"],
                phone=app.get("phone", ""),
                status=app["status"],
                notes=app.get("notes", ""),
                interview_date=app.get("interview_date"),
                created_at=app["created_at"]
            )
            for app in applicants
        ]
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get job applicants error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred"
        )


@router.post("/admin/jobs/{job_id}/applicants")
async def add_applicant(
    job_id: str,
    request: ApplicantCreate,
    current_user: dict = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Add applicant to a job (Admin only)"""
    try:
        company_id = current_user["company_id"]
        
        # Verify job belongs to company
        job = await db.job_postings.find_one({"id": job_id})
        if not job:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job posting not found"
            )
        
        if job["company_id"] != company_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only add applicants to your company's jobs"
            )
        
        applicant = Applicant(
            job_posting_id=job_id,
            company_id=company_id,
            name=request.name,
            email=request.email,
            phone=request.phone,
            cover_letter=request.cover_letter,
            status=ApplicantStatus.NEW
        )
        
        await db.applicants.insert_one(applicant.dict())
        
        return {
            "message": "Applicant added successfully",
            "applicant_id": applicant.id
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Add applicant error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred"
        )


@router.put("/admin/applicants/{applicant_id}/status")
async def update_applicant_status(
    applicant_id: str,
    new_status: str,
    notes: Optional[str] = None,
    interview_date: Optional[str] = None,
    current_user: dict = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update applicant status (Admin only)"""
    try:
        company_id = current_user["company_id"]
        
        valid_statuses = [
            ApplicantStatus.NEW,
            ApplicantStatus.SCREENING,
            ApplicantStatus.INTERVIEW,
            ApplicantStatus.OFFER,
            ApplicantStatus.HIRED,
            ApplicantStatus.REJECTED
        ]
        
        if new_status not in valid_statuses:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid status"
            )
        
        applicant = await db.applicants.find_one({"id": applicant_id})
        if not applicant:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Applicant not found"
            )
        
        if applicant["company_id"] != company_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only update applicants from your company"
            )
        
        update_data = {
            "status": new_status,
            "updated_at": datetime.utcnow()
        }
        
        if notes:
            update_data["notes"] = notes
        
        if interview_date:
            update_data["interview_date"] = datetime.fromisoformat(interview_date)
        
        await db.applicants.update_one(
            {"id": applicant_id},
            {"$set": update_data}
        )
        
        return {"message": f"Applicant status updated to {new_status}"}
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Update applicant status error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred"
        )


@router.delete("/admin/applicants/{applicant_id}")
async def delete_applicant(
    applicant_id: str,
    current_user: dict = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Delete applicant (Admin only)"""
    try:
        company_id = current_user["company_id"]
        
        applicant = await db.applicants.find_one({"id": applicant_id})
        if not applicant:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Applicant not found"
            )
        
        if applicant["company_id"] != company_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only delete applicants from your company"
            )
        
        await db.applicants.delete_one({"id": applicant_id})
        
        return {"message": "Applicant deleted successfully"}
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Delete applicant error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred"
        )


@router.get("/admin/recruitment/stats")
async def get_recruitment_stats(
    current_user: dict = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get recruitment statistics (Admin only)"""
    try:
        company_id = current_user["company_id"]
        
        # Job stats
        total_jobs = await db.job_postings.count_documents({"company_id": company_id})
        open_jobs = await db.job_postings.count_documents({
            "company_id": company_id,
            "status": RecruitmentStatus.OPEN
        })
        closed_jobs = await db.job_postings.count_documents({
            "company_id": company_id,
            "status": RecruitmentStatus.CLOSED
        })
        
        # Applicant stats
        total_applicants = await db.applicants.count_documents({"company_id": company_id})
        new_applicants = await db.applicants.count_documents({
            "company_id": company_id,
            "status": ApplicantStatus.NEW
        })
        in_interview = await db.applicants.count_documents({
            "company_id": company_id,
            "status": ApplicantStatus.INTERVIEW
        })
        hired = await db.applicants.count_documents({
            "company_id": company_id,
            "status": ApplicantStatus.HIRED
        })
        
        return {
            "total_jobs": total_jobs,
            "open_jobs": open_jobs,
            "closed_jobs": closed_jobs,
            "total_applicants": total_applicants,
            "new_applicants": new_applicants,
            "in_interview": in_interview,
            "hired": hired
        }
    
    except Exception as e:
        logger.error(f"Get recruitment stats error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred"
        )
