# MultiFileRAG — Features

| Field | Value |
|-------|-------|
| **Document Version** | 1.0 |
| **Status** | Product requirements complete — aligned with PRD v1.0 |
| **Last Updated** | 2026-06-13 |
| **Related Documents** | [PRD](./PRD.md), [Agent Instructions](./AGENT_INSTRUCTIONS.md) |

---

## 1. Purpose

This document lists product features for MultiFileRAG, their status, and what is still undecided. Features are organized by capability area. Nothing marked **TBD** should be implemented without product owner confirmation.

---

## 2. Feature Status Legend

| Status | Meaning |
|--------|---------|
| **Confirmed** | Explicitly stated by the product owner |
| **Proposed** | Logical extension of confirmed requirements — not yet approved |
| **TBD** | Requires product owner decision |
| **Out of Scope** | Explicitly excluded until added to PRD |

---

## 3. Target User Context

**Confirmed:** Individual user — personal document Q&A. Features should be designed for a single person uploading and querying their own files, not for team workspaces or enterprise administration.

**Confirmed delivery:** Web application — browser-based UI with chat-style Q&A. No CLI, desktop app, or API-only interface for v1.

---

## 4. Feature Summary

| Feature ID | Feature Name | Priority | Status |
|------------|--------------|----------|--------|
| F-001 | Multi-file upload | P0 | Confirmed |
| F-002 | Major file type support | P0 | Confirmed |
| F-003 | Per-file size limit (15 MB) | P0 | Confirmed |
| F-004 | Question & answer over uploaded content | P0 | Confirmed |
| F-013 | Query scope: all files default, optional subset | P0 | Confirmed |
| F-005 | Accurate, document-grounded answers | P0 | Confirmed (criteria TBD) |
| F-011 | Web application UI | P0 | Confirmed |
| F-008 | Conversation history | P0 | Confirmed |
| F-009 | User authentication (sign up / log in) | P0 | Confirmed |
| F-010 | Server-side persistence (files & history) | P0 | Confirmed |
| F-007 | Source citations (optional toggle) | P0 | Confirmed |
| F-017 | Storage usage display | P0 | Confirmed |
| F-016 | File processing & status | P0 | Confirmed |
| F-006 | File management (list, delete, replace) | P0 | Confirmed |

---

## 5. Confirmed Features (P0)

### F-001: Multi-File Upload

**Description:** Users can upload one or more files into the application.

| Attribute | Value |
|-----------|-------|
| Status | Confirmed |
| Priority | P0 |

**Confirmed behavior:**

- Upload supports multiple files — **no file count limit**.
- Each file must not exceed **15 MB**.
- Total storage per account is capped at **100 MB** across all uploaded files.

**Open questions:**

- Maximum number of files per upload? **Resolved:** No count limit (storage caps apply)
- Upload method: **drag-and-drop** and **file picker** (browse button).
- Upload progress and error feedback requirements?

**Acceptance criteria (draft — pending PO review):**

- [ ] User can select and upload at least one file
- [ ] User can upload multiple files in a single action
- [ ] User can upload via drag-and-drop
- [ ] User can upload via file picker (browse)
- [ ] Files larger than 15 MB are rejected with a clear message
- [ ] Upload rejected when adding a file would exceed the 100 MB per-account total
- [ ] User sees **always-visible** storage usage on Files tab (e.g. used / 100 MB)
- [ ] Unsupported file types are rejected immediately (no upload stored)
- [ ] Error message lists supported file types or categories
- [ ] Unsupported extensions (including `.pptx`, `.ppt`, image formats) are rejected with a clear error

---

### F-002: Major File Type Support

**Description:** The application supports text-extractable documents, spreadsheets, and source code files. Presentations and images are not supported in v1.

| Attribute | Value |
|-----------|-------|
| Status | Confirmed |
| Priority | P0 |

**Confirmed supported extensions:**

