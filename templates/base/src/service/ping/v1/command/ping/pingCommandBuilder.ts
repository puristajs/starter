import { ServiceEvent } from '../../../../serviceEvent.enum.js'
import { pingV1ServiceBuilder } from '../../pingV1ServiceBuilder.js'
import {
	pingV1PingInputParameterSchema,
	pingV1PingInputPayloadSchema,
	pingV1PingOutputPayloadSchema,
} from './schema.js'

export const pingCommandBuilder = pingV1ServiceBuilder
	.getCommandBuilder('ping', 'the ping command exposed as http endpoint')
	.setSuccessEventName(ServiceEvent.Pinged)
	.addPayloadSchema(pingV1PingInputPayloadSchema)
	.addParameterSchema(pingV1PingInputParameterSchema)
	.addOutputSchema(pingV1PingOutputPayloadSchema)
	.exposeAsHttpEndpoint('POST', 'ping')
	.setCommandFunction(async function ping(context, payload, _parameter) {
		// add your business logic here
		context.metrics['app.ping.requests'].add(1)
		return {
			pong: payload.ping,
		}
	})
