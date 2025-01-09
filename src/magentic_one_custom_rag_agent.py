from autogen_agentchat.agents import AssistantAgent
from autogen_core.models import (
    ChatCompletionClient,
)

from azure.search.documents import SearchClient
from azure.core.credentials import AzureKeyCredential
from azure.search.documents.models import VectorizedQuery
from azure.search.documents.models import VectorizableTextQuery
from azure.identity import DefaultAzureCredential,get_bearer_token_provider
from openai import AzureOpenAI
from tenacity import retry, wait_random_exponential, stop_after_attempt
from typing import List

import requests


# MAGENTIC_ONE_RAG_DESCRIPTION = "An agent that has access to a knowledge base and can handle RAG tasks, call this agent if you are getting questions on your knowledge base"

MAGENTIC_ONE_RAG_SYSTEM_MESSAGE = """
        You are a helpful AI Assistant.
        When given a user query, use available tools to help the user with their request.
        Reply "TERMINATE" in the end when everything is done."""

class MagenticOneRAGAgent(AssistantAgent):
    """An agent, used by MagenticOne that provides coding assistance using an LLM model client.

    The prompts and description are sealed, to replicate the original MagenticOne configuration. See AssistantAgent if you wish to modify these values.
    """

    def __init__(
        self,
        name: str,
        model_client: ChatCompletionClient,
        index_name: str,
        description: str,
        AZURE_OPENAI_ENDPOINT: str,
        AZURE_SEARCH_SERVICE_ENDPOINT: str,
        AZURE_SEARCH_ADMIN_KEY: str,

    ):
        super().__init__(
            name,
            model_client,
            description=description,
            system_message=MAGENTIC_ONE_RAG_SYSTEM_MESSAGE,
            tools=[self.do_search],
            reflect_on_tool_use=True,
        )

        self.index_name = index_name    
        self.AZURE_OPENAI_ENDPOINT = AZURE_OPENAI_ENDPOINT  
        self.AZURE_SEARCH_SERVICE_ENDPOINT = AZURE_SEARCH_SERVICE_ENDPOINT
        self.AZURE_SEARCH_ADMIN_KEY = AZURE_SEARCH_ADMIN_KEY

        
    def config_search(self) -> SearchClient:
        service_endpoint = self.AZURE_SEARCH_SERVICE_ENDPOINT
        key = self.AZURE_SEARCH_ADMIN_KEY
        index_name = self.index_name
        credential = AzureKeyCredential(key)
        return SearchClient(endpoint=service_endpoint, index_name=index_name, credential=credential)

    async def do_search(self, query: str) -> str:
        """Search indexed data using Azure Cognitive Search with vector-based queries."""
        aia_search_client = self.config_search()
        fields = "text_vector" # TODO: Check if this is the correct field name
        vector_query = VectorizableTextQuery(text=query, k_nearest_neighbors=1, fields=fields, exhaustive=True)
 

        results = aia_search_client.search(  
            search_text=None,  
            vector_queries= [vector_query],
            select=["parent_id", "chunk_id", "chunk"], #TODO: Check if these are the correct field names
            top=1 #TODO: Check if this is the correct number of results
        )  
        answer = ''
        for result in results:  
            # print(f"parent_id: {result['parent_id']}")  
            # print(f"chunk_id: {result['chunk_id']}")  
            # print(f"Score: {result['@search.score']}")  
            # print(f"Content: {result['chunk']}")
            answer = answer + result['chunk']
        return answer


