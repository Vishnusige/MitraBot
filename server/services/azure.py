import os
from dotenv import load_dotenv
from langchain_openai import AzureChatOpenAI, AzureOpenAIEmbeddings
import sys

def get_azure_openai_variables():
    load_dotenv()
    AOAI_ENDPOINT = os.environ.get("AOAI_ENDPOINT")
    AOAI_KEY = os.environ.get("AOAI_KEY")
    AOAI_API_VERSION = "2024-05-01-preview"

    if not AOAI_ENDPOINT or not AOAI_KEY:
        sys.exit("Environment variables AOAI_ENDPOINT or AOAI_KEY are not set.")

    return AOAI_ENDPOINT, AOAI_KEY, AOAI_API_VERSION

def get_azure_openai_llm():
    AOAI_ENDPOINT, AOAI_KEY, AOAI_API_VERSION = get_azure_openai_variables()

    llm = AzureChatOpenAI(
        temperature=0.3,
        openai_api_version=AOAI_API_VERSION,
        azure_endpoint=AOAI_ENDPOINT,
        openai_api_key=AOAI_KEY,
        model="gpt-4"
    )

    return llm

def get_azure_openai_embeddings():
    AOAI_ENDPOINT, AOAI_KEY, AOAI_API_VERSION = get_azure_openai_variables()

    embedding_model = AzureOpenAIEmbeddings(
        openai_api_version=AOAI_API_VERSION,
        azure_endpoint=AOAI_ENDPOINT,
        openai_api_key=AOAI_KEY,
        model="text-embedding-ada-002" 
    )

    return embedding_model