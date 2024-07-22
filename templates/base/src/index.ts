import { type Service, gracefulShutdown, initLogger } from "@purista/core";

export const main = async () => {
  const logger = initLogger();

  const eventBridge = undefined;

  const services: Service[] = [];

  // try to shut down as clean as possible
  gracefulShutdown(logger, [eventBridge, ...services]);
};

main();
