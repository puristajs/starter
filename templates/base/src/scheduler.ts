import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import {
	DefaultSchedulerProvider,
	gracefulShutdown,
	initLogger,
	type ScheduleManifest,
	SchedulerBuilder,
} from '@purista/core'
import { getEventBridge } from './eventbridge.js'

const schedulerGroup = process.env.PURISTA_SCHEDULER_GROUP ?? 'default'
const manifestPath = resolve(process.cwd(), process.env.PURISTA_SCHEDULE_MANIFEST ?? 'purista.schedules.json')
const manifest = JSON.parse(await readFile(manifestPath, 'utf-8')) as ScheduleManifest

const logger = initLogger()
const eventBridge = await getEventBridge(logger)
const scheduler = new SchedulerBuilder(schedulerGroup)
	.loadManifest(manifest)
	.useEventBridge(eventBridge)
	.useProvider(new DefaultSchedulerProvider())
	.getInstance()

await scheduler.start()
logger.warn(
	{ schedulerGroup, manifestPath },
	'Local Scheduler Runtime started. DefaultSchedulerProvider is process-local and must not be used for replicated production hosts.',
)

// This process owns only the clock and event publication. SchedulerRuntime destroys the EventBridge on shutdown.
gracefulShutdown(logger, [{ name: 'scheduler runtime', destroy: () => scheduler.destroy() }])
