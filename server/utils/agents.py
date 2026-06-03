""" This module contains the agent functions that interact with the external APIs. """
import os
from langchain_google_community import  GoogleSearchAPIWrapper, GoogleSearchResults, GooglePlacesTool, GooglePlacesAPIWrapper
from langchain_community.utilities import BingSearchAPIWrapper
from langchain_community.tools import YouTubeSearchTool
from azure.core.credentials import AzureKeyCredential
from azure.ai.textanalytics import TextAnalyticsClient


# Initialize Azure Text Analytics Client
text_analytics_key = os.getenv("AZURE_TEXT_ANALYTICS_KEY")
text_analytics_endpoint = os.getenv("AZURE_TEXT_ANALYTICS_ENDPOINT")

text_analytics_client = None

if text_analytics_key and text_analytics_endpoint:
    text_analytics_client = TextAnalyticsClient(
        endpoint=text_analytics_endpoint,
        credential=AzureKeyCredential(text_analytics_key)
    )




def get_google_search_results(query):
    """
    Uses Google Custom Search to fetch search results for a given query.

    Args:
        query (str): The search query.

    Returns:
        list: A list of search results with titles and links.
    """

    try:
        google_search_wrapper = GoogleSearchAPIWrapper(k=3)
        search_results = google_search_wrapper.run(query)
        print("Search results obtained:", search_results)

        # Ensure the results are JSON-serializable
        
        return search_results
    
    except Exception as e:
        print(f"Failed to fetch Google search results: {e}", exc_info=True)
        return None
    



    
def get_youtube_search_results(query):
    """
    Uses YouTube Search to fetch search results for a given query.

    Args:
        query (str): The search query.

    Returns:
        list: A list of search results with titles, descriptions, and video links.
    """
    try:
        youtube_search_tool = YouTubeSearchTool()
        search_results = youtube_search_tool.run(query)
        print("Search results obtained:", search_results)

        # Ensure the results are JSON-serializable
        return search_results

    except Exception as e:
        print(f"Failed to fetch YouTube search results: {e}", exc_info=True)
        return None





def get_bing_search_results(query):
    """
    Uses Bing Search to fetch search results for a given query.

    Args:
        query (str): The search query.

    Returns:
        list: A list of search results with titles and links.
    """
    try:
        bing_search_wrapper = BingSearchAPIWrapper()
        search_results = bing_search_wrapper.run(query)
        print("Search results obtained:", search_results)

        # Ensure the results are JSON-serializable
        return search_results

    except Exception as e:
        print(f"Failed to fetch Bing search results: {e}", exc_info=True)
        return None
    

def generate_suggestions(mood, user_input):
    """
    Generates personalized suggestions based on mood.
    """

    # Fallback if Azure API is unavailable
    if text_analytics_client is None:
        return [
            "Try taking deep breaths and relaxing for a few minutes.",
            "Consider journaling your thoughts and feelings.",
            "Talking to a trusted friend or family member may help.",
            "Take short breaks and maintain a healthy routine."
        ]

    try:
        sentiment_response = text_analytics_client.analyze_sentiment(
            documents=[{"id": "1", "text": user_input}]
        )

        sentiment = sentiment_response[0].sentiment

        prompt = f"Suggest some personalized activities or coping mechanisms for someone who is feeling {mood} and has a sentiment of {sentiment}."

        response = text_analytics_client.analyze_sentiment(
            documents=[{"id": "2", "text": prompt}]
        )

        suggestions = response[0].sentiment.split('\n')

        return suggestions

    except Exception as e:
        print(f"Suggestion generation failed: {e}")

        return [
            "Practice mindfulness or meditation.",
            "Try listening to calming music.",
            "Maintain a healthy sleep schedule."
        ]



