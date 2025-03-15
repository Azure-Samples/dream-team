import json
import logging
import os
import subprocess
import time

from azure.core.exceptions import ResourceExistsError
from azure.identity import AzureDeveloperCliCredential, DefaultAzureCredential, ManagedIdentityCredential
from azure.search.documents.indexes import SearchIndexClient, SearchIndexerClient
from azure.search.documents.indexes.models import (
    AzureOpenAIEmbeddingSkill,
    AzureOpenAIVectorizerParameters,
    AzureOpenAIVectorizer,
    FieldMapping,
    HnswAlgorithmConfiguration,
    HnswParameters,
    IndexProjectionMode,
    InputFieldMappingEntry,
    OutputFieldMappingEntry,
    SearchableField,
    SearchField,
    SearchFieldDataType,
    SearchIndex,
    SearchIndexer,
    SearchIndexerDataContainer,
    SearchIndexerDataSourceConnection,
    SearchIndexerDataSourceType,
    SearchIndexerDataUserAssignedIdentity,
    SearchIndexerIndexProjection,
    SearchIndexerIndexProjectionSelector,
    SearchIndexerIndexProjectionsParameters,
    SearchIndexerSkillset,
    SemanticConfiguration,
    SemanticField,
    SemanticPrioritizedFields,
    SemanticSearch,
    SimpleField,
    SplitSkill,
    VectorSearch,
    VectorSearchAlgorithmMetric,
    VectorSearchProfile,
)
from azure.storage.blob import BlobServiceClient
from dotenv import load_dotenv
from typing import List
from fastapi import UploadFile
# from rich.logging import RichHandler

EMBEDDINGS_DIMENSIONS = 3072

def load_azd_env():
    # """Get path to current azd env file and load file using python-dotenv"""
    # result = subprocess.run("azd env list -o json", shell=True, capture_output=True, text=True)
    # if result.returncode != 0:
    #     raise Exception("Error loading azd env")
    # env_json = json.loads(result.stdout)
    # env_file_path = None
    # for entry in env_json:
    #     if entry["IsDefault"]:
    #         env_file_path = entry["DotEnvPath"]
    # if not env_file_path:
    #     raise Exception("No default azd env file found")
    # logger.info(f"Loading azd env from {env_file_path}")
    # load_dotenv(env_file_path, override=True)
    load_dotenv("../.env", override=True)


