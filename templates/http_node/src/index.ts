import { DefaultQueueBridge, gracefulShutdown, initLogger, type Service } from '@purista/core'
import { getEventBridge } from './eventbridge.js'
import { getHttpServer } from './http.js'
import { pingV1Service } from './service/ping/v1/index.js'

export const main = async () => {
	const logger = initLogger()

	const eventBridge = await getEventBridge(logger)
	const queueBridge = new DefaultQueueBridge()
	await queueBridge.start()

	const services: Service[] = []

	const pingService = await pingV1Service.getInstance(eventBridge, { queueBridge })
	await pingService.start()
	services.push(pingService)

	const { honoService, serverInstance } = await getHttpServer({
		logger,
		eventBridge,
		services,
	})

	// try to shut down as clean as possible
	gracefulShutdown(logger, [
		honoService.prepareDestroy(),
		queueBridge,
		eventBridge,
		...services,
		{
			name: `${honoService.serviceInfo.serviceName} ${honoService.serviceInfo.serviceVersion} close socket`,
			destroy: async () => {
				await new Promise<void>((resolve, reject) => {
					serverInstance.close(error => {
						if (error) {
							reject(error)
							return
						}
						resolve()
					})
				})
			},
		},
		honoService,
	])
}

main()
