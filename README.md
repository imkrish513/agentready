# AgentReady

> **Master the AI-Pair Interview** — A solo interview prep platform where engineers practice agentic coding interviews alongside an AI assistant that can be buggy, unhelpful, or confidently wrong.

---

## 🚀 Overview

Companies are shifting away from traditional LeetCode puzzles toward **agentic coding interviews** — pair-programming with AI assistants to build, debug, and optimize real codebases.

AgentReady simulates these interview environments with:
- **Progressive Interview Phases**: Exploration (no AI), Implementation, Optimization, and Debugging.
- **Deliberately Degraded AI**: Plausible-but-buggy AI recommendations to test your control, verification, and code steering.
- **Multi-File Web IDE**: Browser-based code editing, test running, and interactive AI pair-programming.
- **Rubric-Based Scoring**: Objective breakdowns across **Approach**, **Control**, **Verification**, and **Communication**.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router, TypeScript)
- **Styling**: Vanilla CSS Modules (Custom Dark Design System)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL, Row Level Security, SSR Auth)
- **Code Execution**: Pyodide (WASM browser-based Python execution)
- **AI Integration**: Anthropic Claude API (streaming responses, diff generation)

---

## 🏁 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/imkrish513/agentready.git
cd agentready
npm install
```

### 2. Configure Environment Variables

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Setup Database

Run the SQL script located at `src/lib/supabase/schema.sql` in your [Supabase SQL Editor](https://supabase.com/dashboard).

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 📂 Project Structure

```
src/
├── app/
│   ├── auth/            # Login, Signup, OAuth Callback
│   ├── dashboard/       # Problem library, telemetry stats
│   ├── globals.css      # Design tokens and theme reset
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Landing / Marketing page
├── lib/
│   └── supabase/        # Browser/Server clients, schema, middleware
├── types/
│   └── database.ts      # TypeScript database schema definitions
└── middleware.ts        # Route protection & token refresh
```
