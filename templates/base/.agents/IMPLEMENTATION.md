# Implementation Guide

This project is CLI-first. Prefer generated PURISTA artifacts over manual framework skeletons.

## Local CLI
- This project installs `@purista/cli` as a dev dependency. Use package scripts instead of a global `purista` binary.
- Runtime: `node`
- Package manager: `npm` by default; use the equivalent script runner for pnpm, yarn, or bun if you changed package manager.
- Create services with `npm run add:service -- <name> --description "<description>"`.
- Create commands with `npm run add:command -- <name> --service <serviceName> --service-version <version>`.
- Run the app with `npm start`.
- Run tests with `npm test`.

## Project Shape
- `purista.json` defines file casing, event casing, `servicePath`, and `agentPath`.
- Service definitions live under `src/service` unless `purista.json` says otherwise.
- Agent definitions live under `src/agents` unless `purista.json` says otherwise.
- Exportable services are tracked by `src/definitions.ts`; the standard local `add:service` command appends new generated services.

## Artifact Creation
- New service: `npm run add:service -- <name> --description "<description>"`
- New command: `npm run add:command -- <name> --service <serviceName> --service-version <version>`
- New subscription: `npm run add:subscription -- <name> --service <serviceName> --service-version <version> --event <eventName>`
- New stream: `npm run add:stream -- <name> --service <serviceName> --service-version <version>`
- New queue: `npm run add:queue -- <name> --service <serviceName> --service-version <version>`
- New queue worker: `npm run add:queue-worker -- <name> --service <serviceName> --service-version <version> --queue <queueName>`
- New agent: `npm run add:agent -- <name> --service <serviceName> --service-version <version>`

After generation, edit handlers, schemas, runtime wiring, and tests to fit the domain.

## Guardrails
- Do not create alternative framework folder structures.
- Do not bypass builders for public PURISTA contracts.
- Do not add CommonJS variants. Generated PURISTA apps are ESM-only.
- Keep external systems behind resources, stores, bridges, or runtime bindings.
- Keep EventBridge and QueueBridge concerns separate.
- Export `purista.schedules.json` before a scheduler deployment. The scheduler host imports that JSON manifest and infrastructure only, never business services or handlers.
- The generated `start:scheduler` host is local/test-only because it uses `DefaultSchedulerProvider`. Production hosts need an explicitly selected shared EventBridge and durable provider package with distributed claims.
- Keep provider packages as app-level dependencies.
