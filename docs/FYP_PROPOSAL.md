<div align="center">

# **MY STUDIO**

### A Web-Based AI Platform for Building Websites and Web Applications Through Natural Language Conversation

**BS Computer Science — Final Year Project Proposal**

<br>

---

**Session:** 2026 – 2027 &nbsp;|&nbsp; **Semester:** Semester 8 (Spring 2027)

---

| | |
|---|---|
| **Student 1** | Ilyas Khan|
| **Student 2** | Akbar Ali |
| **Student 3** | Bibi Tabassum |
| **Registration No(s)** | 231016151 |
| **Program** | BS Computer Science |
| **Semester** | 7th |
| **Supervisor** |  |
| **Co-Supervisor** |  |
| **Date of Submission** | 8/10/2026|

---

*Department of Computer Science*  
*Abdul Wali khan university ,Mardan*

</div>

<div style="page-break-after: always;"></div>

---

## Contents

| | |
|---|---|
| 1. Project Title | 8. Scope of the Project |
| 2. Student Information | 9. Proposed Methodology |
| 3. Abstract | 10. Tools and Technologies |
| 4. Introduction / Background | 11. Expected Outcomes / Deliverables |
| 5. Problem Statement | 12. Literature Review / Existing Work |
| 6. Objectives | 13. Project Timeline |
| 7. Proposed Solution / Project Description | 14. References |

---

## 3. Abstract

Web development presents steep technical and financial hurdles for non-programmers. While modern Large Language Models (LLMs) can generate source code, traditional chat assistants remain inadequate for complete software projects: they output single-file snippets without project structure, lack execution feedback, and require costly, repeated re-prompts when errors arise.

This project proposes **MY Studio**, a browser-based conversational platform where an autonomous AI agent constructs multi-file web applications inside a client-side execution sandbox. By interacting through a unified shell-style tool, the agent iteratively generates, tests, and repairs code before presenting the outcome. To reduce token consumption, the system integrates 12 pre-built project templates and 12 reusable guidance skills, amortizing structural generation costs. Every step is captured via copy-on-write snapshots for instant rollback, and real-time token expenditure is tracked in US dollars. The system is evaluated via a 14-task pilot study across four conditions—including an ablation of templates and skills—measuring token cost, completion time, and task success rate.

---

## 4. Introduction / Background

### 4.1 Context
Demand for customized web applications consistently outstrips developer availability. Non-technical creators typically rely on rigid website builders that restrict custom logic, or hire developers at significant expense. AI-assisted generation bridges this gap, provided it can be made cost-effective and dependable.

### 4.2 Technical Background
- **Code-Generating LLMs:** Models such as GPT-4, Claude, and Gemini [4]–[6] synthesize expressive code from natural language prompts, but lack persistent project state and execution feedback.
- **Tool-Using Agents:** Agentic loops (e.g., ReAct [3] and SWE-agent [1]) allow models to issue commands to an execution environment, inspect runtime outputs, and iteratively self-correct.
- **Inference Economics:** API costs scale linearly with prompt context and repeated round-trips; modular templates and cached skills reduce avoidable boilerplate generation.

### 4.3 The Gap
Existing developer-focused agents optimize for repository bug fixes, while commercial builders obscure cost structures behind subscription paywalls. MY Studio addresses the gap in cost-transparent, self-correcting greenfield web application development for non-programmers.

---

## 5. Problem Statement

Building complete web applications using conversational AI currently suffers from five critical limitations:

1. **Compounding Retry Costs:** Repeated generation attempts multiply token consumption without guaranteed success.
2. **Redundant Boilerplate Generation:** Common structures (portfolios, dashboards, blogs) are repeatedly synthesized from scratch.
3. **Absence of Runtime Verification:** Chat assistants emit code without verifying compilation, execution, or runtime errors.
4. **Context Drift and Irreversibility:** Long conversations cause models to overwrite past work with no native rollback mechanism.
5. **Opaque Financial Accounting:** Inference costs remain hidden until vendor invoices are issued.

> **Research Question:** *Can a conversational web development platform measurably reduce token expenditure and improve task success rates for non-programmers through sandboxed tool execution, instant state rollback, and reusable template/skill libraries?*

---

## 6. Objectives

- **O1 — Sandboxed Agent & Checkpointing Core:** Implement a browser-resident virtual filesystem and agent loop governed by a unified shell tool, with copy-on-write snapshotting for instant rollback.
- **O2 — Multi-Provider Inference & Live Cost Meter:** Build a client-side adapter for OpenAI, Anthropic, Gemini, and local Ollama models with real-time token and USD cost calculation.
- **O3 — Template & Skill Reuse Libraries:** Develop 12 project skeletons and 12 modular instruction skills to minimize redundant code synthesis.
- **O4 — In-Browser IDE & Multi-Runtime Preview:** Provide a Monaco-based editor, file explorer, and live hot-reloading preview supporting HTML/CSS/JS, React, and Vue.
- **O5 — Non-Programmer Interface:** Deliver a dual-mode workspace (Chat/Code), checkpoint inspector, cost display, and 12 drag-and-drop UI blocks evaluated by 5–8 testers.
- **O6 — Empirical Pilot Evaluation:** Benchmark 14 development tasks across four experimental conditions measuring token cost, execution time, and functional success rate.

