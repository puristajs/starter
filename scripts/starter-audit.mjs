import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const readJson = async (path) => JSON.parse(await readFile(join(root, path), 'utf8'))
const readText = (path) => readFile(join(root, path), 'utf8')

const expectedDependencies = {
	'@hono/node-server': '^2.1.0',
	'@purista/core': '^4.0.0',
	'@purista/harness': '^4.0.0',
	'@purista/harness-openai': '^4.0.0',
	'@purista/hono-http-server': '^4.0.0',
	zod: '^4.4.3',
}

const expectedDevDependencies = {
	'@purista/cli': '^4.0.0',
	'@types/node': '^26.2.0',
	'@types/sinon': '^22.0.0',
	sinon: '^22.1.0',
	tsx: '^4.23.12',
	typescript: 'npm:@typescript/typescript6@^6.0.2',
	vitest: '^4.1.10',
}

const expectedFragmentRanges = {
	'templates/eventbridge/amqp/package.json': { '@purista/amqpbridge': '^4.0.0' },
	'templates/eventbridge/mqtt/package.json': { '@purista/mqttbridge': '^4.0.0' },
	'templates/eventbridge/nats/package.json': { '@purista/natsbridge': '^4.0.0' },
	'templates/http_bun/package.json': {
		'@purista/hono-http-server': '^4.0.0',
		'@scalar/hono-api-reference': '^0.11.13',
	},
	'templates/http_node/package.json': {
		'@hono/node-server': '^2.1.0',
		'@purista/hono-http-server': '^4.0.0',
		'@scalar/hono-api-reference': '^0.11.13',
	},
	'templates/linter/biome/package.json': { '@biomejs/biome': '^2.5.8' },
	'templates/linter/eslint_module/package.json': {
		'@eslint/js': '^9.20.0',
		eslint: '^9.20.1',
		globals: '^15.15.0',
		'typescript-eslint': '^8.24.0',
	},
}

const failures = []
const check = (condition, message) => {
	if (!condition) failures.push(message)
}

const [
	rootPackage,
	basePackage,
	rootAgents,
	implementationGuide,
	service,
	harness,
	agent,
	agentTest,
	commandTest,
	bootstrap,
	envExample,
] = await Promise.all([
	readJson('package.json'),
	readJson('templates/base/package.json'),
	readText('AGENTS.md'),
	readText('templates/base/.agents/IMPLEMENTATION.md'),
	readText('templates/base/src/service/ping/v1/pingV1Service.ts'),
	readText('templates/base/src/service/ping/v1/harness/pingHarness.ts'),
	readText('templates/base/src/service/ping/v1/harness/agent/ping/pingAgent.ts'),
	readText('templates/base/src/service/ping/v1/harness/agent/ping/pingAgent.test.ts'),
	readText('templates/base/src/service/ping/v1/command/ping/ping.test.ts'),
	readText('templates/base/src/index.ts'),
	readText('templates/base/.env.example'),
])

const rootScripts = {
	typecheck: 'node scripts/starter-audit.mjs && npm run typecheck --prefix templates/base',
	test: 'node scripts/starter-audit.mjs && npm test --prefix templates/base',
	build: 'node scripts/starter-audit.mjs && npm run build --prefix templates/base',
}
for (const [script, command] of Object.entries(rootScripts)) {
	check(rootPackage.scripts?.[script] === command, `package.json: scripts.${script} must audit and execute the base template`)
}

check(basePackage.scripts?.typecheck === 'tsc --noEmit', 'templates/base/package.json: scripts.typecheck must compile without emitting')
check(basePackage.scripts?.test === 'tsc --noEmit && vitest run src --globals', 'templates/base/package.json: scripts.test must typecheck and run source tests')
check(basePackage.scripts?.build === 'tsc', 'templates/base/package.json: scripts.build must compile the generated application')

for (const [section, expected] of [
	['dependencies', expectedDependencies],
	['devDependencies', expectedDevDependencies],
]) {
	const actual = basePackage[section] ?? {}
	for (const [name, range] of Object.entries(expected)) {
		check(actual[name] === range, `templates/base/package.json: ${section}.${name} must be ${range}`)
	}
}

