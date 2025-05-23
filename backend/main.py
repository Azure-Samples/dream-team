# File: main.py
from fastapi import FastAPI, Depends, UploadFile, HTTPException, Query, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2AuthorizationCodeBearer
from azure.identity import DefaultAzureCredential, get_bearer_token_provider
from azure.storage.blob import BlobServiceClient
# from sqlalchemy.orm import Session
import schemas, crud
from database import CosmosDB
import os
import uuid
from contextlib import asynccontextmanager
from fastapi.responses import StreamingResponse, Response
import json, asyncio
from magentic_one_helper import MagenticOneHelper
from autogen_agentchat.messages import MultiModalMessage, TextMessage, ToolCallExecutionEvent, ToolCallRequestEvent, SelectSpeakerEvent, ToolCallSummaryMessage
from autogen_agentchat.base import TaskResult
from magentic_one_helper import generate_session_name
import aisearch
import logging

from datetime import datetime 
from schemas import AutoGenMessage
from typing import List
import time

print("Starting the server...")
#print(f'AZURE_OPENAI_ENDPOINT:{os.getenv("AZURE_OPENAI_ENDPOINT")}')
#print(f'COSMOS_DB_URI:{os.getenv("COSMOS_DB_URI")}')
#print(f'AZURE_SEARCH_SERVICE_ENDPOINT:{os.getenv("AZURE_SEARCH_SERVICE_ENDPOINT")}')

session_data = {}
MAGENTIC_ONE_DEFAULT_AGENTS = [
            {
            "input_key":"0001",
            "type":"MagenticOne",
            "name":"Coder",
            "system_message":"",
            "description":"",
            "icon":"👨‍💻"
            },
            {
            "input_key":"0002",
            "type":"MagenticOne",
            "name":"Executor",
            "system_message":"",
            "description":"",
            "icon":"💻"
            },
            {
            "input_key":"0003",
            "type":"MagenticOne",
            "name":"FileSurfer",
            "system_message":"",
            "description":"",
            "icon":"📂"
            },
            {
            "input_key":"0004",
            "type":"MagenticOne",
            "name":"WebSurfer",
            "system_message":"",
            "description":"",
            "icon":"🏄‍♂️"
            },
            ]

# Lifespan handler for startup/shutdown events
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup code: initialize database and configure logging
    # app.state.db = None
    app.state.db = CosmosDB()
    logging.basicConfig(level=logging.WARNING,
                        format='%(levelname)s: %(asctime)s - %(message)s')
    print("Database initialized.")
    yield
    # Shutdown code (optional)
    # Cleanup database connection
    app.state.db = None

app = FastAPI(lifespan=lifespan)

# Allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Azure AD Authentication (Mocked for example)
oauth2_scheme = OAuth2AuthorizationCodeBearer(
    authorizationUrl="https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
    tokenUrl="https://login.microsoftonline.com/common/oauth2/v2.0/token"
)

async def validate_tokenx(token: str = Depends(oauth2_scheme)):
    # In production, implement proper token validation
    print("Token:", token)
    return {"sub": "user123", "name": "Test User"}  # Mocked user data

async def validate_token(token: str = None):
    # In production, implement proper token validation
    print("Token:", token)
    return {"sub": "user123", "name": "Test User"}  # Mocked user data

from openai import AsyncAzureOpenAI

# Azure OpenAI Client
async def get_openai_client():
    azure_credential = DefaultAzureCredential()
    token_provider = get_bearer_token_provider(
        azure_credential, "https://cognitiveservices.azure.com/.default"
    )
    
    return AsyncAzureOpenAI(
        api_version="2024-12-01-preview",
        # azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
        # azure_endpoint="https://aoai-eastus-mma-cdn.openai.azure.com/",
        azure_ad_token_provider=token_provider
    )


def write_log(path, log_entry):
    # check if the file exists if not create it
    if not os.path.exists(path):
        with open(path, "w") as f:
            f.write("")
    # append the log entry to a file
    with open(path, "a") as f:
        try:
            f.write(f"{json.dumps(log_entry)}\n")
        except Exception as e:
            # TODO: better handling of the error
            log_entry["content"] = f"Error writing log entry: {str(e)}"
            f.write(f"{json.dumps(log_entry)}\n")



def get_current_time():
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")
def get_agent_icon(agent_name) -> str:
    if agent_name == "MagenticOneOrchestrator":
        agent_icon = "🎻"
    elif agent_name == "WebSurfer":
        agent_icon = "🏄‍♂️"
    elif agent_name == "Coder":
        agent_icon = "👨‍💻"
    elif agent_name == "FileSurfer":
        agent_icon = "📂"
    elif agent_name == "Executor":
        agent_icon = "💻"
    elif agent_name == "user":
        agent_icon = "👤"
    else:
        agent_icon = "🤖"
    return agent_icon

