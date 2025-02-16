import type { HonoServiceV1ConfigPartial } from '@purista/hono-http-server'

const serviceConfig: HonoServiceV1ConfigPartial = {
	enableDynamicRoutes: true,
	enableHealth: true,
	apiMountPath: '/api',
	openApi: {
		enabled: true,
		info: {
			title: 'PURISTA API',
		},
	},
}

const httpConfig = {
	port: 3000,
	root: './public',
	serviceConfig,
}

export default httpConfig
