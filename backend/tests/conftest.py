import os
from typing import Dict, Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings
from app.db.base import Base
from app.db.session import get_db
from app.main import app
from app.models.user import User
from app.core.security import get_password_hash, create_access_token


# Use an in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="session")
def db_engine():
    """Create a new database engine for tests."""
    Base.metadata.create_all(bind=engine)
    yield engine
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def db(db_engine) -> Generator:
    """Create a new database session for a test."""
    connection = db_engine.connect()
    transaction = connection.begin()
    
    db = TestingSessionLocal(bind=connection)
    
    try:
        yield db
    finally:
        db.close()
        transaction.rollback()
        connection.close()


@pytest.fixture(scope="function")
def client(db) -> Generator:
    """Create a new FastAPI TestClient that uses the db fixture."""
    def _get_test_db():
        try:
            yield db
        finally:
            pass
    
    app.dependency_overrides[get_db] = _get_test_db
    with TestClient(app) as c:
        yield c


@pytest.fixture(scope="function")
def superuser_token_headers(client: TestClient, db: Session) -> Dict[str, str]:
    """Return authorization headers for a superuser."""
    # Create a superuser in the database
    superuser = db.query(User).filter(User.email == settings.FIRST_SUPERUSER).first()
    if not superuser:
        superuser = User(
            email=settings.FIRST_SUPERUSER,
            username="admin",
            full_name="Administrator",
            hashed_password=get_password_hash(settings.FIRST_SUPERUSER_PASSWORD),
            is_active=True,
        )
        db.add(superuser)
        db.commit()
        db.refresh(superuser)
    
    # Create access token for the superuser
    access_token = create_access_token(superuser.id)
    return {"Authorization": f"Bearer {access_token}"}


@pytest.fixture(scope="function")
def normal_user_token_headers(client: TestClient, db: Session) -> Dict[str, str]:
    """Return authorization headers for a normal user."""
    # Create a normal user in the database
    email = "user@example.com"
    password = "password"
    
    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(
            email=email,
            username="user",
            full_name="Normal User",
            hashed_password=get_password_hash(password),
            is_active=True,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    
    # Create access token for the normal user
    access_token = create_access_token(user.id)
    return {"Authorization": f"Bearer {access_token}"}