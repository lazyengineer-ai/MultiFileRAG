# MultiFileRAG — Product Requirements Document (PRD)

| Field | Value |
|-------|-------|
| **Product Name** | MultiFileRAG |
| **Document Version** | 1.0 |
| **Status** | Product requirements complete — technical planning underway |
| **Last Updated** | 2026-06-13 |

---

## 1. Document Purpose

This PRD defines what MultiFileRAG is intended to do, who it is for, and what success looks like. It captures **confirmed requirements only**. Items marked **TBD** or **Open Question** require product owner decisions before development proceeds.

---

## 2. Product Vision

MultiFileRAG is an application that lets users upload documents and ask questions against the content of those documents, receiving accurate answers grounded in the uploaded files.

---

## 3. Problem Statement

Individual users accumulate information across many documents, spreadsheets, and code files. Reading and searching manually is slow and error-prone. MultiFileRAG provides a personal web application where users upload their files and ask natural-language questions, receiving answers grounded in their own content.

---

## 4. Target Users

### 4.1 Primary User (Confirmed)

**Individual user** — a single person using MultiFileRAG for personal document Q&A.

| Attribute | Value | Status |
|-----------|-------|--------|
| Primary user | Individual (personal use) | **Confirmed** |
| Use case | Upload personal documents and ask questions against them | **Confirmed** |

### 4.2 Confirmed Context

