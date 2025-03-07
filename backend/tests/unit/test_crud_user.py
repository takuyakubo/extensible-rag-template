import pytest
from sqlalchemy.orm import Session

from app import crud
from app.core.security import verify_password
from app.schemas.user import UserCreate, UserUpdate
from app.models.user import User


def test_create_user(db: Session):
    """Test creating a user."""
    email = "test@example.com"
    username = "testuser"
    password = "password"
    full_name = "Test User"
    
    user_in = UserCreate(
        email=email,
        username=username,
        password=password,
        full_name=full_name,
    )
    
    user = crud.user.create(db, obj_in=user_in)
    
    assert user.email == email
    assert user.username == username
    assert user.full_name == full_name
    assert hasattr(user, "hashed_password")
    assert user.hashed_password != password
    assert verify_password(password, user.hashed_password)


def test_authenticate_user(db: Session):
    """Test authenticating a user."""
    email = "auth-test@example.com"
    password = "password"
    
    user_in = UserCreate(
        email=email,
        username="authtest",
        password=password,
        full_name="Auth Test User",
    )
    
    user = crud.user.create(db, obj_in=user_in)
    
    # Test successful authentication
    authenticated_user = crud.user.authenticate(db, email=email, password=password)
    assert authenticated_user
    assert authenticated_user.id == user.id
    
    # Test authentication with wrong password
    wrong_password_auth = crud.user.authenticate(db, email=email, password="wrongpassword")
    assert wrong_password_auth is None
    
    # Test authentication with wrong email
    wrong_email_auth = crud.user.authenticate(db, email="wrong@example.com", password=password)
    assert wrong_email_auth is None


def test_get_user(db: Session):
    """Test getting a user by ID."""
    email = "get-test@example.com"
    password = "password"
    
    user_in = UserCreate(
        email=email,
        username="gettest",
        password=password,
        full_name="Get Test User",
    )
    
    created_user = crud.user.create(db, obj_in=user_in)
    
    # Get the user by ID
    user = crud.user.get(db, id=created_user.id)
    assert user
    assert user.id == created_user.id
    assert user.email == email
    assert user.username == "gettest"
    
    # Try to get a non-existent user
    non_existent_user = crud.user.get(db, id=9999)
    assert non_existent_user is None


def test_update_user(db: Session):
    """Test updating a user."""
    email = "update-test@example.com"
    password = "password"
    
    user_in = UserCreate(
        email=email,
        username="updatetest",
        password=password,
        full_name="Update Test User",
    )
    
    user = crud.user.create(db, obj_in=user_in)
    
    # Update the user's full_name
    new_full_name = "Updated User Name"
    user_update = UserUpdate(full_name=new_full_name)
    updated_user = crud.user.update(db, db_obj=user, obj_in=user_update)
    
    assert updated_user.id == user.id
    assert updated_user.full_name == new_full_name
    assert updated_user.email == email
    
    # Update the user's password
    new_password = "newpassword"
    user_update = UserUpdate(password=new_password)
    updated_user = crud.user.update(db, db_obj=user, obj_in=user_update)
    
    assert updated_user.id == user.id
    assert verify_password(new_password, updated_user.hashed_password)
    assert not verify_password(password, updated_user.hashed_password)