---

## 7. Proposed Solution / Project Description

MY Studio is a client-side web application where users iteratively design and deploy web applications through natural conversation. The platform executes entirely within the browser, requiring no server-side databases or backend key storage.

```
[ User Interface (Chat / Code) ]  ──>  [ AI Agent (Shell Loop) ]  ──>  [ Multi-Provider LLMs ]
               │                                      │
               ▼                                      ▼
    [ Live Preview & Export ]     <──    [ Sandboxed Virtual FS & Checkpoints ]
```

### Key Mechanisms
- **Single Shell Tool:** The agent executes exclusively via unified filesystem commands (`ls`, `cat`, `sed`, `build`, etc.), inspecting standard output and runtime logs to self-correct before reporting completion.
- **Turn-by-Turn Checkpointing:** Automatic copy-on-write state snapshots allow users to roll back the entire project to any previous turn instantly.
- **Template & Skill Libraries:** Reusable templates provide instant baseline file trees, while skills supply domain knowledge directly into agent prompts.
- **Real-Time Cost Counter:** Continuous token consumption tracking displays exact expenditure in USD as generation occurs.
- **Client-Side Sandbox & BYOK:** User-held API keys and an isolated iframe execution container ensure privacy and security without backend infrastructure.
- **Dual Workspace Modes:** A read-only **Chat** mode for architectural planning and a tool-driven **Code** mode for active project synthesis.

---

## 8. Scope of the Project

### Included
- Conversational Web Application Construction
- Sandboxed Autonomous Agent (Shell-style tool loop)
- Turn-by-Turn State Snapshots and Instant Rollback
- Multi-Provider BYOK Integration (OpenAI, Anthropic, Google Gemini, Ollama)
- Real-Time Token and Cost Tracking (USD)
- 12 Pre-built Project Templates
- 12 Reusable Agent Skills
- In-Browser IDE (Monaco editor, file tree, terminal)
- Multi-Runtime Hot-Reloading Preview (HTML/CSS/JS, React, Vue)
- 12 Drag-and-Drop UI Component Blocks
- Project Import and Export (ZIP)
- 14-Task Empirical Pilot Evaluation & Usability Testing

### Excluded
- Native Mobile App Development (iOS / Android)
- Model Training or Fine-Tuning
- Native Desktop Installers (.exe, .dmg)
- Production Hosting, Cloud Infrastructure & Custom Domain Provisioning
- User Accounts, Authentication & Server-Side Key Storage
- Backend Database Hosting
- Enterprise Security Certification & Compliance Auditing

---

## 9. Proposed Methodology

### 9.1 Phased Workflow & Milestones
Development follows an agile sprint structure across Semester 8 (Spring 2027):
1. **Harness & Benchmark Setup (Feb):** Construct the evaluation logger and formalize pass/fail test checklists for all 14 benchmark tasks prior to platform development.
2. **Core Agent & Sandbox Engine (Feb – Mar):** Implement the virtual filesystem, shell tool execution loop, snapshot engine, and multi-provider client adapter.
3. **IDE, Runtimes & Libraries (Mar – Apr):** Integrate the Monaco editor, live multi-runtime preview (HTML/React/Vue), 12 project templates, and 12 skills.
4. **Evaluation & Usability Sessions (May – Jun):** Conduct the 14-task benchmark across all four conditions, run external usability testing with 5–8 participants, and analyze ablation data.

### 9.2 Pilot Evaluation Matrix
- **Benchmark Tasks (14):** 10 in-template tasks (portfolios, blogs, dashboards, e-commerce layouts) and 4 held-out tasks (pricing calculator, event countdown, wizard form, interactive gallery) assessed against strict pass/fail checklists.
- **Experimental Conditions (4):**
  - **Condition A (Full Platform):** MY Studio with all templates and skills enabled.
  - **Condition B (Ablation):** MY Studio with templates and skills disabled.
  - **Condition C (API Chat Baseline):** Standard non-agentic LLM API calls using the identical model.
  - **Condition D (Manual Baseline):** Hand-coded implementation within a fixed time cap.
- **Evaluation Metrics:** Total token expenditure ($ USD), task completion time (minutes), and functional success rate (% pass).

### 9.3 Quality Assurance & Limitations
- Automated unit test coverage for tool command parsers, snapshot rollback routines, and cost metering logic.
- Acknowledgment of pilot limitations: sample size (14 tasks × 3 repetitions) and third-party model version updates.

---

## 10. Tools and Technologies

