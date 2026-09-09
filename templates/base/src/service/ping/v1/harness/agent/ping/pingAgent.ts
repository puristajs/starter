import { defineAgent } from '@purista/harness'

export const pingAgent = defineAgent('ping', {
	description: 'Answers a short ping request.',
	instructions: 'Reply with a short, friendly confirmation.',
})
