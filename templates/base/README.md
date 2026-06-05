# PURISTA Application

Welcome to your PURISTA based application. The template already contains a `ping` service with

- a synchronous `POST /api/v1/ping` command
- an asynchronous `POST /api/v1/ping/async` command that enqueues work
- a queue (`pingJob`) plus worker processing jobs sequentially
- a disabled-by-default schedule contract that can be exported for external schedulers

Run `npm start` (or `pnpm start`, etc.) to boot the DefaultEventBridge, start the ping service, and expose the HTTP endpoints through the Hono HTTP server (if you selected it during scaffolding).

The official documentation can be found at **[purista.dev](https://purista.dev)**.

## Reliability defaults in this template

- queue workers start conservatively (`sequential`, `prefetch: 1`) for predictable local behavior
- queue retries are bounded and dead-lettered automatically once retry budget/window is exhausted
- startup validation is strict for requested broker guarantees, so unsupported semantics fail fast
- you can explicitly dead-letter from workers with `context.job.moveToDeadLetter(reason?)`

This template installs `@purista/cli` as a dev dependency. Prefer the local package scripts so the CLI version matches the project.

In the root of this project:

- run `npm run add:service -- <name>` to add another service
- run `npm run add:command -- <name>` to add additional commands to an existing service
- run `npm run add:subscription -- <name>` to react to additional events
- run `npm run add:queue -- <name>` whenever you need another pull-based worker
- run `npm run export:runtime` to export provider-neutral runtime capability metadata

This template also includes agent guidance files (`AGENTS.md`, `CLAUDE.md`, and `.agents/IMPLEMENTATION.md`). Local skill links under `.agents/skills/purista` and `.claude/skills/purista` point to the PURISTA skill bundled with `@purista/core`.

Attached agents keep model, skill, sandbox, durable runtime, and durable workspace stores in service bootstrap/config via `ai.models`, `ai.skills`, `ai.sandbox`, `ai.runtime`, and `ai.workspaceStore`. If an agent declares `.useSkills(...)`, bind the skill directories through `ai.skills.bindings`, `ai.skills.namespaces`, or explicitly trusted discovery. Declare durable replay with `setWorkspacePolicy({ mode: 'durable', required: true })` only when an agent must resume from committed workspace checkpoints; otherwise agents remain ephemeral by default.

The template wires `DefaultEventBridge` and `DefaultQueueBridge` separately. This keeps the generated app compatible with PURISTA deployments that later replace either bridge with AMQP, NATS, Redis, Dapr, or another adapter.

---

- Official Website: **[purista.dev](https://purista.dev)**
- Follow on Twitter **[@purista_js](https://twitter.com/purista_js)**
- Join the **[Discord Chat](https://discord.gg/9feaUm3H2v)**

<a href="https://www.producthunt.com/posts/purista?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-purista" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=386519&theme=light" alt="PURISTA - Typescript&#0032;framework&#0032;for&#0032;IoT&#0044;&#0032;microservices&#0044;&#0032;and&#0032;serverless | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

---
