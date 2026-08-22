import { createQueueWorkerTestHarness } from '@purista/core/testing'

import { pingV1Service } from '../../pingV1Service.js'
import type { PingV1PingJobQueueParameter, PingV1PingJobQueuePayload } from '../../queue/pingJob/types.js'
import { pingJobWorkerQueueWorkerBuilder } from './pingJobWorkerQueueWorkerBuilder.js'

describe('service Ping version 1 - queue worker pingJobWorker', () => {
	it('processes one leased job through the worker runtime', async () => {
		const payload: PingV1PingJobQueuePayload = { ping: 'queued ping' }
		const parameter: PingV1PingJobQueueParameter = { requestId: 'req-1' }

		const harness = await createQueueWorkerTestHarness(pingV1Service, pingJobWorkerQueueWorkerBuilder)

		try {
			const result = await harness.run({
				id: 'job-1',
				queueName: 'pingJob',
				payload,
				parameter,
				headers: {},
				createdAt: Date.now(),
				attempt: 1,
				maxAttempts: 3,
				leaseExpiresAt: Date.now() + 60_000,
				leaseTtlMs: 60_000,
				traceId: 'trace-1',
				correlationId: 'corr-1',
			})

			expect(result.ackCalls).toHaveLength(1)
			expect(result.deadLetterCalls).toHaveLength(0)
		} finally {
			await harness.destroy()
		}
	})
})
