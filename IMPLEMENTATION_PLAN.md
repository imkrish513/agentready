# AgentReady — Finalized Implementation Plan

> All design decisions resolved. Ready for development.

---

## Overview

AgentReady is a browser-based, IDE-style agentic interview prep platform for college students and new grads. Users practice coding alongside a **deliberately buggy AI assistant** across structured interview phases, and receive rubric-based scoring on their session.

---

## Resolved Tech Stack

| Layer | Decision |
|---|---|
| **Framework** | Next.js 14+ (App Router), deployed on Vercel |
| **Code Editor** | Monaco Editor (VS Code engine) |
| **AI Provider** | Anthropic Claude via Anthropic API |
| **AI Mechanic** | Live LLM with strict system prompt (plausible-but-wrong enforced) |
| **Code Execution** | Pyodide (Python in browser via WASM) — zero server cost |
| **Database** | Supabase (Postgres + Auth + Storage) |
| **Auth** | Supabase Auth (email/password + Google OAuth) |
| **Deployment** | Vercel (frontend + API routes), Supabase (managed DB) |
| **Email** | Supabase table for bug reports (team-reviewed dashboard) |

---

## Page & Route Structure

```
/                          → Marketing/Landing page (in MVP scope)
/auth/login                → Login
/auth/signup               → Signup  
/auth/callback             → OAuth callback
/dashboard                 → Problem list + personal stats
/problems/[slug]           → IDE interface (core product)
/problems/[slug]/results   → Post-session scorecard
/profile                   → Session history + score trends
/settings                  → Account settings
```

---

## Section 1: Landing Page — `/`

**Scope**: In MVP — needed for investors and new users.

### Sections
1. **Hero**: Headline, sub-headline, CTA ("Start Practicing Free")
2. **Problem Statement**: "Interviews now expect you to code with AI. Are you ready?"
3. **How It Works**: 3-step visual (Choose Problem → Interview Simulation → Get Scored)
4. **Sample Problem Preview**: Read-only screenshot or animated demo of the IDE
5. **The 4 Rubric Dimensions**: Brief explanation of Approach / Control / Verification / Communication
6. **CTA footer**: Sign up

### Design Notes
- Dark mode, premium aesthetic
- No pricing section for MVP (free)
- No social proof yet (launch product)

---

## Section 2: Auth — `/auth/*`

- Email/password signup + Google OAuth via Supabase Auth
- Email verification required before accessing problems
- Password reset flow
- **Auth is required** before starting any problem — no guest mode
- Onboarding: after first login, collect "Target company" and "Interview date" → personalize dashboard recommendations

---

## Section 3: Dashboard — `/dashboard`

### Problem Grid
- Cards for each of the 5 MVP problems
- Each card shows: title, difficulty badge (Easy/Medium/Hard), category tag, completion status (Not Started / Attempted / Solved / Solved with Help)
- Filter by category and difficulty

### Personal Stats Summary
- Average score per rubric dimension (shown as 4 bar charts or a radar chart)
- Total sessions, best scores, improvement trend

### No Gamification
- No streaks, XP, or levels — keep it professional and tool-like

### "Recommended Next" 
- Surface the problem category where the user's weakest rubric score is

---

## Section 4: Core IDE — `/problems/[slug]`

### 4A. Top Bar

| Element | Behavior |
|---|---|
| Problem title | Static label |
| Phase indicator | Shows current phase name (e.g., "Phase 1: Codebase Exploration") |
| Countdown timer | Counts down from the total session time; per-phase time allocated separately |
| **Run Main** button | Executes `main.py` (or problem-defined entry point) via Pyodide |
| **Exit** button | Shows confirmation modal → ends session → navigates to `/results` |
| Help mode toggle | One-way switch; once activated, session is flagged "Solved with Help" |

---

### 4B. Left Panel — File Explorer

- Collapsible file tree with `src/` directory grouping
- Editable files (user can write code) vs. **read-only** files (test files, locked stubs)
- **Users CAN create new files** during a session (add to `src/`)
- Active file highlighted
- **"Report a Bug"** button at bottom → opens modal → submits to Supabase `bug_reports` table
- New file creation: `+` icon in the explorer header

---

### 4C. Center Panel — Monaco Editor

- Full Monaco Editor instance
- Python syntax highlighting (Python-only for MVP)
- **IntelliSense / autocomplete ON by default** (mimics real interview environment with VS Code)
- Line numbers, code folding, bracket matching
- Tab bar: open files as tabs, closeable with `×`
- Breadcrumb showing current file path
- Keyboard shortcuts: `Cmd+S` saves (state persisted in session), `Cmd+Enter` runs code

---

### 4D. Right Panel — 3 Tabs

#### Tab 1: Guide

- **Per-phase content**: the Guide tab updates when the phase advances
  - **Phase 1 (Exploration)**: Problem context, codebase structure description, exploration questions
  - **Phase 2+ (Implementation, Optimization, etc.)**: Phase-specific tasks and requirements
- Problem constraints listed
- Collapsible hint system (hints expand on click; hint usage is tracked for scoring)

#### Tab 2: Output