| Category | Choice |
|---|---|
| Programming Languages | TypeScript, JavaScript, HTML5, CSS3 |
| Frontend Frameworks | Next.js, React, Tailwind CSS, Radix UI, Zustand |
| State & Storage | Browser IndexedDB (Client-side only) |
| Editor & Runtime | Monaco Editor, Web Workers, Sandboxed iframe |
| Supported LLM Providers | OpenAI, Anthropic, Google Gemini, OpenRouter, Ollama |
| Testing & Automation | Vitest, Playwright, ESLint |
| Packaging & Export | JSZip (Client-side ZIP packaging) |

---

## 11. Expected Outcomes / Deliverables

1. **Web-Based Application Builder:** Functional browser platform featuring sandboxed agent execution, checkpoint rollbacks, and real-time cost tracking.
2. **Template & Skill Reusability Suite:** 12 pre-configured application templates and 12 modular instruction skills.
3. **In-Browser IDE & Preview Engine:** Multi-runtime compiler (HTML/React/Vue), file explorer, and hot-reloading iframe sandbox with ZIP export.
4. **Empirical Evaluation & Benchmark Dataset:** Comprehensive pilot report with 14-task benchmark logs, ablation findings, and usability metrics.
5. **Project Technical Documentation:** Complete FYP technical report, architectural diagrams, and user guide.

---

## 12. Literature Review / Existing Work

### 12.1 General-Purpose AI Chat Assistants (ChatGPT, Claude, Gemini) [4]–[6]
Standard chat interfaces excel at generating isolated code snippets. However, they lack persistent project environments, execution runtimes, and automated verification loops, leading to high token costs through repeated manual debugging.

### 12.2 Open Agentic Software Environments (SWE-agent, OpenHands) [1]–[3]
Frameworks such as SWE-agent and OpenHands demonstrate that agent-computer interfaces enable models to resolve software issues autonomously via shell tools. Nevertheless, these systems target professional software engineers resolving repository-level bugs rather than non-programmers constructing greenfield web applications.

### 12.3 In-Editor AI Coding Assistants (GitHub Copilot, Cursor)
IDE extensions enhance developer productivity with inline completions and multi-file editing. They remain developer-centric tools requiring local toolchains, vendor lock-in, and lack upfront cost transparency or template-driven generation.

### 12.4 Commercial AI Website Builders (Lovable, Bolt)
Commercial builders (Lovable, Bolt) impose subscription paywalls and hide inference costs, unlike MY Studio's open, cost-metered, and client-side architecture.

---

## 13. Project Timeline

*Semester 8 (Spring 2027): February 2027 – June 2027*

| Month | Phase | Key Deliverables |
|---|---|---|
| **Feb 2027** | Requirements & Harness | Requirement analysis, evaluation harness, 14 benchmark task checklists |
| **Mar 2027** | Core Agent & Sandbox | Virtual filesystem, shell tool loop, checkpoints, multi-provider BYOK |
| **Apr 2027** | IDE & Asset Libraries | Monaco editor, live iframe sandbox, 12 templates, 12 skills |
| **May 2027** | Testing & Benchmarking | 14-task benchmark across 4 conditions, 5–8 tester usability sessions |
| **Jun 2027** | Documentation & Defense | Data analysis, FYP final technical report, demonstration video, project defense |


---

<div style="page-break-before: always;"></div>

## 14. References

1. J. Yang, C. E. Jimenez, A. Wettig, K. Lieret, S. Yao, K. Narasimhan, and O. Press, "SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering," in *Advances in Neural Information Processing Systems (NeurIPS)*, 2024. [Online]. Available: https://arxiv.org/abs/2405.15793

2. X. Wang, B. Li, Y. Song, F. F. Xu, X. Tang, et al., "OpenHands: An Open Platform for AI Software Developers as Generalist Agents," in *International Conference on Learning Representations (ICLR)*, 2025. [Online]. Available: https://arxiv.org/abs/2407.16741

3. S. Yao, J. Zhao, D. Yu, N. Du, I. Shafran, K. Narasimhan, and Y. Cao, "ReAct: Synergizing Reasoning and Acting in Language Models," in *International Conference on Learning Representations (ICLR)*, 2023. [Online]. Available: https://arxiv.org/abs/2210.03629

4. OpenAI, "GPT-4 Technical Report," *arXiv preprint arXiv:2303.08774*, 2023. [Online]. Available: https://arxiv.org/abs/2303.08774

5. Anthropic, "The Claude 3 Model Family: Opus, Sonnet, Haiku," Technical Report, Anthropic, 2024. [Online]. Available: https://www.anthropic.com/news/claude-3-model-family

6. Gemini Team, Google, "Gemini: A Family of Highly Capable Multimodal Models," *arXiv preprint arXiv:2312.11805*, 2023. [Online]. Available: https://arxiv.org/abs/2312.11805

---

<div style="page-break-before: always;"></div>

<div align="center">

## Approval

**Student Signatures**

[to fill] &nbsp; · &nbsp; [to fill] &nbsp; · &nbsp; [to fill]

**Supervisor Signature:** [to fill]

**FYP Coordinator Signature:** [to fill]

</div>
