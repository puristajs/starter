import { gracefulShutdown, initLogger, type Service } from '@purista/core'
import { openai } from '@purista/harness-openai'
import { env } from './config/env.js'
import { getEventBridge } from './eventbridge.js'
import { pingV1Service } from './service/ping/v1/index.js'

export const main = async () => {
	const logger = initLogger()

	const eventBridge = await getEventBridge(logger)

	const services: Service[] = []

	const pingService = await pingV1Service.getInstance(eventBridge, {
		ai: {
			model: {
				provider: openai({ apiKey: env.OPENAI_API_KEY }),
				model: 'gpt-5-mini',
			},
		},
	})
	await pingService.start()
	services.push(pingService)

	logger.info('Ping v1 service started.')

	// try to shut down as clean as possible
	gracefulShutdown(logger, [eventBridge, ...services])
}

main()
