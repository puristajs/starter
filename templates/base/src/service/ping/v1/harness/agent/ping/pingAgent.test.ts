import { defineHarness } from '@purista/harness'
import { FakeModelProvider } from '@purista/harness/testing'
import { describe, expect, it } from 'vitest'

import { pingAgent } from './pingAgent.js'

describe('pingAgent', () => {
	it('runs as a standalone Harness definition without credentials', async () => {
		const provider = new FakeModelProvider({ strict: true })
		provider.enqueueText({
			content: 'pong',
			usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
			finishReason: 'stop',
		})

		const harness = defineHarness({ name: 'pingAgentTest' }).addAgent(pingAgent)
		const runtime = await harness.getInstance({ models: { ping: { provider, model: 'fake' } } })

		try {
			const session = await runtime.getSession('ping-agent-test')
			const outcome = await session.agents.ping.run('ping')

			expect(outcome.status).toBe('completed')
			if (outcome.status !== 'completed') throw new Error('Expected a completed agent run.')
			expect(outcome.output).toBe('pong')
			provider.assertExhausted()
		} finally {
			await runtime.close()
		}
	})
})
