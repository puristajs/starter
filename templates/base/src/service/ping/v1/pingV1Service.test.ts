import { pingV1Service as service } from './pingV1Service.js'

describe('service ping version 1', () => {
	it('has valid configuration', () => {
		service.testServiceSetup()
	})

	it('declares a disabled event-only scheduler trigger', async () => {
		const definitions = await service.resolveDefinitions()
		expect(definitions.schedules).toContainEqual(
			expect.objectContaining({
				name: 'pingScheduleDue',
				targetKind: 'event',
				targetName: 'ping.schedule.due',
				enabledByDefault: false,
			}),
		)
	})
})
