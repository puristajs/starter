# Agent Guide

This is a PURISTA application. Use the PURISTA framework shape and CLI-generated files as the source of truth for project structure.

## Required workflow
- Read `purista.json` before changing services, commands, subscriptions, streams, queues, workers, or agents.
- Use the local `@purista/cli` package scripts whenever the CLI can create the target artifact. Refine generated code instead of hand-writing framework skeletons.
- Keep service code under the configured `servicePath` and agent code under the configured `agentPath`.
- Keep schemas explicit at every command, subscription, stream, queue, worker, and agent boundary.
- Keep runtime wiring in application bootstrap/config files. Do not import infrastructure clients directly in handlers when a PURISTA resource or runtime binding is appropriate.
- Keep `src/definitions.ts` as the static export inventory. The local `add:service` command appends standard generated services to its `serviceBuilders` array.
- Run `export:schedules` before `start:scheduler`. The scheduler process consumes only `purista.schedules.json` and infrastructure bindings; it must never import, instantiate, or start business services.
- `start:scheduler` uses `DefaultSchedulerProvider` for local/test execution only. It cannot deliver events to a separately started app that also uses `DefaultEventBridge`; that integration needs one shared transport. A replicated production host needs a shared EventBridge, a durable provider with distributed claims, `.setStrict().setRequireDistributedClaims()`, and downstream idempotency based on `message.schedule.occurrenceId`.
- For attached agents, keep `ai.models`, optional `ai.skills`, `ai.sandbox`, `ai.runtime`, and `ai.workspaceStore` bindings in service bootstrap/config. Use `.useSkills(...)` only with matching runtime skill bindings or explicitly trusted discovery. Agents are ephemeral by default. Use `add:agent -- ... --durable-workspace` only for a workflow that must resume private workspace state; it requires application-owned `ai.runtime` and `ai.workspaceStore` bindings. Direct `setHarnessAgent(...)` and `setRunFunction(...)` cannot use durable workspace policy.

## Local CLI
- This project installs `@purista/cli` as a dev dependency. Use package scripts instead of a global `purista` binary.
- Runtime: `node`
- Package manager: `npm` by default; use the equivalent script runner for pnpm, yarn, or bun if you changed package manager.
- Create services with `npm run add:service -- <name> --description "<description>"`.
- Create commands with `npm run add:command -- <name> --service <serviceName> --service-version <version>`.
- Create event-only schedule declarations with `npm run add:schedule -- <name> --description "<description>" --service <serviceName> --service-version <version> --event <eventName> --cron "0 2 * * *"`.
- Run the app with `npm start`.
- Run tests with `npm test`.

## Skills
- Use the bundled PURISTA skill from `.agents/skills/purista` or `.claude/skills/purista`.
- These paths link to `node_modules/@purista/core/skills/purista`, so dependency updates refresh the framework skill.

## Verification
- Run the project test script after framework changes.
- Run export scripts when definitions, schedules, streams, queues, agents, or HTTP exposure change.
- Review logs, events, traces, queues, streams, and agent prompts for secret or PII leakage before production changes.
- Declare application metrics on service or agent builders, then record only
  declared names through typed `context.metrics`. PURISTA uses the OpenTelemetry
  Metrics API; application bootstrap owns SDK readers/exporters, while Harness
  owns GenAI/model/tool telemetry.
- For skill-backed agents, verify startup fails for missing skill bindings and that prompts list only skill metadata plus `/skills/<name>/SKILL.md`, never the `SKILL.md` body.
- For durable agent workspace replay, verify startup fails when required runtime/workspace store capabilities are missing and that workspace refs, file content, prompts, tool IO, credentials, tokens, and raw headers stay out of logs, traces, queues, events, and examples.
