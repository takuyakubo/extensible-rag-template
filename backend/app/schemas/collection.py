from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel

# Shared properties
class CollectionBase(BaseModel):
    name: str
    description: Optional[str] = None

# Properties to receive via API on creation
class CollectionCreate(CollectionBase):
    pass

# Properties to receive via API on update
class CollectionUpdate(CollectionBase):
    name: Optional[str] = None

# Properties to return via API
class Collection(CollectionBase):
    id: int
    created_at: datetime
    updated_at: datetime
    owner_id: int
    
    class Config:
        from_attributes = True