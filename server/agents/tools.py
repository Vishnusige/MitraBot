import os
#from langchain_community.tools.tavily_search import TavilySearchResults
from utils.docs import format_docs
from services.db.user import get_user_profile_by_user_id
from services.db.user_journey import get_user_journey_by_user_id
from langchain.tools import Tool
from utils.agents import get_google_search_results, get_bing_search_results, get_youtube_search_results, generate_suggestions
#from langchain_google_community import GooglePlacesTool




def get_vector_store_chain(agent, collection_name:str):
    return agent._get_cosmosdb_vector_store_retriever(collection_name) | format_docs


def vector_store_chain_factory(collection_name) -> callable:
    collection_name = collection_name
    return lambda x: get_vector_store_chain(collection_name=collection_name)



toolbox = {
    "community": {},

    "custom": {
        "generate_suggestions": {
            "func": generate_suggestions,
            "description": "Generates personalized activities or coping mechanisms based on the user's mood.",
            "structured": True
        },

        "web_search_bing": {
            "func": get_bing_search_results,
            "description": "Fetches Bing search results.",
            "retriever": False,
            "structured": True
        },

        "web_search_google": {
            "func": get_google_search_results,
            "description": "Fetches Google search results.",
            "retriever": False,
            "structured": True
        },

        "web_search_youtube": {
            "func": get_youtube_search_results,
            "description": "Fetches YouTube search results.",
            "retriever": False,
            "structured": True
        }
    }
}


