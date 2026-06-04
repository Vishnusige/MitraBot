import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings


class MissingGoogleAPIKeyConfig(RuntimeError):
    """Raised when Google API credentials are not configured."""

def get_google_api_key():
    load_dotenv()
    GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")

    if not GOOGLE_API_KEY:
        raise MissingGoogleAPIKeyConfig(
            "Environment variable GOOGLE_API_KEY is not set."
        )

    return GOOGLE_API_KEY

def get_google_llm():
    api_key = get_google_api_key()

    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        temperature=0.3,
        api_key=api_key,
    )

    return llm

def get_google_embeddings():
    api_key = get_google_api_key()

    embedding_model = GoogleGenerativeAIEmbeddings(
        google_api_key=api_key,
        model="models/embedding-001",
    )

    return embedding_model
