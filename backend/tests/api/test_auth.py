from typing import Dict

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.user import User


def test_login_access_token(client: TestClient, normal_user_token_headers: Dict[str, str]) -> None:
    """Test that the login endpoint returns a valid access token."""
    login_data = {
        "username": "user@example.com",
        "password": "password",
    }
    
    response = client.post(f"{settings.API_V1_STR}/auth/login", data=login_data)
    tokens = response.json()
    
    assert response.status_code == 200
    assert "access_token" in tokens
    assert tokens["access_token"]
    assert "token_type" in tokens
    assert tokens["token_type"] == "bearer"


def test_login_incorrect_password(client: TestClient) -> None:
    """Test that the login endpoint returns an error for incorrect password."""
    login_data = {
        "username": "user@example.com",
        "password": "wrong_password",
    }
    
    response = client.post(f"{settings.API_V1_STR}/auth/login", data=login_data)
    
    assert response.status_code == 401
    assert "Incorrect email or password" in response.json()["detail"]


def test_login_nonexistent_user(client: TestClient) -> None:
    """Test that the login endpoint returns an error for nonexistent user."""
    login_data = {
        "username": "nonexistent@example.com",
        "password": "password",
    }
    
    response = client.post(f"{settings.API_V1_STR}/auth/login", data=login_data)
    
    assert response.status_code == 401
    assert "Incorrect email or password" in response.json()["detail"]


def test_register_new_user(client: TestClient) -> None:
    """Test that a new user can be registered."""
    user_data = {
        "email": "newuser@example.com",
        "username": "newuser",
        "full_name": "New User",
        "password": "password",
    }
    
    response = client.post(f"{settings.API_V1_STR}/auth/register", json=user_data)
    new_user = response.json()
    
    assert response.status_code == 200
    assert new_user["email"] == user_data["email"]
    assert new_user["username"] == user_data["username"]
    assert new_user["full_name"] == user_data["full_name"]
    assert "id" in new_user
    assert "hashed_password" not in new_user


def test_register_existing_user(client: TestClient, db: Session) -> None:
    """Test that registration fails for an existing user."""
    # Create user
    user_data = {
        "email": "existing@example.com",
        "username": "existing",
        "full_name": "Existing User",
        "password": "password",
    }
    
    # First registration should succeed
    response = client.post(f"{settings.API_V1_STR}/auth/register", json=user_data)
    assert response.status_code == 200
    
    # Second registration with same email should fail
    response = client.post(f"{settings.API_V1_STR}/auth/register", json=user_data)
    assert response.status_code == 400
    assert "A user with this email already exists" in response.json()["detail"]


def test_get_current_user(client: TestClient, normal_user_token_headers: Dict[str, str]) -> None:
    """Test that the current user can be retrieved."""
    response = client.get(f"{settings.API_V1_STR}/auth/me", headers=normal_user_token_headers)
    current_user = response.json()
    
    assert response.status_code == 200
    assert current_user["email"] == "user@example.com"
    assert current_user["username"] == "user"
    assert current_user["full_name"] == "Normal User"
    assert "id" in current_user
    assert "hashed_password" not in current_user