| Item | Value |
|------|-------|
| Authentication | OAuth only — Google + GitHub |
| Data retention | Indefinitely until user deletes |
| Deployment audience | Public pilot on **free-tier** hosting (see [Technical Plan §3](./TECHNICAL_PLAN.md#3-free--cheapest-hosting-strategy-pilot)) |

### 4.3 Explicitly Not Primary User (v1)

The following are **not** the target for the initial product. They remain out of scope unless added later.

- Small team / shared workspace users
- Enterprise users (SSO, compliance, admin)
- Developer / API-only consumers as the primary audience

---

## 5. Product Objectives

### 5.1 Primary Objective (Confirmed)

Any user should be able to:

1. **Upload files** into the application.
2. **Ask questions** using the information contained in those files.
3. **Receive accurate answers** derived from the uploaded content.

### 5.2 Success Criteria

**TBD** — Measurable success criteria are not yet defined.

Examples of criteria that require product owner input:

| Metric | Target | Status |
|--------|--------|--------|
| Answer accuracy | TBD | Open |
| Response latency | TBD | Open |
| Supported file types (explicit list) | See §9 | **Confirmed** |
| Maximum files per session/upload | No count limit (subject to storage caps) | **Confirmed** |
| Total storage per account | **100 MB** | **Confirmed** |
| Uptime / availability | TBD | Open |

---

## 6. Confirmed Requirements

### 6.1 File Upload

| ID | Requirement | Status |
|----|-------------|--------|
| FR-UP-01 | Users can upload files into the application | Confirmed |
| FR-UP-02 | Users can upload any number of files, subject to per-file and per-account storage limits | **Confirmed** |
| FR-UP-03 | Supported file types: **text-extractable** documents, spreadsheets, and source code (see §9) | **Confirmed** |
| FR-UP-04 | Maximum file size is **15 MB per file** | Confirmed |
| FR-UP-05 | Per-account total storage limit: **100 MB** across all uploaded files | **Confirmed** |
| FR-UP-06 | Unsupported file types are **rejected immediately** with a clear error listing supported types | **Confirmed** |
| FR-UP-07 | Multi-sheet spreadsheets (`.xlsx`, `.xls`, `.ods`): **all sheets** extracted and indexed for Q&A | **Confirmed** |

### 6.2 Question & Answer

| ID | Requirement | Status |
|----|-------------|--------|
| FR-QA-01 | Users can ask questions against uploaded file content | Confirmed |
| FR-QA-02 | Answers must be accurate and grounded in uploaded file information | Confirmed |
| FR-QA-03 | Source citations: **file name + short excerpt**; user can **toggle on/off**; **preference persisted per account**; **default on** for first visit | **Confirmed** |
| FR-QA-04 | When the answer is not in uploaded files, clearly state that — **do not guess or hallucinate** | **Confirmed** |
| FR-QA-05 | Conversation history (server-side, per account) | **Confirmed** |
| FR-QA-06 | Multi-turn follow-up questions (within persisted conversation) | **Confirmed** |
| FR-QA-07 | Questions search **all uploaded files by default**; user may optionally narrow to a subset | **Confirmed** |
| FR-QA-08 | Multiple conversations per user; **New Chat** button to start a new conversation | **Confirmed** |
| FR-QA-09 | User can **optionally name or rename** conversations | **Confirmed** |
| FR-QA-10 | When **no Ready files** are in scope, user can still ask; system responds that no documents are ready yet | **Confirmed** |
| FR-QA-11 | Default conversation title: **first question snippet** (~40 characters) when user does not name | **Confirmed** |

### 6.3 Authentication & Data Persistence

| ID | Requirement | Status |
|----|-------------|--------|
| FR-AUTH-01 | Users must **sign up and log in** to use the application | **Confirmed** |
| FR-AUTH-02 | Uploaded files are stored **server-side** and associated with the user's account | **Confirmed** |
| FR-AUTH-03 | Chat / Q&A history is stored **server-side** and persists across browser sessions | **Confirmed** |
| FR-AUTH-04 | Users can return after closing the browser and access their files and history | **Confirmed** |
| FR-AUTH-05 | Authentication method: **OAuth only** (third-party providers such as Google, GitHub) | **Confirmed** |
| FR-AUTH-06 | Email/password registration and login | **Not supported** |
| FR-AUTH-07 | OAuth providers: **Google** and **GitHub** | **Confirmed** |

### 6.4 File Management

| ID | Requirement | Status |
|----|-------------|--------|
| FR-FM-01 | Users can **view a list** of all uploaded files | **Confirmed** |
| FR-FM-02 | Users can **delete** individual uploaded files | **Confirmed** |
| FR-FM-03 | Users can **re-upload / replace** an existing file | **Confirmed** |
| FR-FM-05 | Persist uploads across sessions (server-side, per account) | **Confirmed** |
| FR-FM-06 | Deleting or replacing a file does **not** retroactively change past chat messages or citations — answers are a snapshot at time of response | **Confirmed** |
| FR-FM-07 | **Confirm dialog** required before deleting a file | **Confirmed** |

### 6.5 User Interface (Confirmed)

| ID | Requirement | Status |
|----|-------------|--------|
| FR-UI-01 | Delivery format: **web application** (browser-based UI) | **Confirmed** |
| FR-UI-02 | Upload UX: **drag-and-drop** and **file picker** (browse) | **Confirmed** |
| FR-UI-03 | Q&A UX: chat-style question and answer in the browser | **Confirmed** |
| FR-UI-06 | Answer delivery: **streamed** text with loading indicator; **citations appended at end** when enabled | **Confirmed** |
| FR-UI-07 | App layout: **tabbed** (Files \| Chat) + **sidebar file list** on Chat tab with **main chat** panel | **Confirmed** |
| FR-UI-08 | **Storage usage always visible** on Files tab (e.g. used / 100 MB or progress bar) | **Confirmed** |
| FR-UI-09 | **Desktop-first** for v1 — optimized for tablet/desktop widths; no dedicated mobile optimization | **Confirmed** |

### 6.6 Data Retention

| ID | Requirement | Status |
|----|-------------|--------|
| FR-RET-01 | Uploaded files are retained **indefinitely** until the user deletes them | **Confirmed** |
| FR-RET-02 | Chat / Q&A history is retained **indefinitely** until the user deletes it | **Confirmed** |
| FR-RET-03 | No automatic expiry based on time or inactivity | **Confirmed** |
| FR-RET-04 | Users can **delete entire chat history** or **delete individual conversations** | **Confirmed** |
| FR-RET-05 | **Confirm dialog** required before deleting a conversation or clearing all chat history | **Confirmed** |

### 6.7 File Processing (Ingestion)

| ID | Requirement | Status |
|----|-------------|--------|
| FR-PROC-01 | Each uploaded file has a visible status: **Uploading → Processing → Ready** or **Failed** | **Confirmed** |
| FR-PROC-02 | User can ask questions at any time (not blocked globally) | **Confirmed** |
| FR-PROC-03 | Only files in **Ready** state are used as context for answers | **Confirmed** |
| FR-PROC-04 | Files in Uploading, Processing, or Failed state are excluded from Q&A context | **Confirmed** |
| FR-PROC-05 | Failed processing: show clear error; recovery via **delete and re-upload** or **replace** only (no retry button) | **Confirmed** |
| FR-PROC-06 | When zero Ready files are in Q&A scope, allow question but respond with **no documents ready** message (not a generic not-found) | **Confirmed** |

---

## 7. Pending Requirements (Not Yet Confirmed)

| ID | Area | Requirement | Status |
|----|------|-------------|--------|
| FR-FM-04 | File management | Organize files (folders, tags, collections) | TBD |
| FR-UI-04 | UI | Accessibility requirements | TBD |
| FR-UI-05 | UI | Localization / i18n | TBD |
| FR-SEC-02 | Security | Authorization / role-based access (N/A for individual v1 unless added) | TBD |
| FR-SEC-03 | Security | Data encryption (at rest, in transit) — see [Technical Plan](./TECHNICAL_PLAN.md) | TBD |
| FR-SEC-05 | Security | Audit logging | TBD |

_All confirmed functional requirements are in §6._

---

## 8. Non-Functional Requirements

### 8.1 Confirmed

| ID | Requirement | Status |
|----|-------------|--------|
| NFR-01 | Maximum upload size: **15 MB per file** | Confirmed |
| NFR-05 | **Desktop-first** (tablet/desktop widths); mobile optimization out of scope for v1 | **Confirmed** |
| NFR-08 | Maximum total storage per account: **100 MB** across all uploaded files | **Confirmed** |

### 8.2 Pending

| ID | Requirement | Status |
|----|-------------|--------|
| NFR-02 | Performance / latency targets | TBD — see [Technical Plan](./TECHNICAL_PLAN.md) |
| NFR-03 | Scalability (concurrent users, total storage) | TBD |
| NFR-04 | Availability / SLA | TBD |
| NFR-06 | Offline support | TBD |
| NFR-07 | Compliance (GDPR, HIPAA, SOC2, etc.) | TBD |

---

## 9. Supported File Types

### 9.1 Scope (Confirmed)

MultiFileRAG supports **text-extractable files** in three categories:

1. **Documents**
2. **Spreadsheets**
3. **Source code / text markup**

Files must contain extractable text content. **Presentations and images are not supported in v1.**

**Multi-sheet spreadsheets:** For `.xlsx`, `.xls`, and `.ods`, **all sheets** are extracted and indexed for Q&A.

### 9.2 Supported Extensions (Confirmed)

#### Documents

| Extension | Format |
|-----------|--------|
| `.pdf` | PDF |
| `.docx` | Microsoft Word (Office Open XML) |
| `.doc` | Microsoft Word (legacy) |
| `.txt` | Plain text |
| `.md` | Markdown |
| `.rtf` | Rich Text Format |

#### Spreadsheets

| Extension | Format |
|-----------|--------|
| `.xlsx` | Microsoft Excel (Office Open XML) |
| `.xls` | Microsoft Excel (legacy) |
| `.csv` | Comma-separated values |
| `.ods` | OpenDocument Spreadsheet |

#### Source Code / Text Markup

| Extension | Format |
|-----------|--------|
| `.py` | Python |
| `.js` | JavaScript |
| `.ts` | TypeScript |
| `.jsx` | React JSX |
| `.tsx` | React TSX |
| `.java` | Java |
| `.json` | JSON |
| `.html` | HTML |
| `.xml` | XML |
| `.css` | CSS |
| `.yaml` | YAML |
| `.yml` | YAML |
| `.sql` | SQL |
| `.go` | Go |
| `.rs` | Rust |
| `.rb` | Ruby |
| `.php` | PHP |
| `.c` | C |
| `.cpp` | C++ |
| `.h` | C/C++ header |
| `.sh` | Shell script |
| `.bash` | Bash script |
| `.swift` | Swift |
| `.kt` | Kotlin |
| `.vue` | Vue single-file component |
| `.toml` | TOML |

### 9.3 Out of Scope (v1 — Confirmed)

| Category | Extensions | Status |
|----------|------------|--------|
| Presentations | `.pptx`, `.ppt` | **Not supported** |
| Images | `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, `.bmp`, `.tiff`, etc. | **Not supported** |
| Archives | `.zip`, `.tar`, `.gz`, `.rar`, etc. | Not supported (not requested) |
| Audio / video | `.mp3`, `.mp4`, `.wav`, etc. | Not supported (not requested) |

### 9.4 Open Questions

| Question | Status |
|----------|--------|
| ~~Behavior for unsupported file types~~ | **Resolved:** Reject immediately with clear error listing supported types |
| ~~Multi-sheet spreadsheet handling~~ | **Resolved:** All sheets extracted and indexed |
| Additional code extensions beyond listed set | Open |

---

## 10. User Stories

| ID | Story | Acceptance Criteria | Status |
|----|-------|---------------------|--------|
| US-01 | As a user, I want to upload one or more files so that their content is available for questioning. | Upload ≥1 file; ≤15 MB each; within 100 MB account cap | Confirmed |
| US-02 | As a user, I want to ask a question so that I receive an answer based on my uploaded files. | Submit question; streamed response from Ready files | Confirmed |
| US-03 | As a user, I want to upload text-based documents, spreadsheets, and code files. | Types per §9; unsupported rejected with clear error | Confirmed |
| US-04 | As an individual user, I want to use a web browser without installing software. | Browser UI; Files and Chat tabs; desktop-first | Confirmed |
| US-05 | As a user, I want to sign in with Google or GitHub. | OAuth only; no email/password | Confirmed |
| US-06 | As a logged-in user, I want my files and chat history to persist across sessions. | Available after re-login | Confirmed |
| US-07 | As a user, I want optional citations with file name and excerpt. | On by default; toggle; preference saved | Confirmed |
| US-08 | As a user, I want to be told when my documents don't contain the answer. | Not-found message; no guessing | Confirmed |
| US-09 | As a user, I want a clear storage limit with usage always visible. | 100 MB cap; meter on Files tab | Confirmed |
| US-10 | As a user, I want questions to search all uploaded files by default. | All Ready files unless subset selected | Confirmed |
| US-11 | As a user, I want to list, delete, and replace my files. | Full file management on Files tab; confirm before delete | Confirmed |
| US-12 | As a user, I want drag-and-drop and file picker upload. | Both methods available | Confirmed |
| US-13 | As a user, I want streamed answers with citations after completion. | Loading indicator; citations append at end | Confirmed |
| US-14 | As a user, I want data kept until I delete it; I can delete chats. | No auto-expiry; delete conversation or all history with confirm | Confirmed |
| US-15 | As a user, I want Files and Chat tabs with sidebar while chatting. | Tabbed layout; sidebar + main chat on Chat tab | Confirmed |
| US-16 | As a user, I want per-file processing status. | Uploading → Processing → Ready / Failed; only Ready in Q&A | Confirmed |
| US-17 | As a user, I want New Chat with optional rename. | New Chat button; default title = first question ~40 chars | Confirmed |

---

## 11. Out of Scope (Until Confirmed Otherwise)

The following are **not confirmed** as in-scope. They should not be built unless added to this PRD.

- Email/password authentication
- Team collaboration / shared workspaces
- Enterprise features (SSO, org admin, compliance tooling)
- Billing / subscriptions
- CLI or terminal-based interface
- Desktop-native application
- API-only product (no browser UI)
- Mobile-native app (iOS/Android)
- **Mobile-optimized web layout** (responsive/dedicated mobile UX for v1)
- Presentations (`.pptx`, `.ppt`)
- Images (`.png`, `.jpg`, `.jpeg`, `.webp`, etc.)
- Fine-tuned / custom model training
- Real-time collaborative editing
- Public document publishing

---

## 12. Assumptions

Product requirements in §6 are treated as fixed for v1. **Technical implementation** (stack, RAG pipeline, hosting) is defined in [Technical Plan](./TECHNICAL_PLAN.md) and requires product owner approval before coding begins.

---

## 13. Open Questions

### Product (deferred — non-blocking for v1)

| # | Question | Status |
|---|----------|--------|
| P-01 | Answer accuracy — how measured? | Open |
| P-02 | Acceptable response latency (first token, full answer)? | Open — see Technical Plan T-10 |
| P-03 | Uptime / SLA target? | Open |
| P-04 | Compliance requirements (GDPR, etc.)? | Open |
| P-05 | Additional code extensions beyond PRD §9? | Open |
| P-06 | Public SaaS vs self-hosted deployment? | Open — see Technical Plan T-05 |
| P-07 | File folders / tags (FR-FM-04)? | Open |
| P-08 | Accessibility (FR-UI-04)? | Open |
| P-09 | Localization (FR-UI-05)? | Open |

### Product (resolved — summary)

All core v1 product decisions are confirmed in §6, including: individual user, web app, OAuth (Google + GitHub), storage limits, file types, Q&A behavior, citations, conversations, file processing, layout, and desktop-first scope.

### Technical

See [Technical Plan §10](./TECHNICAL_PLAN.md#10-open-technical-decisions) for stack, LLM, deployment, and RAG design decisions.

---

## 14. Dependencies

| Dependency | Notes |
|------------|-------|
| OAuth apps | Google Cloud + GitHub OAuth app registration |
| LLM / embedding API | Per Technical Plan — requires PO approval |
| Document parsing libraries | Per PRD §9 file types |

---

## 15. Risks

| Risk | Mitigation |
|------|------------|
| Poor extraction on complex PDFs/DOC | Failed status; user re-upload/replace |
| LLM answers outside documents | Strict not-found path; no guessing (FR-QA-04) |
| OAuth provider outage | Clear error; user retries login |
| 100 MB storage exceeded | Always-visible meter; reject with clear message |

---

## 16. Milestones & Release Plan

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 0 | Product requirements (this PRD) | **Complete** |
| Phase 1 | Technical planning | **Complete** — [Technical Plan v1.0](./TECHNICAL_PLAN.md) approved |
| Phase 2 | Implementation Phase 1 — Foundation | **Ready** — [plan](./plans/implementation-phase-1.md) |
| Phase 3 | Implementation Phase 2 — Ingestion pipeline | Not started |
| Phase 4 | Implementation Phase 3 — RAG Q&A | Not started |
| Phase 5 | Implementation Phase 4 — Polish & release | Not started |

---

## 17. Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Product Owner | TBD | — | Pending sign-off |
| Solution Architect | TBD | — | Pending sign-off |

---

## 18. Related Documents

| Document | Path | Purpose |
|----------|------|---------|
| Features | [FEATURES.md](./FEATURES.md) | Feature list and acceptance criteria |
| Technical Plan | [TECHNICAL_PLAN.md](./TECHNICAL_PLAN.md) | Approved architecture — free-tier hosting |
| Phase 1 Plan | [plans/implementation-phase-1.md](./plans/implementation-phase-1.md) | Foundation implementation tasks |
| Agent Instructions | [AGENT_INSTRUCTIONS.md](./AGENT_INSTRUCTIONS.md) | Rules for developers and AI agents |

---

## 19. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | 2026-06-13 | Planning session | Initial draft from stated objectives only |
| 0.2 | 2026-06-13 | Product Owner | Confirmed primary user: individual (personal document Q&A) |
| 0.3 | 2026-06-13 | Product Owner | Confirmed delivery format: web app (browser UI, chat-style Q&A) |
| 0.4 | 2026-06-13 | Product Owner | Confirmed persistence: sign up/login; files and chat history stored server-side |
| 0.5 | 2026-06-13 | Product Owner | Confirmed optional source citations with user toggle |
| 0.6 | 2026-06-13 | Product Owner | Confirmed file types: documents + spreadsheets + code; no ppt/images |
| 0.7 | 2026-06-13 | Product Owner | Confirmed authentication: OAuth only (no email/password) |
| 0.8 | 2026-06-13 | Product Owner | Confirmed OAuth providers: Google + GitHub |
| 0.9 | 2026-06-13 | Product Owner | Confirmed not-found behavior: state clearly, do not guess |
| 0.10 | 2026-06-13 | Product Owner | Confirmed per-account storage limit: 100 MB total |
| 0.11 | 2026-06-13 | Product Owner | Confirmed multi-file Q&A: search all files by default; optional subset |
| 0.12 | 2026-06-13 | Product Owner | Confirmed file management: list, delete, re-upload/replace |
| 0.13 | 2026-06-13 | Product Owner | Confirmed upload UX: drag-and-drop + file picker |
| 0.14 | 2026-06-13 | Product Owner | Confirmed unsupported file handling: reject with clear error |
| 0.15 | 2026-06-13 | Product Owner | Confirmed citation preference persisted per account |
| 0.16 | 2026-06-13 | Product Owner | Confirmed first-visit citation default: on |
| 0.17 | 2026-06-13 | Product Owner | Confirmed citation detail: file name + short excerpt |
| 0.18 | 2026-06-13 | Product Owner | Confirmed answer delivery: streamed + citations at end |
| 0.19 | 2026-06-13 | Product Owner | Confirmed data retention: indefinitely until user deletes |
| 0.20 | 2026-06-13 | Product Owner | Confirmed chat deletion: entire history or individual conversations |
| 0.21 | 2026-06-13 | Product Owner | Confirmed layout: tabbed Files/Chat + sidebar on Chat tab |
| 0.22 | 2026-06-13 | Product Owner | Confirmed file processing: per-file status; only Ready files in Q&A |
| 0.23 | 2026-06-13 | Product Owner | Confirmed conversations: New Chat + optional name/rename |
| 0.24 | 2026-06-13 | Product Owner | Confirmed zero Ready files: allow ask, respond with not-ready guidance |
| 0.25 | 2026-06-13 | Product Owner | Confirmed chat immutability: past answers/citations unchanged on file delete/replace |
| 0.26 | 2026-06-13 | Product Owner | Confirmed storage usage always visible on Files tab |
| 0.27 | 2026-06-13 | Product Owner | Confirmed default conversation title: first question snippet |
| 0.28 | 2026-06-13 | Product Owner | Confirmed failed file recovery: re-upload/replace only (no retry) |
| 0.29 | 2026-06-13 | Product Owner | Confirmed multi-sheet spreadsheets: all sheets indexed |
| 0.30 | 2026-06-13 | Product Owner | Confirmed confirm dialog before file or conversation delete |
| 0.31 | 2026-06-13 | Product Owner | Confirmed desktop-first; no mobile optimization for v1 |
| 1.1 | 2026-06-13 | Product Owner | Technical plan approved; free-tier hosting; Phase 1 ready |
