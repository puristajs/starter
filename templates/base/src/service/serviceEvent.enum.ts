export const ServiceEvent = {
	/**
	 * Emitted by ping v1 command ping:
	 * the ping command exposed as http endpoint
	 */
	Pinged: 'pinged',
	/**
	 * Example event target for a separate PURISTA Scheduler Runtime host or an
	 * external scheduler such as Kubernetes CronJob.
	 */
	PingScheduleDue: 'ping.schedule.due',
} as const
