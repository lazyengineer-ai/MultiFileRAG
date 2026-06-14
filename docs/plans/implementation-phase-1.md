# Phase 1 Implementation Plan — Foundation

> **For agentic workers:** Implement tasks in order. Each task should be completable and testable before moving on.

**Goal:** Deployable pilot foundation — OAuth login, file upload to R2, Files tab UI, storage meter — on **$0 hosting tiers**.

**Architecture:** Next.js on Vercel + FastAPI on Render + Neon Postgres + Cloudflare R2.

**Tech Stack:** Next.js 14, Auth.js, FastAPI, SQLAlchemy, Neon, R2, TypeScript, Python 3.12.

**Estimated cost:** $0/month hosting + OpenAI key (not used until Phase 2).

---

## Scope boundary

### In scope (Phase 1)

| Area | Deliverable |
|------|-------------|
| Auth | Google + GitHub OAuth, logout, protected routes, user row in DB |
| Files | Upload (multi-file), list, delete (confirm), replace, storage meter |
| Storage | R2 blobs + Neon metadata; 15 MB/file, 100 MB/account enforced |
| UI | Files \| Chat tabs; **Files tab complete**; Chat tab shell/placeholder only |
| Deploy | Vercel + Render + Neon + R2 smoke-tested in production |

### Explicitly deferred (later phases — do not block Phase 1)

| Area | Phase | PRD / Features |
|------|-------|----------------|
| Text extraction, chunking, embeddings | 2 | FR-PROC, F-016 |
| Ready / Failed processing pipeline | 2 | FR-PROC-01, F-016 |
| RAG Q&A, streaming answers | 3 | FR-QA, F-004, F-005 |
| Conversations, New Chat, history | 3 | FR-QA-05+, F-008 |
| Citations toggle UI + preferences API | 3 | FR-QA-03, F-007 |
| Chat sidebar file scope selection | 3 | F-013 |

**Phase 1 file status rule:** After a successful upload, set status to **`processing`** (not `ready`). Ingestion in Phase 2 moves files to `ready` or `failed`. Show the Processing badge in the UI so behavior matches PRD before RAG exists.

---

## Feature traceability (Phase 1 only)

| Feature / Story | Covered by |
|-----------------|------------|
| F-001, F-003, F-017, US-01, US-09 | Tasks 6–7 |
| F-002, US-03 | Task 6 (shared allowlist from PRD §9) |
| F-006, FR-FM-07 | Task 7 (delete confirm, replace) |
| F-009, US-05 | Tasks 3–4 (OAuth, logout) |
| F-010 (files only) | Tasks 2, 5–6, exit criteria |
| F-011 (partial) | Task 7 (tabs; Files complete; Chat placeholder) |
| F-016 (partial) | Task 6–7 (status badges; `processing` until Phase 2) |

---

## Prerequisites (human setup — one time)

Before coding, create free accounts and register OAuth apps:

