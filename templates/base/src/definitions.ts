import { exportServiceDefinitions } from '@purista/core'
import { pingV1Service } from './service/ping/v1/pingV1Service.js'

// The CLI appends newly generated services to this explicit static export inventory.
// Keep it free of runtime infrastructure and service instances.
export const serviceBuilders = [pingV1Service]

export const createPuristaDefinitions = () => exportServiceDefinitions(serviceBuilders)
