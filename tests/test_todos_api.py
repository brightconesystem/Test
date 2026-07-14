# AC-4: Backend todo API supports list/create/update/delete operations with the exact contract shape.
# AC-5: Invalid todo input is rejected with a clear client-error response.

import os

os.environ.setdefault("DATABASE_URL", "sqlite:///./test.db")

import pytest
from fastapi.testclient import TestClient

from app.database import Base, SessionLocal, engine
from app.models.todo import Todo
from main import app


@pytest.fixture(autouse=True)
def reset_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def client():
    return TestClient(app)


@pytest.fixture()
def db_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture()
def seeded_todo(db_session):
    todo = Todo(title="Write tests", completed=False)
    db_session.add(todo)
    db_session.commit()
    db_session.refresh(todo)
    return todo


def test_get_api_todos_returns_bare_json_array_with_expected_shape(client, seeded_todo):
    response = client.get("/api/todos")

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert data == [{"id": seeded_todo.id, "title": "Write tests", "completed": False}]


def test_post_api_todos_creates_todo_and_returns_contract_shape(client):
    response = client.post("/api/todos", json={"title": "Ship release"})

    assert response.status_code == 201
    data = response.json()
    assert set(data.keys()) == {"id", "title", "completed"}
    assert data["title"] == "Ship release"
    assert data["completed"] is False
    assert isinstance(data["id"], int)


def test_patch_api_todos_id_toggles_completed_and_returns_updated_todo(client, seeded_todo):
    response = client.patch(f"/api/todos/{seeded_todo.id}", json={"completed": True})

    assert response.status_code == 200
    data = response.json()
    assert data == {"id": seeded_todo.id, "title": "Write tests", "completed": True}


def test_patch_api_todos_id_updates_title_and_returns_updated_todo(client, seeded_todo):
    response = client.patch(f"/api/todos/{seeded_todo.id}", json={"title": "Review tests"})

    assert response.status_code == 200
    data = response.json()
    assert data == {"id": seeded_todo.id, "title": "Review tests", "completed": False}


def test_delete_api_todos_id_returns_no_content_and_removes_row(client, seeded_todo):
    response = client.delete(f"/api/todos/{seeded_todo.id}")

    assert response.status_code == 204
    assert response.content == b""
    follow_up = client.get("/api/todos")
    assert follow_up.json() == []


@pytest.mark.parametrize("payload", [{"title": ""}, {"title": "   "}, {"title": "\t\n"}])
def test_post_api_todos_rejects_blank_titles_with_422(client, payload):
    response = client.post("/api/todos", json=payload)

    assert response.status_code == 422
    assert response.json()["detail"]


@pytest.mark.parametrize("payload", [{"title": ""}, {"title": "   "}, {"title": "\t\n"}])
def test_patch_api_todos_id_rejects_blank_titles_with_422(client, seeded_todo, payload):
    response = client.patch(f"/api/todos/{seeded_todo.id}", json=payload)

    assert response.status_code == 422
    assert response.json()["detail"]