| Step | Action |
|------|--------|
| 1 | [Neon](https://neon.tech) — create project, enable pgvector, copy `DATABASE_URL` |
| 2 | [Cloudflare R2](https://developers.cloudflare.com/r2/) — create bucket, API token |
| 3 | [Render](https://render.com) — account for API (deploy later) |
| 4 | [Vercel](https://vercel.com) — account for frontend (deploy later) |
| 5 | [Google Cloud Console](https://console.cloud.google.com) — OAuth client; add **both** redirect URIs: `http://localhost:3000/api/auth/callback/google` and `https://<your-vercel-domain>/api/auth/callback/google` |
| 6 | [GitHub Developer Settings](https://github.com/settings/developers) — OAuth app; add **both** callbacks: localhost and production (same pattern as Google) |
| 7 | OpenAI — API key + **billing hard limit** (e.g. $5) for later phases (not required to start Phase 1 coding) |

---

## Task 1: Monorepo scaffold

**Files:**
- Create: `apps/web/`, `apps/api/`, `docker/docker-compose.yml`, `.env.example`

- [ ] Initialize git repo structure with `apps/web` (Next.js) and `apps/api` (FastAPI)
- [ ] Add root `README.md` setup section
- [ ] Add `.env.example` with all variables from Technical Plan §11
- [ ] Add `docker/docker-compose.yml`: Postgres 16 + pgvector, MinIO (S3-compatible for local R2)
- [ ] Add Next.js rewrite/proxy: `/api/backend/*` → FastAPI (local + production per Technical Plan §8)
- [ ] Add shared extension allowlist module (single source of truth from PRD §9) — used by API validation; optional client pre-check in Task 7

**Verify:** `docker compose up` starts Postgres; `apps/web` and `apps/api` run locally; proxied API call returns `/health`.

---

## Task 2: Database schema (users + files)

**Files:**
- Create: `apps/api/app/models/`, `apps/api/alembic/`

- [ ] SQLAlchemy models: `users`, `files`
- [ ] Alembic initial migration
- [ ] `users`: id, oauth_provider, oauth_subject, email, citations_enabled (default `true`), created_at
- [ ] Unique constraint on `(oauth_provider, oauth_subject)` — **separate accounts per provider** (Technical Plan T-06); do not merge by email
- [ ] `files`: id, user_id, filename, extension, size_bytes, status (enum), storage_path, error_message, created_at

**Verify:** Migration runs against local Docker Postgres and Neon.

---

## Task 3: FastAPI core + auth middleware

**Files:**
- Create: `apps/api/app/main.py`, `apps/api/app/auth.py`, `apps/api/app/deps.py`

- [ ] FastAPI app with CORS for Vercel/localhost
- [ ] Session validation: Auth.js issues a signed JWT (or session token); frontend sends `Authorization: Bearer <token>`; API validates with `API_AUTH_SECRET` / shared secret
- [ ] `GET /health` endpoint (used by Render health check)
- [ ] `POST /v1/auth/sync` — upsert user from OAuth claims (`provider`, `subject`, `email`); returns internal user id
- [ ] Dependency `get_current_user` — returns user or 401

**Verify:** Unauthenticated requests to protected routes return 401; sync creates/updates user row.

---

## Task 4: Auth.js (Google + GitHub)

**Files:**
- Create: `apps/web/app/api/auth/[...nextauth]/route.ts`, `apps/web/middleware.ts`

- [ ] Auth.js with Google and GitHub providers only (no email/password UI)
- [ ] Session callback: include signed token usable by FastAPI; on sign-in call `POST /v1/auth/sync`
- [ ] Protected app routes redirect unauthenticated users to login
- [ ] Login page: Continue with Google / Continue with GitHub
- [ ] Logout control in app shell (F-009)
- [ ] API client helper attaches Bearer token to all `/v1/*` requests

**Verify:** Local OAuth flow completes; user row created in DB; logout clears session; re-login restores same account.

---

## Task 5: R2 file storage service

**Files:**
- Create: `apps/api/app/services/storage.py`

- [ ] S3-compatible client (boto3) pointing to R2
- [ ] `upload_file(user_id, file_id, content)` → storage_path
- [ ] `delete_file(storage_path)`
- [ ] Local dev uses MinIO with same interface

**Verify:** Upload/download round-trip in unit test or script.

---

## Task 6: File upload API

**Files:**
- Create: `apps/api/app/routers/files.py`

- [ ] `GET /v1/files` — list user files + total bytes used / 100 MB cap
- [ ] `POST /v1/files` — validate extension (PRD §9), size ≤15 MB, total ≤100 MB
- [ ] Reject unsupported types with clear error + supported list (before storing blob)
- [ ] Status flow: `uploading` during transfer → **`processing`** on success (Phase 2 sets `ready` / `failed`)
- [ ] `DELETE /v1/files/:id` — delete from R2 + DB; storage total recalculated
- [ ] `PUT /v1/files/:id` — replace file: validate type/size/total cap, delete old R2 object, upload new, reset status to `processing`

**Verify:** Postman/curl upload respects limits; unsupported `.pptx` rejected; replace cannot exceed 100 MB total.

---

## Task 7: Files tab UI

**Files:**
- Create: `apps/web/app/(app)/files/page.tsx`, components for upload, file list, storage bar

- [ ] App shell with tab navigation: **Files** | **Chat** (Chat tab = placeholder message only until Phase 3)
- [ ] Drag-and-drop + file picker; **multiple files in one action** (F-001)
- [ ] Upload progress / error toasts for limit, cap, and unsupported-type failures
- [ ] File list: name, size, status badge (`processing` after upload), optional upload date
- [ ] Storage bar: `{used} MB / 100 MB` always visible; updates on upload/delete/replace
- [ ] Delete with confirm dialog (FR-FM-07)
- [ ] Replace file action
- [ ] Desktop-first layout per PRD

**Verify:** Manual test — multi-file upload, meter update, delete with confirm, replace, errors shown clearly.

---

## Task 8: Deploy to free tiers

**Files:**
- Create: `apps/api/render.yaml`, Vercel project config

- [ ] Run Alembic migrations against **production** Neon before or during first deploy
- [ ] Deploy API to Render free web service (`GET /health` as health check path)
- [ ] Deploy web to Vercel hobby; set all env vars from Technical Plan §11
- [ ] Configure Next.js rewrite to Render API URL in production
- [ ] Point Neon `DATABASE_URL` and R2 creds to Render env; Auth secrets on Vercel + Render
- [ ] Confirm production OAuth redirect URIs match Vercel domain (see Prerequisites)
- [ ] Smoke test: login (Google or GitHub) → upload → list → delete → re-login → files still present

**Verify:** Public URL works end-to-end for Phase 1 scope.

---

## Phase 1 exit criteria

- [ ] User signs in with Google or GitHub; can **log out**
- [ ] Unauthenticated users cannot access Files UI or upload API
- [ ] User uploads valid files via drag-drop + picker (**multiple files per action**)
- [ ] Unsupported files rejected with clear error (lists supported types)
- [ ] 15 MB/file and 100 MB/account enforced (including on replace)
- [ ] Storage usage always visible on Files tab
- [ ] User can delete (with confirm) and replace files
- [ ] Uploaded files show **`processing`** status; persist after logout and re-login
- [ ] Files \| Chat tabs present; Chat is placeholder only
- [ ] Hosted on $0 tiers (Vercel + Render + Neon + R2)

---

## Non-blocking gaps (pilot acceptable)

| Item | Notes |
|------|-------|
| Concurrent uploads racing 100 MB cap | Rare at pilot scale; optional DB transaction lock later |
| Upload progress bar (F-015) | Proposed feature — spinner/toast enough for Phase 1 |
| Chat history persistence (US-06 partial) | Files only in Phase 1; chat deferred to Phase 3 |
| Citations preference UI | Column exists on `users`; wire in Phase 3 |

---

## Next phase

Phase 2 — Ingestion pipeline (parsing, chunking, embeddings, Ready/Failed status). Plan file: `implementation-phase-2.md` (*to be written*).
