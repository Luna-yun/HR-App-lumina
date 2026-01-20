#!/usr/bin/env python3
"""
Manual user verification script for testing purposes
This bypasses email verification to allow testing of the authentication flow
"""

import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent / "backend"
load_dotenv(ROOT_DIR / '.env')

async def verify_test_users():
    """Manually verify test users in the database"""
    
    # Connect to MongoDB
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    
    try:
        # Find all unverified users with test emails
        unverified_users = await db.users.find({
            "is_verified": False,
            "email": {"$regex": "test.*@luminahr.com"}
        }).to_list(100)
        
        print(f"Found {len(unverified_users)} unverified test users")
        
        for user in unverified_users:
            # Verify the user
            result = await db.users.update_one(
                {"id": user["id"]},
                {"$set": {"is_verified": True, "verification_token": None}}
            )
            
            if result.modified_count > 0:
                print(f"✅ Verified user: {user['email']} (Role: {user['role']})")
            else:
                print(f"❌ Failed to verify user: {user['email']}")
        
        print("\nManual verification complete!")
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(verify_test_users())