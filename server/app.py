"""
API entrypoint for backend API using MongoDB.
"""

from dotenv import load_dotenv
import os
from threading import Thread

from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_pymongo import PyMongo
from flask_mail import Mail

from services.scheduler_main import NotificationScheduler
from models.subscription import db as sub_db
from services.db.agent_facts import load_agent_facts_to_db
from config.config import Config
from routes import register_blueprints
from utils.update_agent_facts import update_agent_facts_in_db

# Load environment variables
load_dotenv()

# Initialize PyMongo
mongo = PyMongo()


def setup_sub_db(app):
    """
    Initialize and set up the MongoDB database.
    """

    app.config["MONGO_URI"] = "mongodb://localhost:27017/mydatabase"

    mongo.init_app(app)

    with app.app_context():

        db = mongo.db

        if "subscriptions" not in db.list_collection_names():

            db.subscriptions.insert_one(
                {
                    "example_field": "Initial Data"
                }
            )

        print(
            "MongoDB setup complete. Available collections:",
            db.list_collection_names()
        )


def run_app():
    """
    Main application setup.
    """

    # Update agent facts in the database
    update_agent_facts_in_db()

    # Create Flask app
    static_folder = os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..", "client", "dist")
    )

    app = Flask(__name__, static_folder=static_folder, static_url_path="")

    # Load config
    app.config.from_object(Config)

    # -----------------------------
    # FIXED CORS CONFIG
    # -----------------------------
    CORS(
        app,
        resources={
            r"/*": {
                "origins": [
                    "http://localhost:3000",
                    "http://127.0.0.1:3000",
                    os.getenv("FRONTEND_ORIGIN", "")
                ]
            }
        },
        supports_credentials=True
    )

    # Debugging statements
    print("SECRET_KEY:", app.config.get("SECRET_KEY"))
    print(
        "SECURITY_PASSWORD_SALT:",
        app.config.get("SECURITY_PASSWORD_SALT")
    )

    print(
        "Loaded SECURITY_PASSWORD_SALT:",
        os.getenv("SECURITY_PASSWORD_SALT")
    )

    # Initialize extensions
    mail = Mail(app)

    jwt = JWTManager(app)

    # Register all routes
    register_blueprints(app)

    # -----------------------------
    # ROOT ROUTE
    # -----------------------------
    @app.get("/")
    def root():
        index_path = os.path.join(app.static_folder, "index.html")
        if os.path.exists(index_path):
            return send_from_directory(app.static_folder, "index.html")
        return {
            "status": "ready"
        }

    # -----------------------------
    # TEST ROUTE
    # -----------------------------
    @app.get("/health")
    def health():

        return jsonify(
            {
                "message": "Server running successfully"
            }
        ), 200

    # -----------------------------
    # NOTIFICATION SCHEDULER
    # -----------------------------
    scheduler = NotificationScheduler(app)

    notification_thread = Thread(
        target=scheduler.run_scheduler
    )

    notification_thread.daemon = True

    notification_thread.start()

    # -----------------------------
    # TEST NOTIFICATION ROUTE
    # -----------------------------
    @app.route("/test-notification")
    def test_notification():

        user_id = "66d7b0c05a0e718dd3ea783d"

        check_in_id = "66d901c021a63476598fe1c1"

        message = "This is a test notification."

        scheduler.send_notification(
            user_id,
            check_in_id,
            message
        )

        return jsonify(
            {
                "message": "Test notification sent"
            }
        )

    return app, jwt, mail


app, jwt, mail = run_app()


@app.get("/<path:path>")
def serve_client(path):
    requested_path = os.path.join(app.static_folder, path)
    if os.path.exists(requested_path) and not os.path.isdir(requested_path):
        return send_from_directory(app.static_folder, path)

    index_path = os.path.join(app.static_folder, "index.html")
    if os.path.exists(index_path):
        return send_from_directory(app.static_folder, "index.html")

    return jsonify({"status": "ready"}), 200


if __name__ == "__main__":

    # Setup MongoDB
    setup_sub_db(app)

    # Load initial agent facts
    load_agent_facts_to_db()

    # Host + Port
    HOST = os.getenv("FLASK_RUN_HOST", "0.0.0.0")

    PORT = int(
        os.getenv("FLASK_RUN_PORT", 8000)
    )

    print(f"Running server on {HOST}:{PORT}")

    # Run app
    app.run(
        debug=True,
        host=HOST,
        port=PORT
    )
