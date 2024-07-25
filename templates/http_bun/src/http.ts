import type { EventBridge, Logger, Service } from '@purista/core'
import { honoV1Service } from '@purista/hono-http-server'
import { apiReference } from '@scalar/hono-api-reference'
import { serveStatic } from 'hono/bun'

export const getHttpServer = async (input:{eventBridge: EventBridge,logger:Logger,services:Service[],port:number})=>{
  const honoService = await honoV1Service.getInstance(input.eventBridge, { logger:input.logger, serviceConfig: { services:input.services, enableDynamicRoutes: true } })
  honoService.app.get(
    '/api',
    apiReference({
      pageTitle: 'PURISTA API',
      spec: {
        url: '/api/openapi.json',
      },
    }),
  )
  honoService.app.get('*', serveStatic({ root: './public' }))
  honoService.openApi.addServer({ url: `http://localhost:${input.port}`, description: 'the local server' })

  // start the webserver
  await honoService.start()

  const serverInstance = Bun.serve({
      fetch: honoService.app.fetch,
      port:input.port,
    })

  return { honoService, serverInstance }
}
