import os
from unittest import mock

import pytest

from app.core.config import Settings


def test_settings_defaults():
    """Test that Settings has sensible defaults."""
    settings = Settings()
    
    # Basic settings
    assert settings.API_V1_STR == "/api/v1"
    assert settings.PROJECT_NAME == "Extensible RAG API"
    assert settings.ACCESS_TOKEN_EXPIRE_MINUTES == 60 * 24 * 8  # 8 days
    
    # Security settings
    assert settings.SECRET_KEY  # Should generate a random key if not provided
    
    # Database settings
    assert settings.POSTGRES_SERVER == "localhost"
    assert settings.POSTGRES_USER == "postgres"
    assert settings.POSTGRES_PASSWORD == "postgres"
    assert settings.POSTGRES_DB == "rag"
    
    # Elasticsearch settings
    assert settings.ELASTICSEARCH_HOST == "localhost"
    assert settings.ELASTICSEARCH_PORT == 9200
    
    # S3 settings
    assert settings.S3_BUCKET_NAME == "rag-documents"
    
    # Redis settings
    assert settings.REDIS_HOST == "localhost"
    assert settings.REDIS_PORT == 6379


def test_settings_from_environment():
    """Test that Settings loads values from environment variables."""
    with mock.patch.dict(os.environ, {
        "SECRET_KEY": "test-secret-key",
        "POSTGRES_SERVER": "test-db-server",
        "POSTGRES_USER": "test-db-user",
        "POSTGRES_PASSWORD": "test-db-password",
        "POSTGRES_DB": "test-db-name",
        "ELASTICSEARCH_HOST": "test-es-host",
        "ELASTICSEARCH_PORT": "9300",
        "S3_BUCKET_NAME": "test-bucket",
        "FIRST_SUPERUSER": "test-admin@example.com",
    }):
        settings = Settings()
        
        assert settings.SECRET_KEY == "test-secret-key"
        assert settings.POSTGRES_SERVER == "test-db-server"
        assert settings.POSTGRES_USER == "test-db-user"
        assert settings.POSTGRES_PASSWORD == "test-db-password"
        assert settings.POSTGRES_DB == "test-db-name"
        assert settings.ELASTICSEARCH_HOST == "test-es-host"
        assert settings.ELASTICSEARCH_PORT == 9300
        assert settings.S3_BUCKET_NAME == "test-bucket"
        assert settings.FIRST_SUPERUSER == "test-admin@example.com"


def test_sqlalchemy_database_uri():
    """Test that the database URI is correctly assembled."""
    # Test with default values
    settings = Settings()
    expected_uri = f"postgresql://postgres:postgres@localhost/rag"
    assert settings.SQLALCHEMY_DATABASE_URI == expected_uri
    
    # Test with custom values
    with mock.patch.dict(os.environ, {
        "POSTGRES_SERVER": "custom-server",
        "POSTGRES_USER": "custom-user",
        "POSTGRES_PASSWORD": "custom-password",
        "POSTGRES_DB": "custom-db",
    }):
        settings = Settings()
        expected_uri = f"postgresql://custom-user:custom-password@custom-server/custom-db"
        assert settings.SQLALCHEMY_DATABASE_URI == expected_uri
    
    # Test with explicit URI
    with mock.patch.dict(os.environ, {
        "SQLALCHEMY_DATABASE_URI": "postgresql://explicit:uri@example.com/db",
    }):
        settings = Settings()
        assert settings.SQLALCHEMY_DATABASE_URI == "postgresql://explicit:uri@example.com/db"


def test_cors_origins():
    """Test that CORS origins are correctly parsed."""
    # Test with empty string
    with mock.patch.dict(os.environ, {"CORS_ORIGINS": ""}):
        settings = Settings()
        assert settings.CORS_ORIGINS == []
    
    # Test with single origin
    with mock.patch.dict(os.environ, {"CORS_ORIGINS": "http://localhost:3000"}):
        settings = Settings()
        assert settings.CORS_ORIGINS == ["http://localhost:3000"]
    
    # Test with multiple origins
    with mock.patch.dict(os.environ, {
        "CORS_ORIGINS": "http://localhost:3000,https://example.com",
    }):
        settings = Settings()
        assert settings.CORS_ORIGINS == ["http://localhost:3000", "https://example.com"]