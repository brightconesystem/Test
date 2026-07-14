# Test

Initialized by BrightWorks.

## Quick start

### Prerequisites

- PostgreSQL (for backend persistence)
- Node.js (v20)
- Python (v3.12)

### Environment variables

Backend uses `backend/.env.example`.

```bash
cp backend/.env.example backend/.env
```

This sets:

- `DATABASE_URL` (PostgreSQL connection string)
- `VITE_FRONTEND_ORIGIN` (CORS allowed origin)

### Run the backend (FastAPI)

```bash
cd backend
python -m pip install --upgrade pip
pip install -r requirements.txt

uvicorn main:app --reload --port 8000
```

Backend exposes:

- `GET /api/todos`
- `POST /api/todos`
- `PATCH /api/todos/{id}`
- `DELETE /api/todos/{id}`

### Run the frontend (React)

```bash
cd frontend
npm ci
npm run dev
```

The UI expects the API base URL from `VITE_API_BASE_URL` (Vite).

### Run both locally

In one terminal per process:

1. Backend on `http://localhost:8000`
2. Frontend on `http://localhost:5173`

If your frontend does not reach the backend, set `VITE_API_BASE_URL=http://localhost:8000` when starting the frontend.

## Test suite

### Backend tests

```bash
cd backend
pytest
```

### Frontend tests

```bash
cd frontend
npm test -- --run
```

## CI (GitHub Actions) and secret scanning

The repository uses `.github/workflows/ci.yml`.

- **backend-tests**: starts a PostgreSQL service container, sets `DATABASE_URL`, installs backend deps, and runs `pytest`.
- **frontend-tests**: installs frontend deps and runs `npm test -- --run`.
- **trufflehog**: runs `trufflesecurity/trufflehog@v3.84.0` with:
  - `path: .`
  - `base: HEAD~1`
  - `head: HEAD`
  - `--no-update --fail --json`

TruffleHog exclusions are defined in `.trufflehog.yml` (e.g. `frontend/package-lock.json`, `backend/.env.example`).
