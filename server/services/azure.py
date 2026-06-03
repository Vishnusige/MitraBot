import os
from dotenv import load_dotenv

try:
    from langchain.chat_models import ChatGoogleGenerativeAI
except ImportError:
    try:
        from langchain_community.chat_models import ChatGoogleGenerativeAI
    except ImportError:
        try:
            from langchain_google_community.chat_models import ChatGoogleGenerativeAI
        except ImportError as exc:
            raise ImportError(
                "ChatGoogleGenerativeAI is required for Gemini integration. "
                "Install langchain-google-community, langchain-community, or a compatible LangChain version."
            ) from exc

try:
    from langchain.embeddings import GoogleVertexAIEmbeddings
except ImportError:
    try:
        from langchain_community.embeddings import GoogleVertexAIEmbeddings
    except ImportError:
        try:
            from langchain_google_community.embeddings import GoogleVertexAIEmbeddings
        except ImportError:
            try:
                from langchain_google_community import GoogleVertexAIEmbeddings
            except ImportError as exc:
                raise ImportError(
                    "GoogleVertexAIEmbeddings is required for Gemini embeddings. "
                    "Install langchain-google-community, langchain-community, or a compatible LangChain version."
                ) from exc


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

    embedding_model = GoogleVertexAIEmbeddings(
        api_key=api_key,
        model="textembedding-gecko-001",
    )

    return embedding_model
