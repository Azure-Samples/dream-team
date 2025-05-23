import os
from autogen_agentchat.agents import AssistantAgent
from autogen_core.models import (
    ChatCompletionClient,
)
from autogen_ext.tools.mcp import SseMcpToolAdapter, StdioServerParams, StdioMcpToolAdapter, SseServerParams

# TODO add checks to ususer inputs to make sure it is a valid definition of custom agent
class MagenticOneCustomMCPAgent(AssistantAgent):
    """An agent used by MagenticOne that provides coding assistance using an LLM model client.
    
    The prompts and description are sealed to replicate the original MagenticOne configuration.
    See AssistantAgent if you wish to modify these values.
    """
    
    def __init__(
        self,
        name: str,
        model_client: ChatCompletionClient,
        system_message: str,
        description: str,
        adapter,  # adapter is now provided by the async factory method
        user_id: str = None
    ):
        super().__init__(
            name,
            model_client,
            description=description,
            system_message=system_message,
            tools=adapter
        )
        self.user_id = user_id
    
    @classmethod
    async def create(
        cls,
        name: str,
        model_client: ChatCompletionClient,
        system_message: str,
        description: str,
        user_id: str = None
    ):
        # # local Stdio server
        # import os
        # server_params = StdioServerParams(
        #     command="python",
        #     args=["mcp_math_server.py"],
        #     env={
        #         "AZURE_COMMUNICATION_EMAIL_ENDPOINT": os.getenv("AZURE_COMMUNICATION_EMAIL_ENDPOINT"),
        #         "AZURE_COMMUNICATION_EMAIL_SENDER": os.getenv("AZURE_COMMUNICATION_EMAIL_SENDER"),
        #         "AZURE_COMMUNICATION_EMAIL_RECIPIENT_DEFAULT": os.getenv("AZURE_COMMUNICATION_EMAIL_RECIPIENT_DEFAULT"),
        #         "AZURE_COMMUNICATION_EMAIL_SUBJECT_DEFAULT": os.getenv("AZURE_COMMUNICATION_EMAIL_SUBJECT_DEFAULT"),
        #         "AZURE_CLIENT_ID": os.getenv("AZURE_CLIENT_ID")
        #     },
        # )
        # # Get the addition tool from the server asynchronously
        # adapter_addition = await StdioMcpToolAdapter.from_server_params(server_params, "add")
        # adapter_multiplication = await StdioMcpToolAdapter.from_server_params(server_params, "multiply")
        # adapter_data_provider = await SseMcpToolAdapter.from_server_params(server_params, "data_provider")
        # adapter_mailer = await SseMcpToolAdapter.from_server_params(server_params, "mailer")
        # return cls(name, 
        #            model_client, 
        #            system_message, 
        #            description, 
        #            [adapter_addition, adapter_multiplication, adapter_data_provider, adapter_mailer],
        #            user_id=user_id)
        
        # MCP_SERVER_URI, MCP_SERVER_API_KEY
        # remote Sse server
        # server_params = SseServerParams(
        #     url="http://localhost:8333/sse",
        #     headers={"x-api-key": "1234"}
        # )

        print("Creating MagenticOneCustomMCPAgent...")
        print("MCP_SERVER_URI: ", os.environ.get("MCP_SERVER_URI"))
        print("MCP_SERVER_API_KEY: ", os.environ.get("MCP_SERVER_API_KEY"))

        mcp_server_uri = os.environ.get("MCP_SERVER_URI")+"/sse"
        server_params = SseServerParams(
            url=mcp_server_uri,
            headers={"x-api-key": os.environ.get("MCP_SERVER_API_KEY")}
        )

        # Get the addition tool from the server asynchronously
        adapter_data_provider = await SseMcpToolAdapter.from_server_params(server_params, "data_provider")
        adapter_data_list_tables = await SseMcpToolAdapter.from_server_params(server_params, "show_tables")
        adapter_mailer = await SseMcpToolAdapter.from_server_params(server_params, "mailer")

        return cls(name, 
                   model_client, 
                   system_message, 
                   description, 
                   [adapter_data_provider, adapter_data_list_tables, adapter_mailer],
                   user_id=user_id)