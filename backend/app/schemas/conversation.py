from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel

# Message schemas
class MessageBase(BaseModel):
    role: str  # user, assistant, system
    content: str

class MessageCreate(MessageBase):
    pass

class Message(MessageBase):
    id: int
    conversation_id: int
    created_at: datetime
    metadata: Optional[Dict[str, Any]] = None
    
    class Config:
        from_attributes = True

# Conversation schemas
class ConversationBase(BaseModel):
    title: str

class ConversationCreate(ConversationBase):
    pass

class ConversationUpdate(ConversationBase):
    title: Optional[str] = None

class Conversation(ConversationBase):
    id: int
    created_at: datetime
    updated_at: datetime
    user_id: int
    messages: List[Message] = []
    
    class Config:
        from_attributes = True

# Chat request/response schemas
class ChatRequest(BaseModel):
    conversation_id: Optional[int] = None
    message: str
    search_options: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    conversation_id: int
    message: Message
    chunks: Optional[List[Dict[str, Any]]] = None