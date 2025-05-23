from fastapi import Security, HTTPException, status
from fastapi.security import APIKeyHeader
import os

api_key_header = APIKeyHeader(name="x-api-key")

def ensure_valid_api_key(api_key_header: str = Security(api_key_header)):
    def check_api_key(key: str) -> bool:
        valid_keys = os.environ.get("MCP_SERVER_API_KEY", "").split(",")
        return key in valid_keys and key != ""

    if not check_api_key(api_key_header):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid API key",
        )
