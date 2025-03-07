from typing import Dict

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.conversation import Conversation
from app.models.message import Message
from app.models.user import User


def test_chat_endpoint(
    client: TestClient, normal_user_token_headers: Dict[str, str], db: Session
) -> None:
    """Test sending a message to the chat endpoint."""
    chat_data = {
        "message": "Hello, how are you?",
        "search_options": {
            "collection_ids": [],
            "use_semantic_search": True,
            "max_results": 5,
        },
    }
    
    response = client.post(
        f"{settings.API_V1_STR}/chat/", 
        json=chat_data, 
        headers=normal_user_token_headers
    )
    
    assert response.status_code == 200
    result = response.json()
    assert "conversation_id" in result
    assert "message" in result
    assert result["message"]["role"] == "assistant"
    assert result["message"]["content"]
    
    # The conversation should have been created in the database
    conversation_id = result["conversation_id"]
    conversation = db.query(Conversation).filter(
        Conversation.id == conversation_id
    ).first()
    
    assert conversation is not None
    assert len(conversation.messages) >= 2  # User message and assistant response


def test_chat_with_existing_conversation(
    client: TestClient, normal_user_token_headers: Dict[str, str], db: Session
) -> None:
    """Test sending a message to an existing conversation."""
    # Create a conversation
    user = db.query(User).filter(User.email == "user@example.com").first()
    conversation = Conversation(
        title="Test Conversation",
        user_id=user.id,
    )
    db.add(conversation)
    db.commit()
    db.refresh(conversation)
    
    # Add a message to the conversation
    message = Message(
        conversation_id=conversation.id,
        role="user",
        content="Initial message",
    )
    db.add(message)
    db.commit()
    
    # Send a message to the existing conversation
    chat_data = {
        "conversation_id": conversation.id,
        "message": "Follow-up message",
    }
    
    response = client.post(
        f"{settings.API_V1_STR}/chat/", 
        json=chat_data, 
        headers=normal_user_token_headers
    )
    
    assert response.status_code == 200
    result = response.json()
    assert result["conversation_id"] == conversation.id
    assert result["message"]["role"] == "assistant"
    
    # The conversation should now have more messages
    db.refresh(conversation)
    assert len(conversation.messages) >= 3  # Initial + user message + assistant response


def test_get_conversations(
    client: TestClient, normal_user_token_headers: Dict[str, str], db: Session
) -> None:
    """Test getting all conversations for the current user."""
    response = client.get(
        f"{settings.API_V1_STR}/chat/conversations", 
        headers=normal_user_token_headers
    )
    
    assert response.status_code == 200
    conversations = response.json()
    assert isinstance(conversations, list)


def test_get_conversation(
    client: TestClient, normal_user_token_headers: Dict[str, str], db: Session
) -> None:
    """Test getting a specific conversation with its messages."""
    # Create a conversation
    user = db.query(User).filter(User.email == "user@example.com").first()
    conversation = Conversation(
        title="Test Get Conversation",
        user_id=user.id,
    )
    db.add(conversation)
    db.commit()
    db.refresh(conversation)
    
    # Add messages to the conversation
    message1 = Message(
        conversation_id=conversation.id,
        role="user",
        content="User message 1",
    )
    message2 = Message(
        conversation_id=conversation.id,
        role="assistant",
        content="Assistant response 1",
    )
    db.add_all([message1, message2])
    db.commit()
    
    # Get the conversation
    response = client.get(
        f"{settings.API_V1_STR}/chat/conversations/{conversation.id}", 
        headers=normal_user_token_headers
    )
    
    assert response.status_code == 200
    result = response.json()
    assert result["id"] == conversation.id
    assert result["title"] == conversation.title
    assert len(result["messages"]) == 2
    assert result["messages"][0]["role"] == "user"
    assert result["messages"][0]["content"] == "User message 1"
    assert result["messages"][1]["role"] == "assistant"
    assert result["messages"][1]["content"] == "Assistant response 1"


def test_delete_conversation(
    client: TestClient, normal_user_token_headers: Dict[str, str], db: Session
) -> None:
    """Test deleting a conversation."""
    # Create a conversation
    user = db.query(User).filter(User.email == "user@example.com").first()
    conversation = Conversation(
        title="Test Delete Conversation",
        user_id=user.id,
    )
    db.add(conversation)
    db.commit()
    db.refresh(conversation)
    
    # Delete the conversation
    response = client.delete(
        f"{settings.API_V1_STR}/chat/conversations/{conversation.id}", 
        headers=normal_user_token_headers
    )
    
    assert response.status_code == 200
    
    # Verify the conversation is deleted
    db_conversation = db.query(Conversation).filter(
        Conversation.id == conversation.id
    ).first()
    
    assert db_conversation is None