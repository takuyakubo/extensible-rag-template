from typing import Dict

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.user import User


def test_get_users(
    client: TestClient, superuser_token_headers: Dict[str, str], db: Session
) -> None:
    """Test get users endpoint as superuser."""
    response = client.get(f"{settings.API_V1_STR}/users/", headers=superuser_token_headers)
    users = response.json()
    
    assert response.status_code == 200
    assert len(users) >= 2  # At least superuser and normal user
    assert all(isinstance(user.get("id"), int) for user in users)
    assert all(isinstance(user.get("email"), str) for user in users)
    assert all("hashed_password" not in user for user in users)


def test_get_users_as_normal_user(
    client: TestClient, normal_user_token_headers: Dict[str, str]
) -> None:
    """Test that normal users cannot access user list."""
    response = client.get(f"{settings.API_V1_STR}/users/", headers=normal_user_token_headers)
    
    assert response.status_code == 403
    assert "Not enough permissions" in response.json().get("detail", "")


def test_get_user(
    client: TestClient, superuser_token_headers: Dict[str, str], db: Session
) -> None:
    """Test get specific user endpoint."""
    # Get a user to test with (admin user)
    admin_user = db.query(User).filter(User.email == settings.FIRST_SUPERUSER).first()
    
    response = client.get(
        f"{settings.API_V1_STR}/users/{admin_user.id}", headers=superuser_token_headers
    )
    user = response.json()
    
    assert response.status_code == 200
    assert user["email"] == settings.FIRST_SUPERUSER
    assert user["id"] == admin_user.id
    assert "hashed_password" not in user


def test_create_user(
    client: TestClient, superuser_token_headers: Dict[str, str]
) -> None:
    """Test creating a new user as superuser."""
    user_data = {
        "email": "test-create@example.com",
        "username": "test-create",
        "full_name": "Test Create",
        "password": "password",
    }
    
    response = client.post(
        f"{settings.API_V1_STR}/users/", json=user_data, headers=superuser_token_headers
    )
    new_user = response.json()
    
    assert response.status_code == 201
    assert new_user["email"] == user_data["email"]
    assert new_user["username"] == user_data["username"]
    assert new_user["full_name"] == user_data["full_name"]
    assert "id" in new_user
    assert "hashed_password" not in new_user


def test_create_user_existing_email(
    client: TestClient, superuser_token_headers: Dict[str, str]
) -> None:
    """Test that creating a user with an existing email fails."""
    user_data = {
        "email": settings.FIRST_SUPERUSER,  # Using existing superuser email
        "username": "test-duplicate",
        "full_name": "Test Duplicate",
        "password": "password",
    }
    
    response = client.post(
        f"{settings.API_V1_STR}/users/", json=user_data, headers=superuser_token_headers
    )
    
    assert response.status_code == 400
    assert "Email already registered" in response.json().get("detail", "")


def test_update_user(
    client: TestClient, superuser_token_headers: Dict[str, str], db: Session
) -> None:
    """Test updating a user."""
    # Create a user to update
    user_data = {
        "email": "test-update@example.com",
        "username": "test-update",
        "full_name": "Test Update",
        "password": "password",
    }
    
    create_response = client.post(
        f"{settings.API_V1_STR}/users/", json=user_data, headers=superuser_token_headers
    )
    created_user = create_response.json()
    
    # Update the user
    update_data = {
        "full_name": "Updated Name",
    }
    
    update_response = client.put(
        f"{settings.API_V1_STR}/users/{created_user['id']}",
        json=update_data,
        headers=superuser_token_headers,
    )
    updated_user = update_response.json()
    
    assert update_response.status_code == 200
    assert updated_user["id"] == created_user["id"]
    assert updated_user["email"] == created_user["email"]
    assert updated_user["full_name"] == update_data["full_name"]


def test_delete_user(
    client: TestClient, superuser_token_headers: Dict[str, str], db: Session
) -> None:
    """Test deleting a user."""
    # Create a user to delete
    user_data = {
        "email": "test-delete@example.com",
        "username": "test-delete",
        "full_name": "Test Delete",
        "password": "password",
    }
    
    create_response = client.post(
        f"{settings.API_V1_STR}/users/", json=user_data, headers=superuser_token_headers
    )
    created_user = create_response.json()
    
    # Delete the user
    delete_response = client.delete(
        f"{settings.API_V1_STR}/users/{created_user['id']}", headers=superuser_token_headers
    )
    
    assert delete_response.status_code == 200
    
    # Verify that the user is deleted
    get_response = client.get(
        f"{settings.API_V1_STR}/users/{created_user['id']}", headers=superuser_token_headers
    )
    
    assert get_response.status_code == 404