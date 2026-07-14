# Local development (FastAPI + React)

This repository contains:
- FastAPI backend in `backend/` (PostgreSQL via `DATABASE_URL`)
- React frontend in `frontend/`

## Prerequisites
- Node.js 20+
- Python 3.12+
- PostgreSQL

## Backend (FastAPI)

### 1) Configure environment
Copy the example env file:

```bash
cd backend
cp .env.example .env
```

Update at least `DATABASE_URL` to point at your local PostgreSQL database.

### 2) Install dependencies

```bash
cd backend
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### 3) Run the API

```bash
cd backend
uvicorn main:app --reload --port 8000
```

The API exposes the todo endpoints under `/api/todos`.

### API endpoints used by the frontend
- `GET /api/todos` → `[{"id": number, "title": string, "completed": boolean}, ...]`
- `POST /api/todos` → `201 {"id": number, "title": string, "completed": boolean}` with body `{"title": string}`
- `PATCH /api/todos/{id}` → `200 {"id": number, "title": string, "completed": boolean}` with optional body `{"title"?: string, "completed"?: boolean}`
- `DELETE /api/todos/{id}` → `204 No Content`

Validation behavior (implemented via Pydantic):
- `title` must not be blank/whitespace-only
- blank titles are rejected with `422 Unprocessable Entity`

## Frontend (React)

### 1) Install dependencies

```bash
cd frontend
npm ci
```

### 2) Run the React app

```bash
cd frontend
npm run dev
```

The dev server runs on port `5173`.

### Configure the API base URL
The frontend API client uses `VITE_API_BASE_URL` (via `import.meta.env`).

If you run the backend at `http://localhost:8000`, start the frontend with:

```bash
cd frontend
VITE_API_BASE_URL=http://localhost:8000 npm run dev
```

## Running both locally

Open two terminals:

1) Backend

```bash
cd backend
uvicorn main:app --reload --port 8000
```

2) Frontend

```bash
cd frontend
VITE_API_BASE_URL=http://localhost:8000 npm run dev
```

## Running tests

### Backend tests

From `backend/`:

```bash
cd backend
pytest
```

CI provisions a PostgreSQL service. Locally, tests default to SQLite if `DATABASE_URL` is not set (see `tests/test_todos_api.py`).

### Frontend tests

From `frontend/`:

```bash
cd frontend
npm test -- --run
```
