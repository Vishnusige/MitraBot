import os
from dotenv import load_dotenv
from langchain_openai import AzureChatOpenAI, AzureOpenAIEmbeddings


class MissingAzureOpenAIConfig(RuntimeError):
    """Raised when Azure OpenAI credentials are not configured."""

def get_azure_openai_variables():
    load_dotenv()
    AOAI_ENDPOINT = os.environ.get("AOAI_ENDPOINT")
    AOAI_KEY = os.environ.get("AOAI_KEY")
    AOAI_API_VERSION = os.environ.get("AOAI_API_VERSION", "2024-05-01-preview")

    if not AOAI_ENDPOINT or not AOAI_KEY:
        raise MissingAzureOpenAIConfig(
            "Environment variables AOAI_ENDPOINT or AOAI_KEY are not set."
        )

    return AOAI_ENDPOINT, AOAI_KEY, AOAI_API_VERSION

def get_azure_openai_llm():
    AOAI_ENDPOINT, AOAI_KEY, AOAI_API_VERSION = get_azure_openai_variables()

    llm = AzureChatOpenAI(
        temperature=0.3,
        openai_api_version=AOAI_API_VERSION,
        azure_endpoint=AOAI_ENDPOINT,
        openai_api_key=AOAI_KEY,
        azure_deployment=os.environ.get("COMPLETIONS_DEPLOYMENT_NAME", "gpt-4"),
    )

    return llm

def get_azure_openai_embeddings():
    AOAI_ENDPOINT, AOAI_KEY, AOAI_API_VERSION = get_azure_openai_variables()

    embedding_model = AzureOpenAIEmbeddings(
        openai_api_version=AOAI_API_VERSION,
        azure_endpoint=AOAI_ENDPOINT,
        openai_api_key=AOAI_KEY,
        azure_deployment=os.environ.get(
            "EMBEDDINGS_DEPLOYMENT_NAME",
            "text-embedding-ada-002"
        ),
    )

    return embedding_model
