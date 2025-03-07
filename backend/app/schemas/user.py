from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field

# Shared properties
class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    full_name: Optional[str] = None
    is_active: Optional[bool] = True

# Properties to receive via API on creation
class UserCreate(UserBase):
    email: EmailStr
    username: str
    full_name: str
    password: str

# Properties to receive via API on update
class UserUpdate(UserBase):
    password: Optional[str] = None

# Properties to return via API
class User(UserBase):
    id: int
    
    class Config:
        from_attributes = True

# Additional properties stored in DB
class UserInDB(User):
    hashed_password: str