for (const [section, dependencies] of Object.entries({
	dependencies: basePackage.dependencies ?? {},
	devDependencies: basePackage.devDependencies ?? {},
	optionalDependencies: basePackage.optionalDependencies ?? {},
})) {
	for (const [name, range] of Object.entries(dependencies)) {
		check(
			!/^latest$|^(?:workspace|file|link|copy):/i.test(range),
			`templates/base/package.json: ${section}.${name} has non-published range ${range}`,
		)
	}
}

for (const [path, expected] of Object.entries(expectedFragmentRanges)) {
	const fragment = await readJson(path)
	const dependencies = { ...(fragment.dependencies ?? {}), ...(fragment.devDependencies ?? {}) }
	for (const [name, range] of Object.entries(expected)) {
		check(dependencies[name] === range, `${path}: ${name} must be ${range}`)
	}
	for (const [name, range] of Object.entries(dependencies)) {
		check(!/^latest$|^(?:workspace|file|link|copy):/i.test(range), `${path}: ${name} has non-published range ${range}`)
	}
}

for (const artifact of ['agent', 'workflow', 'tool', 'skill', 'mcp']) {
	check(
		basePackage.scripts?.[`add:${artifact}`] === `purista add ${artifact}`,
		`templates/base/package.json: missing local add:${artifact} command`,
	)
}

const guidance = `${rootAgents}\n${implementationGuide}`
for (const required of [
	'src/service/<service>/v<version>/harness',
	'mountHarness',
	'ai.models',
	'canInvokeAgent(serviceName, serviceVersion, agent.contract)',
	'ProtectMiddleware',
	'authorization',
	'@purista/harness/testing',
	'FakeModelProvider',
	'FakeHarnessStorage',
	'FakeSandbox',
	'FakeLogger',
]) {
	check(guidance.includes(required), `starter guidance: missing ${required}`)
}

for (const removed of ['src/agents', 'agentPath', 'src/harness/<service>']) {
	check(!guidance.includes(removed), `starter guidance: obsolete path or setting ${removed}`)
}

check((service.match(/\.mountHarness\(/g) ?? []).length === 1, 'pingV1Service.ts: expected exactly one Harness mount')
check(service.includes('.mountHarness(pingHarness)'), 'pingV1Service.ts: the final service must mount pingHarness')
check(harness.includes("defineHarness({ name: 'ping' }).addAgent(pingAgent)"), 'pingHarness.ts: expected one direct ping agent root')
check(agent.includes("defineAgent('ping',"), 'pingAgent.ts: expected the lower camel case ping target id')
check(agent.includes("model: 'ping'"), 'pingAgent.ts: expected an explicit application-chosen model alias')
check(!agent.includes('handler:'), 'pingAgent.ts: default-loop agents must not define custom orchestration handlers')
check(agentTest.includes("from '@purista/harness/testing'"), 'pingAgent.test.ts: expected public Harness testing import')
check(agentTest.includes('new FakeModelProvider({ strict: true })'), 'pingAgent.test.ts: expected a strict fake model')
check(agentTest.includes('provider.assertExhausted()'), 'pingAgent.test.ts: expected fake-model exhaustion assertion')
check(agentTest.includes('await runtime.close()'), 'pingAgent.test.ts: expected runtime cleanup')
check(commandTest.includes("from '@purista/core'"), 'ping.test.ts: expected public Core testing helpers from the package root')
check(!commandTest.includes("@purista/core/testing"), 'ping.test.ts: removed Core testing subpath remains')
check(commandTest.includes('createCommandContextMock'), 'ping.test.ts: expected an isolated command context mock')
check(bootstrap.includes("from '@purista/harness-openai'"), 'src/index.ts: expected the public OpenAI Harness adapter')
check(bootstrap.includes('ai:') && bootstrap.includes('models:') && bootstrap.includes('ping:'), 'src/index.ts: expected the exact ai.models.ping runtime binding')
check(envExample === 'OPENAI_API_KEY=\n', 'templates/base/.env.example: expected an empty OPENAI_API_KEY entry')

const joinedSource = `${service}\n${harness}\n${agent}\n${agentTest}\n${commandTest}\n${bootstrap}`
for (const removed of ['AgentQueueBuilder', 'addAgentDefinition', 'setHarnessAgent', '.define()', '.build()']) {
	check(!joinedSource.includes(removed), `starter source: removed Harness API ${removed} remains`)
}

if (failures.length > 0) {
	console.error(failures.map((failure) => `- ${failure}`).join('\n'))
	process.exitCode = 1
} else {
	console.log('Starter metadata and guidance audit passed.')
}
