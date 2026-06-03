import pytest
import sys
import os

# Add the `server` directory to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import run_app
from services.azure_mongodb import MongoDBClient

@pytest.fixture
def app():
    # Ensure `run_app()` returns the correct number of values
    app, jwt, mail = run_app()  # Unpack the tuple returned by `run_app()`
    context = app.app_context()  # Now you can call `app.app_context()`
    context.push()
    yield app  # Yield the app instance for tests
    context.pop()  # Clean up the context after the test


@pytest.fixture
def db():
    db_client = MongoDBClient.get_client()
    db = db_client[MongoDBClient.get_db_name()]
    yield db
    db_client.close()