def setup_index(azure_credential, azure_storage_endpoint, uami_resource_id,  index_name, azure_search_endpoint, azure_storage_connection_string, azure_storage_container, azure_openai_embedding_endpoint, azure_openai_embedding_deployment, azure_openai_embedding_model, azure_openai_embeddings_dimensions):
    index_client = SearchIndexClient(azure_search_endpoint, azure_credential)
    indexer_client = SearchIndexerClient(azure_search_endpoint, azure_credential)

    logging.basicConfig(level=logging.WARNING, format="%(message)s", datefmt="[%X]")
    logger = logging.getLogger("dream-team")
    logger.setLevel(logging.INFO)

    logger.info(f"Setting up Azure AI Search index: {azure_storage_container}")

    blob_client = BlobServiceClient(
        account_url=azure_storage_endpoint, credential=azure_credential,
        max_single_put_size=4 * 1024 * 1024
    )
    container_client = blob_client.get_container_client(azure_storage_container)
    try:
        if not container_client.exists():
            container_client.create_container()
            logger.info(f"Created blob storage container: {azure_storage_container}")
    except :
        logger.info(f"Blob storage container {azure_storage_container} already exists")
    data_source_connections = indexer_client.get_data_source_connections()
    if index_name in [ds.name for ds in data_source_connections]:
        logger.info(f"Data source connection {index_name} already exists, not re-creating")
    else:
        logger.info(f"Creating data source connection: {index_name}")
        indexer_client.create_data_source_connection(
            data_source_connection=SearchIndexerDataSourceConnection(
                name=index_name, 
                type=SearchIndexerDataSourceType.AZURE_BLOB,
                connection_string=azure_storage_connection_string,
                identity = SearchIndexerDataUserAssignedIdentity(resource_id=uami_resource_id),
                container=SearchIndexerDataContainer(name=azure_storage_container)))
        

    index_names = [index.name for index in index_client.list_indexes()]
    if index_name in index_names:
        logger.info(f"Index {index_name} already exists, not re-creating")
    else:
        logger.info(f"Creating index: {index_name}")
        index_client.create_index(
            SearchIndex(
                name=index_name,
                fields=[
                    SearchableField(name="chunk_id", key=True, analyzer_name="keyword", sortable=True),
                    SimpleField(name="parent_id", type=SearchFieldDataType.String, filterable=True),
                    SearchableField(name="title"),
                    SearchableField(name="chunk"),
                    SearchField(
                        name="text_vector", 
                        type=SearchFieldDataType.Collection(SearchFieldDataType.Single),
                        vector_search_dimensions=EMBEDDINGS_DIMENSIONS,
                        vector_search_profile_name="vp",
                        stored=True,
                        hidden=False)
                ],
                vector_search=VectorSearch(
                    algorithms=[
                        HnswAlgorithmConfiguration(name="algo", parameters=HnswParameters(metric=VectorSearchAlgorithmMetric.COSINE))
                    ],
                    vectorizers=[
                        AzureOpenAIVectorizer(
                            vectorizer_name="openai_vectorizer",
                            parameters=AzureOpenAIVectorizerParameters(
                                resource_url=azure_openai_embedding_endpoint,
                                auth_identity=SearchIndexerDataUserAssignedIdentity(resource_id=uami_resource_id),
                                deployment_name=azure_openai_embedding_deployment,
                                model_name=azure_openai_embedding_model
                            )
                        )
                    ],
                    profiles=[
                        VectorSearchProfile(name="vp", algorithm_configuration_name="algo", vectorizer_name="openai_vectorizer")
                    ]
                ),
                semantic_search=SemanticSearch(
                    configurations=[
                        SemanticConfiguration(
                            name="default",
                            prioritized_fields=SemanticPrioritizedFields(title_field=SemanticField(field_name="title"), content_fields=[SemanticField(field_name="chunk")])
                        )
                    ],
                    default_configuration_name="default"
                )
            )
        )

    skillsets = indexer_client.get_skillsets()
    if index_name in [skillset.name for skillset in skillsets]:
        logger.info(f"Skillset {index_name} already exists, not re-creating")
    else:
        logger.info(f"Creating skillset: {index_name}")
        indexer_client.create_skillset(
            skillset=SearchIndexerSkillset(
                name=index_name,
                skills=[
                    SplitSkill(
                        text_split_mode="pages",
                        context="/document",
                        maximum_page_length=2000,
                        page_overlap_length=500,
                        inputs=[InputFieldMappingEntry(name="text", source="/document/content")],
                        outputs=[OutputFieldMappingEntry(name="textItems", target_name="pages")]),
                    AzureOpenAIEmbeddingSkill(
                        context="/document/pages/*",
                        resource_url=azure_openai_embedding_endpoint,
                        auth_identity=SearchIndexerDataUserAssignedIdentity(resource_id=uami_resource_id),
                        deployment_name=azure_openai_embedding_deployment,
                        model_name=azure_openai_embedding_model,
                        dimensions=azure_openai_embeddings_dimensions,
                        inputs=[InputFieldMappingEntry(name="text", source="/document/pages/*")],
                        outputs=[OutputFieldMappingEntry(name="embedding", target_name="text_vector")])
                ],
                index_projection=SearchIndexerIndexProjection(
                    selectors=[
                        SearchIndexerIndexProjectionSelector(
                            target_index_name=index_name,
                            parent_key_field_name="parent_id",
                            source_context="/document/pages/*",
                            mappings=[
                                InputFieldMappingEntry(name="chunk", source="/document/pages/*"),
                                InputFieldMappingEntry(name="text_vector", source="/document/pages/*/text_vector"),
                                InputFieldMappingEntry(name="title", source="/document/metadata_storage_name")
                            ]
                        )
                    ],
                    parameters=SearchIndexerIndexProjectionsParameters(
                        projection_mode=IndexProjectionMode.SKIP_INDEXING_PARENT_DOCUMENTS
                    )
                )))

    indexers = indexer_client.get_indexers()
    if index_name in [indexer.name for indexer in indexers]:
        logger.info(f"Indexer {index_name} already exists, not re-creating")
    else:
        indexer_client.create_indexer(
            indexer=SearchIndexer(
                name=index_name,
                data_source_name=index_name,
                skillset_name=index_name,
                target_index_name=index_name,        
                field_mappings=[FieldMapping(source_field_name="metadata_storage_name", target_field_name="title")]
            )
        )


