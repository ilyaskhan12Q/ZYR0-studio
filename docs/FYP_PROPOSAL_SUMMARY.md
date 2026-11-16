# MY Studio — FYP One-Page Summary

## Project Title
**MY Studio: A Web-Based AI Platform for Building Websites and Web Applications Through Natural Language Conversation**

**Team:** 3 students · **Duration:** Nov 2026 – Oct 2027 (2 semesters) · **Supervisor:** [to fill]

---

## The Problem
AI chat assistants can write code, but turning a description into a finished web application is still **costly and unreliable**:

1. Every retry spends more tokens — one app can cost several times what it should.
2. Common projects (portfolios, blogs, dashboards) are rebuilt from scratch every time.
3. Chat assistants never *run* the code — errors surface only after manual assembly.
4. Long tasks drift from the request, and nothing can be rolled back.
5. Cost stays invisible until the bill arrives.

> **Research question:** Can a conversational AI platform build a web application **cheaper** and **more successfully** than a standard AI chat assistant — and how much of that difference comes specifically from reusing templates and skills?

## The Solution
A web platform (same category as Lovable/Bolt): the user describes what they want, and an AI agent builds it as a real multi-file project inside a **sandbox**, then runs it and fixes its own errors before showing the result. No account, no server — files, keys and session stay in the user's browser.

- **Cheap** — 12 built-in templates and 12 reusable *skills* give the agent proven starting structure. A live counter shows tokens and US$ while the task runs. Claim: *lower cost per successful task than a chat assistant.*
- **Reliable** — one shell-style tool, real command output, and a **checkpoint saved after every turn** so any step rolls back with one click. Preview runs in a sandboxed iframe with a content security policy.
- **Well designed** — dual-mode workspace (Chat/Code), file tree, checkpoint history, cost panel, and **12 drag-and-drop UI blocks**, reviewed by 5–8 outside testers.

**Also:** at least 3 AI providers with user-held API keys + free local models (Ollama), in-browser IDE with live preview, three runtimes (HTML, React, Vue), ZIP export deployable to Vercel/Netlify/GitHub Pages.

## Objectives
1. **O1** — Sandboxed agent core with per-turn checkpoints and sandboxed preview
2. **O2** — Multi-provider AI layer, BYOK keys in browser, live token/cost counting
3. **O3** — 12 templates + 12 skills framework (the mechanism under test)
4. **O4** — In-browser IDE with live preview, three runtimes
5. **O5** — Interface usable by non-programmers (12 blocks + tester review)
6. **O6** — Pilot evaluation across four conditions

## How We Prove It
**14 fixed tasks** — 10 that templates cover, **4 held out that no template matches**. Each done **four ways**:

| Condition | What runs |
|---|---|
| A — Our platform | Templates + skills enabled |
| B — Our platform, ablation | Templates + skills **switched off** |
| C — Chat assistant | Same API, **same model** as A/B |
| D — Manual coding | By hand, fixed time cap |

A vs C isolates the platform. **A vs B isolates the templates and skills — the actual claim.**

| Metric | Measurement |
|---|---|
| Token cost | tokens × published price = US$ (our counter) |
| Completion time | minutes to pass checklist, median of 3 runs |
| Success rate | pass/fail vs checklist written *before* testing |

Plus one **before/after cost example** and a **5–8 tester usability session**. Reported as a **pilot study, not proof**. Measurement harness built first, in Feb–Mar 2027.

## Scope
**In:** web app generation · sandboxed agent + checkpoints · 12 templates & 12 skills · 3+ providers with BYOK/local mode · in-browser IDE + live preview · 12 drag-drop blocks · ZIP/Vercel/Netlify/GitHub export · 14-task four-condition pilot + tester session.

**Out:** mobile apps · model training · native desktop builds · accounts/server key storage · hosting for published sites (DBs, serverless, custom domains — *future work*) · further runtimes (Handlebars, Preact, Svelte, Python, Lua — *future work*) · enterprise certification.

## Timeline
| Phase | Dates |
|---|---|
| Requirement Analysis | Nov – Dec 2026 |
| Literature Review | Nov 2026 – Jan 2027 |
| Design & Development | Feb – Jul 2027 |
| Testing & Evaluation | Jun – Sep 2027 |
| Documentation & Final Report | Aug – Oct 2027 |

**Workstreams:** A = Agent & AI (O1, O2) · B = Platform & Design (O3–O5) · C = Evaluation & Testing (O6).

**Fallback:** if behind, cut O5 polish → third runtime → templates below 12. **Harness and evaluation are never cut.**

## Expected Deliverables
1. Working web platform (sandboxed agent, checkpoints, BYOK multi-provider, live cost display)
2. 12+ templates + 12+ skills library, documented
3. Non-programmer-friendly interface with 12 blocks, tester-verified
4. Pilot evaluation report: 14 tasks × 4 conditions, with ablation and honest limitations
