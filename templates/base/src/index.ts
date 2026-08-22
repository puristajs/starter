import { DefaultQueueBridge, gracefulShutdown, initLogger, type Service } from '@purista/core'
import { getEventBridge } from './eventbridge.js'
import { pingV1Service } from './service/ping/v1/index.js'
import { initializeTelemetry } from './telemetry.js'

export const main = async () => {
	const logger = initLogger()
	const telemetry = await initializeTelemetry()

	const eventBridge = await getEventBridge(logger)
	const queueBridge = new DefaultQueueBridge()
	await queueBridge.start()

	const services: Service[] = []

	const pingService = await pingV1Service.getInstance(eventBridge, { queueBridge })
	await pingService.start()
	services.push(pingService)

	logger.info('Ping v1 service started with async queue support.')

	// try to shut down as clean as possible
	gracefulShutdown(logger, [...(telemetry ? [telemetry] : []), queueBridge, eventBridge, ...services])
}

main()
