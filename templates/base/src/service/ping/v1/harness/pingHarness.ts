import { defineHarness } from '@purista/harness'

import { pingAgent } from './agent/ping/pingAgent.js'

export const pingHarness = defineHarness({ name: 'ping' }).addAgent(pingAgent)
