# Implementation Guide

This project is CLI-first. Read `purista.json`, run the project-local `purista` scripts, and edit the generated schemas, handlers, runtime bindings, and tests for the domain.

## Structure

- Framework services live under the configured `servicePath`, normally `src/service`.
- Put service-owned Harness definitions under `src/service/<service>/v<version>/harness/{agent,workflow,tool,skill,mcp}`.
- Export direct definitions, compose one service Harness, and call `mountHarness` once on that service builder.
- Keep provider setup in bootstrap code. Bind the model as `ai.model`; keep storage, sandbox, and telemetry bindings there too.
- Keep `src/definitions.ts` as the static service-builder inventory.

## Artifact creation

```sh
npm run add:service -- <name> --description "<description>"
npm run add:command -- <name> --service <serviceName> --service-version <version>
npm run add:subscription -- <name> --service <serviceName> --service-version <version> --event <eventName>
npm run add:stream -- <name> --service <serviceName> --service-version <version>
npm run add:queue -- <name> --service <serviceName> --service-version <version>
npm run add:queue-worker -- <name> --service <serviceName> --service-version <version> --queue <queueName>
npm run add:agent -- <name> --service <serviceName> --service-version <version>
npm run add:workflow -- <name> --service <serviceName> --service-version <version>
npm run add:tool -- <name> --service <serviceName> --service-version <version>
npm run add:skill -- <name> --service <serviceName> --service-version <version>
npm run add:mcp -- <name> --service <serviceName> --service-version <version>
```

## Harness rules

- Direct definitions use lower camel case IDs. Agents and workflows explicitly list their allowed target addresses.
- A command uses `canInvokeAgent(serviceName, serviceVersion, agent.contract)` before calling the matching `context.agent` address.
- A service host tool is created with `serviceBuilder.defineTool(...)` and tested through a mounted service. Only portable definitions get standalone Harness tests.
- Use command, stream, and queue projections for Framework delivery. The UI stream projection uses the AI SDK UI message stream v1 protocol and forwards cancellation and approval resume.
- `ProtectMiddleware` owns HTTP authentication. Business guards and target policies own authorization.

## Credential-free tests

Use `FakeModelProvider`, `FakeHarnessStorage`, `FakeSandbox`, and `FakeLogger` from `@purista/harness/testing`. Queue deterministic responses, use strict fakes, and assert that fixtures are exhausted. Tests must never depend on a provider token or network call.

## General guardrails

- Keep generated apps ESM-only.
- Keep external systems behind resources, stores, bridges, or runtime bindings.
- Keep EventBridge and QueueBridge concerns separate.
- Export `purista.schedules.json` before scheduler deployment. Production scheduler hosts need a shared EventBridge and a durable scheduler provider with distributed claims.
- Keep provider packages as app-level dependencies.