def upload_documents(azure_credential, source_folder, indexer_name, azure_search_endpoint, azure_storage_endpoint, azure_storage_container):
    logging.basicConfig(level=logging.WARNING, format="%(message)s", datefmt="[%X]")
    logger = logging.getLogger("upload_documents")
    logger.setLevel(logging.INFO)
    indexer_client = SearchIndexerClient(azure_search_endpoint, azure_credential)
    # Upload the documents in /data folder to the blob storage container
    blob_client = BlobServiceClient(
        account_url=azure_storage_endpoint, credential=azure_credential,
        max_single_put_size=4 * 1024 * 1024
    )
    container_client = blob_client.get_container_client(azure_storage_container)
    if not container_client.exists():
        container_client.create_container()
    existing_blobs = [blob.name for blob in container_client.list_blobs()]

    # Open each file in /data folder
    for file in os.scandir(source_folder):
        with open(file.path, "rb") as opened_file:
            filename = os.path.basename(file.path)
            # Check if blob already exists
            if filename in existing_blobs:
                logger.info("Blob already exists, skipping file: %s", filename)
            else:
                logger.info("Uploading blob for file: %s", filename)
                blob_client = container_client.upload_blob(filename, opened_file, overwrite=True)

    # Start the indexer
    try:
        indexer_client.run_indexer(indexer_name)
        logger.info("Indexer started. Any unindexed blobs should be indexed in a few minutes, check the Azure Portal for status.")
    except ResourceExistsError:
        logger.info("Indexer already running, not starting again")

def wait_for_indexing(azure_credential, azure_search_endpoint, indexer_name):
    """Poll the indexer status every 5 seconds until indexing is complete."""
    indexer_client = SearchIndexerClient(azure_search_endpoint, azure_credential)
    logger = logging.getLogger("wait_for_indexing")
    logger.setLevel(logging.INFO)
    while True:
        status_response = indexer_client.get_indexer_status(indexer_name)
        # Assuming last_result.status returns a status string like "inProgress" when still indexing.
        current_status = getattr(status_response.last_result, "status", None)
        if current_status is not None and current_status.lower() != "inprogress":
            logger.info("Indexing complete with status: %s", current_status)
            break
        logger.info("Indexing in progress, waiting 5 seconds...")
        time.sleep(5)
def process_upload_and_index(index_name: str, upload_files: List[UploadFile]):
    # Store each file in the container named index_name
    logging.basicConfig(level=logging.WARNING, format="%(message)s", datefmt="[%X]")
    logger = logging.getLogger("process_upload_and_index")
    logger.setLevel(logging.INFO)
    
    AZURE_OPENAI_EMBEDDING_ENDPOINT = os.environ["AZURE_OPENAI_ENDPOINT"]
    AZURE_OPENAI_EMBEDDING_DEPLOYMENT = os.environ["AZURE_OPENAI_EMBEDDING_MODEL"]
    AZURE_OPENAI_EMBEDDING_MODEL = os.environ["AZURE_OPENAI_EMBEDDING_MODEL"]

    # UAMI_ID = os.environ["UAMI_ID"]
    UAMI_RESOURCE_ID = os.environ["UAMI_RESOURCE_ID"]

    AZURE_SEARCH_ENDPOINT = os.environ["AZURE_SEARCH_SERVICE_ENDPOINT"]

    AZURE_STORAGE_ENDPOINT =  os.getenv("AZURE_STORAGE_ACCOUNT_ENDPOINT")
    AZURE_STORAGE_CONNECTION_STRING =  f"ResourceId={os.getenv('AZURE_STORAGE_ACCOUNT_ID')}"

    azure_credential = DefaultAzureCredential()
    azure_storage_container = index_name

    blob_client = BlobServiceClient(
        account_url=AZURE_STORAGE_ENDPOINT, credential=azure_credential,
        max_single_put_size=4 * 1024 * 1024
    )
    container_client = blob_client.get_container_client(azure_storage_container)
    if not container_client.exists():
        container_client.create_container()
        logger.info(f"Created blob storage container: {azure_storage_container}")
    existing_blobs = [blob.name for blob in container_client.list_blobs()]

    for file in upload_files:
        file_contents = file.file.read()
        filename = file.filename
        if filename in existing_blobs:
            logger.info("Blob already exists, skipping file: %s", filename)
        else:
            logger.info("Uploading blob for file: %s", filename)
            container_client.upload_blob(filename, file_contents, overwrite=True)

    setup_index(azure_credential,
                    azure_storage_endpoint=AZURE_STORAGE_ENDPOINT,
            index_name=f"{index_name}",
            # uami_id=UAMI_ID,
            uami_resource_id=UAMI_RESOURCE_ID,
            azure_search_endpoint=AZURE_SEARCH_ENDPOINT,
            azure_storage_connection_string=AZURE_STORAGE_CONNECTION_STRING,
            azure_storage_container=index_name,
            azure_openai_embedding_endpoint=AZURE_OPENAI_EMBEDDING_ENDPOINT,
            azure_openai_embedding_deployment=AZURE_OPENAI_EMBEDDING_DEPLOYMENT,
            azure_openai_embedding_model=AZURE_OPENAI_EMBEDDING_MODEL,
            azure_openai_embeddings_dimensions=EMBEDDINGS_DIMENSIONS)
    
    wait_for_indexing(azure_credential, AZURE_SEARCH_ENDPOINT, index_name)


