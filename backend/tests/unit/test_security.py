import time
from datetime import datetime, timedelta

from jose import jwt
import pytest

from app.core.config import settings
from app.core.security import create_access_token, verify_password, get_password_hash


def test_create_access_token():
    """Test that an access token can be created."""
    # Create a token for a user with ID 1
    token = create_access_token(subject=1)
    
    # Decode the token
    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
    
    # Verify the token has the correct subject
    assert payload["sub"] == "1"
    
    # Verify the token has an expiration time
    assert "exp" in payload
    exp_time = datetime.fromtimestamp(payload["exp"])
    now = datetime.utcnow()
    # The expiration time should be in the future
    assert exp_time > now


def test_create_access_token_with_expires_delta():
    """Test that an access token can be created with a custom expires_delta."""
    # Create a token for a user with ID 1 with a custom expiration
    expires_delta = timedelta(minutes=30)
    token = create_access_token(subject=1, expires_delta=expires_delta)
    
    # Decode the token
    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
    
    # Verify the token has the correct subject
    assert payload["sub"] == "1"
    
    # Verify the token has an expiration time
    assert "exp" in payload
    exp_time = datetime.fromtimestamp(payload["exp"])
    now = datetime.utcnow()
    # The expiration time should be approximately 30 minutes in the future
    # Allow for a small difference due to processing time
    assert timedelta(0) < (exp_time - now) < timedelta(minutes=31)


def test_password_hashing():
    """Test that passwords can be hashed and verified."""
    # Hash a password
    password = "testpassword"
    hashed_password = get_password_hash(password)
    
    # Verify the hashed password is different from the original
    assert password != hashed_password
    
    # Verify the password matches the hash
    assert verify_password(password, hashed_password)
    
    # Verify a different password does not match the hash
    assert not verify_password("wrongpassword", hashed_password)