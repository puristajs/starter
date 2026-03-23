import { type Service, gracefulShutdown, initLogger } from '@purista/core'
import { getEventBridge } from './eventbridge.js'
import { pingV1Service } from './service/ping/v1/index.js'

export const main = async () => {
	const logger = initLogger()

	const eventBridge = await getEventBridge(logger)

	const services: Service[] = []

	const pingService = await pingV1Service.getInstance(eventBridge)
	await pingService.start()
	services.push(pingService)

	logger.info('Ping v1 service started with async queue support.')

	// try to shut down as clean as possible
	gracefulShutdown(logger, [eventBridge, ...services])
}

main()