- Monospace, dark terminal-style panel
- Shows stdout/stderr from Pyodide execution
- Per-test-case results (✓ Pass / ✗ Fail with expected vs. actual)
- Execution time displayed
- Clears on each new run

#### Tab 3: AI Assist

> **Tab is locked during Phase 1 (Codebase Exploration).** It becomes available in Phase 2+.

**Chat Interface:**
- User messages (right, dark bubble)
- AI responses (left, with markdown + code block rendering)
- Streaming token-by-token responses (realistic feel)
- Claude has **full context of all project files** injected into system prompt on session start

**Ask vs. Edit Toggle:**
- **Ask mode**: Conversational only — AI responds in chat, user copies code manually
- **Edit mode**: AI proposes a file diff — user sees a GitHub-style Accept / Reject view. Accepted edits are applied to the Monaco editor. *Rejected edits are logged for scoring (Control metric).*

**Message Counter:**
- Soft limit displayed: "X messages remaining this session" (not a hard block)
- Counter visible in the AI tab footer

**Help Mode (when active):**
- Banner at top of AI tab: "Help Mode Active — this session will be scored separately"
- AI system prompt switches to full-assistance mode (no restrictions)
- Visual accent color change on the AI tab (e.g., amber/yellow tint)

**AI System Prompt (Normal Mode) — Key Constraints:**
- Respond naturally as a coding assistant
- You may suggest code that is plausible-looking but contains subtle bugs
- You must never emit the canonical correct solution
- You may be confidently wrong
- If the user pushes back, you may slightly revise but introduce a different bug
- You have access to all project files (injected as context)
- You must never reveal you are intentionally buggy

---

### 4E. Phase System

Phases are defined **per-problem** and stored in the database. Each phase has:
- `name` (e.g., "Codebase Exploration", "Implementation", "Optimization")  
- `duration_minutes` (allocated time)
- `ai_access` (boolean — is the AI tab unlocked?)
- `guide_content` (markdown shown in the Guide tab for this phase)
- `tasks[]` (list of tasks/questions the user must complete before advancing)

**Phase Advancement:**
- A **"Next Phase →"** button appears when all phase tasks are marked complete
- User can also **manually skip ahead** with the Next Phase button (without completing tasks — tracked in scoring)
- Phases do NOT auto-advance on timer expiry; timer running out ends the session
- Phase 1 always has `ai_access: false`

**Phase 1 — Codebase Exploration (no AI):**
- Some questions are **free-form text** (typed answer graded by AI post-session)
- Some are **multiple choice** (graded immediately)
- Purpose: test whether the user actually read and understood the codebase before coding

---

## Section 5: Results Page — `/problems/[slug]/results`

### Scorecard
- **4 rubric dimensions** displayed as a radar chart + individual bars
- Written rationale per dimension (generated by Claude reading the session transcript)

### Rubric Measurement

| Dimension | How It's Measured |
|---|---|
| **Approach** | AI grades Phase 1 free-form answers (quality of codebase understanding before coding) |
| **Control** | Ratio: (lines user wrote) / (AI-suggested lines accepted without modification) + rejection rate of AI edits |
| **Verification** | Number of test runs after AI edits, whether the user caught planted AI bugs, hint usage |
| **Communication** | Claude reads all chat messages + Phase 1 answers and scores clarity and precision of communication |

### Session Stats
- Total session time, time per phase
- Lines written (user vs. AI-assisted)
- AI messages sent, AI edits accepted vs. rejected
- Test runs performed

### Flags
- "Solved with Help" badge if help mode was ever activated
- "Skipped phases" note if user manually skipped without completing tasks

### CTAs
- "Try Again" (new session, same problem)
- "Next Recommended Problem" (based on weakest rubric area)
- "Back to Dashboard"

### History
- Previous attempts for this problem shown below (score trend over time)

---

## Section 6: Problem Content — 5 MVP Problems

### Categories Selected
1. **Data Structures / Arrays** — e.g., Card game engine (shown in reference screenshot)
2. **Graph Traversal / BFS/DFS** — e.g., Maze shortest path
3. **Object-Oriented Design** — e.g., Parking lot system
4. **String Manipulation / Parsing** — e.g., Log parser

> The 5th problem is TBD (one of the above categories gets a second problem, or a new category is added).

### Problem Schema (Supabase)
```
problems
  id, slug, title, difficulty, category, description_md
  total_duration_minutes
  phases[]  (JSONB array)
  files[]   (JSONB: name, content, read_only, entry_point)
  test_cases[]  (JSONB: input, expected_output, hidden)
  canonical_solution  (never sent to client)
  created_at
```

### AI Buggy Behavior Per Problem
- The system prompt includes a **problem-specific "bugs to introduce" section** listing the types of errors Claude should subtly introduce for that problem
- Example for Card Game: off-by-one errors in deck shuffling, incorrect suit comparisons
- This is authored per-problem by the team during content creation

---

## Section 7: Help Mode

- **One-way switch** per session — once activated, cannot be turned off
- Confirmation modal required to activate: "Are you sure? This session will be scored separately."
- Visual indicator: amber banner in AI tab + lock icon changes on top bar toggle
- Session stored in `sessions` table with `help_mode: true`
- Dashboard shows "Solved with Help" as a distinct state from "Solved"
- Separate personal stats tracked for help mode vs. normal sessions

