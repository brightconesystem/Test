# CI checks (GitHub Actions + TruffleHog)

CI is defined in `.github/workflows/ci.yml`.

## Jobs

### Backend tests (`backend-tests`)
Runs on every `push` and `pull_request`.

- Starts a PostgreSQL 16 container as a GitHub Actions service
- Sets `DATABASE_URL` to the service connection string
- Installs backend dependencies from `backend/requirements.txt`
- Runs:

```bash
pytest
```

`working-directory` is `backend/`.

### Frontend tests (`frontend-tests`)
- Installs frontend dependencies with `npm ci`
- Runs:

```bash
npm test -- --run
```

`working-directory` is `frontend/`.

### Secret scanning (`trufflehog`)
- Uses `trufflesecurity/trufflehog@v3.84.0`
- Fetches full git history (`fetch-depth: 0`)
- Runs a diff scan between `HEAD~1` and `HEAD`:

```yaml
base: HEAD~1
head: HEAD
extra_args: --no-update --fail --json
```

If TruffleHog detects secrets, the job fails.

## TruffleHog configuration
TruffleHog uses `.trufflehog.yml` for exclusions.

Current exclusions:
- `frontend/package-lock.json`
- `backend/.env.example`