async def summarize_plan(plan, client):
    prompt = "You are a project manager."
    text = f"""Summarize the plan for each agent into single-level only bullet points.

    Plan:
    {plan}
    """
    
    from autogen_core.models import UserMessage, SystemMessage
    messages = [
        UserMessage(content=text, source="user"),
        SystemMessage(content=prompt)
    ]
    result = await client.create(messages)
    # print(result.content)
    
    plan_summary = result.content
    return plan_summary
async def display_log_message(log_entry, logs_dir, session_id, user_id, conversation=None):
    _log_entry_json = log_entry
    _user_id = user_id
    
    _response = AutoGenMessage(
        time=get_current_time(),
        session_id=session_id,
        session_user=_user_id
        )

    # Check if the message is a TaskResult class
    if isinstance(_log_entry_json, TaskResult):
        _response.type = "TaskResult"
        _response.source = "TaskResult"
        _response.content = _log_entry_json.messages[-1].content
        _response.stop_reason = _log_entry_json.stop_reason
        app.state.db.store_conversation(_log_entry_json, _response, conversation)

    elif isinstance(_log_entry_json, MultiModalMessage):
        _response.type = _log_entry_json.type
        _response.source = _log_entry_json.source
        _response.content = _log_entry_json.content[0] # text wthout image
        _response.content_image = _log_entry_json.content[1].data_uri # TODO: base64 encoded image -> text / serialize

    elif isinstance(_log_entry_json, TextMessage):
        _response.type = _log_entry_json.type
        _response.source = _log_entry_json.source
        _response.content = _log_entry_json.content
        # Custom logic for Executor with base64 image
        if _log_entry_json.source == "Executor":
            import ast
            import re
            content = _log_entry_json.content
            try:
                if isinstance(content, str) and "'type': 'image'" in content and "'base64_data':" in content:
                    pattern = r"\{[^{}]*'type': 'image'[^{}]*'base64_data':[^{}]*\}"
                    match = re.search(pattern, content)
                    if match:
                        img_dict_str = match.group(0)
                        img_dict = ast.literal_eval(img_dict_str)
                        if (
                            isinstance(img_dict, dict)
                            and img_dict.get('type') == 'image'
                            and img_dict.get('format') == 'png'
                            and 'base64_data' in img_dict
                        ):
                            _response.content_image = f"data:image/png;base64,{img_dict['base64_data']}"
                            # Remove the dict substring from the content
                            cleaned_content = content.replace(img_dict_str, "").strip()
                            _response.content = cleaned_content
            except Exception:
                pass

    elif isinstance(_log_entry_json, ToolCallExecutionEvent):
        _response.type = _log_entry_json.type
        _response.source = _log_entry_json.source
        _response.content = _log_entry_json.content[0].content # tool execution

    elif isinstance(_log_entry_json, ToolCallRequestEvent):
        # _models_usage = _log_entry_json.models_usage
        _response.type = _log_entry_json.type
        _response.source = _log_entry_json.source
        _response.content = _log_entry_json.content[0].arguments # tool execution

    elif isinstance(_log_entry_json, SelectSpeakerEvent):
        _response.type = _log_entry_json.type
        _response.source = _log_entry_json.source
        _response.content = _log_entry_json.content[0]

    elif isinstance(_log_entry_json, ToolCallSummaryMessage):
        _response.type = _log_entry_json.type
        _response.source = _log_entry_json.source
        _response.content = _log_entry_json.content
    else:
        _response.type = "N/A"
        _response.source = "N/A"
        _response.content = "Agents mumbling."

    _ = crud.save_message(
            id=None, # it is auto-generated
            user_id=_user_id,
            session_id=session_id,
            message=_response.to_json(),
            agents=None,
            run_mode_locally=None,
            timestamp=_response.time
        )

    return _response



# Azure Services Setup (Mocked for example)
blob_service_client = BlobServiceClient.from_connection_string(
    "DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;" + \
    "AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;" + \
    "BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;"
)

