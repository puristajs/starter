import { createCommandContextMock } from '@purista/core'
import { createSandbox } from 'sinon'

import { pingCommandBuilder } from './pingCommandBuilder.js'
import type { PingV1PingInputParameter, PingV1PingInputPayload } from './types.js'

describe('service Ping version 1 - command ping', () => {
	let sandbox = createSandbox()
	beforeEach(() => {
		sandbox = createSandbox()
	})

	afterEach(() => {
		sandbox.restore()
	})

	test('does not throw', async () => {
		const payload: PingV1PingInputPayload = { ping: 'test' }

		const parameter: PingV1PingInputParameter = {}

		const { context } = createCommandContextMock(pingCommandBuilder, { payload, parameter, sandbox })

		const result = await pingCommandBuilder.getCommandFunction().call({} as never, context, payload, parameter)

		expect(result).toStrictEqual({ pong: 'test' })
	})
})
