import asyncio
import logging
import os
import time

from typing import Optional, AsyncGenerator, Dict, Any, List
from autogen_agentchat.ui import Console
from autogen_agentchat.agents import CodeExecutorAgent
from autogen_agentchat.teams import MagenticOneGroupChat
from autogen_ext.agents.file_surfer import FileSurfer
from autogen_ext.agents.magentic_one import MagenticOneCoderAgent
from autogen_ext.agents.web_surfer import MultimodalWebSurfer
from autogen_ext.code_executors.local import LocalCommandLineCodeExecutor
from autogen_ext.code_executors.azure import ACADynamicSessionsCodeExecutor
from autogen_ext.code_executors.docker import DockerCommandLineCodeExecutor
from autogen_ext.models.openai import AzureOpenAIChatCompletionClient
from autogen_core import AgentId, AgentProxy, DefaultTopicId
from autogen_core import SingleThreadedAgentRuntime
from autogen_core import CancellationToken
from azure.identity import DefaultAzureCredential, get_bearer_token_provider
import tempfile

from autogen_ext.models.openai import AzureOpenAIChatCompletionClient
from dotenv import load_dotenv
load_dotenv()

from magentic_one_custom_agent import MagenticOneCustomAgent
from magentic_one_custom_rag_agent import MagenticOneRAGAgent
from magentic_one_custom_mcp_agent import MagenticOneCustomMCPAgent

azure_credential = DefaultAzureCredential()
token_provider = get_bearer_token_provider(
    azure_credential, "https://cognitiveservices.azure.com/.default"
)

def generate_session_name():
    '''Generate a unique session name based on random sci-fi words, e.g. quantum-cyborg-1234'''
    import random

    adjectives = [
        "quantum", "neon", "stellar", "galactic", "cyber", "holographic", "plasma", "nano", "hyper", "virtual",
        "cosmic", "interstellar", "lunar", "solar", "astro", "exo", "alien", "robotic", "synthetic", "digital",
        "futuristic", "parallel", "extraterrestrial", "transdimensional", "biomechanical", "cybernetic", "hologram",
        "metaphysical", "subatomic", "tachyon", "warp", "xeno", "zenith", "zerogravity", "antimatter", "darkmatter",
        "neural", "photon", "quantum", "singularity", "space-time", "stellar", "telepathic", "timetravel", "ultra",
        "virtualreality", "wormhole"
    ]
    nouns = [
        "cyborg", "android", "drone", "mech", "robot", "alien", "spaceship", "starship", "satellite", "probe",
        "astronaut", "cosmonaut", "galaxy", "nebula", "comet", "asteroid", "planet", "moon", "star", "quasar",
        "black-hole", "wormhole", "singularity", "dimension", "universe", "multiverse", "matrix", "simulation",
        "hologram", "avatar", "clone", "replicant", "cyberspace", "nanobot", "biobot", "exosuit", "spacesuit",
        "terraformer", "teleporter", "warpdrive", "hyperdrive", "stasis", "cryosleep", "fusion", "fission", "antigravity",
        "darkenergy", "neutrino", "tachyon", "photon"
    ]

    adjective = random.choice(adjectives)
    noun = random.choice(nouns)
    number = random.randint(1000, 9999)
    
    return f"{adjective}-{noun}-{number}"

