# Agent Guide

This is a PURISTA v4 application. Read `purista.json`, use the local `@purista/cli` scripts, and refine generated artifacts instead of writing framework boilerplate from memory.

## Project shape

- Keep Framework definitions under the configured `servicePath`, normally `src/service`.
- Keep a service's Harness code under `src/service/<service>/v<version>/harness/{agent,workflow,tool,skill,mcp}`. Definitions use lower camel case IDs.
- Compose direct agent, workflow, tool, skill, and MCP definitions into one Harness definition for that service version. Call `mountHarness` once on the service builder.
- Keep `src/definitions.ts` as the static service export inventory. `npm run add:service` updates its `serviceBuilders` array.

## Runtime and invocation

- Give every agent an explicit application-chosen model alias. Bind the exact alias map through `ai.models` in application bootstrap code; handlers do not construct provider SDK clients and PURISTA reserves no alias.
- Agents and workflows declare the tools, skills, MCP servers, and target addresses they may use.
- A Framework command declares `canInvokeAgent(serviceName, serviceVersion, agent.contract)` and invokes the same address through `context.agent[serviceName][serviceVersion][agent.contract.id]`.
- Keep direct session and addressed Framework results as Harness outcome envelopes. Workflow-scoped agent `.run(...)` returns the agent output directly.
- Use generated command, stream, or queue projections to expose Harness work. Use the AI SDK UI message stream v1 adapter for compatible UI streaming and resume requests.

## Authentication and authorization

- `ProtectMiddleware` authenticates HTTP requests and provides the principal to PURISTA.
- Business guards and target policies own authorization. Do not treat a valid login as permission to run every agent, workflow, command, or tool.
- Keep credentials in runtime environment configuration. Never commit tokens or put transport secrets in an MCP definition.

## Local CLI

Use package scripts so the project-local CLI version creates every artifact:

```sh
npm run add:service -- <name> --description "<description>"
npm run add:command -- <name> --service <serviceName> --service-version <version>
npm run add:agent -- <name> --service <serviceName> --service-version <version> --model-alias <alias>
npm run add:workflow -- <name> --service <serviceName> --service-version <version>
npm run add:tool -- <name> --service <serviceName> --service-version <version>
npm run add:skill -- <name> --service <serviceName> --service-version <version>
npm run add:mcp -- <name> --service <serviceName> --service-version <version>
```

Run the app with `npm start` and the test suite with `npm test`.

## Deterministic tests

- Import `FakeModelProvider`, `FakeHarnessStorage`, `FakeSandbox`, and `FakeLogger` from `@purista/harness/testing`; tests must not need provider credentials or network access.
- Prefer `new FakeModelProvider({ strict: true })`, enqueue the exact responses, and call `assertExhausted()`.
- Test portable agents and workflows in a small standalone Harness graph. Test a `serviceBuilder.defineTool(...)` host tool through a mounted service instance.

## Skills

- Use `.agents/skills/purista` or `.claude/skills/purista` for Framework work.
- Use the migration skill before upgrading an existing application. The installed paths are mirrors of the package-owned skills.
