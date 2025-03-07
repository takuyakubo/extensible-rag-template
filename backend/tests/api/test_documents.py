import io
from typing import Dict

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.document import Document
from app.models.user import User


def test_get_documents(
    client: TestClient, normal_user_token_headers: Dict[str, str], db: Session
) -> None:
    """Test getting all documents for the current user."""
    response = client.get(
        f"{settings.API_V1_STR}/documents/", headers=normal_user_token_headers
    )
    documents = response.json()
    
    assert response.status_code == 200
    assert isinstance(documents, list)


def test_upload_document(
    client: TestClient, normal_user_token_headers: Dict[str, str], db: Session
) -> None:
    """Test uploading a new document."""
    # Create document form data
    form_data = {
        "title": "Test Document",
        "description": "A test document",
    }
    
    # Create a small PDF file for testing
    file_content = b"%PDF-1.7\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 100 >>\nstream\nBT\n/F1 12 Tf\n100 700 Td\n(Test PDF Document) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000010 00000 n\n0000000060 00000 n\n0000000120 00000 n\n0000000210 00000 n\ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n360\n%%EOF"
    file = io.BytesIO(file_content)
    
    files = {
        "file": ("test.pdf", file, "application/pdf")
    }
    
    response = client.post(
        f"{settings.API_V1_STR}/documents/upload",
        data=form_data,
        files=files,
        headers=normal_user_token_headers,
    )
    
    assert response.status_code == 201
    document = response.json()
    assert document["title"] == form_data["title"]
    assert document["description"] == form_data["description"]
    assert document["file_type"] == "pdf"
    assert document["status"] == "pending"
    assert "id" in document


def test_get_document(
    client: TestClient, normal_user_token_headers: Dict[str, str], db: Session
) -> None:
    """Test getting a specific document."""
    # Create a document in the database first
    user = db.query(User).filter(User.email == "user@example.com").first()
    
    document = Document(
        title="Test Get Document",
        description="A test document for getting",
        file_name="test_get.pdf",
        file_type="pdf",
        file_size=1024,
        s3_path="test/test_get.pdf",
        owner_id=user.id,
        status="indexed",
    )
    
    db.add(document)
    db.commit()
    db.refresh(document)
    
    # Get the document
    response = client.get(
        f"{settings.API_V1_STR}/documents/{document.id}",
        headers=normal_user_token_headers,
    )
    
    assert response.status_code == 200
    retrieved_document = response.json()
    assert retrieved_document["id"] == document.id
    assert retrieved_document["title"] == document.title
    assert retrieved_document["status"] == document.status


def test_update_document(
    client: TestClient, normal_user_token_headers: Dict[str, str], db: Session
) -> None:
    """Test updating a document."""
    # Create a document in the database first
    user = db.query(User).filter(User.email == "user@example.com").first()
    
    document = Document(
        title="Test Update Document",
        description="A test document for updating",
        file_name="test_update.pdf",
        file_type="pdf",
        file_size=1024,
        s3_path="test/test_update.pdf",
        owner_id=user.id,
        status="indexed",
    )
    
    db.add(document)
    db.commit()
    db.refresh(document)
    
    # Update the document
    update_data = {
        "title": "Updated Document Title",
        "description": "Updated document description",
    }
    
    response = client.put(
        f"{settings.API_V1_STR}/documents/{document.id}",
        json=update_data,
        headers=normal_user_token_headers,
    )
    
    assert response.status_code == 200
    updated_document = response.json()
    assert updated_document["id"] == document.id
    assert updated_document["title"] == update_data["title"]
    assert updated_document["description"] == update_data["description"]


def test_delete_document(
    client: TestClient, normal_user_token_headers: Dict[str, str], db: Session
) -> None:
    """Test deleting a document."""
    # Create a document in the database first
    user = db.query(User).filter(User.email == "user@example.com").first()
    
    document = Document(
        title="Test Delete Document",
        description="A test document for deleting",
        file_name="test_delete.pdf",
        file_type="pdf",
        file_size=1024,
        s3_path="test/test_delete.pdf",
        owner_id=user.id,
        status="indexed",
    )
    
    db.add(document)
    db.commit()
    db.refresh(document)
    
    # Delete the document
    response = client.delete(
        f"{settings.API_V1_STR}/documents/{document.id}",
        headers=normal_user_token_headers,
    )
    
    assert response.status_code == 200
    
    # Verify the document is deleted
    get_response = client.get(
        f"{settings.API_V1_STR}/documents/{document.id}",
        headers=normal_user_token_headers,
    )
    
    assert get_response.status_code == 404