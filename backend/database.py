import os
from azure.cosmos import CosmosClient, PartitionKey
from azure.identity import DefaultAzureCredential

from autogen_agentchat.base import TaskResult
from autogen_agentchat.messages import MultiModalMessage, TextMessage, ToolCallExecutionEvent, ToolCallRequestEvent

from schemas import AutoGenMessage
import uuid


def get_db():
    """
    Returns the Cosmos DB container.
    """
    # Get Cosmos DB account details from environment variables
    COSMOS_DB_URI = os.getenv("COSMOS_DB_URI", "https://YOURDB.documents.azure.com:443/")
    COSMOS_DB_DATABASE = os.getenv("COSMOS_DB_DATABASE", "ag_demo")
    COSMOS_DB_CONTAINER = os.getenv("COSMOS_DB_CONTAINER", "ag_demo")
    
    # Use DefaultAzureCredential for AAD token authorization
    credential = DefaultAzureCredential()

    # Initialize the Cosmos client with AAD token authorization
    client = CosmosClient(COSMOS_DB_URI, credential=credential)

    # Create the database if it does not exist
    database = client.create_database_if_not_exists(id=COSMOS_DB_DATABASE)

    # Create the container if it does not exist.
    # Adjust the partition key and throughput as needed.
    container = database.create_container_if_not_exists(
        id=COSMOS_DB_CONTAINER,
        partition_key=PartitionKey(path="/user_id"),
        offer_throughput=400
    ) 
    return container
    # return True
def format_message(_log_entry_json):
    _response = AutoGenMessage(
        time="N/A",
        session_id="session_id",
        session_user="session_user",
        )

    # Check if the message is a TaskResult class
    if isinstance(_log_entry_json, TaskResult):
        _response.type = "TaskResult"
        _response.source = "TaskResult"
        _response.content = _log_entry_json.messages[-1].content
        _response.stop_reason = _log_entry_json.stop_reason
        # store_document(_log_entry_json, _response)

    elif isinstance(_log_entry_json, MultiModalMessage):
        _response.type = _log_entry_json.type
        _response.source = _log_entry_json.source
        _response.content = _log_entry_json.content[0] # text wthout image
        _response.content_image = _log_entry_json.content[1].data_uri # TODO: base64 encoded image -> text / serialize

    elif isinstance(_log_entry_json, TextMessage):
        _response.type = _log_entry_json.type
        _response.source = _log_entry_json.source
        _response.content = _log_entry_json.content

    elif isinstance(_log_entry_json, ToolCallExecutionEvent):
        _response.type = _log_entry_json.type
        _response.source = _log_entry_json.source
        _response.content = _log_entry_json.content[0].content # tool execution

    elif isinstance(_log_entry_json, ToolCallRequestEvent):
        # _models_usage = _log_entry_json.models_usage
        _response.type = _log_entry_json.type
        _response.source = _log_entry_json.source
        _response.content = _log_entry_json.content[0].arguments # tool execution

    else:
        _response.type = "N/A"
        _response.source = "N/A"
        _response.content = "Agents mumbling."
    return _response
def store_conversation(conversation: TaskResult, conveersation_details: AutoGenMessage):
    """
    Stores a conversation document into the Cosmos DB container.
    
    Parameters:
        conversation (dict): The conversation data to store. It must include the partition key field "user_id".
    
    Returns:
        dict: The response from Cosmos DB after the document is created.
    """
    _messsages = []
    for message in conversation.messages:
        _m = format_message(message)
        _messsages.append(_m.to_json())
    conversation_document_item = dict(
        id=str(uuid.uuid4()),
        user_id=conveersation_details.session_user,
        session_id=conveersation_details.session_id,
        messages=_messsages, 
        agents=[], 
        run_mode_locally=False,
        timestamp=conveersation_details.time,
        )

    container = get_db()
    response = container.create_item(body=conversation_document_item)
    return response

def fetch_user_conversatons(user_id: str):
    """
    Retrieves all documents from the Cosmos DB container where user_id equals the given parameter.
    
    Parameters:
        user_id (str): The user ID to filter the documents.
    
    Returns:
        List[dict]: A list of documents that match the given user_id.
    """
    container = get_db()
    query = "SELECT c.user_id, c.session_id, c.timestamp FROM c WHERE c.user_id = @userId"
    parameters = [{"name": "@userId", "value": user_id}]
    items = list(container.query_items(
        query=query,
        parameters=parameters,
        enable_cross_partition_query=True
    ))
    return items

def fetch_user_conversation(user_id: str, session_id: str):
    """
    Retrieves a conversation document from the Cosmos DB container identified by its user_id and session_id.
    
    Parameters:
        user_id (str): The user ID of the conversation document.
        session_id (str): The session ID of the conversation document.
    
    Returns:
        dict: The conversation document that matches the given user_id and session_id.
    """
    container = get_db()
    query = "SELECT * FROM c WHERE c.user_id = @userId AND c.session_id = @sessionId"
    parameters = [
        {"name": "@userId", "value": user_id},
        {"name": "@sessionId", "value": session_id},
    ]
    items = list(container.query_items(
        query=query,
        parameters=parameters,
        enable_cross_partition_query=True
    ))
    return items

def delete_user_conversation(user_id: str, session_id: str):
    """
    Deletes a conversation document from the Cosmos DB container identified by its user_id and session_id.
    
    Parameters:
        user_id (str): The user ID of the conversation document.
        session_id (str): The session ID of the conversation document.
    
    Returns:
        dict: The response from Cosmos DB after deleting the document, or an error message if not found.
    """
    container = get_db()
    query = "SELECT * FROM c WHERE c.user_id = @userId AND c.session_id = @sessionId"
    parameters = [
        {"name": "@userId", "value": user_id},
        {"name": "@sessionId", "value": session_id},
    ]
    items = list(container.query_items(
        query=query,
        parameters=parameters,
        enable_cross_partition_query=True
    ))
    
    if not items:
        return {"error": f"No conversation found with user_id {user_id} and session_id {session_id}."}
    
    # Assuming the combination of user_id and session_id uniquely identifies a conversation.
    conversation = items[0]
    response = container.delete_item(item=conversation["id"], partition_key=conversation["user_id"])
    return response

def delete_user_all_conversations(user_id: str):
    """
    Deletes a conversation document from the Cosmos DB container identified by its user_id and session_id.
    
    Parameters:
        user_id (str): The user ID of the conversation document.
    
    Returns:
        dict: The response from Cosmos DB after deleting the document, or an error message if not found.
    """
    container = get_db()
    query = "SELECT * FROM c WHERE c.user_id = @userId"
    parameters = [
        {"name": "@userId", "value": user_id},
    ]
    items = list(container.query_items(
        query=query,
        parameters=parameters,
        enable_cross_partition_query=True
    ))
    
    if not items:
        return {"error": f"No conversation found with user_id {user_id}."}
    
    for item in items:
        container.delete_item(item=item["id"], partition_key=item["user_id"])
    return True