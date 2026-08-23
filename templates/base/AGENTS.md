# Agent Guide

This is a PURISTA application. Use the PURISTA framework shape and CLI-generated files as the source of truth for project structure.

## Required workflow
- Read `purista.json` before changing services, commands, subscriptions, streams, queues, workers, or agents.
- Use the local `@purista/cli` package scripts whenever the CLI can create the target artifact. Refine generated code instead of hand-writing framework skeletons.
- Keep service code under the configured `servicePath` and agent code under the configured `agentPath`.
- Keep schemas explicit at every command, subscription, stream, queue, worker, and agent boundary.
- Keep runtime wiring in application bootstrap/config files. Do not import infrastructure clients directly in handlers when a PURISTA resource or runtime binding is appropriate.
- Keep `src/definitions.ts` as the static export inventory. The local `add:service` command appends standard generated services to its `serviceBuilders` array.

## Local CLI
- This project installs `@purista/cli` as a dev dependency. Use package scripts instead of a global `purista` binary.
- Runtime: `node`
- Package manager: `npm` by default; use the equivalent script runner for pnpm, yarn, or bun if you changed package manager.
- Create services with `npm run add:service -- <name> --description "<description>"`.
- Create commands with `npm run add:command -- <name> --service <serviceName> --service-version <version>`.
- Run the app with `npm start`.
- Run tests with `npm test`.

## Skills
- Use the bundled PURISTA skill from `.agents/skills/purista` or `.claude/skills/purista`.
- Use `.agents/skills/purista-migration` or `.claude/skills/purista-migration` before upgrading this existing application to a new PURISTA release; it is not the primary skill for new features.
- These paths link to `node_modules/@purista/core/skills/`, so dependency updates refresh both framework skills.

## Verification
- Run the project test script after framework changes.
- Run export scripts when definitions, schedules, streams, queues, agents, or HTTP exposure change.
- Review logs, events, traces, queues, streams, and agent prompts for secret or PII leakage before production changes.
