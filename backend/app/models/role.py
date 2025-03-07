from typing import List

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Table
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base_class import Base

# Many-to-many relationship table between roles and permissions
role_permission = Table(
    "role_permission",
    Base.metadata,
    Column("role_id", Integer, ForeignKey("role.id"), primary_key=True),
    Column("permission_id", Integer, ForeignKey("permission.id"), primary_key=True),
)

class Permission(Base):
    """Permission model for defining access rights"""
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, unique=True, index=True)
    description: Mapped[str] = mapped_column(String)
    resource: Mapped[str] = mapped_column(String)  # The resource this permission applies to
    action: Mapped[str] = mapped_column(String)    # The action this permission allows
    
    # Relationships
    roles: Mapped[List["Role"]] = relationship(
        "Role", secondary=role_permission, back_populates="permissions"
    )

class Role(Base):
    """Role model for role-based access control"""
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, unique=True, index=True)
    description: Mapped[str] = mapped_column(String)
    
    # Relationships
    users: Mapped[List["User"]] = relationship(
        "User", secondary="user_role", back_populates="roles"
    )
    permissions: Mapped[List[Permission]] = relationship(
        Permission, secondary=role_permission, back_populates="roles"
    )