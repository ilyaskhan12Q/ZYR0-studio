# Changelog

All notable changes to **ZYR0 Studio** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.0] - 2026-08-19

### Inaugural Release of ZYR0 Studio
**Author:** Ilyas Khan (`ik7408008@gmail.com`)

ZYR0 Studio is an AI-powered development environment that enables autonomous multi-file web development through natural language conversations with agentic AI.

#### 🤖 AI & Agent Orchestration
- **Single-Tool Shell Paradigm:** Sandboxed agent execution using the virtual `bash` shell tool (`ls`, `cat`, `grep`, `find`, `mkdir`, `rm`, `mv`, `cp`, `sed -i`, `tree`, `head`, `tail`, `build`, `status`).
- **Multi-Agent Coordination:** Specialized agent roles for intake, architectural exploration, planning, interviewing, and implementation (`setup`, `interview`, `explore`, `plan`, `task`).
- **16+ LLM Providers:** Integrated support for OpenRouter, OpenAI, Anthropic Claude, Google Gemini, Groq, HuggingFace, DeepSeek, MiniMax, Zhipu AI, SambaNova, Ollama, LM Studio, llama.cpp, and ChatGPT subscription authentication.
- **Dynamic System Prompts & Skills:** Anthropic-style skill evaluation, project brief context injection, and conversation compaction for long-running workflows.
- **Web Search & Image Generation:** Native search capabilities via DuckDuckGo and integrated image generation tooling.

#### 📁 Virtual File System & Checkpointing
- **Zero-Loss Checkpoints:** Per-message automatic file system snapshotting with instant rollbacks and visual diffing.
- **Hybrid VFS Backend:** IndexedDB-backed client storage for pure browser mode, coupled with SQLite server/desktop persistence.
- **Bidirectional Sync Manager:** Batched, resumable project sync between client workspaces and server storage supporting large multi-megabyte payloads.
- **Portable Backups & Templates:** Export and import capabilities for complete `.osws` project archives (including full revision history) and `.oswt` reusable templates.

#### ⚡ Runtimes & In-Browser Compilation
- **Client-Side Bundling:** In-browser bundling of modern JavaScript/TypeScript frameworks (React, Preact, Svelte, Vue) using `esbuild-wasm`.
- **Templating Engine:** Built-in Handlebars compilation for static websites with reusable partials and layouts.
- **Sandboxed Scripting:** Interactive Python (via Pyodide) and Lua (via Wasmoon) console runtimes.
- **Live Preview:** Hot-reloading iframe environment with console event forwarding and responsive viewport emulation.

#### 🌐 Server Mode & Edge Functions
- **Self-Hosted Multi-Tenancy:** Scoped `/w/[workspaceId]` routing, role-based workspace management, and JWT session security.
- **Serverless Edge Functions:** QuickJS WebAssembly sandbox with secure bindings for `fetch`, SQLite database access, and cryptographic operations.
- **Per-Project Databases:** Isolated SQLite storage for dynamic backends, CRUD endpoints, and admin panels.
- **Automated Publishing & Reverse Proxy:** Built-in static deployment serving and Caddy ingress integration for automatic HTTPS custom domains.

#### 🖥️ Desktop Application
- **Electron Distribution:** Native standalone packaging for macOS, Windows, and Linux.
- **Zero-Config Local Backend:** Integrated Next.js standalone server and local database bootstrapping.

#### 🔒 Security & Performance Foundations
- **Path Traversal Containment:** Virtual file path validation preventing deployment boundary escapes.
- **Optimized Asset Pipeline:** Middleware bypass for preview static assets and hardlinked server-side binary blob storage.
- **Structured JSON Repair:** Streaming parser with automatic repair for models lacking native tool-calling support.