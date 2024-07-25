import { type Service, gracefulShutdown, initLogger } from "@purista/core";
import { eventBridge } from './eventbridge.js';

export const main = async () => {
  const logger = initLogger();

  // EVENT_BRIDGE

  const services: Service[] = [];

  // try to shut down as clean as possible
  gracefulShutdown(logger, [eventBridge, ...services]);
};

main();
