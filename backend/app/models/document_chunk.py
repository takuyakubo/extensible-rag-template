from typing import List, Optional

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base_class import Base

class DocumentChunk(Base):
    """Model for storing document chunks used for vector search"""
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    document_id: Mapped[int] = mapped_column(Integer, ForeignKey("document.id"))
    content: Mapped[str] = mapped_column(Text)
    chunk_index: Mapped[int] = mapped_column(Integer)
    metadata: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    vector_id: Mapped[Optional[str]] = mapped_column(String, nullable=True)  # ID in the vector store
    
    # Relationships
    document: Mapped["Document"] = relationship("Document", back_populates="chunks")
    message_references: Mapped[List["MessageChunkReference"]] = relationship("MessageChunkReference", back_populates="chunk")

class MessageChunkReference(Base):
    """Model for tracking which chunks are referenced in message responses"""
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    message_id: Mapped[int] = mapped_column(Integer, ForeignKey("message.id"))
    chunk_id: Mapped[int] = mapped_column(Integer, ForeignKey("documentchunk.id"))
    relevance_score: Mapped[float] = mapped_column(Integer)
    
    # Relationships
    message: Mapped["Message"] = relationship("Message", back_populates="chunk_references")
    chunk: Mapped[DocumentChunk] = relationship(DocumentChunk, back_populates="message_references")