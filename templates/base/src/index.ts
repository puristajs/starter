import { type Service, gracefulShutdown, initLogger } from "@purista/core";
import { getEventBridge } from './eventbridge.js';

export const main = async () => {
  const logger = initLogger();

  const eventBridge = await getEventBridge(logger)

  const services: Service[] = [];

  // try to shut down as clean as possible
  gracefulShutdown(logger, [eventBridge, ...services]);
};

main();
