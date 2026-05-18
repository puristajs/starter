import { exportServiceDefinitions } from '@purista/core'
import { pingV1Service } from './service/ping/v1/index.js'

export const serviceBuilders = [pingV1Service] as const

export const exportPuristaDefinitions = () => exportServiceDefinitions([...serviceBuilders])
