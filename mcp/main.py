from fastapi import FastAPI, Request, Depends
from mcp.server.sse import SseServerTransport
from starlette.routing import Mount
# from weather import mcp
from mcp_general_server import mcp
from api_key_auth import ensure_valid_api_key
import uvicorn
import logging
logging.basicConfig(level=logging.INFO)

import os
from dotenv import load_dotenv
# Load environment variables from .env file
load_dotenv(override=True)

app = FastAPI(docs_url=None, redoc_url=None, dependencies=[Depends(ensure_valid_api_key)])
# app = FastAPI(docs_url=None, redoc_url=None)

sse = SseServerTransport("/messages/")
app.router.routes.append(Mount("/messages", app=sse.handle_post_message))

@app.get("/sse", tags=["MCP"])
async def handle_sse(request: Request):
    
    async with sse.connect_sse(request.scope, request.receive, request._send) as (
        read_stream,
        write_stream,
    ):
        init_options = mcp._mcp_server.create_initialization_options()

        await mcp._mcp_server.run(
            read_stream,
            write_stream,
            init_options,
        )


        if __name__ == "__main__":

            uvicorn.run(app, host="0.0.0.0", port=8333, log_level="info")