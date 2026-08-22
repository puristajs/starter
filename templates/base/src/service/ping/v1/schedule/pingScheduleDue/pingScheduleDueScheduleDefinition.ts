import { ServiceEvent } from '../../../../serviceEvent.enum.js'
import { pingV1ServiceBuilder } from '../../pingV1ServiceBuilder.js'

/**
 * Example clock boundary. A separately deployed Scheduler Runtime emits this
 * event; subscriptions, queues, and agents own all business work downstream.
 */
export const pingScheduleDueScheduleDefinition = pingV1ServiceBuilder
	.getScheduleBuilder('pingScheduleDue', 'Example scheduler trigger event')
	.emitEvent(ServiceEvent.PingScheduleDue, {
		expression: { kind: 'cron', value: '*/15 * * * *' },
		missedRunPolicy: 'skip',
		schedulerGroup: 'default',
		enabledByDefault: false,
	})
