import type { HonoServiceV1Config } from '@purista/hono-http-server'

const serviceConfig: HonoServiceV1Config = {}

const httpConfig = {
	port: 3000,
	root: './public',
	serviceConfig: {
		enableDynamicRoutes: true,
		enableHealth: true,
		apiMountPath: '/api',
		openApi: {
			enabled: true,
			info: {
				title: 'PURISTA API',
			},
		},
	},
}

export default httpConfig
