# Development Commands and Guidelines

## Project Structure
- **Frontend**: Next.js/React app with TypeScript in `/frontend`
- **Backend**: Python FastAPI app in `/backend`
- **Docs**: Architecture documentation in `/documents`

## Project-wide Commands
- Full stack: `docker-compose up --build` (start all services)
- Background: `docker-compose up -d` (detached mode)
- Stop services: `docker-compose down`
- Git: `git add . && git commit -m "message"` (commit changes)

## Frontend Commands
- Development: `cd frontend && npm run dev` (Next.js dev server)
- Build: `cd frontend && npm run build` (production build)
- Lint: `cd frontend && npm run lint` (ESLint)
- Test: `cd frontend && npm test` (all Jest tests)
- Test single: `cd frontend && npm test -- -t "test name"` or `npm test -- path/to/file.test.tsx`

## Backend Commands
- Development: `cd backend && uvicorn app.main:app --reload` (FastAPI dev server)
- API docs: Browse to `http://localhost:8000/docs` when server is running
- Test: `cd backend && pytest` (all pytest tests)
- Test single: `cd backend && pytest tests/path/to/test_file.py::test_function_name`
- Test coverage: `cd backend && pytest --cov=app tests/`

## Code Style Guidelines
### Frontend
- **TypeScript**: Strict typing, interfaces in lib/types.ts
- **React**: Functional components with hooks, 'use client' directive for client components
- **Naming**: PascalCase for components, camelCase for variables/functions
- **CSS**: TailwindCSS for styling with utility classes
- **Error Handling**: Try/catch with appropriate error states in components

### Backend
- **Python**: Follow PEP 8, use type hints throughout
- **Imports**: Group and sort (stdlib, third-party, local)
- **Models**: SQLAlchemy models in models/, Pydantic schemas in schemas/
- **API Structure**: Endpoints in api/v1/endpoints/ organized by resource
- **Error Handling**: Use HTTPException with appropriate status codes
- **Testing**: Pytest with fixtures in conftest.py

## Architecture
- Microservices-based with Docker containers
- PostgreSQL for relational data
- Elasticsearch for vector search
- Redis for caching and message queue
- S3-compatible storage for documents