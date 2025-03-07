# Extensible RAG Backend

This is the Python backend for the Extensible RAG template system. It provides a FastAPI-based API for document management, search, and RAG-powered chat.

## Features

- User authentication and management
- Document upload and processing
- Collection management
- Vector search using Elasticsearch
- Integration with multiple LLM providers
- RAG-powered chat interface
- Extensible plugin architecture

## Setup

### Prerequisites

- Python 3.11+
- PostgreSQL
- Elasticsearch
- Redis

### Installation

1. Clone the repository
2. Install dependencies:

```bash
cd backend
pip install -r requirements.txt
```

3. Set up environment variables:

Create a `.env` file with the following variables:

```
POSTGRES_SERVER=localhost
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=rag
ELASTICSEARCH_HOST=localhost
ELASTICSEARCH_PORT=9200
REDIS_HOST=localhost
REDIS_PORT=6379
SECRET_KEY=your-secret-key
FIRST_SUPERUSER=admin@example.com
FIRST_SUPERUSER_PASSWORD=password
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key
```

### Running the Application

#### Development

```bash
uvicorn app.main:app --reload
```

#### Production

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Docker

You can run the entire stack using Docker Compose:

```bash
docker-compose up -d
```

## API Documentation

Once the application is running, you can access the API documentation at:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Project Structure

- `app/`: Main application package
  - `api/`: API endpoints
  - `core/`: Core functionality and configuration
  - `crud/`: Database CRUD operations
  - `db/`: Database setup and session management
  - `models/`: SQLAlchemy models
  - `schemas/`: Pydantic schemas
  - `services/`: Business logic services
  - `utils/`: Utility functions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.