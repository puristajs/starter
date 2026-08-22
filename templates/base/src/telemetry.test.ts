import { afterEach, describe, expect, it } from 'vitest'

import { initializeTelemetry } from './telemetry.js'

describe('optional telemetry bootstrap', () => {
	const originalTelemetry = process.env.PURISTA_TELEMETRY

	afterEach(() => {
		if (originalTelemetry === undefined) {
			delete process.env.PURISTA_TELEMETRY
			return
		}
		process.env.PURISTA_TELEMETRY = originalTelemetry
	})

	it('does not require OpenTelemetry SDK dependencies unless explicitly enabled', async () => {
		delete process.env.PURISTA_TELEMETRY

		await expect(initializeTelemetry()).resolves.toBeUndefined()
	})
})
