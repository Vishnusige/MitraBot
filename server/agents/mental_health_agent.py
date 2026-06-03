"""
This module defines a class used to generate AI agents centered around mental health applications.
"""

# -- Standard libraries --
from datetime import datetime
import logging
import json
import asyncio
from operator import itemgetter

# -- Langchain --
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.chat_history import BaseChatMessageHistory
from langchain.memory.chat_memory import BaseChatMemory
from langchain.memory.summary import ConversationSummaryMemory
from langchain_core.runnables import RunnablePassthrough
from langchain.agents import create_tool_calling_agent, AgentExecutor
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_mongodb.chat_message_histories import MongoDBChatMessageHistory
from langchain_core.messages import trim_messages
from langchain_core.messages.human import HumanMessage

# -- Custom modules --
from .ai_agent import AIAgent
from services.azure_mongodb import MongoDBClient
from utils.consts import SYSTEM_MESSAGE
from utils.consts import PROCESSING_STEP


class MentalHealthAIAgent(AIAgent):

    def __init__(
        self,
        system_message: str = SYSTEM_MESSAGE,
        tool_names: list[str] = []
    ):

        super().__init__(system_message, tool_names)

        self.prompt = ChatPromptTemplate.from_messages(
            [
                ("system", self.system_message.content),
                ("system", "{past_summaries}"),
                ("system", "You can retrieve information about the AI using the 'agent_facts' tool."),
                ("system", "You can generate suggestions using the 'generate_suggestions' tool."),
                ("system", "You can search for information using the 'web_search_google' tool."),
                ("system", "You can search for information using the 'web_search_bing' tool."),
                ("system", "You can search for information using the 'web_search_youtube' tool."),
                ("system", "You can search for information using the 'web_search_tavily' tool."),
                ("system", "You can search for locations using the 'location_search_gplaces' tool."),
                ("system", "You can retrieve your user profile using the 'user_profile_retrieval' tool."),
                ("system", "You can retrieve your user journey using the 'user_journey_retrieval' tool."),
                ("system", "user_id:{user_id}"),
                MessagesPlaceholder(variable_name="chat_turns"),
                ("human", "{input}"),
                MessagesPlaceholder(variable_name="agent_scratchpad"),
            ]
        )

        self.agent = create_tool_calling_agent(
            self.llm,
            self.tools,
            self.prompt
        )

        executor: AgentExecutor = AgentExecutor(
            agent=self.agent,
            tools=self.tools,
            verbose=True,
            handle_parsing_errors=True
        )

        self.agent_executor = self.get_agent_with_history(executor)

    def get_session_history(
        self,
        session_id: str
    ) -> MongoDBChatMessageHistory:

        CONNECTION_STRING = MongoDBClient.get_mongodb_variables()

        history = MongoDBChatMessageHistory(
            CONNECTION_STRING,
            session_id,
            MongoDBClient.get_db_name(),
            collection_name="chat_turns"
        )

        logging.info(f"Retrieved chat history for session {session_id}")

        return history

    def get_agent_memory(
        self,
        user_id: str,
        chat_id: int
    ) -> BaseChatMemory:

        memory = None

        return memory

    def get_agent_with_history(
        self,
        agent_executor
    ) -> RunnableWithMessageHistory:

        agent_with_history = RunnableWithMessageHistory(
            agent_executor,
            get_session_history=self.get_session_history,
            input_messages_key="input",
            history_messages_key="chat_turns",
            verbose=True
        )

        return agent_with_history

    def get_agent_executor(self, prompt):

        tools = self.get_agent_tools()

        agent = create_tool_calling_agent(
            self.llm,
            tools,
            prompt
        )

        agent_executor = AgentExecutor(
            agent=agent,
            tools=tools,
            verbose=True,
            handle_parsing_errors=True
        )

        return agent_executor

    def get_suggestions_based_on_mood(
        self,
        user_id,
        chat_id,
        user_input
    ):

        mood = self.get_user_mood(user_id, chat_id)

        suggestions = self.tools["generate_suggestions"].func(
            mood,
            user_input
        )

        return suggestions

    def get_user_mood(self, user_id, chat_id):

        history: BaseChatMessageHistory = self.get_session_history(
            f"{user_id}-{chat_id}"
        )

        history_log = asyncio.run(history.aget_messages())

        instructions = """
        Given the messages provided, describe the user's mood in a single adjective.
        Do your best to capture their intensity, attitude and disposition in that single word.
        Do not include anything in your response aside from that word.
        If you cannot complete this task, just answer "None".
        """

        prompt = ChatPromptTemplate.from_messages(
            [
                ("system", instructions),
                MessagesPlaceholder(variable_name="messages"),
            ]
        )

        trimmer = trim_messages(
            max_tokens=65,
            strategy="last",
            token_counter=self.llm,
            include_system=True,
            allow_partial=False,
            start_on="human",
        )

        trimmer.invoke(history_log)

        chain = (
            RunnablePassthrough.assign(
                messages=itemgetter("messages") | trimmer
            )
            | prompt
            | self.llm
        )

        response = chain.invoke({"messages": history_log})

        user_mood = (
            None
            if response.content == "None"
            else response.content
        )

        print("The user is feeling:", user_mood)

        return user_mood

    @staticmethod
    def get_chat_id(user_id):

        db_client = MongoDBClient.get_client()
        db_name = MongoDBClient.get_db_name()
        db = db_client[db_name]

        chat_summary_collection = db["chat_summaries"]

        most_recent_chat_summary = chat_summary_collection.find_one(
            {"user_id": user_id},
            sort=[("chat_id", -1)]
        )

        if not most_recent_chat_summary:
            return None

        return most_recent_chat_summary.get("chat_id")

    def run(
        self,
        message: str,
        with_history: bool = True,
        user_id: str = None,
        chat_id: int = None,
        turn_id: int = None,
    ) -> str:

        try:

            # SAFETY FIX
            if chat_id is None:
                chat_id = int(datetime.now().timestamp())

            session_id = f"{user_id}-{chat_id}"

            logging.info(f"SESSION ID: {session_id}")
            logging.info(f"USER MESSAGE: {message}")


            db_client = MongoDBClient.get_client()
            db_name = MongoDBClient.get_db_name()
            db = db_client[db_name]

            chat_summary_collection = db["chat_summaries"]

            past_summaries_cursor = (
                chat_summary_collection.find(
                    {"user_id": user_id}
                ).sort("chat_id", -1)
            )

            past_summaries = list(past_summaries_cursor)

            summaries_text = "\n".join(
                [
                    summary.get("summary_text", "")
                    for summary in past_summaries
                ]
            )

            logging.info("RUNNING AGENT EXECUTOR")

            invocation = self.agent_executor.invoke(
                {
                    "input": message,
                    "user_id": user_id,
                    "past_summaries": summaries_text,
                    "agent_scratchpad": [],
                },
                config={
                    "configurable": {
                        "session_id": session_id
                    }
                },
            )

            logging.info(f"Invocation result: {invocation}")

            response = invocation["output"]

            if isinstance(response, dict):
                response = json.dumps(response)

            elif not isinstance(response, str):
                response = str(response)

            logging.info(f"FINAL RESPONSE: {response}")

            return response

        except Exception as e:

            logging.exception("AGENT RUN FAILED")

            return f"Backend Error: {str(e)}"

    def get_initial_greeting(self, user_id: str) -> dict:

        db_client = MongoDBClient.get_client()
        db_name = MongoDBClient.get_db_name()
        db = db_client[db_name]

        user_journey_collection = db["user_journeys"]
        chat_summary_collection = db["chat_summaries"]

        user_journey = user_journey_collection.find_one(
            {"user_id": user_id}
        )

        now = datetime.now()

        chat_id = int(now.timestamp())

        chat_summary_collection.insert_one(
            {
                "user_id": user_id,
                "chat_id": chat_id,
                "perceived_mood": "",
                "summary_text": "",
                "concerns_progress": []
            }
        )

        if user_journey is None:

            user_journey_collection.insert_one(
                {
                    "user_id": user_id,
                    "patient_goals": [],
                    "therapy_type": [],
                    "last_updated": datetime.now().isoformat(),
                    "therapy_plan": [],
                    "mental_health_concerns": []
                }
            )

        response = self.run(
            message="Hello",
            with_history=True,
            user_id=user_id,
            chat_id=chat_id,
            turn_id=0,
        )

        return {
            "message": response,
            "chat_id": chat_id
        }

    def get_summary_from_chat_history(
        self,
        user_id,
        chat_id
    ):

        history: BaseChatMessageHistory = self.get_session_history(
            f"{user_id}-{chat_id}"
        )

        memory = ConversationSummaryMemory(
            llm=self.llm,
            chat_memory=history,
            return_messages=True
        )

        for msg in asyncio.run(history.aget_messages()):

            if isinstance(msg, HumanMessage):

                memory.save_context(
                    {"input": msg.content},
                    {}
                )

            else:

                memory.save_context(
                    {},
                    {"output": msg.content}
                )

        summary = memory.load_memory_variables(
            {}
        ).get("history", "")

        print(f"Generated summary: {summary}")

        return summary

    def perform_final_processes(
        self,
        user_id,
        chat_id
    ):

        db_client = MongoDBClient.get_client()
        db_name = MongoDBClient.get_db_name()
        db = db_client[db_name]

        chat_summary_collection = db["chat_summaries"]

        mood = self.get_user_mood(user_id, chat_id)

        summary = self.get_summary_from_chat_history(
            user_id,
            chat_id
        )

        result = chat_summary_collection.update_one(
            {
                "user_id": user_id,
                "chat_id": int(chat_id)
            },
            {
                "$set": {
                    "perceived_mood": mood,
                    "summary_text": summary
                }
            }
        )

        print(result)