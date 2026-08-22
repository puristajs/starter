# PURISTA Application

Welcome to your PURISTA based application. The template already contains a `ping` service with

- a synchronous `POST /api/v1/ping` command
- an asynchronous `POST /api/v1/ping/async` command that enqueues work
- a queue (`pingJob`) plus worker processing jobs sequentially
- a disabled-by-default schedule trigger that can be loaded by a separate Core scheduler host or exported for external schedulers

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
- run `npm run add:schedule -- <name> --description "<description>" --service <service> --service-version 1 --event <eventName> --cron "0 2 * * *"` to declare an event-only clock boundary
- run `npm run export:definitions` to refresh `purista.definitions.json` directly
- run `npm run export:asyncapi`, `npm run export:schedules`, or `npm run export:runtime` to export provider-neutral integration metadata
- run `npm run start:scheduler` only after `npm run export:schedules` for the local standalone Scheduler Runtime host; it needs a shared EventBridge to reach a separately started app
- run `npm run export:kubernetes-cronjobs -- --trigger-image <image> --trigger-url <url>` to export Kubernetes CronJob JSON for cron-based schedules

Contract exporters read `purista.definitions.json`. Update `src/definitions.ts` when you add additional service builders that should be exported.

This template also includes agent guidance files (`AGENTS.md`, `CLAUDE.md`, and `.agents/IMPLEMENTATION.md`). Local links under `.agents/skills/` and `.claude/skills/` point to the bundled PURISTA architecture and migration skills in `@purista/core`. Use `purista-migration` only when upgrading an existing application; use `purista` for normal feature work.

Attached agents keep model, skill, sandbox, durable runtime, and durable workspace stores in service bootstrap/config via `ai.models`, `ai.skills`, `ai.sandbox`, `ai.runtime`, and `ai.workspaceStore`. If an agent declares `.useSkills(...)`, bind the skill directories through `ai.skills.bindings`, `ai.skills.namespaces`, or explicitly trusted discovery. Agents are ephemeral by default. Use `npm run add:agent -- <name> --service <service> --service-version 1 --durable-workspace` only for a resumable workflow-backed agent; it generates `setHarnessWorkflow(...)` plus `setWorkspacePolicy({ mode: 'durable', required: true, cleanup: 'on_terminal' })`. Do not use durable workspace policy for a direct harness agent or custom run function.

Kubernetes export requires you to provide the trigger image and URL or command at invocation time.
Kubernetes owns the clock; the trigger calls PURISTA, and PURISTA emits the event or enqueues the queue job. For a Core Scheduler Runtime host, keep it as a separate process: it loads the exported manifest and publishes trigger events, but never boots the business service graph.

`start:scheduler` uses `DefaultSchedulerProvider`, so it is deliberately local/test-only. It is not a production scheduler configuration and does not make `DefaultEventBridge` communicate across processes. For a replicated production scheduler host, use a shared EventBridge plus a provider package with durable distributed claims (for example `@purista/redis-scheduler-provider`), call `.setStrict().setRequireDistributedClaims()`, and make downstream business work idempotent with `message.schedule.occurrenceId`.

The template wires `DefaultEventBridge` and `DefaultQueueBridge` separately. This keeps the generated app compatible with PURISTA deployments that later replace either bridge with AMQP, NATS, Redis, Dapr, or another adapter.

## Optional OpenTelemetry metrics

The ping service declares `app.ping.requests` and records it through typed
`context.metrics`. PURISTA records through the OpenTelemetry Metrics API; the
application owns SDK readers and exporters.

The starter stays dependency-free by default. To opt in locally, install the
OpenTelemetry API and metrics SDK, then start with the telemetry environment
flag:

```sh
npm install @opentelemetry/api @opentelemetry/sdk-metrics
PURISTA_TELEMETRY=otel npm start
```

`src/telemetry.ts` uses a console reader for the opt-in path. Replace it with
your application's OTLP reader or collector configuration for production. Do
not add request IDs, tenant IDs, prompts, payloads, headers, or secrets as
metric attributes.

---

- Official Website: **[purista.dev](https://purista.dev)**
- Follow on Twitter **[@purista_js](https://twitter.com/purista_js)**
- Join the **[Discord Chat](https://discord.gg/9feaUm3H2v)**

<a href="https://www.producthunt.com/posts/purista?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-purista" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=386519&theme=light" alt="PURISTA - Typescript&#0032;framework&#0032;for&#0032;IoT&#0044;&#0032;microservices&#0044;&#0032;and&#0032;serverless | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

---
