import type { Logger } from '@purista/core'
import { NatsBridge } from '@purista/natsbridge'
import bridgeConfig from '../config/nats.js'

export const getEventBridge = async (logger: Logger)=>{
  const eventBridge = new NatsBridge({ ...bridgeConfig, logger })
  await eventBridge.start()
  return eventBridge
}
