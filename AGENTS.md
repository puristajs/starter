# Starter Repository Guide

This repository publishes the files used to start a PURISTA application. Keep the generated project small, runnable with npm, and aligned with the public PURISTA v4 packages.

## Application shape

- Keep service code under `src/service/<service>/v<version>/`.
- Put Harness definitions in that service version's `harness/agent`, `harness/workflow`, `harness/tool`, `harness/skill`, and `harness/mcp` directories.
- Compose those direct definitions with one `defineHarness(...)` value and attach it to the service once with `mountHarness`.
- Give every agent an explicit application-chosen model alias. Bind the exact alias map through `ai.models` at startup instead of importing a provider client inside an agent. PURISTA reserves no alias.
- Let agents and workflows declare their target policy. Service commands call an agent with `canInvokeAgent(serviceName, serviceVersion, agent.contract)` and then use the same service address from their context.

## Boundaries and projections

- Use generated command, stream, and queue projections when an agent or workflow needs a Framework boundary.
- `ProtectMiddleware` authenticates an HTTP request. Business guards and policies decide whether that authenticated principal is authorized to invoke the target.
- Keep credentials in runtime configuration. Never place provider tokens in definitions, prompts, tests, or committed environment files.

## Testing

- Use `FakeModelProvider`, `FakeHarnessStorage`, `FakeSandbox`, and `FakeLogger` from `@purista/harness/testing` for deterministic, credential-free tests.
- Queue every expected fake model response, enable strict mode, and call `assertExhausted()` so an extra or missing model request fails the test.
- A portable agent or workflow may be tested in a small standalone Harness graph. Test `serviceBuilder.defineTool(...)` host tools through a mounted service instance so the service resources and invocation policy are present.

Run `npm run typecheck`, `npm test`, and `npm run build` from this repository before handing off a template change. Do not edit generated output by hand.