# Chat Endpoint
@app.post("/chat")
async def chat_endpoint(
    message: schemas.ChatMessageCreate,
    user: dict = Depends(validate_token)
):
    # ...existing code...
    mock_response = "This is a mock AI response (Markdown formatted)."
    # Log the user message.
    crud.save_message(
        user_id=user["sub"],
        session_id="session_direct",  # or generate a session id if needed
        message={"content": message.content, "role": "user"}
    )
    # Log the AI response message.
    response = {
        "time": get_current_time(),
        "type": "Muj",
        "source": "MagenticOneOrchestrator",
        "content": mock_response,
        "stop_reason": None,
        "models_usage": None,
        "content_image": None,
    }
    crud.save_message(
        user_id=user["sub"],
        session_id="session_direct",
        message=response
    )

    return Response(content=json.dumps(response), media_type="application/json")


# Chat Endpoint
@app.post("/start", response_model=schemas.ChatMessageResponse)
async def chat_endpoint(
    message: schemas.ChatMessageCreate,
    user: dict = Depends(validate_token)
):
    logger = logging.getLogger("chat_endpoint")
    logger.setLevel(logging.INFO)
    logger.info(f"Starting agent session with message: {message.content}")
    # print("User:", user["sub"])
    _user_id=message.user_id if message.user_id else user["sub"]
    # print("Provided user_id:", message.user_id)
    logger.info(f"User ID: {_user_id}")
    _agents = json.loads(message.agents) if message.agents else MAGENTIC_ONE_DEFAULT_AGENTS
    _session_id = generate_session_name()
    conversation = crud.save_message(
        id=uuid.uuid4(),
        user_id=_user_id,
        session_id=_session_id,
        message={"content": message.content, "role": "user"},
        agents=_agents,
        run_mode_locally=False,
        timestamp=get_current_time()
    )

    logger.info(f"Conversation saved with session_id: {_session_id} and user_id: {_user_id}")
    # Return session_id as the conversation identifier
    db_message = schemas.ChatMessageResponse(
        id=uuid.uuid4(),
        content=message.content,
        response=_session_id,
        timestamp="2021-01-01T00:00:00",
        user_id=_user_id,
        orm_mode=True
    )
    return db_message


# Streaming Chat Endpoint
@app.get("/chat-stream")
async def chat_stream(
    session_id: str = Query(...),
    user_id: str = Query(...),
    # db: Session = Depends(get_db),
    user: dict = Depends(validate_token)
):
    
   
    logger = logging.getLogger("chat_stream")
    logger.setLevel(logging.WARNING)
    logger.info(f"Chat stream started for session_id: {session_id} and user_id: {user_id}")
    # create folder for logs if not exists
    logs_dir="./logs"
    if not os.path.exists(logs_dir):    
        os.makedirs(logs_dir)

    # get the conversation from the database using user and session id
    conversation = crud.get_conversation(user_id, session_id)
    logger.info(f"Conversation retrieved: {conversation}")
    # get first message from the conversation
    first_message = conversation["messages"][0]
    # get the task from the first message as content
    task = first_message["content"]
    print("Task:", task)

    _run_locally = conversation["run_mode_locally"]
    _agents = conversation["agents"]


    #  Initialize the MagenticOne system with user_id
    magentic_one = MagenticOneHelper(logs_dir=logs_dir, save_screenshots=False, run_locally=_run_locally, user_id=user_id)
    logger.info(f"Initializing MagenticOne with agents: {len(_agents)} and session_id: {session_id} and user_id: {user_id}")
    await magentic_one.initialize(agents=_agents, session_id=session_id)
    logger.info(f"Initialized MagenticOne with agents: {len(_agents)} and session_id: {session_id} and user_id: {user_id}")

    stream, cancellation_token = magentic_one.main(task = task)
    logger.info(f"Stream and cancellation token created for task: {task}")


    async def event_generator(stream, conversation):

        async for log_entry in stream:
            json_response = await display_log_message(log_entry=log_entry, logs_dir=logs_dir, session_id=magentic_one.session_id, conversation=conversation, user_id=user_id)    
            yield f"data: {json.dumps(json_response.to_json())}\n\n"


    return StreamingResponse(event_generator(stream, conversation), media_type="text/event-stream")

@app.get("/stop")
async def stop(session_id: str = Query(...)):
    try:
        print("Stopping session:", session_id)
        cancellation_token = session_data[session_id].get("cancellation_token")
        if (cancellation_token):
            cancellation_token.cancel()
            return {"status": "success", "message": f"Session {session_id} cancelled successfully."}
        else:
            return {"status": "error", "message": "Cancellation token not found."}
    except Exception as e:
        print(f"Error stopping session {session_id}: {str(e)}")
        return {"status": "error", "message": f"Error stopping session: {str(e)}"}

