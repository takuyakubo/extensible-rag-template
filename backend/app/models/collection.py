from datetime import datetime
from typing import List, Optional

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base_class import Base

class Collection(Base):
    """Collection model for grouping documents"""
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, index=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    owner_id: Mapped[int] = mapped_column(Integer, ForeignKey("user.id"))
    
    # Relationships
    owner: Mapped["User"] = relationship("User", back_populates="collections")
    documents: Mapped[List["Document"]] = relationship("Document", back_populates="collection")