| Category | Extensions |
|----------|------------|
| Documents | `.pdf`, `.docx`, `.doc`, `.txt`, `.md`, `.rtf` |
| Spreadsheets | `.xlsx`, `.xls`, `.csv`, `.ods` |
| Source code / markup | `.py`, `.js`, `.ts`, `.jsx`, `.tsx`, `.java`, `.json`, `.html`, `.xml`, `.css`, `.yaml`, `.yml`, `.sql`, `.go`, `.rs`, `.rb`, `.php`, `.c`, `.cpp`, `.h`, `.sh`, `.bash`, `.swift`, `.kt`, `.vue`, `.toml` |

**Confirmed out of scope (v1):**

- Presentations: `.pptx`, `.ppt`
- Images: `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, etc.

**Confirmed spreadsheet behavior:**

- Multi-sheet files (`.xlsx`, `.xls`, `.ods`): **all sheets** are extracted and indexed for Q&A

**Open questions:**

- Behavior for unsupported types: **reject immediately** with clear error listing supported types.
- Multi-sheet spreadsheet handling?
- Additional code extensions beyond listed set?

**Acceptance criteria (draft — pending PO review):**

- [ ] Each supported extension in the table can be uploaded and text-extracted
- [ ] Multi-sheet spreadsheets: all sheets extracted and available for Q&A
- [ ] Unsupported extensions (including `.pptx`, `.ppt`, image formats) are rejected with a clear error
- [ ] Supported file types list is documented in PRD §9 and enforced at upload

---

### F-003: Per-File Size Limit (15 MB)

**Description:** Each uploaded file is limited to a maximum size of 15 MB.

| Attribute | Value |
|-----------|-------|
| Status | Confirmed |
| Priority | P0 |

**Acceptance criteria (draft — pending PO review):**

- [ ] Files ≤ 15 MB are accepted (subject to type support)
- [ ] Files > 15 MB are rejected
- [ ] User receives a clear, actionable error when limit is exceeded

---

### F-017: Storage Usage Display

**Description:** Users always see how much of their 100 MB account storage is used.

| Attribute | Value |
|-----------|-------|
| Status | Confirmed |
| Priority | P0 |

**Confirmed behavior:**

- Storage usage is **always visible** on the **Files tab**
- Display format: e.g. `42 MB / 100 MB` or progress bar (implementation TBD)
- Updates after upload, delete, or replace

**Acceptance criteria (draft — pending PO review):**

- [ ] Files tab shows current used storage and 100 MB cap at all times
- [ ] Display updates when files are added or removed

---

### F-016: File Processing & Status

**Description:** After upload, each file moves through processing stages. Users see per-file status; only Ready files are used for Q&A.

| Attribute | Value |
|-----------|-------|
| Status | Confirmed |
| Priority | P0 |

**Confirmed behavior:**

| Status | Meaning | Used in Q&A? |
|--------|---------|--------------|
| **Uploading** | File transfer in progress | No |
| **Processing** | Text extraction / indexing in progress | No |
| **Ready** | File successfully processed | **Yes** |
| **Failed** | Processing error | No |

- User can submit questions at any time (not globally blocked)
- Answers use **only Ready files** (respecting query scope selection)
- Status visible in Files tab and Chat tab sidebar

**Open questions:**

- Retry UX for Failed files? **Resolved:** No retry button — user deletes and re-uploads or uses replace
- Show processing progress percentage or indeterminate spinner only?
- Behavior when user asks but zero files are Ready? **Resolved:** Allow question; respond that no documents are ready yet (guidance to wait or upload)

**Acceptance criteria (draft — pending PO review):**

- [ ] Each file displays one of: Uploading, Processing, Ready, Failed
- [ ] Q&A context includes only Ready files
- [ ] User can ask questions while other files are still Processing
- [ ] Failed files show a clear error state
- [ ] Failed files offer recovery via delete + re-upload or replace (no in-app Retry button)
- [ ] When zero Ready files in scope, user can still submit a question
- [ ] System responds with a clear "no documents ready yet" message (not generic not-found, not a guess)

---

### F-006: File Management (List, Delete, Replace)

**Description:** Users can view all uploaded files, delete individual files, and re-upload/replace existing files.

| Attribute | Value |
|-----------|-------|
| Status | Confirmed |
| Priority | P0 |

**Confirmed behavior:**

- **List** — user sees all files in their account (name, size, upload date TBD)
- **Delete** — user can remove individual files; freed storage becomes available within 100 MB cap
- **Replace** — user can re-upload a file to replace an existing one (same or different content)
- **Historical immutability** — past chat messages and citations are **not updated** when a file is later deleted or replaced; they reflect what was committed at answer time

**Open questions:**

- Layout for file list? **Resolved:** Files tab (full management); Chat tab sidebar for file list / scope
- Confirm dialog before delete? **Resolved:** Yes — confirm before deleting files and before deleting conversations (including clear all history)
- Does replace trigger re-processing only for new Q&A (not past chats)? **Resolved:** Yes — past chats unchanged

**Acceptance criteria (draft — pending PO review):**

- [ ] User can view a list of all uploaded files in their account
- [ ] User can delete an individual file
- [ ] User must confirm before file delete
- [ ] User can re-upload / replace an existing file
- [ ] Deleted file no longer appears in list or Q&A context
- [ ] Storage usage updates correctly after delete or replace
- [ ] Deleting or replacing a file does not alter past chat messages or citations in that conversation

---

### F-004: Question & Answer

**Description:** Users can ask questions and receive answers based on uploaded file content. By default, queries search **all** uploaded files.

| Attribute | Value |
|-----------|-------|
| Status | Confirmed |
| Priority | P0 |

**Confirmed behavior:**

- Questions search across **all uploaded files by default**
- User may optionally narrow query to a subset of files (see F-013)
- Answers are **streamed** to the chat UI with a **loading indicator** while generating
- When citations are enabled, **citations are appended after** the streamed answer completes (file name + short excerpt)

**Open questions:**

- UI for question input and answer display? **Resolved:** Chat tab — sidebar + main chat panel

**Acceptance criteria (draft — pending PO review):**

- [ ] User can submit a natural-language question after uploading files
- [ ] User receives a streamed text response with visible loading state while generating
- [ ] When citations are on, file name + excerpt citations appear after the answer finishes streaming
- [ ] System searches all uploaded files by default when answering
- [ ] System uses uploaded file content as the basis for the answer (implementation TBD)

---

### F-005: Accurate, Document-Grounded Answers

**Description:** Answers must be accurate and derived from uploaded file content. When information is not present in the documents, the system must say so clearly — no guessing.

| Attribute | Value |
|-----------|-------|
| Status | Confirmed (evaluation criteria TBD) |
| Priority | P0 |

**Confirmed behavior:**

- Answers are grounded in uploaded file content only
- If the answer is **not found** in the documents, the system **clearly states that** — it does **not** guess, fabricate, or fall back to general knowledge
- Source citations: optional user toggle (see F-007)

**Open questions:**

- How is accuracy validated in testing?
- Exact wording / UX for "not found" responses?

**Acceptance criteria (draft — pending PO review):**

- [ ] Answers are based on uploaded file content when information is available
- [ ] When information is absent, user receives a clear "not found in your documents" style response
- [ ] System does not provide ungrounded or speculative answers when content is missing
- [ ] Evaluation method for accuracy — **TBD**

---

### F-011: Web Application UI

**Description:** Individual users access MultiFileRAG through a web browser. Layout combines **tabbed navigation** (Files | Chat) with a **sidebar + main chat** pattern on the Chat tab.

| Attribute | Value |
|-----------|-------|
| Status | Confirmed |
| Priority | P0 |

**Confirmed layout (A + C hybrid):**

| Area | Content |
|------|---------|
| **Top-level tabs** | **Files** and **Chat** |
| **Files tab** | Dedicated file management: upload (drag-and-drop + picker), file list, delete, replace, **storage usage always visible** |
| **Chat tab** | **Sidebar** — file list / scope selection; **Main panel** — chat-style Q&A |

**Other confirmed behavior:**

- Product is delivered as a browser-based web application
- Answers **stream** into the chat with a loading indicator; citations append at end when enabled

**Open questions:**

- Mobile / narrow viewport: collapse sidebar to drawer, or switch tabs only? **Resolved:** Desktop-first — no mobile optimization for v1
- Conversation list placement on Chat tab (sidebar section, separate panel)?

**Acceptance criteria (draft — pending PO review):**

- [ ] User can switch between **Files** and **Chat** tabs
- [ ] Files tab provides full file management (upload, list, delete, replace)
- [ ] Files tab always shows storage usage (used / 100 MB or equivalent)
- [ ] Chat tab shows file sidebar and main chat panel side by side (desktop-first layout)
- [ ] No dedicated mobile-responsive layout required for v1
- [ ] User can open the app in a modern web browser
- [ ] User can upload files through the web UI (drag-and-drop and file picker)
- [ ] User can ask questions and view streamed answers in a chat-style interface
- [ ] Loading indicator visible while answer is generating
- [ ] No install step required (browser only)

---

### F-008: Conversation History

**Description:** Q&A conversations are saved server-side per user account and persist across browser sessions. Users can delete entire history or individual conversations.

| Attribute | Value |
|-----------|-------|
| Status | Confirmed |
| Priority | P0 |

**Confirmed behavior:**

- Chat history is stored on the server, linked to the logged-in user
- User can view prior conversations after logging back in
- History retained **indefinitely** until the user deletes it (no auto-expiry)
- User can **delete entire chat history** (clear all)
- User can **delete individual conversations**
- **New Chat** button starts a new conversation
- User can **optionally name or rename** conversations
- **Default title** (if user does not name): first **~40 characters** of the first question in that conversation

**Open questions:**

- UX for conversation list and delete actions?
- Conversation list placement on Chat tab (sidebar section, separate panel)?

**Acceptance criteria (draft — pending PO review):**

- [ ] Questions and answers are persisted server-side per account
- [ ] User sees prior chat messages / conversations after re-login
- [ ] History is not shared across user accounts
- [ ] User can delete entire chat history
- [ ] User can delete an individual conversation
- [ ] User must confirm before deleting a conversation or clearing all history
- [ ] User can start a new conversation via **New Chat** button
- [ ] User can optionally name or rename a conversation
- [ ] Unnamed conversations default to first question snippet (~40 characters)

---

### F-009: User Authentication (OAuth Only)

**Description:** Users sign up and log in exclusively via OAuth (third-party identity providers). No email/password flow.

| Attribute | Value |
|-----------|-------|
| Status | Confirmed |
| Priority | P0 |

**Confirmed behavior:**

- Authentication is **OAuth only** — no email/password registration or login
- Supported providers at launch: **Google** and **GitHub**
- User selects a provider to sign in
- Each user's files and history are isolated to their authenticated account

**Open questions:**

- Account linking if same email across Google and GitHub?
- Session duration / refresh token policy?

**Acceptance criteria (draft — pending PO review):**

- [ ] User can sign up / log in via **Google** OAuth
- [ ] User can sign up / log in via **GitHub** OAuth
- [ ] No email/password sign-up or login UI is offered
- [ ] User can log out
- [ ] Unauthenticated users cannot upload files or ask questions
- [ ] User can access only their own files and history

---

### F-010: Server-Side Persistence (Files & History)

**Description:** Uploaded files and chat history are stored on the server and survive browser restarts.

| Attribute | Value |
|-----------|-------|
| Status | Confirmed |
| Priority | P0 |

**Confirmed behavior:**

- Files are stored server-side, associated with the user's account
- Data persists when the user closes the browser and returns later

**Open questions:**

- Total storage limit per user? **Resolved:** 100 MB per account
- Data retention / deletion policy? **Resolved:** Indefinitely until user deletes; no auto-expiry
- File list and delete UX? **Resolved:** Full management — list, delete, replace (see F-006)

**Acceptance criteria (draft — pending PO review):**

- [ ] Uploaded files remain available after logout and re-login
- [ ] Total stored files per account do not exceed 100 MB
- [ ] Chat history remains available after logout and re-login
- [ ] Session-only / browser-local-only storage is not the primary persistence model

---

### F-007: Source Citations (Optional Toggle)

**Description:** Answers can display source references (which file(s) the answer drew from). The user controls whether citations are shown. The user's choice is **remembered per account**.

| Attribute | Value |
|-----------|-------|
| Status | Confirmed |
| Priority | P0 |

**Confirmed behavior:**

- Citations are **optional**, controlled by a user-facing toggle (on/off)
- When enabled, answers include **file name** and a **short excerpt** of the relevant passage from each source
- When disabled, answers are shown without source references
- **User's toggle preference is persisted per account** and restored on subsequent logins
- **First visit (no saved preference):** citations **on** by default
- Citation format: **file name + short excerpt** (relevant passage snippet)

**Open questions:**

- Maximum excerpt length?

**Acceptance criteria (draft — pending PO review):**

- [ ] User can turn citations on or off via a visible control
- [ ] With citations on, each answer shows source **file name(s)** and **short excerpt(s)** from the relevant passage
- [ ] With citations off, answers display without source references
- [ ] Toggle preference is saved to the user's account
- [ ] Preference is restored when the user logs in again
- [ ] First visit defaults to citations **on** when no preference exists

---

### F-013: Query Scope (All Files Default, Optional Subset)

**Description:** Questions use all uploaded files by default. Users can optionally narrow the query to selected files only.

| Attribute | Value |
|-----------|-------|
| Status | Confirmed |
| Priority | P0 |

**Confirmed behavior:**

- Default: search **all** files in the user's account
- Optional: user can restrict a question to one or more selected files

**Open questions:**

- UX for file selection (checkboxes, sidebar multi-select, etc.)?
- Visual indicator when query is scoped to a subset?

**Acceptance criteria (draft — pending PO review):**

- [ ] With no selection, Q&A searches all uploaded files
- [ ] User can optionally select specific files to scope a query
- [ ] Scoped queries use only selected file content

---

## 6. Proposed Features (Not Approved)

These features are **not confirmed**. They are listed for discussion only.

| Feature ID | Feature Name | Rationale | Status |
|------------|--------------|-----------|--------|
| F-012 | File preview | Verify correct file before querying | Proposed |
| F-014 | Export chat / answers | Save Q&A results | Proposed |
| F-015 | Upload progress indicator | UX for large/multi-file uploads | Proposed |

---

## 7. Feature Dependencies

**TBD** — To be mapped after feature set is confirmed.

```
F-009 (Auth) ──► F-010 (Persistence) ──► F-001 (Upload) ──► F-006 (Manage) ──► F-004 (Q&A) ──► F-005 (Accuracy)
                      │                        │                │
                      └──► F-008 (History)     ├──► F-002       └──► F-013 (Scope)
                                               └──► F-003
