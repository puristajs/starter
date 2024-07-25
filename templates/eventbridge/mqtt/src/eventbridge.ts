import type { Logger } from '@purista/core'
import { MqttBridge } from '@purista/mqttbridge'
import bridgeConfig from './config/mqtt.js'

export const getEventBridge = async (logger: Logger)=>{
  const eventBridge = new MqttBridge({ ...bridgeConfig, logger })
  await eventBridge.start()
  return eventBridge
}
