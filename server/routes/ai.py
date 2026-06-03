import logging

from flask import jsonify
from flask import Blueprint, request
import json
from datetime import datetime
from services.speech_service import speech_to_text
from agents.mental_health_agent import MentalHealthAIAgent
from services.azure import MissingAzureOpenAIConfig
from services.azure_mongodb import MongoDBClient

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

ai_routes = Blueprint("ai", __name__)


def _create_fallback_chat(user_id):
    db = MongoDBClient.get_client()[MongoDBClient.get_db_name()]
    user_journey_collection = db["user_journeys"]
    chat_summary_collection = db["chat_summaries"]
    chat_id = int(datetime.now().timestamp())

    chat_summary_collection.insert_one(
        {
            "user_id": user_id,
            "chat_id": chat_id,
            "perceived_mood": "",
            "summary_text": "",
            "concerns_progress": []
        }
    )

    user_journey_collection.update_one(
        {"user_id": user_id},
        {
            "$setOnInsert": {
                "user_id": user_id,
                "patient_goals": [],
                "therapy_type": [],
                "last_updated": datetime.now().isoformat(),
                "therapy_plan": [],
                "mental_health_concerns": []
            }
        },
        upsert=True
    )

    return chat_id


def _fallback_response(message):
    return f"MitraBot response: I received your message -> {message}"


@ai_routes.post("/ai/mental_health/welcome/<user_id>")
def get_mental_health_agent_welcome(user_id):

    try:
        agent = MentalHealthAIAgent(
            tool_names=[
                "generate_suggestions",
                "web_search_youtube",
                "web_search_tavily",
                "wiki_search",
                "web_search_bing",
                "location_search_gplaces",
                "web_search_google",
                "user_profile_retrieval",
                "agent_facts",
            ]
        )

        response = agent.get_initial_greeting(user_id=user_id)

        if response is None:
            logger.error(f"No greeting found for user {user_id}")
            return jsonify({"error": "Greeting not found"}), 404

    except MissingAzureOpenAIConfig:
        chat_id = _create_fallback_chat(user_id)
        response = {
            "message": _fallback_response("Hello"),
            "chat_id": chat_id
        }

    return jsonify(response), 200


@ai_routes.post("/ai/mental_health/<user_id>/<chat_id>")
def run_mental_health_agent(user_id, chat_id):

    body = request.get_json()

    if not body:
        return jsonify({"error": "No data provided"}), 400

    prompt = body.get("prompt")
    turn_id = body.get("turn_id")

    try:

        logger.info(f"Prompt: {prompt}")
        logger.info(f"User ID: {user_id}")
        logger.info(f"Chat ID: {chat_id}")
        logger.info(f"Turn ID: {turn_id}")

        agent = MentalHealthAIAgent(
            tool_names=[
                "generate_suggestions",
                "web_search_youtube",
                "web_search_google",
                "web_search_tavily",
                "location_search_gplaces",
                "web_search_bing",
                "user_profile_retrieval",
                "agent_facts",
                "user_journey_retrieval",
            ]
        )

        response = agent.run(
            message=prompt,
            with_history=True,
            user_id=user_id,
            chat_id=int(chat_id),
            turn_id=turn_id + 1,
        )

        logger.info(f"Agent response: {response}")

        return jsonify(response), 200

    except MissingAzureOpenAIConfig:
        return jsonify(_fallback_response(prompt)), 200

    except json.JSONDecodeError as e:

        logger.error(f"JSON parsing error: {str(e)}")

        return jsonify({"error": "Invalid JSON format"}), 400

    except Exception as e:

        logger.exception("FULL AI ROUTE ERROR")

        return jsonify({"error": str(e)}), 500


@ai_routes.patch("/ai/mental_health/finalize/<user_id>/<chat_id>")
def set_mental_health_end_state(user_id, chat_id):

    try:

        logger.info(f"Finalizing chat {chat_id} for user {user_id}")

        agent = MentalHealthAIAgent(
            tool_names=[
                "generate_suggestions",
                "web_search_youtube",
                "web_search_tavily",
                "web_search_bing",
                "location_search_gplaces",
                "web_search_google",
                "user_profile_retrieval",
                "agent_facts",
            ]
        )

        agent.perform_final_processes(user_id, chat_id)

        return jsonify(
            {"message": "Chat session finalized successfully"}
        ), 200

    except Exception as e:

        logger.error(
            f"Error during finalizing chat: {e}",
            exc_info=True
        )

        return jsonify({"error": "Failed to finalize chat"}), 500


@ai_routes.post("/ai/mental_health/voice-to-text")
def handle_voice_input():

    if "audio" not in request.files:
        return jsonify({"error": "Audio file is required"}), 400

    voice_data = request.files["audio"]

    text_output = speech_to_text(voice_data)

    if text_output:
        return jsonify({"message": text_output}), 200

    else:
        return jsonify({"error": "Speech recognition failed"}), 400
