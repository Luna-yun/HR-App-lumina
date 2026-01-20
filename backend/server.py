from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Lumina EMS API",
    description="Enterprise Employee Management System - ASEAN Focus",
    version="2.0.0"
)

# CORS Configuration
cors_origins = os.environ.get('CORS_ORIGINS', '*')
if cors_origins == '*':
    origins = ['*']
else:
    origins = [origin.strip() for origin in cors_origins.split(',')]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB Configuration
MONGO_URL = os.environ.get('MONGO_URL')
DB_NAME = os.environ.get('DB_NAME', 'ems_database')

# Database connection
client = None
db = None

@app.on_event("startup")
async def startup_db_client():
    global client, db
    try:
        client = AsyncIOMotorClient(MONGO_URL)
        db = client[DB_NAME]
        # Test connection
        await client.admin.command('ping')
        logger.info(f"Connected to MongoDB database: {DB_NAME}")
        
        # Create indexes for better performance
        await create_indexes()
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {str(e)}")
        raise

@app.on_event("shutdown")
async def shutdown_db_client():
    global client
    if client:
        client.close()
        logger.info("MongoDB connection closed")

async def create_indexes():
    """Create database indexes for optimal performance"""
    try:
        # Users collection indexes
        await db.users.create_index("email", unique=True)
        await db.users.create_index("company_id")
        await db.users.create_index([("company_id", 1), ("role", 1)])
        await db.users.create_index([("company_id", 1), ("department", 1)])
        
        # Companies collection indexes
        await db.companies.create_index("name")
        await db.companies.create_index([("name", 1), ("country", 1)], unique=True)
        
        # Attendance collection indexes
        await db.attendance.create_index([("employee_id", 1), ("date", 1)], unique=True)
        await db.attendance.create_index([("company_id", 1), ("date", 1)])
        
        # Leave requests collection indexes
        await db.leave_requests.create_index("employee_id")
        await db.leave_requests.create_index([("company_id", 1), ("status", 1)])
        
        # Salary records collection indexes
        await db.salary_records.create_index([("employee_id", 1), ("year", -1), ("month", -1)])
        await db.salary_records.create_index("company_id")
        
        # Notices collection indexes
        await db.notices.create_index([("company_id", 1), ("is_active", 1)])
        
        # Departments collection indexes
        await db.departments.create_index([("company_id", 1), ("name", 1)], unique=True)
        
        # Job postings collection indexes
        await db.job_postings.create_index([("company_id", 1), ("status", 1)])
        
        # Applicants collection indexes
        await db.applicants.create_index("job_posting_id")
        await db.applicants.create_index([("company_id", 1), ("status", 1)])
        
        # Knowledge documents collection indexes
        await db.knowledge_documents.create_index("company_id")
        await db.knowledge_documents.create_index([("company_id", 1), ("content_hash", 1)], unique=True)
        
        # Chat messages collection indexes
        await db.chat_messages.create_index([("session_id", 1), ("created_at", 1)])
        await db.chat_messages.create_index("company_id")
        
        # Notifications collection indexes
        await db.notifications.create_index([("target_user_id", 1), ("created_at", -1)])
        await db.notifications.create_index([("company_id", 1), ("is_read", 1)])
        await db.notifications.create_index("created_at")
        
        logger.info("Database indexes created successfully")
    except Exception as e:
        logger.warning(f"Error creating indexes: {str(e)}")

# Import and include routers
from auth_routes import router as auth_router
from attendance_routes import router as attendance_router
from leave_routes import router as leave_router
from salary_routes import router as salary_router
from notice_routes import router as notice_router
from department_routes import router as department_router
from recruitment_routes import router as recruitment_router
from ai_chat_routes import router as ai_chat_router
from notification_routes import router as notification_router

app.include_router(auth_router, prefix="/api", tags=["Authentication"])
app.include_router(attendance_router, prefix="/api", tags=["Attendance"])
app.include_router(leave_router, prefix="/api", tags=["Leave Management"])
app.include_router(salary_router, prefix="/api", tags=["Salary & Payroll"])
app.include_router(notice_router, prefix="/api", tags=["Notices"])
app.include_router(department_router, prefix="/api", tags=["Departments"])
app.include_router(recruitment_router, prefix="/api", tags=["Recruitment"])
app.include_router(ai_chat_router, prefix="/api", tags=["AI Chat"])
app.include_router(notification_router, prefix="/api", tags=["Notifications"])

# Health check endpoint
@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Lumina EMS API",
        "version": "2.0.0"
    }

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to Lumina EMS API",
        "docs": "/docs",
        "health": "/api/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
