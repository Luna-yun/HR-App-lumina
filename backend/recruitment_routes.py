from fastapi import APIRouter, HTTPException, status, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Optional
from pydantic import BaseModel
import logging
from datetime import datetime

from models import (
    JobPosting, JobPostingCreate, JobPostingResponse,
    Applicant, ApplicantCreate, ApplicantResponse,
    RecruitmentStatus, ApplicantStatus, Notice
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
        
        # Get company name for notice
        company = await db.companies.find_one({"id": company_id})
        company_name = company["name"] if company else "Our Company"
        
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
        
        # Create a notice about the job posting
        from models import Notice
        
        # Build HTML content for the notice
        notice_content = f"""
        <div style="font-family: system-ui, sans-serif;">
            <h2 style="color: #1e40af; margin-bottom: 16px;">🎉 We're Hiring: {job.title}</h2>
            
            <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                <p style="margin: 0 0 12px 0;"><strong>📍 Department:</strong> {job.department}</p>
                <p style="margin: 0 0 12px 0;"><strong>📌 Location:</strong> {job.location or 'To be discussed'}</p>
                <p style="margin: 0 0 12px 0;"><strong>⏰ Type:</strong> {job.employment_type}</p>
                {f'<p style="margin: 0;"><strong>💰 Salary:</strong> {job.salary_range}</p>' if job.salary_range else ''}
            </div>
            
            <h3 style="color: #374151; margin-bottom: 8px;">About the Role</h3>
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 16px;">{job.description[:500]}{'...' if len(job.description) > 500 else ''}</p>
            
            <h3 style="color: #374151; margin-bottom: 8px;">Requirements</h3>
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">{job.requirements[:400]}{'...' if len(job.requirements) > 400 else ''}</p>
            
            <div style="background: #fef3c7; padding: 16px; border-radius: 8px; border-left: 4px solid #f59e0b;">
                <p style="margin: 0; color: #92400e;">
                    <strong>Know someone perfect for this role?</strong><br>
                    Share this opportunity with your network! Referrals are always appreciated.
                </p>
            </div>
            
            <p style="margin-top: 20px; padding: 12px; background: #f3f4f6; border-radius: 8px; text-align: center;">
                <strong>Apply now or share:</strong><br>
                <a href="/careers/{job.id}" style="color: #2563eb; text-decoration: none;">View Full Job Details & Apply →</a>
            </p>
        </div>
        """
        
        notice = Notice(
            company_id=company_id,
            title=f"🚀 New Job Opening: {job.title}",
            content=notice_content,
            published_by=admin_id,
            publisher_name=current_user.get("email", "HR Department").split("@")[0].title()
        )
        
        await db.notices.insert_one(notice.dict())
        logger.info(f"Created notice for job posting: {job.title}")
        
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


class JobStatusUpdate(BaseModel):
    status: str  # open, closed, on_hold


@router.put("/admin/jobs/{job_id}/status")
async def update_job_status(
    job_id: str,
    request: JobStatusUpdate,
    current_user: dict = Depends(get_current_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update job posting status (Admin only)"""
    try:
        company_id = current_user["company_id"]
        new_status = request.status
        
        if new_status not in [RecruitmentStatus.OPEN, RecruitmentStatus.CLOSED, RecruitmentStatus.ON_HOLD]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid status. Must be 'open', 'closed', or 'on_hold'"
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
        
        # If closing the job, create a notice
        if new_status == RecruitmentStatus.CLOSED:
            notice_content = f"""
The position **{job['title']}** in **{job['department']}** is now closed and no longer accepting applications.

Thank you to all applicants who showed interest in this opportunity.
            """.strip()
            
            notice = Notice(
                company_id=company_id,
                title=f"📋 Position Closed: {job['title']}",
                content=notice_content,
                published_by=current_user.get("sub", ""),
                publisher_name=current_user.get("email", "HR Department").split("@")[0].title()
            )
            await db.notices.insert_one(notice.dict())
        
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


# ==================
# PUBLIC JOB ENDPOINTS (Shareable)
# ==================

@router.get("/careers/{job_id}")
async def get_public_job(
    job_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get public job posting details (No auth required - for shareable links)"""
    try:
        job = await db.job_postings.find_one({"id": job_id})
        
        if not job:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job posting not found"
            )
        
        # Get company name
        company = await db.companies.find_one({"id": job["company_id"]})
        company_name = company["name"] if company else "Company"
        company_country = company.get("country", "") if company else ""
        
        # Check if job is open for applications
        is_open = job.get("status") == RecruitmentStatus.OPEN
        
        return {
            "id": job["id"],
            "title": job["title"],
            "department": job["department"],
            "description": job["description"],
            "requirements": job["requirements"],
            "salary_range": job.get("salary_range", ""),
            "location": job.get("location", ""),
            "employment_type": job.get("employment_type", "Full-time"),
            "company_name": company_name,
            "company_country": company_country,
            "created_at": job["created_at"],
            "is_open": is_open,
            "status": job.get("status", "open")
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get public job error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred"
        )


@router.get("/careers")
async def get_public_jobs(
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get all open job postings (No auth required - public careers page)"""
    try:
        jobs = await db.job_postings.find({
            "status": RecruitmentStatus.OPEN
        }).sort("created_at", -1).to_list(100)
        
        result = []
        for job in jobs:
            company = await db.companies.find_one({"id": job["company_id"]})
            company_name = company["name"] if company else "Company"
            
            result.append({
                "id": job["id"],
                "title": job["title"],
                "department": job["department"],
                "location": job.get("location", ""),
                "employment_type": job.get("employment_type", "Full-time"),
                "company_name": company_name,
                "created_at": job["created_at"]
            })
        
        return {"jobs": result, "total": len(result)}
    
    except Exception as e:
        logger.error(f"Get public jobs error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred"
        )


@router.post("/careers/{job_id}/apply")
async def apply_for_job(
    job_id: str,
    request: ApplicantCreate,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Apply for a job (Public - no auth required)"""
    try:
        job = await db.job_postings.find_one({"id": job_id})
        
        if not job:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job posting not found"
            )
        
        if job.get("status") != RecruitmentStatus.OPEN:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This job is no longer accepting applications"
            )
        
        # Check if already applied
        existing = await db.applicants.find_one({
            "job_posting_id": job_id,
            "email": request.email
        })
        
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You have already applied for this position"
            )
        
        applicant = Applicant(
            company_id=job["company_id"],
            job_posting_id=job_id,
            name=request.name,
            email=request.email,
            phone=request.phone,
            cover_letter=request.cover_letter,
            resume_url=request.resume_url,
            status=ApplicantStatus.NEW
        )
        
        await db.applicants.insert_one(applicant.dict())
        
        return {
            "message": "Application submitted successfully! We'll be in touch soon.",
            "applicant_id": applicant.id
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Apply for job error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred"
        )
