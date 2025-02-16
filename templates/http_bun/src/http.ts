import type { EventBridge, Logger, Service } from '@purista/core'
import { honoV1Service } from '@purista/hono-http-server'
import { apiReference } from '@scalar/hono-api-reference'
import { serveStatic } from 'hono/bun'
import httpConfig from './config/http.js'

export const getHttpServer = async (input: {
	eventBridge: EventBridge
	logger: Logger
	services: Service[]
}) => {
	const honoService = await honoV1Service.getInstance(input.eventBridge, {
		logger: input.logger,
		serviceConfig: { ...httpConfig, services: input.services },
	})
	honoService.app.get(
		httpConfig.serviceConfig.apiMountPath,
		apiReference({
			pageTitle: httpConfig.serviceConfig.openApi.info.title,
			spec: {
				url: `${httpConfig.serviceConfig.apiMountPath}/openapi.json`,
			},
		}),
	)
	honoService.app.get('*', serveStatic({ root: httpConfig.root }))
	honoService.openApi.addServer({
		url: `http://localhost:${httpConfig.port}`,
		description: 'the local server',
	})

	// start the webserver
	await honoService.start()

	const serverInstance = Bun.serve({
		fetch: honoService.app.fetch,
		port: httpConfig.port,
	})

	return { honoService, serverInstance }
}
