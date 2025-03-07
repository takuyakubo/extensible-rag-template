from datetime import datetime
from typing import Dict, List, Optional

from pydantic import BaseModel

# Shared properties
class DocumentBase(BaseModel):
    title: str
    description: Optional[str] = None
    collection_id: Optional[int] = None

# Properties to receive via API on creation
class DocumentCreate(DocumentBase):
    pass

# Properties to receive via API on update
class DocumentUpdate(DocumentBase):
    title: Optional[str] = None
    status: Optional[str] = None

# Properties to return via API
class Document(DocumentBase):
    id: int
    file_name: str
    file_type: str
    file_size: int
    s3_path: str
    created_at: datetime
    updated_at: datetime
    owner_id: int
    status: str
    metadata: Optional[Dict] = None
    
    class Config:
        from_attributes = True

# Properties for file upload
class DocumentUpload(BaseModel):
    title: str
    description: Optional[str] = None
    collection_id: Optional[int] = None
    file: bytes