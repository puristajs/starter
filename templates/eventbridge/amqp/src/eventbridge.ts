import { AmqpBridge } from '@purista/amqpbridge'
import type { Logger } from '@purista/core'
import bridgeConfig from '../config/amqp.js'

export const getEventBridge = async (logger: Logger)=>{
  const eventBridge = new AmqpBridge({ ...bridgeConfig, logger })
  await eventBridge.start()
  return eventBridge
}
