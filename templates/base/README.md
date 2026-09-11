# PURISTA Application

Welcome to your PURISTA based application. The template contains one `ping`
service with a synchronous `POST /api/v1/ping` command and one small native
Harness agent. The agent shows the service-owned folder layout, one Harness
composition, one service mount, runtime model binding, and a deterministic test.
Queues, subscriptions, streams, schedules, telemetry, and further adapters are
added only when the application requires them.

Run `npm start` (or `pnpm start`, etc.) to boot the DefaultEventBridge, start the ping service, and expose the HTTP endpoints through the Hono HTTP server (if you selected it during scaffolding).

Set `OPENAI_API_KEY` in the process environment before starting the
agent-enabled application; `.env.example` lists the required variable. Tests
use `FakeModelProvider` and do not need that credential or network access.

The official documentation can be found at **[purista.dev](https://purista.dev)**.

This template installs `@purista/cli` as a dev dependency. Prefer the local package scripts so the CLI version matches the project.

In the root of this project:

- run `npm run add:service -- <name>` to add another service
- run `npm run add:command -- <name>` to add additional commands to an existing service
- run `npm run add:subscription -- <name>` to react to additional events
- run `npm run add:queue -- <name>` whenever you need another pull-based worker
- run `npm run add:schedule -- <name> --description "<description>" --service <service> --service-version 1 --event <eventName> --cron "0 2 * * *"` to declare an event-only clock boundary
- run `npm run add:agent -- <name> --service <service> --service-version 1 --model-alias <alias>` to add a native agent with an application-chosen model alias to a service-owned Harness
- run `npm run add:workflow`, `npm run add:tool`, `npm run add:skill`, or `npm run add:mcp` for the corresponding Harness definition
- run `npm run export:definitions` to refresh `purista.definitions.json` directly
- run `npm run inspect:architecture` before changing an existing boundary; it exports definitions and prints the deterministic agent context
- run `npm run validate:architecture` after a boundary change and `npm run doctor:architecture` for static project checks
- persist `purista inspect --out <artifact>` and use `purista diff --base <approved-artifact> --strict` when a reviewed public contract changes; changed schemas are deliberately reported as unknown until approved

Contract exporters read `purista.definitions.json`. Update `src/definitions.ts` when you add additional service builders that should be exported.

This template also includes agent guidance files (`AGENTS.md`, `CLAUDE.md`, and `.agents/IMPLEMENTATION.md`). Local links under `.agents/skills/` and `.claude/skills/` point to the bundled PURISTA architecture and migration skills in `@purista/core`. Use `purista-migration` only when upgrading an existing application; use `purista` for normal Framework and Harness integration work.

---

- Official Website: **[purista.dev](https://purista.dev)**
- Follow on Twitter **[@purista_js](https://twitter.com/purista_js)**
- Join the **[Discord Chat](https://discord.gg/9feaUm3H2v)**

<a href="https://www.producthunt.com/posts/purista?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-purista" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=386519&theme=light" alt="PURISTA - Typescript&#0032;framework&#0032;for&#0032;IoT&#0044;&#0032;microservices&#0044;&#0032;and&#0032;serverless | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

---
