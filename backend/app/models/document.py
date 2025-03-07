from datetime import datetime
from typing import List, Optional

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base_class import Base

class Document(Base):
    """Document model for storing document metadata"""
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String, index=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    file_name: Mapped[str] = mapped_column(String)
    file_type: Mapped[str] = mapped_column(String)
    file_size: Mapped[int] = mapped_column(Integer)
    s3_path: Mapped[str] = mapped_column(String)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    owner_id: Mapped[int] = mapped_column(Integer, ForeignKey("user.id"))
    collection_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("collection.id"), nullable=True)
    status: Mapped[str] = mapped_column(String, default="pending")  # pending, processing, indexed, error
    metadata: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    
    # Relationships
    owner: Mapped["User"] = relationship("User", back_populates="documents")
    collection: Mapped[Optional["Collection"]] = relationship("Collection", back_populates="documents")
    chunks: Mapped[List["DocumentChunk"]] = relationship("DocumentChunk", back_populates="document", cascade="all, delete-orphan")