F-011 (Web UI) wraps upload, file management, and Q&A
```

---

## 8. Feature ↔ Requirement Traceability

| Feature | PRD Requirements |
|---------|------------------|
| F-001 | FR-UP-01, FR-UP-02, FR-UI-02 |
| F-002 | FR-UP-03, FR-UP-06, FR-UP-07 |
| F-003 | FR-UP-04, FR-UP-05, NFR-01, NFR-08, FR-UI-08 |
| F-017 | FR-UI-08, FR-UP-05, NFR-08 |
| F-004 | FR-QA-01, FR-QA-07, FR-QA-10, FR-UI-06 |
| F-013 | FR-QA-07 |
| F-005 | FR-QA-02, FR-QA-04 |
| F-007 | FR-QA-03 |
| F-008 | FR-QA-05, FR-QA-08, FR-QA-09, FR-QA-11, FR-RET-02, FR-RET-04, FR-RET-05 |
| F-009 | FR-SEC-01, FR-AUTH-01 |
| F-016 | FR-PROC-01, FR-PROC-02, FR-PROC-03, FR-PROC-04, FR-PROC-05, FR-PROC-06 |
| F-006 | FR-FM-01, FR-FM-02, FR-FM-03, FR-FM-06, FR-FM-07, FR-UI-07 |
| F-010 | FR-AUTH-02, FR-AUTH-03, FR-AUTH-04, FR-FM-05, FR-UP-05, NFR-08, FR-RET-01 |
| F-011 | FR-UI-01, FR-UI-02, FR-UI-03, FR-UI-06, FR-UI-07, FR-UI-08, FR-UI-09, NFR-05 |

---

## 9. Decisions Needed Before Development

| # | Decision | Blocks |
|---|----------|--------|
| 1 | ~~Supported file types list~~ | **Resolved:** Documents + spreadsheets + code (see PRD §9) |
| 2 | ~~Delivery format (web/API/CLI)~~ | **Resolved:** Web app |
| 3 | Accuracy / evaluation criteria | F-005, testing strategy |
| 4 | ~~Citations required?~~ | **Resolved:** Optional toggle |
| 5 | ~~Auth required?~~ | **Resolved:** Yes — sign up / log in |
| 6 | ~~Persistence required?~~ | **Resolved:** Yes — server-side per account |
| 7 | ~~Authentication method~~ | **Resolved:** OAuth only |
| 8 | ~~Which OAuth providers?~~ | **Resolved:** Google + GitHub |

---

## 10. Revision History

| Version | Date | Changes |
|---------|------|---------|
| 0.1 | 2026-06-13 | Initial feature list from confirmed requirements only |
| 0.2 | 2026-06-13 | Confirmed target user: individual (personal document Q&A) |
| 0.3 | 2026-06-13 | Confirmed delivery format: web app (browser UI, chat-style Q&A) |
| 0.4 | 2026-06-13 | Confirmed auth + server-side persistence for files and chat history |
| 0.5 | 2026-06-13 | Confirmed optional source citations with user toggle |
| 0.6 | 2026-06-13 | Confirmed file types: documents + spreadsheets + code; no ppt/images |
| 0.7 | 2026-06-13 | Confirmed authentication: OAuth only (no email/password) |
| 0.8 | 2026-06-13 | Confirmed OAuth providers: Google + GitHub |
| 0.9 | 2026-06-13 | Confirmed not-found behavior: state clearly, do not guess |
| 0.10 | 2026-06-13 | Confirmed per-account storage limit: 100 MB total |
| 0.11 | 2026-06-13 | Confirmed multi-file Q&A: all files by default, optional subset |
| 0.12 | 2026-06-13 | Confirmed file management: list, delete, re-upload/replace |
| 0.13 | 2026-06-13 | Confirmed upload UX: drag-and-drop + file picker |
| 0.14 | 2026-06-13 | Confirmed unsupported file handling: reject with clear error |
| 0.15 | 2026-06-13 | Confirmed citation preference persisted per account |
| 0.16 | 2026-06-13 | Confirmed first-visit citation default: on |
| 0.17 | 2026-06-13 | Confirmed citation detail: file name + short excerpt |
| 0.18 | 2026-06-13 | Confirmed answer delivery: streamed + citations at end |
| 0.19 | 2026-06-13 | Confirmed data retention: indefinitely until user deletes |
| 0.20 | 2026-06-13 | Confirmed chat deletion: entire history or individual conversations |
| 0.21 | 2026-06-13 | Confirmed layout: tabbed Files/Chat + sidebar on Chat tab |
| 0.22 | 2026-06-13 | Confirmed file processing: per-file status; only Ready files in Q&A |
| 0.23 | 2026-06-13 | Confirmed conversations: New Chat + optional name/rename |
| 0.24 | 2026-06-13 | Confirmed zero Ready files: allow ask, respond with not-ready guidance |
| 0.25 | 2026-06-13 | Confirmed chat immutability: past answers/citations unchanged on file delete/replace |
| 0.26 | 2026-06-13 | Confirmed storage usage always visible on Files tab |
| 0.27 | 2026-06-13 | Confirmed default conversation title: first question snippet |
| 0.28 | 2026-06-13 | Confirmed failed file recovery: re-upload/replace only (no retry) |
| 0.29 | 2026-06-13 | Confirmed multi-sheet spreadsheets: all sheets indexed |
| 0.30 | 2026-06-13 | Confirmed confirm dialog before file or conversation delete |
| 0.31 | 2026-06-13 | Confirmed desktop-first; no mobile optimization for v1 |
| 1.0 | 2026-06-13 | Aligned with PRD v1.0 cleanup |
