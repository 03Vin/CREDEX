# Devlog

## Day 1 — 2026-05-09
**Hours worked:** 1
**What I did:**
- Initialized Next.js project with TypeScript and Tailwind CSS.
- Researched pricing data for Cursor, GitHub Copilot, Claude, ChatGPT, and Gemini.
- Created `PRICING_DATA.md` with sources.
- Set up the project task list and implementation plan.

**What I learned:**
- `create-next-app` fails if the directory name contains spaces or capital letters (when using `./`). Had to create it in a subdirectory `spend-audit`.
- Pricing structures are moving towards credit-based systems (Cursor, Copilot).

**Blockers / what I'm stuck on:**
- None so far.

**Plan for tomorrow:**
- Build the spend input form.
- Implement the core audit engine logic.

## Day 2 — 2026-05-10
**Hours worked:** 3
**What I did:**
- Built the spend input form with state persistence.
- Implemented the core audit engine logic for all tools.
- Created the results page with premium dark UI.
- Integrated AI summary with fallback.
- Set up Lead Capture & Storage structure with Supabase.
- Wrote 10 passing unit tests with Vitest.
- Set up CI workflow with GitHub Actions.

**What I learned:**
- Next.js 15+ handles dynamic routes differently with Promises.
- Mocking Supabase allows for great local dev DX.
- console.error can trigger the Next.js error overlay in dev mode.

**Blockers / what I'm stuck on:**
- None. MVP is complete!

**Plan for tomorrow:**
- Finalize documentation and prepare for submission.
