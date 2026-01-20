#!/usr/bin/env python3
import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables the same way as the backend
ROOT_DIR = Path(__file__).parent / "backend"
load_dotenv(ROOT_DIR / '.env')

print("Environment variables check:")
print(f"JWT_SECRET: {repr(os.environ.get('JWT_SECRET'))}")
print(f"JWT_ALGORITHM: {repr(os.environ.get('JWT_ALGORITHM'))}")
print(f"MONGO_URL: {repr(os.environ.get('MONGO_URL'))}")

# Test JWT token creation
try:
    from jose import jwt
    
    JWT_SECRET = os.environ.get('JWT_SECRET')
    JWT_ALGORITHM = os.environ.get('JWT_ALGORITHM', 'HS256')
    
    test_data = {"sub": "test", "email": "test@example.com"}
    token = jwt.encode(test_data, JWT_SECRET, algorithm=JWT_ALGORITHM)
    print(f"JWT token creation: SUCCESS")
    print(f"Token: {token[:50]}...")
    
    # Test decoding
    decoded = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    print(f"JWT token decoding: SUCCESS")
    print(f"Decoded: {decoded}")
    
except Exception as e:
    print(f"JWT error: {e}")