# Agent Guide

This is a PURISTA application. Use the PURISTA framework shape and CLI-generated files as the source of truth for project structure.

## Required workflow
- Read `purista.json` before changing services, commands, subscriptions, streams, queues, workers, or agents.
- Use the local `@purista/cli` package scripts whenever the CLI can create the target artifact. Refine generated code instead of hand-writing framework skeletons.
- Keep service code under the configured `servicePath` and agent code under the configured `agentPath`.
- Keep schemas explicit at every command, subscription, stream, queue, worker, and agent boundary.
- Keep runtime wiring in application bootstrap/config files. Do not import infrastructure clients directly in handlers when a PURISTA resource or runtime binding is appropriate.
- For attached agents, keep `ai.models`, optional `ai.sandbox`, `ai.runtime`, and `ai.workspace` bindings in service bootstrap/config. Use `setWorkspacePolicy({ mode: 'durable', required: true })` only when a queued agent must resume from durable workspace checkpoints.

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
- These paths link to `node_modules/@purista/core/skills/purista`, so dependency updates refresh the framework skill.

## Verification
- Run the project test script after framework changes.
- Review logs, events, traces, queues, streams, and agent prompts for secret or PII leakage before production changes.
- For durable agent workspace replay, verify startup fails when required runtime/workspace capabilities are missing and that workspace refs, file content, prompts, tool IO, credentials, tokens, and raw headers stay out of logs, traces, queues, events, and examples.
