# Key methods and database patterns used in the LuminaHR backend:

## 1. Database Connection (MongoDB with Motor - Async Driver)

```python
# server.py
from motor.motor_asyncio import AsyncIOMotorClient

client = AsyncIOMotorClient(os.environ.get('MONGO_URL'))
db = client[os.environ.get('DB_NAME', 'ems_database')]
```

## 2. CRUD Operations Examples

### **CREATE** - Insert
```python
# auth_routes.py - Creating a new user
user = User(
    email=request.email,
    password_hash=hash_password(request.password),
    full_name=request.full_name,
    role=request.role,
    company_id=company_id
)
await db.users.insert_one(user.dict())
```

### **READ** - Find documents (one and multi)
```python
# Find one document
user = await db.users.find_one({"email": request.email})

# Find multiple with filter, sort, limit
documents = await db.knowledge_documents.find({
    "company_id": company_id
}).sort("created_at", -1).limit(100).to_list(100)

# Count documents
count = await db.users.count_documents({"company_id": company_id})
```

### **UPDATE** - Modify info
```python
# Update one document
await db.users.update_one(
    {"id": user_id},                    # filter
    {"$set": {"is_approved": True}}     # update operation
)

# Update with multiple fields
await db.users.update_one(
    {"email": email},
    {"$set": {
        "last_login": datetime.utcnow(),
        "is_active": True
    }}
)
```

### **DELETE** - Remove documents
```python
# Delete one
await db.knowledge_documents.delete_one({"id": document_id})

# Delete many
result = await db.chat_messages.delete_many({"session_id": session_id})
print(f"Deleted {result.deleted_count} messages")
```

## 3. FastAPI Route Patterns

```python
# Dependency injection for database
async def get_db() -> AsyncIOMotorDatabase:
    from server import db
    return db

# Protected route with authentication
@router.post("/admin/chat")
async def chat(
    request: ChatRequest,
    current_user: dict = Depends(get_current_admin),  # Auth check
    db: AsyncIOMotorDatabase = Depends(get_db)        # DB injection
):
    company_id = current_user["company_id"]
    # ... route logic
```

## 4. Pydantic Models for Validation

```python
# models.py
class SignUpRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    country: str
    
    @field_validator('country')
    @classmethod
    def validate_country(cls, v):
        if v not in ASEAN_COUNTRIES:
            raise ValueError('Country must be one of ASEAN countries')
        return v
```

## 5. Vector Database (Qdrant) Operations

```python
# Create collection
qdrant_client.create_collection(
    collection_name=collection_name,
    vectors_config=qmodels.VectorParams(size=384, distance=qmodels.Distance.COSINE)
)

# Insert vectors
qdrant_client.upsert(
    collection_name=collection_name,
    points=[qmodels.PointStruct(id=point_id, vector=embedding, payload={...})]
)

# Search similar vectors
results = qdrant_client.query_points(
    collection_name=collection_name,
    query=query_embedding,
    limit=5,
    score_threshold=0.3
)
```

## 6. JWT Authentication

```python
# auth_utils.py
def create_access_token(data: dict):
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = data.copy()
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode(), hashed_password.encode())
```

## Summary Table

| Operation | MongoDB Method | Example |
|-----------|---------------|---------|
| Create | `insert_one()` | `await db.users.insert_one(user.dict())` |
| Read One | `find_one()` | `await db.users.find_one({"email": email})` |
| Read Many | `find().to_list()` | `await db.users.find({}).to_list(100)` |
| Update | `update_one()` | `await db.users.update_one(filter, {"$set": data})` |
| Delete | `delete_one()` | `await db.users.delete_one({"id": id})` |
| Count | `count_documents()` | `await db.users.count_documents({})` |
