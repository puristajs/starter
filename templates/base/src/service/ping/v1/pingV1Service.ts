import { pingCommandBuilder } from './command/ping/pingCommandBuilder.js'
import { pingHarness } from './harness/pingHarness.js'
import { pingV1ServiceBuilder } from './pingV1ServiceBuilder.js'

// bring service config definition, command definitions and subscription definitions together in the service
// add only definitions and no further service config here
// other service config should be done in ./pingServiceBuilder.ts file

type CommandDefinition = Parameters<typeof pingV1ServiceBuilder.addCommandDefinition>[number]

const commandDefinitions: CommandDefinition[] = [pingCommandBuilder.getDefinition()]

export const pingV1Service = pingV1ServiceBuilder
	.addCommandDefinition(...commandDefinitions)
	.mountHarness(pingHarness)
