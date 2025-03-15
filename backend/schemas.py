# File: schemas.py
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from uuid import UUID

class ChatMessageBase(BaseModel):
    content: str

class User(BaseModel):
    user_id: str

class ChatMessageCreate(ChatMessageBase):
    content: str
    agents: Optional[str] = None
    user_id: Optional[str] = None

class ChatMessageResponse(ChatMessageBase):
    id: UUID
    response: str
    timestamp: datetime
    user_id: str
    
    class Config:
        orm_mode = True

class FileBase(BaseModel):
    filename: str

class FileCreate(FileBase):
    pass

class FileResponse(FileBase):
    id: UUID
    size: int
    upload_date: datetime
    user_id: str
    blob_url: str
    
    class Config:
        orm_mode = True

class UserBase(BaseModel):
    username: str
    email: str

class UserResponse(UserBase):
    id: str
    created_at: datetime
    
    class Config:
        orm_mode = True
from autogen_core import CancellationToken
class AutoGenMessage(BaseModel):
    time: str
    type: Optional[str] = None
    source:  Optional[str] = None
    content:  Optional[str] = None
    stop_reason:  Optional[str] = None
    models_usage:  Optional[str] = None
    content_image:  Optional[str] = None
    session_id:  Optional[str] = None
    session_user:  Optional[str] = None
    # cancellation_token: Optional[CancellationToken] = None

    def to_json(self):
        return {
            "time" : self.time,
            "type" : self.type,
            "source": self.source,
            "content": self.content,
            "stop_reason": self.stop_reason,
            "models_usage": self.models_usage,
            "content_image": self.content_image,
            "session_id": self.session_id,
            "session_user": self.session_user
        }
    