class MagenticOneHelper:
    def __init__(self, logs_dir: str = None, save_screenshots: bool = False, run_locally: bool = False, user_id: str = None) -> None:
        """
        A helper class to interact with the MagenticOne system.
        Initialize MagenticOne instance.

        Args:
            logs_dir: Directory to store logs and downloads
            save_screenshots: Whether to save screenshots of web pages
            user_id: The user ID associated with this helper instance
        """
        self.logs_dir = logs_dir or os.getcwd()
        self.runtime: Optional[SingleThreadedAgentRuntime] = None
        # self.log_handler: Optional[LogHandler] = None
        self.save_screenshots = save_screenshots
        self.run_locally = run_locally

        self.user_id = user_id

        self.max_rounds = 50
        self.max_time = 25 * 60
        self.max_stalls_before_replan = 5
        self.return_final_answer = True
        self.start_page = "https://www.bing.com"

        if not os.path.exists(self.logs_dir):
            os.makedirs(self.logs_dir)

    async def initialize(self, agents, session_id = None) -> None:
        """
        Initialize the MagenticOne system, setting up agents and runtime.
        """
        # Create the runtime
        self.runtime = SingleThreadedAgentRuntime()
        
        # generate session id from current datetime
        if session_id is None:
            self.session_id = generate_session_name()
        else:
            self.session_id = session_id
        # print(f"Session MODEL gpt-4.1-2025-04-14")
        print(f"Session MODEL o4-mini-2025-04-16")
        self.client = AzureOpenAIChatCompletionClient(
            model="gpt-4.1-2025-04-14",
            azure_deployment="gpt-4.1",
            api_version="2025-03-01-preview",
            azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
            azure_ad_token_provider=token_provider,
            model_info={
                "vision": True,
                "function_calling": True,
                "json_output": True,
                "family": "gpt-4o"
            }
        )

        self.client_reasoning = AzureOpenAIChatCompletionClient(
            model="o4-mini-2025-04-16",
            azure_deployment="o4-mini",
            api_version="2025-03-01-preview",
            azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
            azure_ad_token_provider=token_provider,
            model_info={
                "vision": True,
                "function_calling": True,
                "json_output": True,
                "family": "o4"
            }
        )


        # Set up agents
        self.agents = await self.setup_agents(agents, self.client, self.logs_dir) 

        print("Agents setup complete!")

    async def setup_agents(self, agents, client, logs_dir):
        agent_list = []
        for agent in agents:
            # This is default MagenticOne agent - Coder
            if (agent["type"] == "MagenticOne" and agent["name"] == "Coder"):
                coder = MagenticOneCoderAgent("Coder", model_client=client)
                agent_list.append(coder)
                print("Coder added!")

            # This is default MagenticOne agent - Executor
            elif (agent["type"] == "MagenticOne" and agent["name"] == "Executor"):
                # handle local = local docker execution
                if self.run_locally:
                    #docker
                    code_executor = DockerCommandLineCodeExecutor(work_dir=logs_dir)
                    await code_executor.start()
                    executor = CodeExecutorAgent("Executor", code_executor=code_executor)
                
                # or remote = Azure ACA Dynamic Sessions execution
                else:
                    pool_endpoint = os.getenv("POOL_MANAGEMENT_ENDPOINT")
                    assert pool_endpoint, "POOL_MANAGEMENT_ENDPOINT environment variable is not set"
                    with tempfile.TemporaryDirectory() as temp_dir:# Define the correct path to the data folder for file access
                        code_executor=ACADynamicSessionsCodeExecutor(
                            pool_management_endpoint=pool_endpoint,
                            credential=azure_credential,
                            work_dir=temp_dir
                        )
                        print(code_executor._session_id)
                        #code_executor.upload_files(os.path.join(os.getcwd(), "data"))
                        print("Files uploaded!")
                        executor = CodeExecutorAgent("Executor",code_executor=code_executor )
                
                agent_list.append(executor)
                print("Executor added!")

            # This is default MagenticOne agent - WebSurfer
            elif (agent["type"] == "MagenticOne" and agent["name"] == "WebSurfer"):
                web_surfer = MultimodalWebSurfer("WebSurfer", model_client=client)
                agent_list.append(web_surfer)
                print("WebSurfer added!")
            
            # This is default MagenticOne agent - FileSurfer
            elif (agent["type"] == "MagenticOne" and agent["name"] == "FileSurfer"):
                file_surfer = FileSurfer("FileSurfer", model_client=client)
                file_surfer._browser.set_path(os.path.join(os.getcwd(), "data"))  # Set the path to the data folder in the current working directory
                agent_list.append(file_surfer)
                print("FileSurfer added!")
            
            # This is custom agent - simple SYSTEM message and DESCRIPTION is used inherited from AssistantAgent
            elif (agent["type"] == "Custom"):
                custom_agent = MagenticOneCustomAgent(
                    agent["name"], 
                    model_client=client, 
                    system_message=agent["system_message"], 
                    description=agent["description"]
                    )

                agent_list.append(custom_agent)
                print(f'{agent["name"]} (custom) added!')
            
            elif (agent["type"] == "CustomMCP"):
                custom_agent = await MagenticOneCustomMCPAgent.create(
                    agent["name"], 
                    client, 
                    agent["system_message"] + "\n\n in case of email use this address as TO: " + self.user_id, 
                    agent["description"],
                    self.user_id
                )
                agent_list.append(custom_agent)
                print(f'{agent["name"]} (custom MCP) added!')

            
            # This is custom agent - RAG agent - you need to specify index_name and Azure Cognitive Search service endpoint and admin key in .env file
            elif (agent["type"] == "RAG"):
                # RAG agent
                rag_agent = MagenticOneRAGAgent(
                    agent["name"], 
                    model_client=client, 
                    index_name=agent["index_name"],
                    description=agent["description"],
                    AZURE_SEARCH_SERVICE_ENDPOINT=os.getenv("AZURE_SEARCH_SERVICE_ENDPOINT"),
                    # AZURE_SEARCH_ADMIN_KEY=os.getenv("AZURE_SEARCH_ADMIN_KEY")
                    )
                agent_list.append(rag_agent)
                print(f'{agent["name"]} (RAG) added!')
            else:
                raise ValueError('Unknown Agent!')
        return agent_list

    def main(self, task):
        team = MagenticOneGroupChat(
            participants=self.agents,
            model_client=self.client,
            # model_client=self.client_reasoning,
            max_turns=self.max_rounds,
            max_stalls=self.max_stalls_before_replan,
            emit_team_events=False,
            
        )
        cancellation_token = CancellationToken()
        stream = team.run_stream(task=task, cancellation_token=cancellation_token)
        return stream, cancellation_token
    
async def main(agents, task, run_locally) -> None:

    magentic_one = MagenticOneHelper(logs_dir=".", run_locally=run_locally)
    await magentic_one.initialize(agents)

    team = MagenticOneGroupChat(
            participants=magentic_one.agents,
            model_client=magentic_one.client,
            max_turns=magentic_one.max_rounds,
            max_stalls=magentic_one.max_stalls_before_replan,
            
        )
    try:
        await Console(team.run_stream(task=task))
    except Exception as e:
        print(f"Error: {e}")
    finally:
        await team.shutdown()

if __name__ == "__main__":   
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
    
    import argparse
    parser = argparse.ArgumentParser(description="Run MagenticOneHelper with specified task and run_locally option.")
    parser.add_argument("--task", "-t", type=str, required=True, help="The task to run, e.g. 'How much taxes elon musk paid?'")
    parser.add_argument("--run_locally", action="store_true", help="Run locally if set")
    
    # You can run this command from terminal
    # python magentic_one_helper.py --task "Find me a French restaurant in Dubai with 2 Michelin stars?"
    
    args = parser.parse_args()

    asyncio.run(main(MAGENTIC_ONE_DEFAULT_AGENTS,args.task, args.run_locally))



