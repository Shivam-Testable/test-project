# test-project — Register (Stage 1 demo)

Minimal working **register** stack for Jira Stage ① (development links).

| Ticket | Scope | Branch |
|---|---|---|
| [TESR-1](https://nandhini-2413.atlassian.net/browse/TESR-1) | Backend register API | `TESR-1-register-api` |
| [TESR-2](https://nandhini-2413.atlassian.net/browse/TESR-2) | Frontend register page | `TESR-2-register-ui` |

## Structure

```text
backend/   Express API — POST /api/v1/auth/register
frontend/  Vite + React — /register page
```

## Run locally

```bash
# Terminal 1 — API (http://localhost:4000)
cd backend
npm install
npm start

# Terminal 2 — UI (http://localhost:5173)
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173/register`.

## Stage ① note

`main` holds the working app (fresh empty repo bootstrap).  
For Stage ①, link each ticket’s **branch/PR** in the Jira Development panel:

- TESR-1 → `TESR-1-register-api`
- TESR-2 → `TESR-2-register-ui`