# New endpoint to retrieve all conversations with pagination.
@app.post("/conversations")
async def list_all_conversations(
    request_data: dict,
    user: dict = Depends(validate_token)
    ):
    try:
        user_id = request_data.get("user_id")
        page = request_data.get("page", 1)
        page_size = request_data.get("page_size", 20)
        conversations = app.state.db.fetch_user_conversatons(
            user_id=None, 
            page=page, 
            page_size=page_size
        )
        return conversations
    except Exception as e:
        print(f"Error retrieving conversations: {str(e)}")
        return {"conversations": [], "total_count": 0, "page": 1, "total_pages": 1}

# New endpoint to retrieve conversations for the authenticated user.
@app.post("/conversations/user")
async def list_user_conversation(request_data: dict = None, user: dict = Depends(validate_token)):
    session_id = request_data.get("session_id") if request_data else None
    user_id = request_data.get("user_id") if request_data else None
    conversations = app.state.db.fetch_user_conversation(user_id, session_id=session_id)
    return conversations

@app.post("/conversations/delete")
async def delete_conversation(session_id: str = Query(...), user_id: str = Query(...), user: dict = Depends(validate_token)):
    logger = logging.getLogger("delete_conversation")
    logger.setLevel(logging.INFO)
    logger.info(f"Deleting conversation with session_id: {session_id} for user_id: {user_id}")
    try:
        # result = crud.delete_conversation(user["sub"], session_id)
        result = app.state.db.delete_user_conversation(user_id=user_id, session_id=session_id)
        if result:
            logger.info(f"Conversation {session_id} deleted successfully.")
            return {"status": "success", "message": f"Conversation {session_id} deleted successfully."}
        else:
            logger.warning(f"Conversation {session_id} not found.")
            return {"status": "error", "message": f"Conversation {session_id} not found."}
    except Exception as e:
        logger.error(f"Error deleting conversation {session_id}: {str(e)}")
        return {"status": "error", "message": f"Error deleting conversation: {str(e)}"}
    
@app.get("/health")
async def health_check():
    logger = logging.getLogger("health_check")
    logger.setLevel(logging.INFO)
    logger.info("Health check endpoint called")
    # print("Health check endpoint called")
    return {"status": "healthy"}

@app.post("/upload")
async def upload_files(indexName: str = Form(...), files: List[UploadFile] = File(...)):
    logger = logging.getLogger("upload_files")
    logger.setLevel(logging.INFO)
    logger.info(f"Received indexName: {indexName}")
    # print("Received indexName:", indexName)
    for file in files:
        # print("Uploading file:", file.filename)
        logger.info(f"Uploading file: {file.filename}")
    try:
        aisearch.process_upload_and_index(indexName, files)
        logger.info(f"Files processed and indexed successfully.")
    except Exception as err:
        logger.error(f"Error processing upload and index: {str(err)}")
        return {"status": "error", "message": str(err)}
    return {"status": "success", "filenames": [f.filename for f in files]}

from fastapi import HTTPException

@app.get("/teams")
async def get_teams_api():
    try:
        teams = app.state.db.get_teams()
        # teams= []
        return teams
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving teams: {str(e)}")

@app.get("/teams/{team_id}")
async def get_team_api(team_id: str):
    try:
        team = app.state.db.get_team(team_id)
        if not team:
            raise HTTPException(status_code=404, detail="Team not found")
        return team
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving team: {str(e)}")

@app.post("/teams")
async def create_team_api(team: dict):
    try:
        team["agents"] = MAGENTIC_ONE_DEFAULT_AGENTS
        response = app.state.db.create_team(team)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating team: {str(e)}")

@app.put("/teams/{team_id}")
async def update_team_api(team_id: str, team: dict):
    logger = logging.getLogger("update_team_api")
    logger.info(f"Updating team with ID: {team_id} and data: {team}")
    try:
        response = app.state.db.update_team(team_id, team)
        if "error" in response:
            logger.error(f"Error updating team: {response['error']}")
            raise HTTPException(status_code=404, detail=response["error"])
        return response
    except Exception as e:
        logger.error(f"Error updating team: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error updating team: {str(e)}")

@app.delete("/teams/{team_id}")
async def delete_team_api(team_id: str):
    try:
        response = app.state.db.delete_team(team_id)
        if "error" in response:
            raise HTTPException(status_code=404, detail=response["error"])
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting team: {str(e)}")
    

@app.post("/inititalize-teams")
async def initialize_teams_api():
    try:
        # Initialize the teams in the database
        msg = app.state.db.initialize_teams()
        msg = "DUMMY: Teams initialized successfully."
        return {"status": "success", "message": msg}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error initializing teams: {str(e)}")