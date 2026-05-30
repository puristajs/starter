# Agent Guide

This is a PURISTA application. Use the PURISTA framework shape and CLI-generated files as the source of truth for project structure.

## Required workflow
- Read `purista.json` before changing services, commands, subscriptions, streams, queues, workers, or agents.
- Use `purista add ...` commands whenever the CLI can create the target artifact. Refine generated code instead of hand-writing framework skeletons.
- Keep service code under the configured `servicePath` and agent code under the configured `agentPath`.
- Keep schemas explicit at every command, subscription, stream, queue, worker, and agent boundary.
- Keep runtime wiring in application bootstrap/config files. Do not import infrastructure clients directly in handlers when a PURISTA resource or runtime binding is appropriate.
- Update `src/definitions.ts` when a new service builder should be exported.

## Skills
- Use the bundled PURISTA skill from `.agents/skills/purista` or `.claude/skills/purista`.
- These paths link to `node_modules/@purista/core/skills/purista`, so dependency updates refresh the framework skill.

## Verification
- Run the project test script after framework changes.
- Run export scripts when definitions, schedules, streams, queues, agents, or HTTP exposure change.
- Review logs, events, traces, queues, streams, and agent prompts for secret or PII leakage before production changes.
