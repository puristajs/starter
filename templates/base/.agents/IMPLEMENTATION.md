# Implementation Guide

This project is CLI-first. Prefer generated PURISTA artifacts over manual framework skeletons.

## Project Shape
- `purista.json` defines file casing, event casing, `servicePath`, and `agentPath`.
- Service definitions live under `src/service` unless `purista.json` says otherwise.
- Agent definitions live under `src/agents` unless `purista.json` says otherwise.
- Exportable services must be included in `src/definitions.ts`.

## Artifact Creation
- New service: `purista add service`
- New command: `purista add command`
- New subscription: `purista add subscription`
- New stream: `purista add stream`
- New queue: `purista add queue`
- New queue worker: `purista add queue-worker`
- New agent: `purista add agent`

After generation, edit handlers, schemas, runtime wiring, and tests to fit the domain.

## Guardrails
- Do not create alternative framework folder structures.
- Do not bypass builders for public PURISTA contracts.
- Do not add CommonJS variants. Generated PURISTA apps are ESM-only.
- Keep external systems behind resources, stores, bridges, or runtime bindings.
- Keep EventBridge and QueueBridge concerns separate.
- Keep provider packages as app-level dependencies.
