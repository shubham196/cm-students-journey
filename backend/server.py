from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import jwt
import bcrypt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

JWT_SECRET = os.environ.get('JWT_SECRET', 'student_admission_secret_key_2025')
JWT_ALGORITHM = "HS256"

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

# Models
class StudentLogin(BaseModel):
    email: str
    password: str

class StudentRegister(BaseModel):
    email: EmailStr
    mobile: str
    password: str
    full_name: str

class Student(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    mobile: str
    full_name: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PersonalDetails(BaseModel):
    student_id: str
    full_name: str
    dob: str
    gender: str
    father_name: str
    mother_name: str
    blood_group: Optional[str] = None
    nationality: str = "Indian"

class AddressDetails(BaseModel):
    student_id: str
    permanent_address: str
    permanent_city: str
    permanent_state: str
    permanent_pincode: str
    current_address: str
    current_city: str
    current_state: str
    current_pincode: str

class AcademicDetails(BaseModel):
    student_id: str
    tenth_board: str
    tenth_year: str
    tenth_percentage: float
    twelfth_board: str
    twelfth_year: str
    twelfth_percentage: float
    entrance_exam: Optional[str] = None
    entrance_score: Optional[float] = None

class DocumentUpload(BaseModel):
    student_id: str
    document_type: str
    document_url: str
    status: str = "Uploaded"
    uploaded_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AdmissionStep(BaseModel):
    step_name: str
    status: str  # Pending, In Progress, Completed
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AdmissionJourney(BaseModel):
    student_id: str
    steps: List[AdmissionStep]

# Helper functions
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(student_id: str, email: str) -> str:
    payload = {
        "student_id": student_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(days=7)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_student(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

# Routes
@api_router.post("/auth/register")
async def register(student: StudentRegister):
    existing = await db.students.find_one({"email": student.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    student_obj = Student(
        email=student.email,
        mobile=student.mobile,
        full_name=student.full_name
    )
    
    doc = student_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['password'] = hash_password(student.password)
    
    await db.students.insert_one(doc)
    
    # Initialize admission journey
    journey_steps = [
        {"step_name": "Registration", "status": "Completed", "updated_at": datetime.now(timezone.utc).isoformat()},
        {"step_name": "Personal Details", "status": "Pending", "updated_at": datetime.now(timezone.utc).isoformat()},
        {"step_name": "Address Details", "status": "Pending", "updated_at": datetime.now(timezone.utc).isoformat()},
        {"step_name": "Academic Details", "status": "Pending", "updated_at": datetime.now(timezone.utc).isoformat()},
        {"step_name": "Document Upload", "status": "Pending", "updated_at": datetime.now(timezone.utc).isoformat()},
        {"step_name": "Verification", "status": "Pending", "updated_at": datetime.now(timezone.utc).isoformat()},
        {"step_name": "Seat Allotment", "status": "Pending", "updated_at": datetime.now(timezone.utc).isoformat()},
        {"step_name": "Payment", "status": "Pending", "updated_at": datetime.now(timezone.utc).isoformat()},
        {"step_name": "Final Admission", "status": "Pending", "updated_at": datetime.now(timezone.utc).isoformat()}
    ]
    
    await db.admission_journey.insert_one({
        "student_id": student_obj.id,
        "steps": journey_steps
    })
    
    token = create_token(student_obj.id, student.email)
    
    return {
        "message": "Registration successful",
        "token": token,
        "student": {"id": student_obj.id, "email": student.email, "full_name": student.full_name}
    }

@api_router.post("/auth/login")
async def login(credentials: StudentLogin):
    student = await db.students.find_one({"email": credentials.email})
    if not student:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(credentials.password, student['password']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token(student['id'], student['email'])
    
    return {
        "message": "Login successful",
        "token": token,
        "student": {"id": student['id'], "email": student['email'], "full_name": student['full_name']}
    }

@api_router.get("/student/profile")
async def get_profile(current_student: dict = Depends(get_current_student)):
    student = await db.students.find_one({"id": current_student['student_id']}, {"_id": 0, "password": 0})
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

@api_router.get("/admission/journey")
async def get_admission_journey(current_student: dict = Depends(get_current_student)):
    journey = await db.admission_journey.find_one({"student_id": current_student['student_id']}, {"_id": 0})
    if not journey:
        raise HTTPException(status_code=404, detail="Journey not found")
    return journey

@api_router.put("/admission/journey/step")
async def update_journey_step(step_name: str, status: str, current_student: dict = Depends(get_current_student)):
    result = await db.admission_journey.update_one(
        {"student_id": current_student['student_id'], "steps.step_name": step_name},
        {"$set": {"steps.$.status": status, "steps.$.updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    return {"message": "Step updated", "modified": result.modified_count}

@api_router.post("/forms/personal")
async def save_personal_details(details: PersonalDetails, current_student: dict = Depends(get_current_student)):
    details.student_id = current_student['student_id']
    await db.personal_details.update_one(
        {"student_id": details.student_id},
        {"$set": details.model_dump()},
        upsert=True
    )
    
    # Update journey step
    await db.admission_journey.update_one(
        {"student_id": current_student['student_id'], "steps.step_name": "Personal Details"},
        {"$set": {"steps.$.status": "Completed", "steps.$.updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    return {"message": "Personal details saved"}

@api_router.get("/forms/personal")
async def get_personal_details(current_student: dict = Depends(get_current_student)):
    details = await db.personal_details.find_one({"student_id": current_student['student_id']}, {"_id": 0})
    return details or {}

@api_router.post("/forms/address")
async def save_address_details(details: AddressDetails, current_student: dict = Depends(get_current_student)):
    details.student_id = current_student['student_id']
    await db.address_details.update_one(
        {"student_id": details.student_id},
        {"$set": details.model_dump()},
        upsert=True
    )
    
    await db.admission_journey.update_one(
        {"student_id": current_student['student_id'], "steps.step_name": "Address Details"},
        {"$set": {"steps.$.status": "Completed", "steps.$.updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    return {"message": "Address details saved"}

@api_router.get("/forms/address")
async def get_address_details(current_student: dict = Depends(get_current_student)):
    details = await db.address_details.find_one({"student_id": current_student['student_id']}, {"_id": 0})
    return details or {}

@api_router.post("/forms/academic")
async def save_academic_details(details: AcademicDetails, current_student: dict = Depends(get_current_student)):
    details.student_id = current_student['student_id']
    await db.academic_details.update_one(
        {"student_id": details.student_id},
        {"$set": details.model_dump()},
        upsert=True
    )
    
    await db.admission_journey.update_one(
        {"student_id": current_student['student_id'], "steps.step_name": "Academic Details"},
        {"$set": {"steps.$.status": "Completed", "steps.$.updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    return {"message": "Academic details saved"}

@api_router.get("/forms/academic")
async def get_academic_details(current_student: dict = Depends(get_current_student)):
    details = await db.academic_details.find_one({"student_id": current_student['student_id']}, {"_id": 0})
    return details or {}

@api_router.post("/documents/upload")
async def upload_document(doc: DocumentUpload, current_student: dict = Depends(get_current_student)):
    doc.student_id = current_student['student_id']
    doc_dict = doc.model_dump()
    doc_dict['uploaded_at'] = doc_dict['uploaded_at'].isoformat()
    
    await db.documents.update_one(
        {"student_id": doc.student_id, "document_type": doc.document_type},
        {"$set": doc_dict},
        upsert=True
    )
    
    # Check if all required docs are uploaded
    doc_count = await db.documents.count_documents({"student_id": current_student['student_id']})
    if doc_count >= 4:
        await db.admission_journey.update_one(
            {"student_id": current_student['student_id'], "steps.step_name": "Document Upload"},
            {"$set": {"steps.$.status": "Completed", "steps.$.updated_at": datetime.now(timezone.utc).isoformat()}}
        )
    
    return {"message": "Document uploaded"}

@api_router.get("/documents/list")
async def list_documents(current_student: dict = Depends(get_current_student)):
    docs = await db.documents.find({"student_id": current_student['student_id']}, {"_id": 0}).to_list(100)
    return docs

@api_router.get("/dashboard/stats")
async def get_dashboard_stats(current_student: dict = Depends(get_current_student)):
    journey = await db.admission_journey.find_one({"student_id": current_student['student_id']})
    
    completed = 0
    total = 0
    if journey:
        total = len(journey['steps'])
        completed = sum(1 for step in journey['steps'] if step['status'] == 'Completed')
    
    progress = int((completed / total * 100)) if total > 0 else 0
    
    announcements = [
        {"id": "1", "title": "Admission 2025 Open", "message": "Applications are now open for the academic year 2025-26", "date": "2025-01-15"},
        {"id": "2", "title": "Document Verification", "message": "Please ensure all documents are uploaded before the deadline", "date": "2025-01-10"}
    ]
    
    return {
        "progress": progress,
        "completed_steps": completed,
        "total_steps": total,
        "announcements": announcements
    }

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()