---

## Section 8: Profile & Session History — `/profile`

- List of all completed sessions (date, problem, score per dimension, help mode flag)
- Score trend charts over time (line chart per rubric dimension)
- No comparison to other users (solo only)
- Exportable summary (PDF or copy-to-clipboard) — nice-to-have post-MVP

---

## Section 9: Non-Functional Requirements

### Performance
- Monaco Editor is code-split and lazy-loaded (only loads on `/problems/[slug]`)
- Pyodide WASM is loaded on problem page mount (show a loading spinner)
- Claude responses are streamed via Vercel AI SDK (`useChat` hook)
- Target: <2s to first AI streaming token

### Security
- Claude system prompt is **server-side only** (in Next.js API Route / Server Action) — never exposed to client
- Pyodide execution is sandboxed inside the browser (no server access)
- Supabase Row Level Security (RLS) enabled on all tables — users can only read their own sessions
- Rate limiting on AI endpoints (Vercel Edge middleware) — max 60 requests/hour per user
- `canonical_solution` column never returned in any API response (excluded in all queries)

### Mobile
- Show a "best experienced on desktop" banner on viewports <768px
- Basic responsive layout: read-only problem view (Guide tab content), no editor
- No mobile-specific editor experience

### Accessibility
- ARIA labels on all editor and panel controls
- Keyboard navigation: Tab through panels, Escape to close modals
- Monaco Editor has built-in accessibility features (screen reader support)

### Analytics
- PostHog for product analytics (session starts, phase completions, drop-off points, help mode activations)
- Sentry for error tracking (frontend + API routes)
- Supabase Dashboard for DB monitoring

---

## Section 10: Database Schema (Supabase)

```sql
-- Users (extends Supabase auth.users)
profiles (id, target_company, interview_date, created_at)

-- Problems
problems (id, slug, title, difficulty, category, description_md, 
          total_duration_minutes, phases, files, test_cases, 
          canonical_solution, created_at)

-- Sessions
sessions (id, user_id, problem_id, started_at, ended_at, 
          help_mode, phases_completed, phases_skipped,
          total_ai_messages, ai_edits_accepted, ai_edits_rejected,
          test_runs, lines_written, lines_ai_accepted,
          phase1_answers, chat_transcript,
          score_approach, score_control, score_verification, score_communication,
          score_rationale_json, created_at)

-- Bug Reports
bug_reports (id, user_id, problem_id, session_id, bug_type, 
             description, created_at)
```

---

## Section 11: API Routes

```
POST /api/ai/chat              → Streams Claude response (normal or help mode)
POST /api/ai/score             → Scores a completed session (Claude as judge)
POST /api/sessions             → Creates a new session record
PATCH /api/sessions/[id]       → Updates session telemetry (phase advance, stats)
POST /api/sessions/[id]/end    → Ends session, triggers scoring
POST /api/bugs                 → Submits bug report
GET  /api/problems             → Lists all problems (for dashboard)
GET  /api/problems/[slug]      → Gets single problem (excludes canonical_solution)
GET  /api/profile/sessions     → Gets current user's session history
```

---

## Section 12: Development Phases

### Phase 1 — Foundation (Weeks 1–3)
- [ ] Next.js project setup + Supabase integration
- [ ] Auth flow (signup, login, Google OAuth, email verification)
- [ ] Database schema + RLS policies
- [ ] Basic dashboard with static problem cards
- [ ] Landing page

### Phase 2 — IDE Core (Weeks 4–7)
- [ ] Monaco Editor integration + file explorer
- [ ] Pyodide integration (Python execution in browser)
- [ ] Phase system (phase states, Guide tab per-phase content, phase advancement)
- [ ] Output tab (test runner)
- [ ] Session creation + telemetry tracking

### Phase 3 — AI Integration (Weeks 8–10)
- [ ] Claude API integration with streaming (Vercel AI SDK)
- [ ] AI system prompt for buggy-assistant behavior (per-problem tuning)
- [ ] Ask vs. Edit toggle + diff view
- [ ] Help mode (system prompt swap + visual indicators)
- [ ] AI context injection (all project files in system prompt)

### Phase 4 — Scoring (Weeks 11–12)
- [ ] Session end flow + scoring API
- [ ] Claude-as-judge for Approach and Communication scoring
- [ ] Rule-based scoring for Control and Verification
- [ ] Results page with radar chart + rationale
- [ ] Session history on profile page

### Phase 5 — Content & Polish (Weeks 13–16)
- [ ] Author all 5 problems (phases, files, test cases, buggy behavior instructions)
- [ ] QA the buggy AI mechanic per problem (red-team testing)
- [ ] Performance optimization (Monaco code split, Pyodide loading)
- [ ] Accessibility pass
- [ ] PostHog + Sentry integration
- [ ] Beta user testing + iteration

### Target Launch: November 2026 ✓

---

## Open Questions Resolved

All 25 design decisions have been answered. No remaining blockers to begin development.
