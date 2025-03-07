from datetime import datetime
from typing import List, Optional

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Table
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base_class import Base

# Many-to-many relationship table between users and roles
user_role = Table(
    "user_role",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("user.id"), primary_key=True),
    Column("role_id", Integer, ForeignKey("role.id"), primary_key=True),
)

class User(Base):
    """User model for authentication and user management"""
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    username: Mapped[str] = mapped_column(String, unique=True, index=True)
    full_name: Mapped[str] = mapped_column(String)
    hashed_password: Mapped[str] = mapped_column(String)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    roles: Mapped[List["Role"]] = relationship(
        "Role", secondary=user_role, back_populates="users"
    )
    documents: Mapped[List["Document"]] = relationship(
        "Document", back_populates="owner"
    )
    collections: Mapped[List["Collection"]] = relationship(
        "Collection", back_populates="owner"
    )
    conversations: Mapped[List["Conversation"]] = relationship(
        "Conversation", back_populates="user"
    )