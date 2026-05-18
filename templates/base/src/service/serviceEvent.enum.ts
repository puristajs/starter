export const ServiceEvent = {
	/**
	 * Emitted by ping v1 command ping:
	 * the ping command exposed as http endpoint
	 */
	Pinged: 'pinged',
	/**
	 * Example event target for external schedule contracts.
	 * Production timing is owned by an external scheduler such as Kubernetes CronJob.
	 */
	PingScheduleDue: 'ping.schedule.due',
} as const
