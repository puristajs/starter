import type { AmqpBridgeConfig } from "@purista/amqpbridge";

const amqpBridgeConfig: Partial<AmqpBridgeConfig> = {
  exchangeName: "purista",
  url: "amqp://localhost",
};

export default amqpBridgeConfig;
