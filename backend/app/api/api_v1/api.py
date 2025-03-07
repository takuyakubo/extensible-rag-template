from fastapi import APIRouter

from app.api.api_v1.endpoints import auth, users, documents, collections, chat

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(documents.router, prefix="/documents", tags=["documents"])
api_router.include_router(collections.router, prefix="/collections", tags=["collections"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])