if __name__ == "__main__":
    # logging.basicConfig(level=logging.WARNING, format="%(message)s", datefmt="[%X]", handlers=[RichHandler(rich_tracebacks=True)])
    logging.basicConfig(level=logging.WARNING, format="%(message)s", datefmt="[%X]")
    logger = logging.getLogger("dream-team")
    logger.setLevel(logging.INFO)

    load_azd_env()

    logger.info("Checking if we need to set up Azure AI Search index...")
    if os.environ.get("AZURE_SEARCH_REUSE_EXISTING") == "true":
        logger.info("Since an existing Azure AI Search index is being used, no changes will be made to the index.")
        exit()
    else:
        logger.info("Setting up Azure AI Search index and integrated vectorization...")


    # AVAILABLE
    azure_credential = DefaultAzureCredential()
    # azure_credential = ManagedIdentityCredential()
    
    # azure_credential = ManagedIdentityCredential(identity_config={"resource_id": UAMI_RESOURCE_ID})


    AZURE_OPENAI_EMBEDDING_ENDPOINT = os.environ["AZURE_OPENAI_ENDPOINT"]
    AZURE_OPENAI_EMBEDDING_DEPLOYMENT = os.environ["AZURE_OPENAI_EMBEDDING_MODEL"]
    AZURE_OPENAI_EMBEDDING_MODEL = os.environ["AZURE_OPENAI_EMBEDDING_MODEL"]

    # UAMI_ID = os.environ["UAMI_ID"]
    UAMI_RESOURCE_ID = os.environ["UAMI_RESOURCE_ID"]

    AZURE_SEARCH_ENDPOINT = os.environ["AZURE_SEARCH_SERVICE_ENDPOINT"]

    AZURE_STORAGE_ENDPOINT =  os.getenv("AZURE_STORAGE_ACCOUNT_ENDPOINT")
    AZURE_STORAGE_CONNECTION_STRING =  f"ResourceId={os.getenv('AZURE_STORAGE_ACCOUNT_ID')}"

    blob_service_client = BlobServiceClient(AZURE_STORAGE_ENDPOINT, azure_credential)

    source_directory = f"{os.path.dirname(__file__)}/./data/ai-search-index"
    entries = os.listdir(source_directory)
    folders = [entry for entry in entries if os.path.isdir(os.path.join(source_directory, entry))]

    for index_name in folders:
        print(index_name)

        

        setup_index(azure_credential,
                    azure_storage_endpoint=AZURE_STORAGE_ENDPOINT,
            index_name=f"{index_name}",
            # uami_id=UAMI_ID,
            uami_resource_id=UAMI_RESOURCE_ID,
            azure_search_endpoint=AZURE_SEARCH_ENDPOINT,
            azure_storage_connection_string=AZURE_STORAGE_CONNECTION_STRING,
            azure_storage_container=index_name,
            azure_openai_embedding_endpoint=AZURE_OPENAI_EMBEDDING_ENDPOINT,
            azure_openai_embedding_deployment=AZURE_OPENAI_EMBEDDING_DEPLOYMENT,
            azure_openai_embedding_model=AZURE_OPENAI_EMBEDDING_MODEL,
            azure_openai_embeddings_dimensions=EMBEDDINGS_DIMENSIONS)

        upload_documents(azure_credential,
            indexer_name=f"{index_name}",
            source_folder=os.path.join(source_directory, index_name),
            azure_search_endpoint=AZURE_SEARCH_ENDPOINT,
            azure_storage_endpoint=AZURE_STORAGE_ENDPOINT,
            azure_storage_container=index_name)
